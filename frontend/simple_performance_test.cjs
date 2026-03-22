const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🚀 简化性能测试开始\n');

// 测试URL
const testUrls = [
  { url: 'http://localhost:3000/', name: '首页' },
  { url: 'http://localhost:3000/news/ultra-simple/cyberpunk-2077-2-0-review', name: '文章详情页' },
  { url: 'http://localhost:3000/user/ultra-simple/admin', name: '用户个人中心' },
  { url: 'http://localhost:3000/community/post/ultra-simple/cmn19p2xr0005jd5sb9h1jo0p', name: '帖子详情页' },
];

async function measurePageLoad(url, name) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = http.request(url, (res) => {
      let data = '';
      const responseStart = Date.now();
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        const responseTime = responseStart - startTime;
        const downloadTime = endTime - responseStart;
        const contentLength = Buffer.byteLength(data, 'utf8');
        
        // 分析HTML内容
        const hasViewport = data.includes('viewport');
        const hasLazyLoading = data.includes('loading="lazy"');
        const hasAsyncScripts = data.includes('async') || data.includes('defer');
        const hasOptimizedImages = data.includes('next/image') || data.includes('Image');
        const hasMinimalCSS = (data.match(/<style/g) || []).length;
        const hasMinimalJS = (data.match(/<script/g) || []).length;
        
        resolve({
          name,
          url,
          success: res.statusCode === 200,
          statusCode: res.statusCode,
          metrics: {
            totalTime,
            responseTime,
            downloadTime,
            contentLength: Math.round(contentLength / 1024), // KB
            hasViewport,
            hasLazyLoading,
            hasAsyncScripts,
            hasOptimizedImages,
            hasMinimalCSS,
            hasMinimalJS,
          }
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        name,
        url,
        success: false,
        error: error.message,
        metrics: null
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        name,
        url,
        success: false,
        error: '请求超时',
        metrics: null
      });
    });
    
    req.end();
  });
}

