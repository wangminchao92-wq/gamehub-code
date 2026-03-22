const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

console.log('📊 性能监控脚本启动\n');

// 监控的URL
const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/news/ultra-simple/cyberpunk-2077-2-0-review',
  'http://localhost:3000/user/ultra-simple/admin',
  'http://localhost:3000/community/post/ultra-simple/cmn19p2xr0005jd5sb9h1jo0p',
];

// 性能指标
const performanceMetrics = {
  pageLoadTime: [],
  pageSize: [],
  requests: [],
  imageCount: [],
  scriptCount: [],
  cssCount: [],
};

async function measurePerformance(url, name) {
  console.log(`📈 测量: ${name}`);
  console.log(`🔗 URL: ${url}`);
  
  try {
    // 使用curl测量页面加载时间
    const startTime = Date.now();
    const { stdout } = await execPromise(`curl -s -o /dev/null -w "%{time_total},%{size_download},%{num_connects},%{num_redirects}" ${url}`);
    const endTime = Date.now();
    
    const [timeTotal, sizeDownload, numConnects, numRedirects] = stdout.split(',').map(Number);
    
    // 获取页面内容分析
    const { stdout: html } = await execPromise(`curl -s ${url}`);
    
    // 分析HTML内容
    const imageCount = (html.match(/<img/g) || []).length;
    const scriptCount = (html.match(/<script/g) || []).length;
    const cssCount = (html.match(/<link.*?rel="stylesheet"/g) || []).length;
    const lazyImages = (html.match(/loading="lazy"/g) || []).length;
    const hasViewport = html.includes('viewport');
    const hasTouchFriendly = html.includes('touch-target') || html.includes('min-height: 48px');
    
    // 记录指标
    performanceMetrics.pageLoadTime.push(timeTotal * 1000); // 转换为毫秒
    performanceMetrics.pageSize.push(sizeDownload);
    performanceMetrics.requests.push(numConnects + numRedirects);
    performanceMetrics.imageCount.push(imageCount);
    performanceMetrics.scriptCount.push(scriptCount);
    performanceMetrics.cssCount.push(cssCount);
    
    console.log(`  ⏱️  加载时间: ${(timeTotal * 1000).toFixed(0)}ms`);
    console.log(`  📦 页面大小: ${(sizeDownload / 1024).toFixed(2)}KB`);
    console.log(`  🔗 请求数量: ${numConnects + numRedirects}`);
    console.log(`  🖼️  图片数量: ${imageCount} (${lazyImages} 懒加载)`);
    console.log(`  📜 脚本数量: ${scriptCount}`);
    console.log(`  🎨 CSS数量: ${cssCount}`);
    console.log(`  📱 移动端友好: ${hasViewport ? '✅' : '❌'}`);
    console.log(`  👆 触摸友好: ${hasTouchFriendly ? '✅' : '❌'}`);
    console.log('');
    
    return {
      success: true,
      metrics: {
        loadTime: timeTotal * 1000,
        size: sizeDownload,
        requests: numConnects + numRedirects,
        images: imageCount,
        lazyImages,
        scripts: scriptCount,
        css: cssCount,
        mobileFriendly: hasViewport,
        touchFriendly: hasTouchFriendly,
      }
    };
    
  } catch (error) {
    console.log(`  ❌ 测量失败: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

function calculateStatistics(metrics) {
  const stats = {};
  
  for (const [key, values] of Object.entries(metrics)) {
    if (values.length === 0) continue;
    
    const numericValues = values.filter(v => typeof v === 'number');
    if (numericValues.length === 0) continue;
    
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const avg = sum / numericValues.length;
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    
    stats[key] = {
      avg: key === 'pageSize' ? avg / 1024 : avg, // KB for size
      min: key === 'pageSize' ? min / 1024 : min,
      max: key === 'pageSize' ? max / 1024 : max,
      count: numericValues.length,
    };
  }
  
  return stats;
}

async function generateReport() {
  console.log('='.repeat(60));
  console.log('📊 性能监控报告');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const name = ['首页', '文章详情页', '用户个人中心', '帖子详情页'][i];
    
    const result = await measurePerformance(url, name);
    results.push({ name, ...result });
  }
  
  // 计算统计信息
  const stats = calculateStatistics(performanceMetrics);
  
  console.log('='.repeat(60));
  console.log('📈 性能统计');
  console.log('='.repeat(60));
  
  if (stats.pageLoadTime) {
    console.log(`⏱️  平均加载时间: ${stats.pageLoadTime.avg.toFixed(0)}ms`);
    console.log(`  最快: ${stats.pageLoadTime.min.toFixed(0)}ms`);
    console.log(`  最慢: ${stats.pageLoadTime.max.toFixed(0)}ms`);
  }
  
  if (stats.pageSize) {
    console.log(`\n📦 平均页面大小: ${stats.pageSize.avg.toFixed(2)}KB`);
    console.log(`  最小: ${stats.pageSize.min.toFixed(2)}KB`);
    console.log(`  最大: ${stats.pageSize.max.toFixed(2)}KB`);
  }
  
  if (stats.requests) {
    console.log(`\n🔗 平均请求数量: ${stats.requests.avg.toFixed(1)}`);
  }
  
  if (stats.imageCount) {
    console.log(`\n🖼️  平均图片数量: ${stats.imageCount.avg.toFixed(1)}`);
  }
  
  if (stats.scriptCount) {
    console.log(`\n📜 平均脚本数量: ${stats.scriptCount.avg.toFixed(1)}`);
  }
  
  if (stats.cssCount) {
    console.log(`\n🎨 平均CSS数量: ${stats.cssCount.avg.toFixed(1)}`);
  }
  
  // 生成优化建议
  console.log('\n' + '='.repeat(60));
  console.log('💡 优化建议');
  console.log('='.repeat(60));
  
  const successfulResults = results.filter(r => r.success);
  const lazyImageCount = successfulResults.reduce((sum, r) => sum + (r.metrics?.lazyImages || 0), 0);
  const totalImageCount = successfulResults.reduce((sum, r) => sum + (r.metrics?.images || 0), 0);
  const lazyImagePercentage = totalImageCount > 0 ? (lazyImageCount / totalImageCount * 100) : 0;
  
  const mobileFriendlyCount = successfulResults.filter(r => r.metrics?.mobileFriendly).length;
  const touchFriendlyCount = successfulResults.filter(r => r.metrics?.touchFriendly).length;
  
  console.log(`🖼️  图片懒加载: ${lazyImageCount}/${totalImageCount} (${lazyImagePercentage.toFixed(1)}%)`);
  if (lazyImagePercentage < 90) {
    console.log('   • 建议: 为所有图片添加 loading="lazy" 属性');
    console.log('   • 建议: 使用 IntersectionObserver 实现滚动懒加载');
    console.log('   • 建议: 使用 Next.js Image 组件自动优化');
  } else {
    console.log('   ✅ 图片懒加载覆盖率优秀');
  }
  
  console.log(`\n📱 移动端友好: ${mobileFriendlyCount}/${successfulResults.length} 页面`);
  if (mobileFriendlyCount < successfulResults.length) {
    console.log('   • 建议: 确保所有页面都有 viewport meta 标签');
    console.log('   • 建议: 使用响应式设计适配不同屏幕尺寸');
    console.log('   • 建议: 测试不同移动设备的显示效果');
  } else {
    console.log('   ✅ 所有页面移动端友好');
  }
  
  console.log(`\n👆 触摸友好: ${touchFriendlyCount}/${successfulResults.length} 页面`);
  if (touchFriendlyCount < successfulResults.length) {
    console.log('   • 建议: 确保按钮和链接至少有 48x48 像素可点击区域');
    console.log('   • 建议: 增加触摸目标之间的间距');
    console.log('   • 建议: 添加触摸反馈效果');
  } else {
    console.log('   ✅ 所有页面触摸友好');
  }
  
  if (stats.pageLoadTime && stats.pageLoadTime.avg > 100) {
    console.log(`\n⚡ 加载时间优化: ${stats.pageLoadTime.avg.toFixed(0)}ms (目标: <100ms)`);
    console.log('   • 建议: 启用 Gzip 压缩');
    console.log('   • 建议: 使用 CDN 加速静态资源');
    console.log('   • 建议: 减少 HTTP 请求数量');
    console.log('   • 建议: 优化图片格式和大小');
  } else if (stats.pageLoadTime) {
    console.log(`\n⚡ 加载时间: ${stats.pageLoadTime.avg.toFixed(0)}ms ✅ 优秀`);
  }
  
  if (stats.pageSize && stats.pageSize.avg > 100) {
    console.log(`\n📦 页面大小优化: ${stats.pageSize.avg.toFixed(2)}KB (目标: <100KB)`);
    console.log('   • 建议: 压缩 JavaScript 和 CSS 文件');
    console.log('   • 建议: 移除未使用的代码');
    console.log('   • 建议: 使用代码分割按需加载');
  } else if (stats.pageSize) {
    console.log(`\n📦 页面大小: ${stats.pageSize.avg.toFixed(2)}KB ✅ 优秀`);
  }
  
  // 保存报告
  const report = {
    timestamp: new Date().toISOString(),
    urls: urls.map((url, i) => ({
      url,
      name: ['首页', '文章详情页', '用户个人中心', '帖子详情页'][i],
    })),
    statistics: stats,
    optimizationSuggestions: {
      lazyImages: lazyImagePercentage < 90,
      mobileFriendly: mobileFriendlyCount < successfulResults.length,
      touchFriendly: touchFriendlyCount < successfulResults.length,
      loadTime: stats.pageLoadTime?.avg > 100,
      pageSize: stats.pageSize?.avg > 100,
    },
    rawMetrics: performanceMetrics,
  };
  
  const reportPath = path.join(__dirname, 'performance_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📁 报告保存: performance_report.json');
  console.log('='.repeat(60));
  
  // 生成优化清单
  generateOptimizationChecklist(report);
}

function generateOptimizationChecklist(report) {
  const checklistPath = path.join(__dirname, 'optimization_checklist.md');
  
  let checklist = `# GameHub 性能优化清单

## 测试时间
${new Date().toLocaleString()}

## 性能指标
- 平均加载时间: ${report.statistics.pageLoadTime?.avg?.toFixed(0) || 'N/A'}ms
- 平均页面大小: ${report.statistics.pageSize?.avg?.toFixed(2) || 'N/A'}KB
- 平均请求数量: ${report.statistics.requests?.avg?.toFixed(1) || 'N/A'}

## 优化检查清单

### 1. 图片优化
- [ ] 所有图片使用 WebP 格式
- [ ] 图片尺寸适配不同设备
- [ ] 实现图片懒加载
- [ ] 使用合适的图片压缩

### 2. 移动端优化
- [ ] 所有页面都有 viewport meta 标签
- [ ] 响应式设计适配所有屏幕
- [ ] 触摸友好的交互元素
- [ ] 移动端导航菜单

### 3. 性能优化
- [ ] 启用 Gzip 压缩
- [ ] 使用浏览器缓存
- [ ] 减少 HTTP 请求
- [ ] 代码分割和懒加载

### 4. 可访问性优化
- [ ] 语义化 HTML 结构
- [ ] ARIA 标签和属性
- [ ] 键盘导航支持
- [ ] 颜色对比度检查

### 5. SEO 优化
- [ ] 页面标题和描述
- [ ] 结构化数据标记
- [ ] 规范的 URL
- [ ] 移动端友好性

## 立即行动项

`;

  if (report.optimizationSuggestions.lazyImages) {
    checklist += `1. **图片懒加载**: 为所有图片添加 loading="lazy" 属性\n`;
  }
  
  if (report.optimizationSuggestions.mobileFriendly) {
    checklist += `2. **移动端优化**: 确保所有页面都有正确的 viewport 配置\n`;
  }
  
  if (report.optimizationSuggestions.touchFriendly) {
    checklist += `3. **触摸友好**: 确保交互元素有足够的点击区域\n`;
  }
  
  if (report.optimizationSuggestions.loadTime) {
    checklist += `4. **加载时间**: 优化资源加载，减少请求数量\n`;
  }
  
  if (report.optimizationSuggestions.pageSize) {
    checklist += `5. **页面大小**: 压缩资源，移除未使用代码\n`;
  }
  
  checklist += `
## 监控建议

1. **持续监控**: 定期运行性能测试
2. **用户反馈**: 收集真实用户性能体验
3. **竞品分析**: 对比同类网站性能指标
4. **技术升级**: 保持技术栈更新

---

*最后更新: ${new Date().toLocaleString()}*
*优化状态: ${Object.values(report.optimizationSuggestions).filter(v => v).length === 0 ? '优秀' : '需要优化'}*
`;

  fs.writeFileSync(checklistPath, checklist);
  console.log(`📋 优化清单: optimization_checklist.md`);
}

// 运行监控
generateReport().catch(console.error);