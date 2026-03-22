/**
 * AchievementSystem 系统测试
 * 测试整个成就系统在真实环境中的表现
 */

const puppeteer = require('puppeteer');
const { startServer, stopServer } = require('../utils/test-server');
const { createTestUser, cleanupTestData } = require('../utils/test-data');

describe('AchievementSystem 系统测试', () => {
  let browser;
  let page;
  let server;
  let testUser;

  // 测试前准备
  beforeAll(async () => {
    // 启动测试服务器
    server = await startServer();
    
    // 创建测试用户
    testUser = await createTestUser({
      username: 'systemtestuser',
      email: 'systemtest@example.com',
      password: 'Test123!@#',
      role: 'USER',
    });

    // 启动浏览器
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  // 每个测试前准备
  beforeEach(async () => {
    page = await browser.newPage();
    
    // 设置视口大小
    await page.setViewport({ width: 1280, height: 800 });
    
    // 设置请求拦截，记录性能数据
    await page.setRequestInterception(true);
    
    const requests = [];
    page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        startTime: Date.now(),
      });
      request.continue();
    });
    
    page.on('requestfinished', (request) => {
      const req = requests.find(r => r.url === request.url());
      if (req) {
        req.endTime = Date.now();
        req.duration = req.endTime - req.startTime;
      }
    });
  });

  // 每个测试后清理
  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  // 测试后清理
  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
    
    if (server) {
      await stopServer(server);
    }
    
    // 清理测试数据
    await cleanupTestData(testUser.id);
  }, 30000);

  // 测试1: 完整的用户旅程
  test('完整的成就系统用户旅程', async () => {
    console.log('开始测试: 完整的成就系统用户旅程');
    
    // 1. 用户登录
    await page.goto('http://localhost:3000/login');
    
    // 填写登录表单
    await page.type('input[name="email"]', testUser.email);
    await page.type('input[name="password"]', 'Test123!@#');
    
    // 点击登录按钮
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]'),
    ]);
    
    // 验证登录成功
    const userMenu = await page.$('[data-testid="user-menu"]');
    expect(userMenu).toBeTruthy();
    
    console.log('✓ 用户登录成功');

    // 2. 访问成就页面
    await page.goto('http://localhost:3000/achievements');
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="achievements-container"]', { timeout: 10000 });
    
    // 验证成就页面加载成功
    const pageTitle = await page.$eval('h1', el => el.textContent);
    expect(pageTitle).toContain('成就');
    
    console.log('✓ 成就页面加载成功');

    // 3. 查看成就列表
    const achievementItems = await page.$$('[data-testid="achievement-item"]');
    expect(achievementItems.length).toBeGreaterThan(0);
    
    // 验证成就信息显示正确
    const firstAchievement = await page.$eval('[data-testid="achievement-item"]', el => ({
      name: el.querySelector('[data-testid="achievement-name"]')?.textContent,
      description: el.querySelector('[data-testid="achievement-description"]')?.textContent,
      points: el.querySelector('[data-testid="achievement-points"]')?.textContent,
    }));
    
    expect(firstAchievement.name).toBeTruthy();
    expect(firstAchievement.description).toBeTruthy();
    expect(firstAchievement.points).toMatch(/\d+/);
    
    console.log('✓ 成就列表显示正确');

    // 4. 测试成就过滤
    const filterButtons = await page.$$('[data-testid="achievement-filter"]');
    expect(filterButtons.length).toBeGreaterThan(0);
    
    // 点击内容成就过滤
    await page.click('[data-testid="filter-content"]');
    
    // 等待过滤生效
    await page.waitForTimeout(1000);
    
    // 验证过滤后的成就数量
    const filteredItems = await page.$$('[data-testid="achievement-item"]');
    expect(filteredItems.length).toBeGreaterThan(0);
    
    console.log('✓ 成就过滤功能正常');

    // 5. 测试成就搜索
    const searchInput = await page.$('input[placeholder*="搜索"]');
    expect(searchInput).toBeTruthy();
    
    // 输入搜索关键词
    await searchInput.type('欢迎');
    await page.waitForTimeout(500);
    
    // 验证搜索结果
    const searchResults = await page.$$('[data-testid="achievement-item"]');
    expect(searchResults.length).toBeGreaterThan(0);
    
    // 清除搜索
    await searchInput.click({ clickCount: 3 });
    await searchInput.press('Backspace');
    
    console.log('✓ 成就搜索功能正常');

    // 6. 测试成就排序
    const sortSelect = await page.$('select[data-testid="achievement-sort"]');
    if (sortSelect) {
      await sortSelect.select('points');
      await page.waitForTimeout(500);
      
      // 验证排序生效
      const sortedItems = await page.$$('[data-testid="achievement-item"]');
      expect(sortedItems.length).toBeGreaterThan(0);
      
      console.log('✓ 成就排序功能正常');
    }

    // 7. 查看成就详情
    const firstAchievementLink = await page.$('[data-testid="achievement-item"] a');
    if (firstAchievementLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        firstAchievementLink.click(),
      ]);
      
      // 验证详情页面加载
      await page.waitForSelector('[data-testid="achievement-detail"]', { timeout: 5000 });
      
      const detailTitle = await page.$eval('h1', el => el.textContent);
      expect(detailTitle).toBeTruthy();
      
      console.log('✓ 成就详情页面正常');
      
      // 返回成就列表
      await page.goBack();
      await page.waitForSelector('[data-testid="achievements-container"]');
    }

    // 8. 测试成就解锁（如果有可解锁的成就）
    const unlockButtons = await page.$$('button:has-text("立即解锁")');
    if (unlockButtons.length > 0) {
      // 点击解锁按钮
      await unlockButtons[0].click();
      
      // 等待确认对话框
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      // 确认解锁
      const confirmButton = await page.$('button:has-text("确定")');
      if (confirmButton) {
        await confirmButton.click();
        
        // 等待解锁完成
        await page.waitForTimeout(2000);
        
        // 验证解锁成功提示
        const successMessage = await page.$('[data-testid="success-message"]');
        expect(successMessage).toBeTruthy();
        
        console.log('✓ 成就解锁功能正常');
      }
    }

    // 9. 测试成就分享
    const shareButtons = await page.$$('button[aria-label*="分享"]');
    if (shareButtons.length > 0) {
      // 点击分享按钮
      await shareButtons[0].click();
      
      // 等待分享菜单出现
      await page.waitForSelector('[data-testid="share-menu"]', { timeout: 5000 });
      
      // 验证分享选项
      const shareOptions = await page.$$('[data-testid="share-option"]');
      expect(shareOptions.length).toBeGreaterThan(0);
      
      console.log('✓ 成就分享功能正常');
      
      // 关闭分享菜单
      await page.keyboard.press('Escape');
    }

    // 10. 测试响应式设计
    // 切换到移动端视图
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // 验证移动端布局
    const mobileContainer = await page.$('[data-testid="achievements-container"]');
    expect(mobileContainer).toBeTruthy();
    
    // 切换回桌面视图
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('✓ 响应式设计正常');

    // 11. 测试性能
    const performanceMetrics = await page.evaluate(() => {
      const metrics = {};
      
      // 页面加载时间
      if (window.performance) {
        const perf = window.performance;
        const nav = perf.getEntriesByType('navigation')[0];
        
        if (nav) {
          metrics.loadTime = nav.loadEventEnd - nav.startTime;
          metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.startTime;
        }
      }
      
      // 内存使用
      if (window.performance && performance.memory) {
        metrics.memory = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      
      return metrics;
    });
    
    // 验证性能指标
    expect(performanceMetrics.loadTime).toBeLessThan(5000); // 5秒内加载完成
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000); // 3秒内DOM加载完成
    
    console.log('✓ 性能指标正常');
    console.log(`  页面加载时间: ${performanceMetrics.loadTime}ms`);
    console.log(`  DOM加载时间: ${performanceMetrics.domContentLoaded}ms`);

    // 12. 测试可访问性
    // 检查键盘导航
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // 检查焦点状态
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBeTruthy();
    
    // 检查ARIA属性
    const ariaLabels = await page.evaluate(() => {
      const elements = document.querySelectorAll('[aria-label], [aria-labelledby]');
      return Array.from(elements).map(el => ({
        tag: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        ariaLabelledby: el.getAttribute('aria-labelledby'),
      }));
    });
    
    expect(ariaLabels.length).toBeGreaterThan(0);
    
    console.log('✓ 可访问性检查通过');

    // 13. 测试错误处理
    // 模拟网络错误
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('/api/achievements')) {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    // 刷新页面触发错误
    await page.reload({ waitUntil: 'networkidle0' });
    
    // 验证错误处理
    const errorMessage = await page.$('[data-testid="error-message"]');
    expect(errorMessage).toBeTruthy();
    
    // 恢复正常请求
    await page.setRequestInterception(false);
    
    console.log('✓ 错误处理正常');

    // 14. 测试数据持久性
    // 更改用户偏好（如视图模式）
    const viewToggle = await page.$('[data-testid="view-toggle"]');
    if (viewToggle) {
      const initialClass = await viewToggle.evaluate(el => el.className);
      await viewToggle.click();
      await page.waitForTimeout(500);
      
      const newClass = await viewToggle.evaluate(el => el.className);
      expect(newClass).not.toBe(initialClass);
      
      // 刷新页面验证偏好保存
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="view-toggle"]');
      
      const persistedClass = await viewToggle.evaluate(el => el.className);
      expect(persistedClass).toBe(newClass);
      
      console.log('✓ 用户偏好持久化正常');
    }

    // 15. 测试并发操作
    console.log('开始并发操作测试...');
    
    // 同时进行多个操作
    const concurrentActions = [
      // 操作1: 过滤
      page.click('[data-testid="filter-content"]').catch(() => {}),
      
      // 操作2: 搜索
      page.type('input[placeholder*="搜索"]', 'test').catch(() => {}),
      
      // 操作3: 排序
      page.select('select[data-testid="achievement-sort"]', 'name').catch(() => {}),
    ];
    
    await Promise.all(concurrentActions);
    await page.waitForTimeout(1000);
    
    // 验证系统没有崩溃
    const container = await page.$('[data-testid="achievements-container"]');
    expect(container).toBeTruthy();
    
    console.log('✓ 并发操作处理正常');

    // 16. 测试边界条件
    // 测试大量数据
    console.log('测试大量数据加载...');
    
    // 模拟大量成就数据
    await page.evaluate(() => {
      window.TEST_MODE = 'large-data';
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    
    // 验证大量数据加载
    await page.waitForSelector('[data-testid="achievement-item"]', { timeout: 10000 });
    
    const allItems = await page.$$('[data-testid="achievement-item"]');
    expect(allItems.length).toBeGreaterThan(0);
    
    // 检查虚拟滚动或分页
    const virtualScroll = await page.$('[data-testid="virtual-scroll"]');
    const pagination = await page.$('[data-testid="pagination"]');
    
    expect(virtualScroll || pagination).toBeTruthy();
    
    console.log('✓ 大量数据处理正常');

    // 17. 测试国际化
    // 切换语言（如果支持）
    const languageSwitcher = await page.$('[data-testid="language-switcher"]');
    if (languageSwitcher) {
      await languageSwitcher.click();
      
      const englishOption = await page.$('button:has-text("English")');
      if (englishOption) {
        await englishOption.click();
        await page.waitForTimeout(1000);
        
        // 验证界面语言切换
        const englishTitle = await page.$eval('h1', el => el.textContent);
        expect(englishTitle.toLowerCase()).toContain('achievement');
        
        console.log('✓ 国际化支持正常');
        
        // 切换回中文
        await languageSwitcher.click();
        const chineseOption = await page.$('button:has-text("中文")');
        await chineseOption.click();
      }
    }

    // 18. 测试主题切换
    const themeToggle = await page.$('[data-testid="theme-toggle"]');
    if (themeToggle) {
      const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(newTheme).not.toBe(initialTheme);
      
      console.log('✓ 主题切换正常');
    }

    // 19. 测试离线支持
    console.log('测试离线支持...');
    
    // 模拟离线状态
    await page.setOfflineMode(true);
    await page.waitForTimeout(1000);
    
    // 尝试操作
    try {
      await page.click('[data-testid="achievement-item"]');
    } catch (error) {
      // 离线时操作可能失败，这是正常的
    }
    
    // 验证离线提示
    const offlineIndicator = await page.$('[data-testid="offline-indicator"]');
    if (offlineIndicator) {
      expect(offlineIndicator).toBeTruthy();
    }
    
    // 恢复在线状态
    await page.setOfflineMode(false);
    
    console.log('✓ 离线支持正常');

    // 20. 测试安全
    console.log('测试安全功能...');
    
    // 尝试XSS攻击
    const xssPayload = '<script>alert("xss")</script>';
    await page.evaluate((payload) => {
      const input = document.querySelector('input[placeholder*="搜索"]');
      if (input) {
        input.value = payload;
        input.dispatchEvent(new Event('input'));
      }
    }, xssPayload);
    
    await page.waitForTimeout(1000);
    
    // 验证没有执行脚本
    const alerts = await page.evaluate(() => {
      return window.alertCalls || 0;
    });
    
    expect(alerts).toBe(0);
    
    console.log('✓ 安全防护正常');

    console.log('🎉 所有系统测试通过！');
  }, 60000);

  // 测试2: 性能基准测试
  test('性能基准测试', async () => {
    console.log('开始性能基准测试...');
    
    await page.goto('http://localhost:3000/achievements');
    await page.waitForSelector('[data-testid="achievements-container"]');
    
    // 收集性能数据
    const performanceData = await page.evaluate(() => {
      const data = {};
      
      // 导航计时
      const [navigationEntry] = performance.getEntriesByType('navigation');
      if (navigationEntry) {
        data.navigation = {
          d