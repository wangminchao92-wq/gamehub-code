const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 最终环境检查\n');
console.log('='.repeat(60));

// 检查的URL列表
const testUrls = [
  { url: 'http://localhost:3000/', name: '首页' },
  { url: 'http://localhost:3000/home-touch-test', name: '触摸优化首页' },
  { url: 'http://localhost:3000/news/ultra-simple/cyberpunk-2077-2-0-review', name: '文章详情页' },
  { url: 'http://localhost:3000/user/ultra-simple/admin', name: '用户个人中心' },
  { url: 'http://localhost:3000/community/post/ultra-simple/cmn19p2xr0005jd5sb9h1jo0p', name: '帖子详情页' },
  { url: 'http://localhost:3000/login', name: '登录页面' },
  { url: 'http://localhost:3000/register', name: '注册页面' },
];

// 测试用户账户
const testAccounts = [
  { username: 'testuser1', password: 'test123', role: '普通用户' },
  { username: 'creator1', password: 'test123', role: '内容创作者' },
  { username: 'admin', password: 'admin123', role: '管理员' },
];

// 检查结果存储
const checkResults = {
  pages: [],
  accounts: [],
  performance: [],
  touchOptimization: [],
};

async function checkPageAccessibility(url, name) {
  console.log(`📄 检查页面: ${name}`);
  console.log(`   URL: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = execSync(`curl -s -o /dev/null -w "%{http_code},%{time_total}" ${url}`, { encoding: 'utf8' });
    const endTime = Date.now();
    
    const [statusCode, timeTotal] = response.trim().split(',').map(v => v.trim());
    const loadTime = parseFloat(timeTotal) * 1000; // 转换为毫秒
    
    const isAccessible = statusCode === '200';
    const status = isAccessible ? '✅' : '❌';
    
    console.log(`   状态: ${status} ${statusCode}`);
    console.log(`   加载时间: ${loadTime.toFixed(0)}ms`);
    
    if (isAccessible) {
      // 获取页面内容检查更多信息
      const html = execSync(`curl -s ${url}`, { encoding: 'utf8' });
      const hasTitle = html.includes('<title>');
      const hasViewport = html.includes('viewport');
      const hasTouchOptimization = html.includes('touch-target') || html.includes('btn-touch');
      
      console.log(`   标题: ${hasTitle ? '✅' : '❌'}`);
      console.log(`   视口: ${hasViewport ? '✅' : '❌'}`);
      console.log(`   触摸优化: ${hasTouchOptimization ? '✅' : '❌'}`);
      
      checkResults.pages.push({
        name,
        url,
        status: 'success',
        statusCode,
        loadTime,
        hasTitle,
        hasViewport,
        hasTouchOptimization,
      });
    } else {
      checkResults.pages.push({
        name,
        url,
        status: 'failed',
        statusCode,
        loadTime,
      });
    }
    
  } catch (error) {
    console.log(`   ❌ 检查失败: ${error.message}`);
    checkResults.pages.push({
      name,
      url,
      status: 'error',
      error: error.message,
    });
  }
  
  console.log('');
}

function checkTestAccounts() {
  console.log('👤 检查测试用户账户');
  console.log('='.repeat(40));
  
  // 注意：这里我们只是检查账户是否存在，实际登录测试需要前端交互
  // 我们可以检查用户相关的页面是否可以访问
  testAccounts.forEach(account => {
    console.log(`   用户: ${account.username} (${account.role})`);
    console.log(`   密码: ${account.password}`);
    
    // 检查用户个人中心页面
    const userUrl = `http://localhost:3000/user/ultra-simple/${account.username}`;
    try {
      const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${userUrl}`, { encoding: 'utf8' });
      const statusCode = response.trim();
      const isAccessible = statusCode === '200';
      
      console.log(`   个人中心: ${isAccessible ? '✅' : '❌'} (${statusCode})`);
      
      checkResults.accounts.push({
        username: account.username,
        role: account.role,
        personalCenterAccessible: isAccessible,
        statusCode,
      });
    } catch (error) {
      console.log(`   个人中心: ❌ (检查失败)`);
      checkResults.accounts.push({
        username: account.username,
        role: account.role,
        personalCenterAccessible: false,
        error: error.message,
      });
    }
    
    console.log('');
  });
}

function checkPerformance() {
  console.log('⚡ 性能检查');
  console.log('='.repeat(40));
  
  const performanceUrls = [
    'http://localhost:3000/',
    'http://localhost:3000/home-touch-test',
  ];
  
  performanceUrls.forEach(url => {
    console.log(`   测试: ${url}`);
    
    try {
      // 进行3次测试取平均值
      let totalTime = 0;
      let successCount = 0;
      
      for (let i = 0; i < 3; i++) {
        const response = execSync(`curl -s -o /dev/null -w "%{http_code},%{time_total}" ${url}`, { encoding: 'utf8' });
        const [statusCode, timeTotal] = response.trim().split(',');
        
        if (statusCode === '200') {
          totalTime += parseFloat(timeTotal) * 1000;
          successCount++;
        }
        
        // 等待一下避免请求太快
        if (i < 2) execSync('sleep 0.5');
      }
      
      if (successCount > 0) {
        const avgTime = totalTime / successCount;
        console.log(`     平均加载时间: ${avgTime.toFixed(0)}ms`);
        console.log(`     成功率: ${successCount}/3`);
        
        let performanceLevel = '优秀';
        if (avgTime > 100) performanceLevel = '良好';
        if (avgTime > 200) performanceLevel = '一般';
        if (avgTime > 500) performanceLevel = '较差';
        
        console.log(`     性能等级: ${performanceLevel}`);
        
        checkResults.performance.push({
          url,
          avgLoadTime: avgTime,
          successRate: successCount / 3,
          performanceLevel,
        });
      } else {
        console.log(`     ❌ 所有测试都失败`);
        checkResults.performance.push({
          url,
          avgLoadTime: null,
          successRate: 0,
          performanceLevel: '失败',
        });
      }
    } catch (error) {
      console.log(`     ❌ 性能测试失败: ${error.message}`);
      checkResults.performance.push({
        url,
        error: error.message,
      });
    }
    
    console.log('');
  });
}

function checkTouchOptimization() {
  console.log('👆 触摸优化检查');
  console.log('='.repeat(40));
  
  const touchTestUrls = [
    { url: 'http://localhost:3000/home-touch-test', name: '触摸优化首页' },
    { url: 'http://localhost:3000/news/ultra-simple/cyberpunk-2077-2-0-review', name: '文章详情页' },
    { url: 'http://localhost:3000/user/ultra-simple/admin', name: '用户个人中心' },
  ];
  
  touchTestUrls.forEach(({ url, name }) => {
    console.log(`   检查: ${name}`);
    console.log(`     URL: ${url}`);
    
    try {
      const html = execSync(`curl -s ${url}`, { encoding: 'utf8' });
      
      // 检查触摸优化类
      const touchClasses = [
        'touch-target',
        'btn-touch',
        'link-touch',
        'link-block-touch',
        'card-touch',
        'nav-item-touch',
        'hamburger-touch',
      ];
      
      const foundClasses = [];
      touchClasses.forEach(className => {
        if (html.includes(className)) {
          foundClasses.push(className);
        }
      });
      
      console.log(`     找到优化类: ${foundClasses.length} 种`);
      if (foundClasses.length > 0) {
        console.log(`     类名: ${foundClasses.join(', ')}`);
      }
      
      // 检查移动导航
      const hasMobileNav = html.includes('hamburger') || html.includes('mobile-nav');
      console.log(`     移动导航: ${hasMobileNav ? '✅' : '❌'}`);
      
      // 检查视口
      const hasViewport = html.includes('viewport');
      console.log(`     视口配置: ${hasViewport ? '✅' : '❌'}`);
      
      checkResults.touchOptimization.push({
        name,
        url,
        touchClasses: foundClasses,
        touchClassCount: foundClasses.length,
        hasMobileNav,
        hasViewport,
        status: 'checked',
      });
      
    } catch (error) {
      console.log(`     ❌ 检查失败: ${error.message}`);
      checkResults.touchOptimization.push({
        name,
        url,
        error: error.message,
        status: 'error',
      });
    }
    
    console.log('');
  });
}

function generateSummaryReport() {
  console.log('='.repeat(60));
  console.log('📊 最终环境检查总结');
  console.log('='.repeat(60));
  
  // 页面可访问性统计
  const accessiblePages = checkResults.pages.filter(p => p.status === 'success').length;
  const totalPages = checkResults.pages.length;
  const pageAccessibilityRate = (accessiblePages / totalPages * 100).toFixed(1);
  
  console.log(`📄 页面可访问性: ${accessiblePages}/${totalPages} (${pageAccessibilityRate}%)`);
  
  // 账户可访问性统计
  const accessibleAccounts = checkResults.accounts.filter(a => a.personalCenterAccessible).length;
  const totalAccounts = checkResults.accounts.length;
  const accountAccessibilityRate = (accessibleAccounts / totalAccounts * 100).toFixed(1);
  
  console.log(`👤 账户可访问性: ${accessibleAccounts}/${totalAccounts} (${accountAccessibilityRate}%)`);
  
  // 性能统计
  if (checkResults.performance.length > 0) {
    const avgLoadTimes = checkResults.performance.filter(p => p.avgLoadTime).map(p => p.avgLoadTime);
    const totalAvgLoadTime = avgLoadTimes.reduce((sum, time) => sum + time, 0);
    const overallAvgLoadTime = avgLoadTimes.length > 0 ? totalAvgLoadTime / avgLoadTimes.length : 0;
    
    console.log(`⚡ 平均加载时间: ${overallAvgLoadTime.toFixed(0)}ms`);
    
    const performanceLevels = checkResults.performance.map(p => p.performanceLevel);
    const excellentCount = performanceLevels.filter(l => l === '优秀').length;
    console.log(`   性能优秀页面: ${excellentCount}/${checkResults.performance.length}`);
  }
  
  // 触摸优化统计
  if (checkResults.touchOptimization.length > 0) {
    const pagesWithTouchOptimization = checkResults.touchOptimization.filter(t => t.touchClassCount > 0).length;
    const pagesWithMobileNav = checkResults.touchOptimization.filter(t => t.hasMobileNav).length;
    
    console.log(`👆 触摸优化: ${pagesWithTouchOptimization}/${checkResults.touchOptimization.length} 页面`);
    console.log(`🍔 移动导航: ${pagesWithMobileNav}/${checkResults.touchOptimization.length} 页面`);
  }
  
  // 总体评估
  console.log('\n' + '='.repeat(60));
  console.log('🏆 总体评估');
  console.log('='.repeat(60));
  
  let overallScore = 0;
  let maxScore = 0;
  
  // 页面可访问性 (30分)
  maxScore += 30;
  overallScore += (accessiblePages / totalPages) * 30;
  
  // 账户可访问性 (20分)
  maxScore += 20;
  overallScore += (accessibleAccounts / totalAccounts) * 20;
  
  // 性能 (25分)
  maxScore += 25;
  if (checkResults.performance.length > 0) {
    const performanceScore = checkResults.performance.reduce((score, p) => {
      if (p.performanceLevel === '优秀') return score + 25;
      if (p.performanceLevel === '良好') return score + 20;
      if (p.performanceLevel === '一般') return score + 15;
      if (p.performanceLevel === '较差') return score + 10;
      return score;
    }, 0);
    overallScore += performanceScore / checkResults.performance.length;
  }
  
  // 触摸优化 (25分)
  maxScore += 25;
  if (checkResults.touchOptimization.length > 0) {
    const touchOptimizationScore = checkResults.touchOptimization.reduce((score, t) => {
      let pageScore = 0;
      if (t.touchClassCount >= 3) pageScore += 15;
      else if (t.touchClassCount >= 1) pageScore += 10;
      
      if (t.hasMobileNav) pageScore += 10;
      else pageScore += 5;
      
      return score + pageScore;
    }, 0);
    overallScore += touchOptimizationScore / checkResults.touchOptimization.length;
  }
  
  const finalScore = (overallScore / maxScore * 100).toFixed(1);
  
  console.log(`📈 环境检查得分: ${finalScore}/100`);
  
  if (finalScore >= 90) {
    console.log('   🏆 优秀 - 环境准备就绪，可以开始用户测试');
  } else if (finalScore >= 70) {
    console.log('   ✅ 良好 - 环境基本就绪，建议进行少量优化');
  } else if (finalScore >= 50) {
    console.log('   ⚠️  一般 - 需要优化后才能开始用户测试');
  } else {
    console.log('   ❌ 较差 - 需要大幅优化环境');
  }
  
  // 建议
  console.log('\n💡 建议:');
  
  if (accessiblePages < totalPages) {
    console.log(`   1. 修复无法访问的页面 (${totalPages - accessiblePages} 个)`);
  }
  
  if (accessibleAccounts < totalAccounts) {
    console.log(`   2. 检查测试账户访问权限 (${totalAccounts - accessibleAccounts} 个)`);
  }
  
  const slowPages = checkResults.performance.filter(p => p.avgLoadTime > 200);
  if (slowPages.length > 0) {
    console.log(`   3. 优化加载较慢的页面 (${slowPages.length} 个)`);
  }
  
  const pagesWithoutTouchOptimization = checkResults.touchOptimization.filter(t => t.touchClassCount === 0);
  if (pagesWithoutTouchOptimization.length > 0) {
    console.log(`   4. 为页面添加触摸优化 (${pagesWithoutTouchOptimization.length} 个)`);
  }
  
  // 保存检查报告
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      finalScore: parseFloat(finalScore),
      pageAccessibility: `${accessiblePages}/${totalPages}`,
      accountAccessibility: `${accessibleAccounts}/${totalAccounts}`,
      overallAssessment: finalScore >= 90 ? '优秀' : finalScore >= 70 ? '良好' : finalScore >= 50 ? '一般' : '较差',
    },
    details: checkResults,
    recommendations: [
      accessiblePages < totalPages ? `修复无法访问的页面 (${totalPages - accessiblePages} 个)` : null,
      accessibleAccounts < totalAccounts ? `检查测试账户访问权限 (${totalAccounts - accessibleAccounts} 个)` : null,
      slowPages.length > 0 ? `优化加载较慢的页面 (${slowPages.length} 个)` : null,
      pagesWithoutTouchOptimization.length > 0 ? `为页面添加触摸优化 (${pagesWithoutTouchOptimization.length} 个)` : null,
    ].filter(Boolean),
  };
  
  const reportPath = path.join(__dirname, 'final_environment_check_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📁 检查报告保存: final_environment_check_report.json`);
  console.log('='.repeat(60));
}

// 执行检查
async function runAllChecks() {
  console.log('🚀 开始最终环境检查\n');
  
  // 检查页面可访问性
  console.log('📄 页面可访问性检查');
  console.log('='.repeat(40));
  for (const { url, name } of testUrls) {
    await checkPageAccessibility(url, name);
  }
  
  // 检查测试账户
  checkTestAccounts();
  
  // 检查性能
  checkPerformance();
  
  // 检查触摸优化
  checkTouchOptimization();
  
  // 生成总结报告
  generateSummaryReport();
}

// 运行所有检查
runAllChecks().catch(console.error);