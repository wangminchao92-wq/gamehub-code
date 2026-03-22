const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

console.log('📱 增强版移动端兼容性测试\n');

// 测试的URL
const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/news/ultra-simple/cyberpunk-2077-2-0-review',
  'http://localhost:3000/user/ultra-simple/admin',
  'http://localhost:3000/community/post/ultra-simple/cmn19p2xr0005jd5sb9h1jo0p',
];

// 测试结果存储
const testResults = [];

// 触摸优化类检测
const TOUCH_OPTIMIZATION_CLASSES = [
  'touch-target',
  'btn-touch',
  'link-touch',
  'link-block-touch',
  'card-touch',
  'list-item-touch',
  'grid-item-touch',
  'nav-item-touch',
  'hamburger-touch',
  'input-touch',
  'select-touch',
  'checkbox-touch',
  'radio-touch',
];

async function testMobileCompatibility(url, name) {
  console.log(`📱 测试: ${name}`);
  console.log(`🔗 URL: ${url}`);
  
  try {
    // 获取页面HTML
    const { stdout: html } = await execPromise(`curl -s ${url}`);
    
    // 分析页面内容
    const analysis = {
      name,
      url,
      hasViewport: html.includes('viewport'),
      hasTouchOptimization: false,
      touchElements: [],
      buttonCount: 0,
      linkCount: 0,
      formElementCount: 0,
      responsiveClasses: [],
      mobileNavigation: false,
      fontSizeAnalysis: {},
    };
    
    // 检查触摸优化类
    TOUCH_OPTIMIZATION_CLASSES.forEach(className => {
      const regex = new RegExp(`class=["'][^"']*${className}[^"']*["']`, 'g');
      const matches = html.match(regex);
      if (matches && matches.length > 0) {
        analysis.hasTouchOptimization = true;
        analysis.touchElements.push({
          className,
          count: matches.length,
        });
      }
    });
    
    // 检查按钮数量
    const buttonRegex = /<button/g;
    const buttonMatches = html.match(buttonRegex);
    analysis.buttonCount = buttonMatches ? buttonMatches.length : 0;
    
    // 检查链接数量
    const linkRegex = /<a[^>]*href=["'][^"']+["'][^>]*>/g;
    const linkMatches = html.match(linkRegex);
    analysis.linkCount = linkMatches ? linkMatches.length : 0;
    
    // 检查表单元素
    const inputRegex = /<input/g;
    const selectRegex = /<select/g;
    const textareaRegex = /<textarea/g;
    
    analysis.formElementCount = 
      (html.match(inputRegex)?.length || 0) +
      (html.match(selectRegex)?.length || 0) +
      (html.match(textareaRegex)?.length || 0);
    
    // 检查响应式类 (Tailwind)
    const responsiveClassRegex = /(sm:|md:|lg:|xl:|2xl:)[a-zA-Z0-9-]+/g;
    const responsiveMatches = html.match(responsiveClassRegex);
    if (responsiveMatches) {
      analysis.responsiveClasses = [...new Set(responsiveMatches)];
    }
    
    // 检查移动导航
    analysis.mobileNavigation = 
      html.includes('hamburger') || 
      html.includes('mobile-nav') || 
      html.includes('navbar-toggle');
    
    // 字体大小分析
    const styleRegex = /font-size:\s*([0-9]+)(px|rem|em)/g;
    let match;
    const fontSizeCounts = {};
    
    while ((match = styleRegex.exec(html)) !== null) {
      const size = parseInt(match[1]);
      const unit = match[2];
      const key = `${size}${unit}`;
      fontSizeCounts[key] = (fontSizeCounts[key] || 0) + 1;
    }
    
    analysis.fontSizeAnalysis = fontSizeCounts;
    
    // 计算触摸友好得分
    const touchScore = calculateTouchScore(analysis);
    
    console.log(`  📱 视口配置: ${analysis.hasViewport ? '✅' : '❌'}`);
    console.log(`  👆 触摸优化: ${analysis.hasTouchOptimization ? '✅' : '❌'}`);
    console.log(`  🔘 按钮数量: ${analysis.buttonCount}`);
    console.log(`  🔗 链接数量: ${analysis.linkCount}`);
    console.log(`  📝 表单元素: ${analysis.formElementCount}`);
    console.log(`  🎨 响应式类: ${analysis.responsiveClasses.length} 种`);
    console.log(`  🍔 移动导航: ${analysis.mobileNavigation ? '✅' : '❌'}`);
    console.log(`  📊 触摸得分: ${touchScore}/100`);
    
    if (analysis.touchElements.length > 0) {
      console.log(`  🎯 触摸优化元素:`);
      analysis.touchElements.forEach(elem => {
        console.log(`     • ${elem.className}: ${elem.count} 个`);
      });
    }
    
    testResults.push({
      ...analysis,
      touchScore,
    });
    
    return analysis;
    
  } catch (error) {
    console.log(`  ❌ 测试失败: ${error.message}`);
    return null;
  }
}

