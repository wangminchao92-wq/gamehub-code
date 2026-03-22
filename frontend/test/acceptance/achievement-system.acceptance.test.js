/**
 * AchievementSystem 验收测试
 * 测试是否符合用户需求和业务目标
 */

const { defineFeature, loadFeature } = require('jest-cucumber');
const puppeteer = require('puppeteer');
const path = require('path');

// 加载特性文件
const feature = loadFeature(path.join(__dirname, 'features/achievement-system.feature'));

// 定义验收测试
defineFeature(feature, (test) => {
  let browser;
  let page;
  let testContext = {};

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    testContext = {};
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  }, 30000);

  // 场景1: 用户查看成就系统
  test('用户查看成就系统', ({ given, when, then, and }) => {
    given('用户已登录到GameHub平台', async () => {
      await page.goto('http://localhost:3000/login');
      
      // 模拟登录（在实际测试中应该使用真实登录）
      await page.evaluate(() => {
        localStorage.setItem('test-user', JSON.stringify({
          id: 'test-user-123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
        }));
      });
      
      await page.goto('http://localhost:3000');
      await page.waitForSelector('[data-testid="user-menu"]');
    });

    when('用户导航到成就页面', async () => {
      // 点击成就链接
      const achievementsLink = await page.$('a[href*="achievements"]');
      if (achievementsLink) {
        await achievementsLink.click();
      } else {
        await page.goto('http://localhost:3000/achievements');
      }
      
      await page.waitForSelector('[data-testid="achievements-container"]', { timeout: 10000 });
    });

    then('用户应该看到成就系统标题', async () => {
      const title = await page.$eval('h1', el => el.textContent);
      expect(title).toMatch(/成就|Achievements/i);
      
      testContext.pageTitle = title;
    });

    and('用户应该看到成就统计信息', async () => {
      const stats = await page.evaluate(() => {
        const statElements = document.querySelectorAll('[data-testid="achievement-stat"]');
        return Array.from(statElements).map(el => el.textContent);
      });
      
      expect(stats.length).toBeGreaterThan(0);
      expect(stats.some(stat => stat.includes('总成就'))).toBeTruthy();
      expect(stats.some(stat => stat.includes('已解锁'))).toBeTruthy();
      expect(stats.some(stat => stat.includes('积分'))).toBeTruthy();
      
      testContext.stats = stats;
    });

    and('用户应该看到成就列表', async () => {
      const achievements = await page.$$('[data-testid="achievement-item"]');
      expect(achievements.length).toBeGreaterThan(0);
      
      // 记录成就数量
      testContext.achievementCount = achievements.length;
    });

    and('每个成就应该显示名称、描述和积分', async () => {
      const achievementInfo = await page.evaluate(() => {
        const items = document.querySelectorAll('[data-testid="achievement-item"]');
        return Array.from(items.slice(0, 3)).map(item => ({
          name: item.querySelector('[data-testid="achievement-name"]')?.textContent || '',
          description: item.querySelector('[data-testid="achievement-description"]')?.textContent || '',
          points: item.querySelector('[data-testid="achievement-points"]')?.textContent || '',
        }));
      });
      
      achievementInfo.forEach(info => {
        expect(info.name).toBeTruthy();
        expect(info.description).toBeTruthy();
        expect(info.points).toMatch(/\d+/);
      });
      
      testContext.achievementInfo = achievementInfo;
    });

    and('成就应该按类别分类', async () => {
      const categories = await page.evaluate(() => {
        const categoryElements = document.querySelectorAll('[data-testid="achievement-category"]');
        return Array.from(categoryElements).map(el => el.textContent);
      });
      
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('内容成就');
      expect(categories).toContain('社交成就');
      
      testContext.categories = categories;
    });

    and('界面应该美观且易于使用', async () => {
      // 检查布局
      const container = await page.$('[data-testid="achievements-container"]');
      expect(container).toBeTruthy();
      
      // 检查颜色对比度（简单检查）
      const textColor = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="achievement-name"]');
        return element ? window.getComputedStyle(element).color : '';
      });
      
      const bgColor = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="achievement-item"]');
        return element ? window.getComputedStyle(element).backgroundColor : '';
      });
      
      expect(textColor).toBeTruthy();
      expect(bgColor).toBeTruthy();
      
      // 检查响应式设计
      await page.setViewport({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const mobileLayout = await page.$('[data-testid="achievements-container"]');
      expect(mobileLayout).toBeTruthy();
      
      // 恢复桌面视图
      await page.setViewport({ width: 1280, height: 800 });
    });
  });

  // 场景2: 用户过滤和搜索成就
  test('用户过滤和搜索成就', ({ given, when, then, and }) => {
    given('用户在成就页面', async () => {
      await page.goto('http://localhost:3000/achievements');
      await page.waitForSelector('[data-testid="achievements-container"]');
    });

    when('用户点击"内容成就"过滤按钮', async () => {
      const contentFilter = await page.$('[data-testid="filter-content"]');
      expect(contentFilter).toBeTruthy();
      
      await contentFilter.click();
      await page.waitForTimeout(1000);
    });

    then('用户应该只看到内容类成就', async () => {
      const achievements = await page.$$('[data-testid="achievement-item"]');
      expect(achievements.length).toBeGreaterThan(0);
      
      // 验证所有显示的成就都是内容类
      const achievementTypes = await page.evaluate(() => {
        const items = document.querySelectorAll('[data-testid="achievement-item"]');
        return Array.from(items).map(item => 
          item.getAttribute('data-type') || ''
        );
      });
      
      achievementTypes.forEach(type => {
        expect(type).toBe('CONTENT');
      });
      
      testContext.filteredCount = achievements.length;
    });

    when('用户在搜索框输入"首次"', async () => {
      const searchInput = await page.$('input[placeholder*="搜索"]');
      expect(searchInput).toBeTruthy();
      
      await searchInput.type('首次');
      await page.waitForTimeout(1000);
    });

    then('用户应该只看到包含"首次"的成就', async () => {
      const achievements = await page.$$('[data-testid="achievement-item"]');
      expect(achievements.length).toBeGreaterThan(0);
      
      const achievementNames = await page.evaluate(() => {
        const items = document.querySelectorAll('[data-testid="achievement-item"]');
        return Array.from(items).map(item => 
          item.querySelector('[data-testid="achievement-name"]')?.textContent || ''
        );
      });
      
      achievementNames.forEach(name => {
        expect(name).toContain('首次');
      });
      
      testContext.searchedCount = achievements.length;
    });

    and('搜索结果数量应该显示在界面上', async () => {
      const resultText = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="search-results"]');
        return element ? element.textContent : '';
      });
      
      expect(resultText).toContain(testContext.searchedCount.toString());
    });

    when('用户清除搜索条件', async () => {
      const searchInput = await page.$('input[placeholder*="搜索"]');
      await searchInput.click({ clickCount: 3 });
      await searchInput.press('Backspace');
      await page.waitForTimeout(1000);
    });

    then('用户应该看到所有成就', async () => {
      const achievements = await page.$$('[data-testid="achievement-item"]');
      expect(achievements.length).toBe(testContext.filteredCount);
    });
  });

  // 场景3: 用户查看成就详情
  test('用户查看成就详情', ({ given, when, then, and }) => {
    given('用户在成就页面', async () => {
      await page.goto('http://localhost:3000/achievements');
      await page.waitForSelector('[data-testid="achievements-container"]');
    });

    when('用户点击一个成就', async () => {
      const firstAchievement = await page.$('[data-testid="achievement-item"]');
      expect(firstAchievement).toBeTruthy();
      
      // 记录成就信息
      testContext.achievementName = await firstAchievement.$eval(
        '[data-testid="achievement-name"]',
        el => el.textContent
      );
      
      await firstAchievement.click();
      await page.waitForSelector('[data-testid="achievement-detail"]', { timeout: 5000 });
    });

    then('用户应该看到成就详情页面', async () => {
      const detailTitle = await page.$eval('h1', el => el.textContent);
      expect(detailTitle).toBe(testContext.achievementName);
      
      testContext.detailTitle = detailTitle;
    });

    and('页面应该显示成就的完整描述', async () => {
      const description = await page.$eval(
        '[data-testid="achievement-description"]',
        el => el.textContent
      );
      
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(10);
      
      testContext.description = description;
    });

    and('页面应该显示成就的积分奖励', async () => {
      const points = await page.$eval(
        '[data-testid="achievement-points"]',
        el => el.textContent
      );
      
      expect(points).toMatch(/\d+/);
      testContext.points = parseInt(points.match(/\d+/)[0]);
    });

    and('页面应该显示成就的解锁条件', async () => {
      const requirements = await page.$eval(
        '[data-testid="achievement-requirements"]',
        el => el.textContent
      );
      
      expect(requirements).toBeTruthy();
      testContext.requirements = requirements;
    });

    and('页面应该显示成就的解锁状态', async () => {
      const status = await page.$eval(
        '[data-testid="achievement-status"]',
        el => el.textContent
      );
      
      expect(status).toMatch(/已解锁|未解锁|进行中/);
      testContext.status = status;
    });

    and('如果成就已解锁，应该显示解锁时间', async () => {
      if (testContext.status === '已解锁') {
        const unlockedAt = await page.$eval(
          '[data-testid="achievement-unlocked-at"]',
          el => el.textContent
        );
        
        expect(unlockedAt).toBeTruthy();
        expect(unlockedAt).toMatch(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/);
      }
    });

    and('页面应该有返回成就列表的链接', async () => {
      const backLink = await page.$('a[href*="/achievements"]');
      expect(backLink).toBeTruthy();
      
      const linkText = await backLink.evaluate(el => el.textContent);
      expect(linkText).toMatch(/返回|Back/i);
    });

    when('用户点击返回链接', async () => {
      const backLink = await page.$('a[href*="/achievements"]');
      await backLink.click();
      await page.waitForSelector('[data-testid="achievements-container"]');
    });

    then('用户应该返回到成就列表页面', async () => {
      const pageTitle = await page.$eval('h1', el => el.textContent);
      expect(pageTitle).toMatch(/成就|Achievements/i);
    });
  });

  // 场景4: 用户解锁成就
  test('用户解锁成就', ({ given, when, then, and }) => {
    given('用户在成就页面', async () => {
      await page.goto('http://localhost:3000/achievements');
      await page.waitForSelector('[data-testid="achievements-container"]');
    });

    and('用户有一个可解锁的成就', async () => {
      // 查找可解锁的成就
      const unlockableAchievements = await page.evaluate(() => {
        const items = document.querySelectorAll('[data-testid="achievement-item"]');
        return Array.from(items)
          .filter(item => {
            const status = item.querySelector('[data-testid="achievement-status"]')?.textContent;
            return status && status.includes('解锁');
          })
          .map(item => ({
            element: item,
            name: item.querySelector('[data-testid="achievement-name"]')?.textContent || '',
          }));
      });
      
      expect(unlockableAchievements.length).toBeGreaterThan(0);
      
      testContext.unlockableAchievement = unlockableAchievements[0];
      testContext.initialUnlockedCount = await page.evaluate(() => {
        const stat = document.querySelector('[data-testid="stat-unlocked"]');
        return stat ? parseInt(stat.textContent.match(/\d+/)[0]) : 0;
      });
    });

    when('用户点击"立即解锁"按钮', async () => {
      const unlockButton = await testContext.unlockableAchievement.element.$('button:has-text("立即解锁")');
      expect(unlockButton).toBeTruthy();
      
      await unlockButton.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    });

    then('系统应该显示确认对话框', async () => {
      const dialog = await page.$('[role="dialog"]');
      expect(dialog).toBeTruthy();
      
      const dialogTitle = await dialog.$eval('h2', el => el.textContent);
      expect(dialogTitle).toMatch(/确认|Confirm/i);
      
      const dialogMessage = await dialog.evaluate(el => el.textContent);
      expect(dialogMessage).toContain(testContext.unlockableAchievement.name);
    });

    when('用户在对话框中点击"确定"', async () => {
      const confirmButton = await page.$('button:has-text("确定")');
      expect(confirmButton).toBeTruthy();
      
      await confirmButton.click();
      await page.waitForTimeout(2000);
    });

    then('系统应该显示成功消息', async () => {
      const successMessage = await page.$('[data-testid="success-message"]');
      expect(successMessage).toBeTruthy();
      
      const messageText = await successMessage.evaluate(el => el.textContent);
      expect(messageText).toContain('成功');
      expect(messageText).toContain(testContext.unlockableAchievement.name);
    });

    and('成就状态应该更新为"已解锁"', async () => {
      const achievementStatus = await page.evaluate((achievementName) => {
        const items = document.querySelectorAll('[data-testid="achievement-item"]');
        for (const item of items) {
          const name = item.querySelector('[data-testid="achievement-name"]')?.textContent;
          if (name === achievementName) {
            return item.querySelector('[data-testid="achievement-status"]')?.textContent;
          }
        }
        return '';
      }, testContext.unlockableAchievement.name);
      
      expect(achievementStatus).toContain('已解锁');
    });

    and('已解锁成就数量应该增加', async () => {
      const newUnlockedCount = await page.evaluate(() => {
        const stat = document.querySelector('[data-testid="stat-unlocked"]');
        return stat ? parseInt(stat.textContent.match(/\d+/)[0]) : 0;
      });
      
      expect(newUnlockedCount).toBe(testContext.initialUnlockedCount + 1);
    });

    and('用户总积分应该增加', async () => {
      const totalPoints = await page.evaluate(() => {
        const stat = document.querySelector('[data-testid="stat-total-points"]');
        return stat ? parseInt(stat.textContent.match(/\d+/)[0]) : 0;
      });
      
      expect(totalPoints).toBeGreaterThan(0);
    });

    and('成就应该出现在"已解锁"过滤列表中', async