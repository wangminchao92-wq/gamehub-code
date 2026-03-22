#!/usr/bin/env node

/**
 * GameHub Sitemap测试脚本
 * 测试所有sitemap文件的生成和有效性
 */

const http = require('http');
const https = require('https');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// 测试配置
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  sitemaps: [
    '/api/sitemap-index.xml',
    '/api/sitemap.xml',
    '/api/sitemap-news.xml',
    '/api/sitemap-images.xml',
  ],
  timeout: 10000, // 10秒超时
};

// 发送HTTP请求
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          data: data,
          headers: res.headers,
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(TEST_CONFIG.timeout, () => {
      req.destroy();
      reject(new Error(`请求超时: ${url}`));
    });
  });
}

// 验证XML格式
function validateXml(xml, expectedRoot) {
  if (!xml || typeof xml !== 'string') {
    return { valid: false, error: 'XML为空或不是字符串' };
  }
  
  // 检查XML声明
  if (!xml.startsWith('<?xml')) {
    return { valid: false, error: '缺少XML声明' };
  }
  
  // 检查根元素
  if (expectedRoot && !xml.includes(`<${expectedRoot}`)) {
    return { valid: false, error: `缺少预期的根元素: ${expectedRoot}` };
  }
  
  // 检查URL数量
  const urlMatches = xml.match(/<url>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  return { valid: true, urlCount };
}

// 测试单个sitemap
async function testSitemap(sitemapPath) {
  const url = `${TEST_CONFIG.baseUrl}${sitemapPath}`;
  console.log(`${colors.cyan}🔍 测试: ${sitemapPath}${colors.reset}`);
  
  try {
    const startTime = Date.now();
    const result = await fetchUrl(url);
    const responseTime = Date.now() - startTime;
    
    // 检查状态码
    if (result.statusCode !== 200) {
      console.log(`  ${colors.red}❌ 状态码错误: ${result.statusCode}${colors.reset}`);
      return { success: false, error: `状态码: ${result.statusCode}` };
    }
    
    // 检查Content-Type
    if (!result.contentType || !result.contentType.includes('application/xml')) {
      console.log(`  ${colors.yellow}⚠️  Content-Type可能不正确: ${result.contentType}${colors.reset}`);
    }
    
    // 验证XML
    let expectedRoot = 'urlset';
    if (sitemapPath.includes('sitemap-index')) {
      expectedRoot = 'sitemapindex';
    }
    
    const validation = validateXml(result.data, expectedRoot);
    
    if (!validation.valid) {
      console.log(`  ${colors.red}❌ XML验证失败: ${validation.error}${colors.reset}`);
      return { success: false, error: validation.error };
    }
    
    // 检查缓存头
    const cacheControl = result.headers['cache-control'];
    if (!cacheControl) {
      console.log(`  ${colors.yellow}⚠️  缺少Cache-Control头${colors.reset}`);
    }
    
    // 输出结果
    console.log(`  ${colors.green}✅ 测试通过${colors.reset}`);
    console.log(`    状态码: ${colors.blue}${result.statusCode}${colors.reset}`);
    console.log(`    响应时间: ${colors.blue}${responseTime}ms${colors.reset}`);
    console.log(`    Content-Type: ${colors.blue}${result.contentType}${colors.reset}`);
    
    if (validation.urlCount > 0) {
      console.log(`    URL数量: ${colors.blue}${validation.urlCount}${colors.reset}`);
    }
    
    if (cacheControl) {
      console.log(`    Cache-Control: ${colors.blue}${cacheControl}${colors.reset}`);
    }
    
    console.log('');
    
    return { 
      success: true, 
      statusCode: result.statusCode,
      responseTime,
      urlCount: validation.urlCount,
      cacheControl,
    };
    
  } catch (error) {
    console.log(`  ${colors.red}❌ 请求失败: ${error.message}${colors.reset}`);
    console.log('');
    return { success: false, error: error.message };
  }
}

// 测试robots.txt
async function testRobotsTxt() {
  const url = `${TEST_CONFIG.baseUrl}/robots.txt`;
  console.log(`${colors.cyan}🔍 测试: /robots.txt${colors.reset}`);
  
  try {
    const result = await fetchUrl(url);
    
    if (result.statusCode !== 200) {
      console.log(`  ${colors.red}❌ 状态码错误: ${result.statusCode}${colors.reset}`);
      return { success: false };
    }
    
    // 检查是否包含sitemap引用
    const hasSitemap = result.data.includes('Sitemap:');
    
    console.log(`  ${colors.green}✅ robots.txt可访问${colors.reset}`);
    console.log(`    状态码: ${colors.blue}${result.statusCode}${colors.reset}`);
    console.log(`    包含sitemap引用: ${hasSitemap ? colors.green + '是' : colors.yellow + '否'}${colors.reset}`);
    
    if (hasSitemap) {
      const sitemapLines = result.data.split('\n').filter(line => line.includes('Sitemap:'));
      sitemapLines.forEach(line => {
        console.log(`    ${colors.blue}${line.trim()}${colors.reset}`);
      });
    }
    
    console.log('');
    
    return { success: true, hasSitemap };
    
  } catch (error) {
    console.log(`  ${colors.red}❌ 请求失败: ${error.message}${colors.reset}`);
    console.log('');
    return { success: false, error: error.message };
  }
}

// 主函数
async function main() {
  console.log(`${colors.magenta}🚀 GameHub Sitemap测试脚本${colors.reset}`);
  console.log(`${colors.magenta}=============================${colors.reset}\n`);
  
  console.log(`${colors.blue}📊 测试配置:${colors.reset}`);
  console.log(`  基础URL: ${TEST_CONFIG.baseUrl}`);
  console.log(`  超时设置: ${TEST_CONFIG.timeout}ms`);
  console.log(`  测试文件: ${TEST_CONFIG.sitemaps.length}个sitemap文件\n`);
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: [],
  };
  
  // 测试robots.txt
  const robotsResult = await testRobotsTxt();
  results.total++;
  if (robotsResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  results.details.push({ name: 'robots.txt', ...robotsResult });
  
  // 测试所有sitemap
  for (const sitemap of TEST_CONFIG.sitemaps) {
    const sitemapResult = await testSitemap(sitemap);
    results.total++;
    if (sitemapResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
    results.details.push({ name: sitemap, ...sitemapResult });
  }
  
  // 输出总结
  console.log(`${colors.magenta}📈 测试总结:${colors.reset}`);
  console.log(`  总计测试: ${results.total}`);
  console.log(`  通过: ${colors.green}${results.passed}${colors.reset}`);
  console.log(`  失败: ${results.failed > 0 ? colors.red + results.failed : colors.green + results.failed}${colors.reset}`);
  console.log(`  通过率: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  // 输出建议
  console.log(`\n${colors.cyan}💡 建议:${colors.reset}`);
  
  if (results.failed > 0) {
    console.log(`  1. 检查服务器是否运行在 ${TEST_CONFIG.baseUrl}`);
    console.log(`  2. 检查API路由是否正确配置`);
    console.log(`  3. 检查数据库连接是否正常`);
  } else {
    console.log(`  1. ✅ 所有sitemap测试通过`);
    console.log(`  2. 确保生产环境使用正确的域名`);
    console.log(`  3. 定期监控sitemap生成`);
  }
  
  console.log(`\n${colors.green}📄 详细结果已记录${colors.reset}`);
  
  // 保存测试报告
  const report = {
    timestamp: new Date().toISOString(),
    config: TEST_CONFIG,
    results: results,
    summary: {
      passRate: `${((results.passed / results.total) * 100).toFixed(1)}%`,
      totalTests: results.total,
      passedTests: results.passed,
      failedTests: results.failed,
    }
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    'sitemap-test-report.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log(`${colors.green}📄 测试报告已保存到: sitemap-test-report.json${colors.reset}`);
  
  // 返回退出码
  process.exit(results.failed > 0 ? 1 : 0);
}

// 运行主函数
if (require.main === module) {
  // 检查服务器是否运行
  const checkServer = async () => {
    try {
      await fetchUrl(TEST_CONFIG.baseUrl);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  (async () => {
    console.log(`${colors.blue}🔍 检查服务器是否运行...${colors.reset}`);
    
    const serverRunning = await checkServer();
    if (!serverRunning) {
      console.log(`${colors.red}❌ 服务器未运行在 ${TEST_CONFIG.baseUrl}${colors.reset}`);
      console.log(`${colors.yellow}💡 请先运行: cd gamehub-project/frontend && npm run dev${colors.reset}`);
      process.exit(1);
    }
    
    console.log(`${colors.green}✅ 服务器运行正常${colors.reset}\n`);
    
    try {
      await main();
    } catch (error) {
      console.error(`${colors.red}❌ 测试过程中出错:${colors.reset}`, error.message);
      process.exit(1);
    }
  })();
}

module.exports = { testSitemap, testRobotsTxt };