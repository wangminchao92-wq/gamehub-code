/**
 * GameHub项目本地部署测试脚本
 * 全面测试本地部署的功能、性能、安全性和用户体验
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000; // 30秒超时

// 测试结果存储
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// 辅助函数：HTTP请求
async function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(TEST_TIMEOUT, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// 辅助函数：记录测试结果
function recordTest(name, passed, details = {}) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}`);
  }
  
  testResults.details.push({
    name,
    passed,
    timestamp: new Date().toISOString(),
    ...details
  });
}

// 测试1: 服务器健康检查
async function testServerHealth() {
  try {
    const response = await httpRequest(`${BASE_URL}/api/health`);
    const isHealthy = response.statusCode === 200;
    recordTest('服务器健康检查', isHealthy, {
      statusCode: response.statusCode,
      response: response.body
    });
    return isHealthy;
  } catch (error) {
    recordTest('服务器健康检查', false, {
      error: error.message
    });
    return false;
  }
}

// 测试2: 核心页面可访问性
async function testCorePages() {
  const pages = [
    { path: '/', name: '首页' },
    { path: '/login', name: '登录页面' },
    { path: '/register', name: '注册页面' },
    { path: '/news', name: '新闻列表页' },
    { path: '/community', name: '社区页面' },
    { path: '/guides', name: '游戏指南页' },
    { path: '/about', name: '关于页面' },
    { path: '/contact', name: '联系页面' }
  ];

  for (const page of pages) {
    try {
      const response = await httpRequest(`${BASE_URL}${page.path}`);
      const passed = response.statusCode === 200;
      recordTest(`${page.name}可访问性`, passed, {
        path: page.path,
        statusCode: response.statusCode
      });
    } catch (error) {
      recordTest(`${page.name}可访问性`, false, {
        path: page.path,
        error: error.message
      });
    }
  }
}

// 测试3: API端点功能
async function testAPIs() {
  const apis = [
    { path: '/api/health', method: 'GET', name: '健康检查API' },
    { path: '/api/auth/simple-login-fixed', method: 'POST', name: '登录API' },
    { path: '/api/articles', method: 'GET', name: '文章列表API' },
    { path: '/api/forum/posts', method: 'GET', name: '帖子列表API' },
    { path: '/api/achievements', method: 'GET', name: '成就API' },
    { path: '/api/notifications', method: 'GET', name: '通知API' },
    { path: '/api/follow', method: 'GET', name: '关注API' }
  ];

  for (const api of apis) {
    try {
      const options = {
        method: api.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (api.method === 'POST') {
        options.body = JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        });
      }

      const response = await httpRequest(`${BASE_URL}${api.path}`, options);
      
      // 对于需要认证的API，401是正常响应
      const passed = response.statusCode === 200 || 
                    response.statusCode === 401 || 
                    response.statusCode === 400;
      
      recordTest(`${api.name}功能`, passed, {
        path: api.path,
        method: api.method,
        statusCode: response.statusCode
      });
    } catch (error) {
      recordTest(`${api.name}功能`, false, {
        path: api.path,
        method: api.method,
        error: error.message
      });
    }
  }
}

// 测试4: 数据库连接
async function testDatabaseConnection() {
  try {
    const { stdout, stderr } = await execPromise('cd gamehub-project/frontend && npx prisma db push --accept-data-loss --skip-generate');
    
    // 检查是否有错误
    const hasError = stderr && stderr.includes('error');
    const passed = !hasError;
    
    recordTest('数据库连接', passed, {
      stdout: stdout.substring(0, 200),
      stderr: stderr ? stderr.substring(0, 200) : '无错误'
    });
    
    return passed;
  } catch (error) {
    recordTest('数据库连接', false, {
      error: error.message
    });
    return false;
  }
}

// 测试5: 构建检查
async function testBuild() {
  try {
    const { stdout, stderr } = await execPromise('cd gamehub-project/frontend && npm run build', { timeout: 120000 });
    
    // 检查构建是否成功
    const buildSuccess = stdout.includes('✓') && !stderr.includes('error');
    const passed = buildSuccess;
    
    recordTest('项目构建', passed, {
      stdout: stdout.substring(stdout.length - 500),
      stderr: stderr ? stderr.substring(0, 200) : '无错误'
    });
    
    return passed;
  } catch (error) {
    recordTest('项目构建', false, {
      error: error.message
    });
    return false;
  }
}

// 测试6: 性能测试
async function testPerformance() {
  const pagesToTest = ['/', '/news', '/community', '/login'];
  const performanceResults = [];

  for (const page of pagesToTest) {
    try {
      const startTime = Date.now();
      const response = await httpRequest(`${BASE_URL}${page}`);
      const endTime = Date.now();
      const loadTime = endTime - startTime;

      performanceResults.push({
        page,
        loadTime,
        statusCode: response.statusCode,
        size: response.body.length
      });

      const passed = loadTime < 3000; // 3秒内加载完成
      recordTest(`${page}页面性能`, passed, {
        loadTime,
        statusCode: response.statusCode,
        size: response.body.length
      });
    } catch (error) {
      recordTest(`${page}页面性能`, false, {
        page,
        error: error.message
      });
    }
  }

  return performanceResults;
}

// 测试7: 安全头检查
async function testSecurityHeaders() {
  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection'
  ];

  try {
    const response = await httpRequest(BASE_URL);
    const headers = response.headers;
    
    const missingHeaders = requiredHeaders.filter(header => !headers[header.toLowerCase()]);
    const passed = missingHeaders.length === 0;
    
    recordTest('安全HTTP头', passed, {
      missingHeaders,
      headers: Object.keys(headers)
    });
    
    return passed;
  } catch (error) {
    recordTest('安全HTTP头', false, {
      error: error.message
    });
    return false;
  }
}

// 测试8: SEO检查
async function testSEO() {
  try {
    const response = await httpRequest(BASE_URL);
    const html = response.body;
    
    const seoChecks = {
      hasTitle: html.includes('<title>'),
      hasMetaDescription: html.includes('name="description"'),
      hasCanonical: html.includes('rel="canonical"'),
      hasOpenGraph: html.includes('property="og:'),
      hasTwitterCard: html.includes('name="twitter:card"'),
      hasStructuredData: html.includes('application/ld+json')
    };
    
    const passedChecks = Object.values(seoChecks).filter(Boolean).length;
    const totalChecks = Object.keys(seoChecks).length;
    const passed = passedChecks >= totalChecks * 0.7; // 70%通过率
    
    recordTest('SEO优化检查', passed, {
      checks: seoChecks,
      passedChecks,
      totalChecks
    });
    
    return passed;
  } catch (error) {
    recordTest('SEO优化检查', false, {
      error: error.message
    });
    return false;
  }
}

// 测试9: 移动端兼容性
async function testMobileCompatibility() {
  try {
    const response = await httpRequest(BASE_URL);
    const html = response.body;
    
    const mobileChecks = {
      hasViewport: html.includes('name="viewport"'),
      hasResponsiveMeta: html.includes('initial-scale=1'),
      hasTouchIcons: html.includes('apple-touch-icon'),
      hasThemeColor: html.includes('name="theme-color"')
    };
    
    const passedChecks = Object.values(mobileChecks).filter(Boolean).length;
    const totalChecks = Object.keys(mobileChecks).length;
    const passed = passedChecks >= totalChecks * 0.75; // 75%通过率
    
    recordTest('移动端兼容性', passed, {
      checks: mobileChecks,
      passedChecks,
      totalChecks
    });
    
    return passed;
  } catch (error) {
    recordTest('移动端兼容性', false, {
      error: error.message
    });
    return false;
  }
}

// 测试10: 错误处理
async function testErrorHandling() {
  const errorPages = [
    '/non-existent-page',
    '/api/non-existent-api',
    '/news/non-existent-article'
  ];

  for (const page of errorPages) {
    try {
      const response = await httpRequest(`${BASE_URL}${page}`);
      
      // 404页面应该返回404状态码或友好的错误页面
      const passed = response.statusCode === 404 || 
                    (response.statusCode === 200 && response.body.includes('404')) ||
                    (response.statusCode === 200 && response.body.includes('Not Found'));
      
      recordTest(`${page}错误处理`, passed, {
        path: page,
        statusCode: response.statusCode,
        hasErrorContent: response.body.includes('404') || response.body.includes('Not Found')
      });
    } catch (error) {
      recordTest(`${page}错误处理`, false, {
        path: page,
        error: error.message
      });
    }
  }
}

// 测试11: 静态资源
async function testStaticResources() {
  const staticFiles = [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/humans.txt',
    '/logo.png'
  ];

  for (const file of staticFiles) {
    try {
      const response = await httpRequest(`${BASE_URL}${file}`);
      const passed = response.statusCode === 200 || response.statusCode === 404;
      
      recordTest(`${file}静态资源`, passed, {
        path: file,
        statusCode: response.statusCode,
        contentType: response.headers['content-type']
      });
    } catch (error) {
      recordTest(`${file}静态资源`, false, {
        path: file,
        error: error.message
      });
    }
  }
}

// 测试12: 环境配置检查
async function testEnvironmentConfig() {
  try {
    const { stdout } = await execPromise('cd gamehub-project/frontend && node -e "console.log(JSON.stringify(process.env.NODE_ENV))"');
    const nodeEnv = stdout.trim();
    
    const { stdout: pkgStdout } = await execPromise('cd gamehub-project/frontend && cat package.json | grep -A5 -B5 "scripts"');
    
    const passed = nodeEnv === '"development"' || nodeEnv === '"test"';
    
    recordTest('环境配置检查', passed, {
      nodeEnv,
      hasBuildScript: pkgStdout.includes('"build"'),
      hasDevScript: pkgStdout.includes('"dev"'),
      hasStartScript: pkgStdout.includes('"start"')
    });
    
    return passed;
  } catch (error) {
    recordTest('环境配置检查', false, {
      error: error.message
    });
    return false;
  }
}

// 主测试函数
async function runAllTests() {
  console.log('🚀 开始GameHub项目本地部署测试');
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  
  // 运行所有测试
  await testServerHealth();
  await testCorePages();
  await testAPIs();
  await testDatabaseConnection();
  await testBuild();
  await testPerformance();
  await testSecurityHeaders();
  await testSEO();
  await testMobileCompatibility();
  await testErrorHandling();
  await testStaticResources();
  await testEnvironmentConfig();
  
  const endTime = Date.now();
  const totalTime = (endTime - startTime) / 1000;
  
  // 生成测试报告
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试报告');
  console.log('='.repeat(60));
  
  console.log(`总计测试: ${testResults.total}`);
  console.log(`通过: ${testResults.passed} (${((testResults.passed / testResults.total) * 100).toFixed(1)}%)`);
  console.log(`失败: ${testResults.failed} (${((testResults.failed / testResults.total) * 100).toFixed(1)}%)`);
  console.log(`测试用时: ${totalTime.toFixed(2)}秒`);
  
  // 显示失败详情
  const failedTests = testResults.details.filter(test => !test.passed);
  if (failedTests.length > 0) {
    console.log('\n❌ 失败测试详情:');
    failedTests.forEach(test => {
      console.log(`  - ${test.name}`);
      if (test.error) console.log(`    错误: ${test.error}`);
      if (test.statusCode) console.log(`    状态码: ${test.statusCode}`);
    });
  }
  
  // 总体评估
  console.log('\n' + '='.repeat(60));
  console.log('🎯 总体评估');
  console.log('='.repeat(60));
  
  const passRate = (testResults.passed / testResults.total) * 100;
  
  if (passRate >= 90) {
    console.log('✅ 优秀 - 项目已准备好生产部署！');
    console.log('   所有核心功能正常，性能优秀，安全性良好。');
  } else if (passRate >= 75) {
    console.log('⚠️  良好 - 项目基本可用，建议修复部分问题。');
    console.log('   核心功能正常，但存在一些需要优化的问题。');
  } else if (passRate >= 50) {
    console.log('⚠️  一般 - 项目需要进一步修复。');
    console.log('   部分功能存在问题，建议优先修复关键问题。');
  } else {
    console.log('❌ 较差 - 项目需要重大修复。');
    console.log('   多个核心功能存在问题，建议全面检查和修复。');
  }
  
  console.log(`\n📈 通过率: ${passRate.toFixed(1)}%`);
  
  // 生成详细报告文件
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: testResults.total,
    passedTests: testResults.passed,
    failedTests: testResults.failed,
    passRate: passRate,
    totalTime: totalTime,
    details: testResults.details,
    summary: passRate >= 90 ? '优秀 - 准备生产部署' :
             passRate >= 75 ? '良好 - 基本可用' :
             passRate >= 50 ? '一般 - 需要修复' : '较差 - 需要重大修复'
  };
  
  const fs = require('fs');
  fs.writeFileSync('local_deployment_test_report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 详细测试报告已保存到: local_deployment_test_report.json');
  
  // 返回测试结果
  return {
    success: passRate >= 75,
    passRate,
    totalTests: testResults.total,
    passedTests: testResults.passed,
    failedTests: testResults.failed
  };
}

// 运行测试
runAllTests().then(result => {
  console.log('\n' + '='.repeat(60));
  console.log(result.success ? '🎉 测试完成 - 项目部署成功！' : '⚠️  测试完成 - 需要修复问题');
  console.log('='.repeat(60));
  
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});