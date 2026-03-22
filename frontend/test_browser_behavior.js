// 模拟浏览器行为测试
const http = require('http');

console.log('🌐 模拟浏览器行为测试');
console.log('='.repeat(50));

const baseUrl = 'http://localhost:3000';

// 测试1: 访问用户管理页面
console.log('\n1. 访问用户管理页面:');
const req1 = http.request(baseUrl + '/admin/users/simple', (res) => {
  console.log(`   状态: ${res.statusCode} ${res.statusCode === 200 ? '✅' : '❌'}`);
  
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // 检查页面是否包含JavaScript错误
    const hasScriptErrors = html.includes('console.error') || html.includes('Uncaught');
    const hasApiCalls = html.includes('fetch') || html.includes('axios');
    
    console.log(`   页面大小: ${html.length} 字节`);
    console.log(`   包含API调用: ${hasApiCalls ? '✅' : '❌'}`);
    console.log(`   可能包含JS错误: ${hasScriptErrors ? '⚠️' : '✅'}`);
    
    // 检查页面中的API端点
    const apiMatches = html.match(/\/api\/[^"']+/g);
    if (apiMatches) {
      console.log(`   发现的API端点:`);
      apiMatches.slice(0, 3).forEach(api => console.log(`     - ${api}`));
    }
    
    // 测试页面加载后的API调用
    testPageApis();
  });
});

req1.on('error', (err) => {
  console.log(`   错误: ${err.code} ❌`);
});

req1.end();

function testPageApis() {
  console.log('\n2. 测试页面加载后的API调用:');
  
  // 测试用户管理API（模拟页面中的fetch）
  const userId = 'd191fcda-81e1-4a07-bbf2-bd0d469844e2';
  const options = {
    headers: {
      'x-user-id': userId,
      'User-Agent': 'Mozilla/5.0 (模拟浏览器)',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  
  const req2 = http.request(baseUrl + '/api/admin/users/simple?limit=20', options, (res) => {
    console.log(`   用户API状态: ${res.statusCode} ${res.statusCode === 200 ? '✅' : '❌'}`);
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log(`   响应成功: ${result.success ? '✅' : '❌'}`);
        console.log(`   用户数量: ${result.data?.users?.length || 0}`);
        
        // 测试登录API
        testLoginApi();
      } catch (err) {
        console.log(`   响应解析错误: ${err.message} ❌`);
        console.log(`   原始响应: ${data.substring(0, 200)}...`);
      }
    });
  });
  
  req2.on('error', (err) => {
    console.log(`   用户API错误: ${err.code} ❌`);
  });
  
  req2.end();
}

function testLoginApi() {
  console.log('\n3. 测试登录API:');
  
  const postData = JSON.stringify({
    identifier: 'wangminchao',
    password: '4219011oave@'
  });
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Mozilla/5.0 (模拟浏览器)'
    }
  };
  
  const req = http.request(baseUrl + '/api/auth/simple-login-fixed', options, (res) => {
    console.log(`   登录API状态: ${res.statusCode} ${res.statusCode === 200 ? '✅' : '❌'}`);
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log(`   登录成功: ${result.success ? '✅' : '❌'}`);
        console.log(`   返回消息: ${result.message || '无消息'}`);
        
        // 测试可能返回400的其他API
        testOtherApis();
      } catch (err) {
        console.log(`   登录响应解析错误: ${err.message} ❌`);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log(`   登录API错误: ${err.code} ❌`);
  });
  
  req.write(postData);
  req.end();
}

function testOtherApis() {
  console.log('\n4. 测试其他可能返回400的API:');
  
  const apisToTest = [
    { path: '/api/auth/login', method: 'POST', data: '{}', expect: '404或400' },
    { path: '/api/auth/register', method: 'POST', data: '{}', expect: '404' },
    { path: '/api/articles', method: 'GET', expect: '404' },
    { path: '/api/comments', method: 'GET', expect: '404' },
  ];
  
  let completed = 0;
  
  apisToTest.forEach(({ path, method, data, expect }) => {
    const options = {
      method: method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (模拟浏览器)'
      }
    };
    
    if (data && method === 'POST') {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }
    
    const req = http.request(baseUrl + path, options, (res) => {
      console.log(`   ${path}: ${res.statusCode} ${res.statusCode >= 400 ? '⚠️' : '✅'} (预期: ${expect})`);
      completed++;
      
      if (completed === apisToTest.length) {
        showSummary();
      }
    });
    
    req.on('error', (err) => {
      console.log(`   ${path}: 错误 ${err.code} ❌`);
      completed++;
      
      if (completed === apisToTest.length) {
        showSummary();
      }
    });
    
    if (data && method === 'POST') {
      req.write(data);
    }
    req.end();
  });
}

function showSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('📋 浏览器行为测试总结');
  console.log('='.repeat(50));
  console.log('\n🔍 发现的问题:');
  console.log('1. 一些旧的API端点返回404（正常，已被禁用）');
  console.log('2. 需要检查前端JavaScript控制台的具体错误');
  console.log('3. 400错误可能来自：');
  console.log('   • 缺少请求头或参数');
  console.log('   • 请求格式不正确');
  console.log('   • 服务器端验证失败');
  console.log('\n💡 建议:');
  console.log('1. 打开浏览器开发者工具查看具体错误');
  console.log('2. 检查网络标签中的请求/响应详情');
  console.log('3. 查看控制台输出的JavaScript错误');
}