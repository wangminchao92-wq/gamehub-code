const { execSync } = require('child_process');

console.log('📱 测试触摸优化首页效果\n');

const url = 'http://localhost:3000/home-touch-test';

try {
  // 获取页面HTML
  const html = execSync(`curl -s ${url}`).toString();
  
  console.log(`🔗 测试页面: ${url}`);
  console.log(`📄 页面大小: ${(html.length / 1024).toFixed(2)}KB`);
  
  // 检查触摸优化类
  const touchClasses = [
    'touch-target',
    'btn-touch', 
    'link-touch',
    'link-block-touch',
    'card-touch',
    'nav-item-touch',
    'hamburger-touch'
  ];
  
  let hasTouchOptimization = false;
  const touchElements = [];
  
  touchClasses.forEach(className => {
    const regex = new RegExp(`class=["'][^"']*${className}[^"']*["']`, 'g');
    const matches = html.match(regex);
    if (matches && matches.length > 0) {
      hasTouchOptimization = true;
      touchElements.push({ className, count: matches.length });
    }
  });
  
  console.log(`\n👆 触摸优化检测:`);
  console.log(`  总体状态: ${hasTouchOptimization ? '✅ 已应用' : '❌ 未应用'}`);
  
  if (touchElements.length > 0) {
    console.log(`  优化元素统计:`);
    touchElements.forEach(elem => {
      console.log(`    • ${elem.className.padEnd(20)}: ${elem.count} 个`);
    });
    console.log(`  总计: ${touchElements.reduce((sum, elem) => sum + elem.count, 0)} 个触摸优化元素`);
  }
  
  // 检查视口配置
  const hasViewport = html.includes('viewport');
  console.log(`\n📱 视口配置: ${hasViewport ? '✅' : '❌'}`);
  
  // 检查响应式类
  const responsiveRegex = /(sm:|md:|lg:|xl:|2xl:)[a-zA-Z0-9-]+/g;
  const responsiveMatches = html.match(responsiveRegex);
  const responsiveClasses = responsiveMatches ? [...new Set(responsiveMatches)] : [];
  console.log(`🎨 响应式类: ${responsiveClasses.length} 种`);
  if (responsiveClasses.length > 0) {
    console.log(`  示例: ${responsiveClasses.slice(0, 5).join(', ')}${responsiveClasses.length > 5 ? '...' : ''}`);
  }
  
  // 检查移动导航
  const hasMobileNav = html.includes('hamburger') || html.includes('mobile-nav');
  console.log(`🍔 移动导航: ${hasMobileNav ? '✅' : '❌'}`);
  
  // 统计交互元素
  const buttonCount = (html.match(/<button/g) || []).length;
  const linkCount = (html.match(/<a[^>]*href=["'][^"']+["'][^>]*>/g) || []).length;
  console.log(`\n🔘 交互元素统计:`);
  console.log(`  按钮数量: ${buttonCount}`);
  console.log(`  链接数量: ${linkCount}`);
  
  // 计算触摸得分
  let score = 0;
  
  // 视口配置 (20分)
  if (hasViewport) score += 20;
  
  // 触摸优化 (30分 + 额外10分)
  if (hasTouchOptimization) {
    score += 30;
    // 每3种触摸优化类加2分，最多10分
    const classBonus = Math.min(Math.floor(touchElements.length / 3) * 2, 10);
    score += classBonus;
  }
  
  // 响应式设计 (20分)
  if (responsiveClasses.length >= 5) score += 20;
  else if (responsiveClasses.length >= 3) score += 15;
  else if (responsiveClasses.length >= 1) score += 10;
  
  // 移动导航 (15分)
  if (hasMobileNav) score += 15;
  
  // 字体可读性检查 (15分)
  const fontSizeRegex = /font-size:\s*([0-9]+)(px|rem|em)/g;
  let match;
  let hasReadableFont = false;
  while ((match = fontSizeRegex.exec(html)) !== null) {
    const size = parseInt(match[1]);
    const unit = match[2];
    if (size >= 16 || unit === 'rem' || unit === 'em') {
      hasReadableFont = true;
      break;
    }
  }
  if (hasReadableFont) score += 15;
  
  console.log(`\n📊 触摸友好得分: ${score}/100`);
  
  // 优化建议
  console.log(`\n💡 优化建议:`);
  
  if (score < 60) {
    console.log(`  ⚠️  需要大幅优化 (当前: ${score}/100)`);
    if (!hasTouchOptimization) {
      console.log(`    1. 立即添加触摸优化类`);
      console.log(`       • 为按钮添加 btn-touch touch-target`);
      console.log(`       • 为链接添加 link-touch 或 link-block-touch`);
      console.log(`       • 为卡片添加 card-touch`);
    }
    if (!hasMobileNav) {
      console.log(`    2. 实现移动导航`);
      console.log(`       • 添加汉堡菜单`);
      console.log(`       • 使用 hamburger-touch 类`);
    }
  } else if (score < 80) {
    console.log(`  ✅ 良好，仍有优化空间 (当前: ${score}/100)`);
    if (score < 70) {
      console.log(`    1. 增加触摸优化元素覆盖率`);
      console.log(`    2. 完善响应式设计`);
    }
  } else {
    console.log(`  🏆 优秀触摸体验! (当前: ${score}/100)`);
  }
  
  // 与原始首页对比
  console.log(`\n📈 与原始首页对比:`);
  console.log(`  原始首页触摸得分: 45/100`);
  console.log(`  优化后估计得分: ${score}/100`);
  console.log(`  提升: +${score - 45}分`);
  
} catch (error) {
  console.log(`❌ 测试失败: ${error.message}`);
}