function calculateTouchScore(analysis) {
  let score = 0;
  
  // 视口配置 (20分)
  if (analysis.hasViewport) score += 20;
  
  // 触摸优化类使用 (30分)
  if (analysis.hasTouchOptimization) {
    score += 20;
    // 每2种触摸优化类加2分，最多10分
    const classBonus = Math.min(analysis.touchElements.length * 2, 10);
    score += classBonus;
  }
  
  // 响应式设计 (20分)
  if (analysis.responsiveClasses.length >= 3) score += 20;
  else if (analysis.responsiveClasses.length >= 1) score += 10;
  
  // 移动导航 (15分)
  if (analysis.mobileNavigation) score += 15;
  
  // 字体可读性 (15分)
  const hasReadableFont = Object.keys(analysis.fontSizeAnalysis).some(key => {
    const size = parseInt(key);
    return size >= 16 || key.includes('rem') || key.includes('em');
  });
  if (hasReadableFont) score += 15;
  
  return score;
}

async function generateEnhancedReport() {
  console.log('='.repeat(60));
  console.log('📱 增强版移动端兼容性测试报告');
  console.log('='.repeat(60));
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const name = ['首页', '文章详情页', '用户个人中心', '帖子详情页'][i];
    await testMobileCompatibility(url, name);
    console.log('');
  }
  
  // 计算总体统计
  const totalScore = testResults.reduce((sum, result) => sum + result.touchScore, 0);
  const avgScore = testResults.length > 0 ? totalScore / testResults.length : 0;
  
  const pagesWithViewport = testResults.filter(r => r.hasViewport).length;
  const pagesWithTouchOptimization = testResults.filter(r => r.hasTouchOptimization).length;
  const pagesWithMobileNav = testResults.filter(r => r.mobileNavigation).length;
  
  console.log('='.repeat(60));
  console.log('📊 总体统计');
  console.log('='.repeat(60));
  
  console.log(`📱 测试页面: ${testResults.length}/${urls.length} 成功`);
  console.log(`🏆 平均触摸友好得分: ${avgScore.toFixed(1)}/100`);
  console.log(`👁️  视口配置: ${pagesWithViewport}/${testResults.length} 页面`);
  console.log(`👆 触摸优化: ${pagesWithTouchOptimization}/${testResults.length} 页面`);
  console.log(`🍔 移动导航: ${pagesWithMobileNav}/${testResults.length} 页面`);
  
  // 触摸优化元素统计
  const allTouchElements = {};
  testResults.forEach(result => {
    result.touchElements.forEach(elem => {
      allTouchElements[elem.className] = (allTouchElements[elem.className] || 0) + elem.count;
    });
  });
  
  if (Object.keys(allTouchElements).length > 0) {
    console.log('\n🎯 触摸优化元素使用统计:');
    Object.entries(allTouchElements)
      .sort((a, b) => b[1] - a[1])
      .forEach(([className, count]) => {
        console.log(`  • ${className}: ${count} 次使用`);
      });
  }
  
  // 生成优化建议
  console.log('\n' + '='.repeat(60));
  console.log('💡 详细优化建议');
  console.log('='.repeat(60));
  
  if (avgScore < 60) {
    console.log('⚠️  移动端兼容性需要大幅提升');
    
    if (pagesWithViewport < testResults.length) {
      console.log('  1. 📱 视口配置不完整');
      console.log('     • 确保所有页面都有正确的viewport meta标签');
      console.log('     • 添加: <meta name="viewport" content="width=device-width, initial-scale=1">');
    }
    
    if (pagesWithTouchOptimization < testResults.length) {
      console.log('  2. 👆 触摸优化不足');
      console.log('     • 为所有交互元素添加触摸优化类');
      console.log('     • 使用 touch-target 确保最小48x48像素');
      console.log('     • 为按钮添加 btn-touch 类');
      console.log('     • 为链接添加 link-touch 或 link-block-touch 类');
    }
    
    if (pagesWithMobileNav < testResults.length) {
      console.log('  3. 🍔 移动导航缺失');
      console.log('     • 添加汉堡菜单用于移动端导航');
      console.log('     • 使用 hamburger-touch 类确保触摸友好');
      console.log('     • 实现响应式导航切换');
    }
    
    const totalButtons = testResults.reduce((sum, r) => sum + r.buttonCount, 0);
    const totalLinks = testResults.reduce((sum, r) => sum + r.linkCount, 0);
    
    console.log(`  4. 🔘 交互元素统计: ${totalButtons} 按钮, ${totalLinks} 链接`);
    console.log('     • 确保所有按钮和链接都触摸友好');
    console.log('     • 检查是否有过小的交互元素');
    console.log('     • 增加触摸目标之间的间距');
    
  } else if (avgScore < 80) {
    console.log('✅ 移动端兼容性良好，仍有优化空间');
    
    // 具体页面建议
    testResults.forEach((result, index) => {
      if (result.touchScore < 70) {
        console.log(`  • ${result.name}: ${result.touchScore}分 - 需要优化`);
        if (!result.hasTouchOptimization) {
          console.log('     - 添加触摸优化类');
        }
        if (!result.mobileNavigation) {
          console.log('     - 改进移动导航');
        }
      }
    });
    
  } else {
    console.log('🏆 移动端兼容性优秀！');
  }
  
  // 生成具体实施建议
  console.log('\n' + '='.repeat(60));
  console.log('🚀 具体实施建议');
  console.log('='.repeat(60));
  
  console.log('1. 立即实施（今天完成）:');
  console.log('   • 检查并修复缺少viewport的页面');
  console.log('   • 为所有按钮添加 btn-touch touch-target 类');
  console.log('   • 为所有链接添加 link-touch 或 link-block-touch 类');
  console.log('   • 为表单元素添加 input-touch、select-touch 类');
  
  console.log('\n2. 短期优化（1-2天）:');
  console.log('   • 实现完整的移动端导航菜单');
  console.log('   • 优化卡片和列表项的触摸体验');
  console.log('   • 添加触摸反馈效果（如按下状态）');
  console.log('   • 测试不同移动设备的显示效果');
  
  console.log('\n3. 长期优化（1周内）:');
  console.log('   • 实现手势操作支持（如滑动、长按）');
  console.log('   • 优化移动端性能（图片懒加载、代码分割）');
  console.log('   • 添加移动端专属功能（如下拉刷新）');
  console.log('   • 进行真实用户移动端测试');
  
  // 保存详细报告
  const report = {
    timestamp: new Date().toISOString(),
    testResults,
    summary: {
      averageScore: avgScore,
      pagesTested: testResults.length,
      pagesWithViewport,
      pagesWithTouchOptimization,
      pagesWithMobileNav,
      totalTouchElements: Object.values(allTouchElements).reduce((a, b) => a + b, 0),
    },
    recommendations: {
      immediate: [
        '修复缺少viewport的页面',
        '为所有交互元素添加触摸优化类',
        '确保最小触摸目标48x48像素',
      ],
      shortTerm: [
        '实现移动端导航菜单',
        '优化触摸反馈效果',
        '测试不同设备兼容性',
      ],
      longTerm: [
        '添加手势操作支持',
        '优化移动端性能',
        '进行真实用户测试',
      ],
    },
  };
  
  const reportPath = path.join(__dirname, 'mobile_compatibility_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📁 报告保存: mobile_compatibility_report.json');
  console.log('='.repeat(60));
  
  // 生成优化清单
  generateOptimizationChecklist(report);
}