async function runAllTests() {
  console.log('='.repeat(60));
  console.log('🎯 简化性能测试');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const page of testUrls) {
    console.log(`📊 测试: ${page.name}`);
    console.log(`🔗 URL: ${page.url}`);
    
    const result = await measurePageLoad(page.url, page.name);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ 状态码: ${result.statusCode}`);
      console.log(`     总时间: ${result.metrics.totalTime}ms`);
      console.log(`     响应时间: ${result.metrics.responseTime}ms`);
      console.log(`     下载时间: ${result.metrics.downloadTime}ms`);
      console.log(`     内容大小: ${result.metrics.contentLength}KB`);
      console.log(`     移动端友好: ${result.metrics.hasViewport ? '✅' : '❌'}`);
      console.log(`     图片懒加载: ${result.metrics.hasLazyLoading ? '✅' : '❌'}`);
      console.log(`     脚本优化: ${result.metrics.hasAsyncScripts ? '✅' : '❌'}`);
      console.log(`     图片优化: ${result.metrics.hasOptimizedImages ? '✅' : '❌'}`);
    } else {
      console.log(`  ❌ 测试失败: ${result.error || '未知错误'}`);
    }
    
    console.log(''); // 空行分隔
  }
  
  // 生成总结报告
  console.log('='.repeat(60));
  console.log('📋 性能测试总结');
  console.log('='.repeat(60));
  
  const successfulTests = results.filter(r => r.success);
  
  if (successfulTests.length > 0) {
    console.log(`📊 测试页面: ${successfulTests.length}/${testUrls.length} 成功`);
    console.log('');
    
    // 计算平均指标
    const avgMetrics = {
      totalTime: Math.round(successfulTests.reduce((sum, r) => sum + r.metrics.totalTime, 0) / successfulTests.length),
      responseTime: Math.round(successfulTests.reduce((sum, r) => sum + r.metrics.responseTime, 0) / successfulTests.length),
      downloadTime: Math.round(successfulTests.reduce((sum, r) => sum + r.metrics.downloadTime, 0) / successfulTests.length),
      contentLength: Math.round(successfulTests.reduce((sum, r) => sum + r.metrics.contentLength, 0) / successfulTests.length),
    };
    
    // 计算优化特性覆盖率
    const optimizationStats = {
      viewport: successfulTests.filter(r => r.metrics.hasViewport).length / successfulTests.length * 100,
      lazyLoading: successfulTests.filter(r => r.metrics.hasLazyLoading).length / successfulTests.length * 100,
      asyncScripts: successfulTests.filter(r => r.metrics.hasAsyncScripts).length / successfulTests.length * 100,
      optimizedImages: successfulTests.filter(r => r.metrics.hasOptimizedImages).length / successfulTests.length * 100,
    };
    
    console.log('📈 性能指标:');
    console.log(`   平均总时间: ${avgMetrics.totalTime}ms ${getPerformanceRating(avgMetrics.totalTime, 'time')}`);
    console.log(`   平均响应时间: ${avgMetrics.responseTime}ms ${getPerformanceRating(avgMetrics.responseTime, 'response')}`);
    console.log(`   平均下载时间: ${avgMetrics.downloadTime}ms ${getPerformanceRating(avgMetrics.downloadTime, 'download')}`);
    console.log(`   平均页面大小: ${avgMetrics.contentLength}KB ${getPerformanceRating(avgMetrics.contentLength, 'size')}`);
    console.log('');
    
    console.log('🔧 优化特性覆盖率:');
    console.log(`   移动端友好: ${optimizationStats.viewport.toFixed(0)}% ${getCoverageEmoji(optimizationStats.viewport)}`);
    console.log(`   图片懒加载: ${optimizationStats.lazyLoading.toFixed(0)}% ${getCoverageEmoji(optimizationStats.lazyLoading)}`);
    console.log(`   脚本异步加载: ${optimizationStats.asyncScripts.toFixed(0)}% ${getCoverageEmoji(optimizationStats.asyncScripts)}`);
    console.log(`   图片优化: ${optimizationStats.optimizedImages.toFixed(0)}% ${getCoverageEmoji(optimizationStats.optimizedImages)}`);
    console.log('');
    
    console.log('💡 优化建议:');
    
    if (avgMetrics.totalTime > 1000) {
      console.log('   • 页面加载时间较长 (>1秒):');
      console.log('     - 启用服务器端渲染缓存');
      console.log('     - 优化数据库查询性能');
      console.log('     - 减少不必要的JavaScript');
    }
    
    if (avgMetrics.contentLength > 500) {
      console.log('   • 页面体积较大 (>500KB):');
      console.log('     - 压缩图片资源');
      console.log('     - 启用Gzip/Brotli压缩');
      console.log('     - 移除未使用的CSS/JS');
    }
    
    if (optimizationStats.lazyLoading < 80) {
      console.log('   • 图片懒加载覆盖率不足:');
      console.log('     - 为所有图片添加loading="lazy"');
      console.log('     - 使用Next.js Image组件');
      console.log('     - 实现滚动懒加载');
    }
    
    if (optimizationStats.asyncScripts < 80) {
      console.log('   • 脚本加载优化不足:');
      console.log('     - 为第三方脚本添加async/defer');
      console.log('     - 延迟加载非关键脚本');
      console.log('     - 使用动态import()');
    }
    
    console.log('');
    console.log('🚀 快速优化方案:');
    console.log('   1. 在next.config.js中添加性能优化配置');
    console.log('   2. 使用Next.js内置的Image组件优化图片');
    console.log('   3. 实现代码分割和懒加载');
    console.log('   4. 启用服务端渲染缓存');
    console.log('   5. 优化数据库查询索引');
    
  } else {
    console.log('❌ 所有测试失败，请检查开发服务器是否运行');
  }
  
  console.log('');
  console.log('='.repeat(60));
  console.log('🎯 简化性能测试完成');
  console.log('='.repeat(60));
  
  // 创建优化配置文件
  createOptimizationConfig();
}

function getPerformanceRating(value, type) {
  if (type === 'time' || type === 'response' || type === 'download') {
    if (value < 500) return '🏆';
    if (value < 1000) return '✅';
    if (value < 2000) return '⚠️';
    return '❌';
  }
  
  if (type === 'size') {
    if (value < 300) return '🏆';
    if (value < 500) return '✅';
    if (value < 1000) return '⚠️';
    return '❌';
  }
  
  return '';
}

function getCoverageEmoji(coverage) {
  if (coverage >= 90) return '🏆';
  if (coverage >= 70) return '✅';
  if (coverage >= 50) return '⚠️';
  return '❌';
}

function createOptimizationConfig() {
  const configPath = path.join(__dirname, 'next.config.optimized.js');
  const configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 图片优化
  images: {
    domains: [],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 性能优化
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // 压缩配置
  compress: true,
  
  // 缓存配置
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // 重写规则
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // 重定向规则
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;`;

  fs.writeFileSync(configPath, configContent);
  console.log(`📁 创建优化配置文件: ${configPath}`);
}

runAllTests().catch(console.error);