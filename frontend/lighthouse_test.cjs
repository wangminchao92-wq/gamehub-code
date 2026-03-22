const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Lighthouse性能评估开始\n');

// 测试URL
const testUrls = [
  { url: 'http://localhost:3000/', name: '首页' },
  { url: 'http://localhost:3000/news/ultra-simple/cyberpunk-2077-2-0-review', name: '文章详情页' },
  { url: 'http://localhost:3000/user/ultra-simple/admin', name: '用户个人中心' },
  { url: 'http://localhost:3000/community/post/ultra-simple/cmn19p2xr0005jd5sb9h1jo0p', name: '帖子详情页' },
];

// 创建报告目录
const reportDir = path.join(__dirname, 'lighthouse-reports');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

async function runLighthouseTest(url, name) {
  console.log(`📊 测试: ${name}`);
  console.log(`🔗 URL: ${url}`);
  
  const reportFile = path.join(reportDir, `${name.replace(/\s+/g, '-')}-report.json`);
  const htmlFile = path.join(reportDir, `${name.replace(/\s+/g, '-')}-report.html`);
  
  return new Promise((resolve, reject) => {
    const command = `npx lighthouse ${url} --output=json,html --output-path=${reportFile} --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo`;
    
    console.log('  运行Lighthouse测试...');
    
    exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
      if (error) {
        console.log(`  ❌ 测试失败: ${error.message}`);
        resolve({ name, url, success: false, error: error.message });
        return;
      }
      
      try {
        // 读取JSON报告
        const reportData = fs.readFileSync(reportFile, 'utf8');
        const report = JSON.parse(reportData);
        
        const scores = {
          performance: Math.round(report.categories.performance.score * 100),
          accessibility: Math.round(report.categories.accessibility.score * 100),
          bestPractices: Math.round(report.categories['best-practices'].score * 100),
          seo: Math.round(report.categories.seo.score * 100),
        };
        
        // 提取关键指标
        const metrics = report.audits;
        const keyMetrics = {
          firstContentfulPaint: metrics['first-contentful-paint']?.displayValue || 'N/A',
          largestContentfulPaint: metrics['largest-contentful-paint']?.displayValue || 'N/A',
          cumulativeLayoutShift: metrics['cumulative-layout-shift']?.displayValue || 'N/A',
          totalBlockingTime: metrics['total-blocking-time']?.displayValue || 'N/A',
          speedIndex: metrics['speed-index']?.displayValue || 'N/A',
        };
        
        console.log(`  ✅ 测试完成`);
        console.log(`     性能: ${scores.performance}/100`);
        console.log(`     可访问性: ${scores.accessibility}/100`);
        console.log(`     最佳实践: ${scores.bestPractices}/100`);
        console.log(`     SEO: ${scores.seo}/100`);
        
        resolve({
          name,
          url,
          success: true,
          scores,
          keyMetrics,
          reportPath: htmlFile,
        });
        
      } catch (parseError) {
        console.log(`  ❌ 报告解析失败: ${parseError.message}`);
        resolve({ name, url, success: false, error: parseError.message });
      }
    });
  });
}

async function runAllTests() {
  console.log('='.repeat(60));
  console.log('🎯 Lighthouse性能评估');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const page of testUrls) {
    const result = await runLighthouseTest(page.url, page.name);
    results.push(result);
    console.log(''); // 空行分隔
  }
  
  // 生成总结报告
  console.log('='.repeat(60));
  console.log('📋 Lighthouse性能评估总结');
  console.log('='.repeat(60));
  
  const successfulTests = results.filter(r => r.success);
  
  if (successfulTests.length > 0) {
    // 计算平均分
    const avgScores = {
      performance: Math.round(successfulTests.reduce((sum, r) => sum + r.scores.performance, 0) / successfulTests.length),
      accessibility: Math.round(successfulTests.reduce((sum, r) => sum + r.scores.accessibility, 0) / successfulTests.length),
      bestPractices: Math.round(successfulTests.reduce((sum, r) => sum + r.scores.bestPractices, 0) / successfulTests.length),
      seo: Math.round(successfulTests.reduce((sum, r) => sum + r.scores.seo, 0) / successfulTests.length),
    };
    
    console.log(`📊 测试页面: ${successfulTests.length}/${testUrls.length} 成功`);
    console.log('');
    
    console.log('🏆 平均得分:');
    console.log(`   性能: ${avgScores.performance}/100 ${getScoreEmoji(avgScores.performance)}`);
    console.log(`   可访问性: ${avgScores.accessibility}/100 ${getScoreEmoji(avgScores.accessibility)}`);
    console.log(`   最佳实践: ${avgScores.bestPractices}/100 ${getScoreEmoji(avgScores.bestPractices)}`);
    console.log(`   SEO: ${avgScores.seo}/100 ${getScoreEmoji(avgScores.seo)}`);
    console.log('');
    
    console.log('📈 性能指标分析:');
    successfulTests.forEach(test => {
      console.log(`   ${test.name}:`);
      console.log(`     FCP: ${test.keyMetrics.firstContentfulPaint}`);
      console.log(`     LCP: ${test.keyMetrics.largestContentfulPaint}`);
      console.log(`     CLS: ${test.keyMetrics.cumulativeLayoutShift}`);
      console.log(`     TBT: ${test.keyMetrics.totalBlockingTime}`);
      console.log(`     Speed Index: ${test.keyMetrics.speedIndex}`);
    });
    console.log('');
    
    console.log('💡 优化建议:');
    if (avgScores.performance < 90) {
      console.log('   • 性能优化建议:');
      console.log('     - 图片懒加载和优化');
      console.log('     - 代码分割和懒加载组件');
      console.log('     - 减少JavaScript执行时间');
      console.log('     - 优化CSS交付');
    }
    
    if (avgScores.accessibility < 90) {
      console.log('   • 可访问性优化建议:');
      console.log('     - 添加ARIA标签');
      console.log('     - 确保颜色对比度达标');
      console.log('     - 键盘导航支持');
      console.log('     - 屏幕阅读器兼容性');
    }
    
    if (avgScores.seo < 90) {
      console.log('   • SEO优化建议:');
      console.log('     - 优化meta标签');
      console.log('     - 结构化数据标记');
      console.log('     - 移动端友好性');
      console.log('     - 页面加载速度');
    }
    
    console.log('');
    console.log('📁 报告文件位置:');
    console.log(`   ${reportDir}/`);
    successfulTests.forEach(test => {
      console.log(`   • ${test.name}: ${test.reportPath}`);
    });
    
  } else {
    console.log('❌ 所有测试失败，请检查开发服务器是否运行');
  }
  
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 Lighthouse性能评估完成');
  console.log('='.repeat(60));
}

function getScoreEmoji(score) {
  if (score >= 90) return '🏆';
  if (score >= 75) return '✅';
  if (score >= 50) return '⚠️';
  return '❌';
}

// 检查是否安装了lighthouse
exec('npx lighthouse --version', (error) => {
  if (error) {
    console.log('⚠️ Lighthouse未安装，正在安装...');
    exec('npm install -g lighthouse', (installError) => {
      if (installError) {
        console.log('❌ Lighthouse安装失败，使用本地版本');
        runAllTests();
      } else {
        console.log('✅ Lighthouse安装成功');
        runAllTests();
      }
    });
  } else {
    runAllTests();
  }
});