function generateOptimizationChecklist(report) {
  const checklistPath = path.join(__dirname, 'mobile_optimization_checklist.md');
  
  let checklist = `# GameHub 移动端优化清单

## 测试时间
${new Date().toLocaleString()}

## 测试结果
- 平均触摸友好得分: ${report.summary.averageScore.toFixed(1)}/100
- 测试页面: ${report.summary.pagesTested} 个
- 视口配置完整: ${report.summary.pagesWithViewport} 页面
- 触摸优化应用: ${report.summary.pagesWithTouchOptimization} 页面
- 移动导航存在: ${report.summary.pagesWithMobileNav} 页面

## 详细测试结果

| 页面 | 触摸得分 | 视口配置 | 触摸优化 | 移动导航 | 响应式类 |
|------|----------|----------|----------|----------|----------|
`;

  report.testResults.forEach(result => {
    checklist += `| ${result.name} | ${result.touchScore} | ${result.hasViewport ? '✅' : '❌'} | ${result.hasTouchOptimization ? '✅' : '❌'} | ${result.mobileNavigation ? '✅' : '❌'} | ${result.responsiveClasses.length} |\n`;
  });

  checklist += `
## 优化检查清单

### 1. 基础配置 ✅
- [ ] 所有页面都有正确的viewport meta标签
- [ ] 禁用电话号码/邮箱自动识别
- [ ] 设置主题颜色和状态栏颜色
- [ ] 防止iOS Safari缩放

### 2. 触摸优化 🔘
- [ ] 所有按钮添加 \`btn-touch touch-target\` 类
- [ ] 所有链接添加 \`link-touch\` 或 \`link-block-touch\` 类
- [ ] 表单元素添加 \`input-touch\`、\`select-touch\` 类
- [ ] 卡片和列表项添加 \`card-touch\`、\`list-item-touch\` 类
- [ ] 导航项添加 \`nav-item-touch\` 类

### 3. 响应式设计 📱
- [ ] 使用Tailwind响应式工具类（sm:, md:, lg:, xl:）
- [ ] 测试不同屏幕尺寸的布局
- [ ] 优化移动端图片显示
- [ ] 确保文字在移动端可读

### 4. 移动导航 🍔
- [ ] 实现汉堡菜单
- [ ] 添加 \`hamburger-touch\` 类
- [ ] 优化移动端菜单体验
- [ ] 确保导航项触摸友好

### 5. 性能优化 ⚡
- [ ] 图片懒加载
- [ ] 代码分割
- [ ] 减少HTTP请求
- [ ] 优化移动端加载速度

## 立即行动项

`;

  if (report.summary.averageScore < 60) {
    checklist += `1. **紧急优化**（今天完成）\n`;
    checklist += `   - 修复缺少viewport的页面\n`;
    checklist += `   - 为所有交互元素添加触摸优化类\n`;
    checklist += `   - 确保最小触摸目标48x48像素\n\n`;
  }

  if (report.summary.pagesWithMobileNav < report.summary.pagesTested) {
    checklist += `2. **移动导航优化**（明天完成）\n`;
    checklist += `   - 实现汉堡菜单\n`;
    checklist += `   - 优化移动端导航体验\n`;
    checklist += `   - 确保导航项触摸友好\n\n`;
  }

  if (report.summary.averageScore < 80) {
    checklist += `3. **响应式设计优化**（2天内完成）\n`;
    checklist += `   - 完善Tailwind响应式类\n`;
    checklist += `   - 测试不同设备显示效果\n`;
    checklist += `   - 优化移动端布局\n\n`;
  }

  checklist += `## 监控建议

1. **持续监控**: 定期运行移动端兼容性测试
2. **用户反馈**: 收集移动端用户使用体验
3. **设备测试**: 测试不同移动设备和浏览器
4. **性能监控**: 监控移动端加载速度和性能

---

*最后更新: ${new Date().toLocaleString()}*
*优化状态: ${report.summary.averageScore >= 80 ? '优秀' : report.summary.averageScore >= 60 ? '良好' : '需要大幅优化'}*
*建议优先级: ${report.summary.averageScore < 60 ? '高' : report.summary.averageScore < 80 ? '中' : '低'}*
`;

  fs.writeFileSync(checklistPath, checklist);
  console.log(`📋 优化清单: mobile_optimization_checklist.md`);
}

// 运行测试
generateEnhancedReport().catch(console.error);