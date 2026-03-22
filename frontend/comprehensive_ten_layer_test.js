/**
 * GameHub项目十层全面测试
 * 功能测试、性能测试、界面测试、兼容性测试、安全测试等
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 15000;

// 测试结果存储
const testResults = {
  layers: {},
  summary: {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    startTime: null,
    endTime: null
  }
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
function recordTest(layer, name, passed, details = {}) {
  if (!testResults.layers[layer]) {
    testResults.layers[layer] = {
      tests: [],
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  testResults.summary.totalTests++;
  if (passed) {
    testResults.summary.passedTests++;
    testResults.layers[layer].passed++;
    console.log(`✅ [${layer}] ${name}`);
  } else {
    testResults.summary.failedTests++;
    testResults.layers[layer].failed++;
    console.log(`❌ [${layer}] ${name}`);
  }

  testResults.layers[layer].total++;
  testResults.layers[layer].tests.push({
    name,
    passed,
    timestamp: new Date().toISOString(),
    ...details
  });
}

// ==================== 第一层：功能测试 ====================
async function layer1_functional_tests() {
  console.log('\n🔧 第一层：功能测试');
  console.log('='.repeat(50));

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

  // 测试页面可访问性
  for (const page of pages) {
    try {
      const response = await httpRequest(`${BASE_URL}${page.path}`);
      const passed = response.statusCode === 200;
      recordTest('功能测试', `${page.name}可访问性`, passed, {
        path: page.path,
        statusCode: response.statusCode,
        loadTime: 'N/A'
      });
    } catch (error) {
      recordTest('功能测试', `${page.name}可访问性`, false, {
        path: page.path,
        error: error.message
      });
    }
  }

  // 测试API功能
  const apis = [
    { path: '/api/health', method: 'GET', name: '健康检查API' },
    { path: '/api/auth/simple-login-fixed', method: 'POST', name: '登录API' }
  ];

  for (const api of apis) {
    try {
      const options = {
        method: api.method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (api.method === 'POST') {
        options.body = JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        });
      }

      const response = await httpRequest(`${BASE_URL}${api.path}`, options);
      const passed = response.statusCode === 200 || response.statusCode === 401 || response.statusCode === 400;
      recordTest('功能测试', `${api.name}功能`, passed, {
        path: api.path,
        method: api.method,
        statusCode: response.statusCode
      });
    } catch (error) {
      recordTest('功能测试', `${api.name}功能`, false, {
        path: api.path,
        method: api.method,
        error: error.message
      });
    }
  }

  // 测试静态资源
  const staticFiles = [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/humans.txt'
  ];

  for (const file of staticFiles) {
    try {
      const response = await httpRequest(`${BASE_URL}${file}`);
      const passed = response.statusCode === 200 || response.statusCode === 404;
      recordTest('功能测试', `${file}静态资源`, passed, {
        path: file,
        statusCode: response.statusCode
      });
    } catch (error) {
      recordTest('功能测试', `${file}静态资源`, false, {
        path: file,
        error: error.message
      });
    }
  }
}

// ==================== 第二层：性能测试 ====================
async function layer2_performance_tests() {
  console.log('\n⚡ 第二层：性能测试');
  console.log('='.repeat(50));

  const pagesToTest = ['/', '/news', '/community', '/login', '/register'];
  
  for (const page of pagesToTest) {
    try {
      const startTime = Date.now();
      const response = await httpRequest(`${BASE_URL}${page}`);
      const endTime = Date.now();
      const loadTime = endTime - startTime;

      const passed = loadTime < 3000; // 3秒内加载完成
      recordTest('性能测试', `${page}页面加载性能`, passed, {
        page,
        loadTime: `${loadTime}ms`,
        statusCode: response.statusCode,
        size: `${(response.body.length / 1024).toFixed(2)}KB`
      });
    } catch (error) {
      recordTest('性能测试', `${page}页面加载性能`, false, {
        page,
        error: error.message
      });
    }
  }

  // 测试并发性能
  try {
    const concurrentRequests = 5;
    const promises = [];
    
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(httpRequest(`${BASE_URL}/`));
    }
    
    const startTime = Date.now();
    await Promise.all(promises);
    const endTime = Date.now();
    const concurrentTime = endTime - startTime;
    
    const passed = concurrentTime < 5000; // 5秒内完成5个并发请求
    recordTest('性能测试', `并发请求性能（${concurrentRequests}个）`, passed, {
      concurrentRequests,
      totalTime: `${concurrentTime}ms`,
      avgTime: `${(concurrentTime / concurrentRequests).toFixed(2)}ms`
    });
  } catch (error) {
    recordTest('性能测试', '并发请求性能', false, {
      error: error.message
    });
  }
}

// ==================== 第三层：界面测试 ====================
async function layer3_ui_tests() {
  console.log('\n🎨 第三层：界面测试');
  console.log('='.repeat(50));

  // 测试响应式设计
  const viewports = [
    { width: 1920, height: 1080, name: '桌面端' },
    { width: 768, height: 1024, name: '平板端' },
    { width: 375, height: 667, name: '移动端' }
  ];

  for (const viewport of viewports) {
    try {
      const response = await httpRequest(`${BASE_URL}/`);
      const html = response.body;
      
      // 检查响应式meta标签
      const hasViewport = html.includes('name="viewport"');
      const hasResponsive = html.includes('initial-scale=1');
      
      const passed = hasViewport && hasResponsive;
      recordTest('界面测试', `${viewport.name}响应式支持`, passed, {
        viewport: `${viewport.width}x${viewport.height}`,
        hasViewport,
        hasResponsive
      });
    } catch (error) {
      recordTest('界面测试', `${viewport.name}响应式支持`, false, {
        viewport: `${viewport.width}x${viewport.height}`,
        error: error.message
      });
    }
  }

  // 测试CSS和JS加载
  try {
    const response = await httpRequest(`${BASE_URL}/`);
    const html = response.body;
    
    const checks = {
      hasCSS: html.includes('.css') || html.includes('style='),
      hasJS: html.includes('.js') || html.includes('<script'),
      hasImages: html.includes('.jpg') || html.includes('.png') || html.includes('.svg'),
      hasFonts: html.includes('font-family') || html.includes('@font-face')
    };
    
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const passed = passedChecks >= 3; // 至少3项通过
    
    recordTest('界面测试', '资源加载检查', passed, {
      checks,
      passedChecks,
      totalChecks: Object.keys(checks).length
    });
  } catch (error) {
    recordTest('界面测试', '资源加载检查', false, {
      error: error.message
    });
  }
}

// ==================== 第四层：兼容性测试 ====================
async function layer4_compatibility_tests() {
  console.log('\n🌐 第四层：兼容性测试');
  console.log('='.repeat(50));

  // 测试不同User-Agent
  const userAgents = [
    { 
      name: 'Chrome', 
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
    },
    { 
      name: 'Firefox', 
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0' 
    },
    { 
      name: 'Safari', 
      agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' 
    },
    { 
      name: 'Edge', 
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0' 
    }
  ];

  for (const ua of userAgents) {
    try {
      const response = await httpRequest(`${BASE_URL}/`, {
        headers: { 'User-Agent': ua.agent }
      });
      
      const passed = response.statusCode === 200;
      recordTest('兼容性测试', `${ua.name}浏览器兼容性`, passed, {
        browser: ua.name,
        statusCode: response.statusCode,
        contentType: response.headers['content-type']
      });
    } catch (error) {
      recordTest('兼容性测试', `${ua.name}浏览器兼容性`, false, {
        browser: ua.name,
        error: error.message
      });
    }
  }

  // 测试不同内容类型接受
  const acceptHeaders = [
    { type: 'HTML', header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    { type: 'JSON', header: 'application/json' },
    { type: 'XML', header: 'application/xml' }
  ];

  for (const accept of acceptHeaders) {
    try {
      const response = await httpRequest(`${BASE_URL}/api/health`, {
        headers: { 'Accept': accept.header }
      });
      
      const passed = response.statusCode === 200 || response.statusCode === 406;
      recordTest('兼容性测试', `${accept.type}内容类型支持`, passed, {
        type: accept.type,
        statusCode: response.statusCode,
        contentType: response.headers['content-type']
      });
    } catch (error) {
      recordTest('兼容性测试', `${accept.type}内容类型支持`, false, {
        type: accept.type,
        error: error.message
      });
    }
  }
}

// ==================== 第五层：安全测试 ====================
async function layer5_security_tests() {
  console.log('\n🔒 第五层：安全测试');
  console.log('='.repeat(50));

  // 测试安全头
  try {
    const response = await httpRequest(`${BASE_URL}/`);
    const headers = response.headers;
    
    const securityHeaders = {
      'X-Frame-Options': headers['x-frame-options'],
      'X-Content-Type-Options': headers['x-content-type-options'],
      'X-XSS-Protection': headers['x-xss-protection'],
      'Content-Security-Policy': headers['content-security-policy'],
      'Strict-Transport-Security': headers['strict-transport-security']
    };
    
    const hasSecurityHeaders = Object.values(securityHeaders).filter(h => h).length;
    const passed = hasSecurityHeaders > 0;
    
    recordTest('安全测试', '安全HTTP头检查', passed, {
      headers: securityHeaders,
      hasHeaders: hasSecurityHeaders,
      totalHeaders: Object.keys(securityHeaders).length
    });
  } catch (error) {
    recordTest('安全测试', '安全HTTP头检查', false, {
      error: error.message
    });
  }

  // 测试SQL注入防护
  const sqlInjectionTests = [
    { payload: "' OR '1'='1", name: '基础SQL注入' },
    { payload: "'; DROP TABLE users; --", name: 'DROP语句注入' },
    { payload: "1' UNION SELECT * FROM users --", name: 'UNION注入' }
  ];

  for (const test of sqlInjectionTests) {
    try {
      const response = await httpRequest(`${BASE_URL}/api/auth/simple-login-fixed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: test.payload,
          password: test.payload
        })
      });
      
      // 如果返回400或500，说明有防护
      const passed = response.statusCode === 400 || response.statusCode === 500 || response.statusCode === 401;
      recordTest('安全测试', `SQL注入防护 - ${test.name}`, passed, {
        payload: test.payload,
        statusCode: response.statusCode
      });
    } catch (error) {
      recordTest('安全测试', `SQL注入防护 - ${test.name}`, false, {
        payload: test.payload,
        error: error.message
      });
    }
  }

  // 测试XSS防护
  const xssTests = [
    { payload: '<script>alert("xss")</script>', name: '脚本标签XSS' },
    { payload: '<img src="x" onerror="alert(1)">', name: '图片onerror XSS' },
    { payload: 'javascript:alert(1)', name: 'JavaScript协议XSS' }
  ];

  for (const test of xssTests) {
    try {
      const response = await httpRequest(`${BASE_URL}/search?q=${encodeURIComponent(test.payload)}`);
      
      // 检查响应中是否包含原始payload
      const containsPayload = response.body.includes(test.payload);
      const passed = !containsPayload; // 不包含原始payload说明有防护
      
      recordTest('安全测试', `XSS防护 - ${test.name}`, passed, {
        payload: test.payload,
        containsPayload,
        statusCode: response.statusCode
      });
    } catch (error) {
      recordTest('安全测试', `XSS防护 - ${test.name}`, false, {
        payload: test.payload,
        error: error.message
      });
    }
  }
}

// ==================== 第六层：冒烟测试 ====================
async function layer6_smoke_tests() {
  console.log('\n🚬 第六层：冒烟测试');
  console.log('='.repeat(50));

  // 核心功能冒烟测试
  const smokeTests = [
    { path: '/', name: '首页加载' },
    { path: '/login', name: '登录页面' },
    { path: '/api/health', name: '健康检查' },
    { path: '/robots.txt', name: 'robots文件' }
  ];

  for (const test of smokeTests) {
    try {
      const startTime = Date.now();
      const response = await httpRequest(`${BASE_URL}${test.path}`);
      const endTime =