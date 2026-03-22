// 诊断400错误
const http = require('http');

console.log('🔧 诊断400错误问题');
console.log('='.repeat(50));

const baseUrl = 'http://localhost:3000';

// 测试各种可能触发400的场景
const testCases = [
  {
    name: '用户API - 缺少x-user-id头',
    path: '/api/admin/users/simple',
    method: 'GET',
    headers: {},
    expect400: true
  },
  {
    name: '用户API - 有效的管理员请求',
    path: '/api/admin/users/simple',
    method: 'GET',
    headers: { 'x-user-id': 'd191fcda-81e1-4a07-bbf2-bd0d469844e2' },
    expect400: false
  },
  {
    name: '登录API - 空请求体',
    path: '/api/auth/simple-login-fixed',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
    expect400: true
  },
  {
    name: '登录API - 缺少密码',
    path: '/api/auth/simple-login-fixed',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"identifier":"test"}',
    expect400: true
  },
  {
    name: '登录API - 有效请求',
    path: '/api/auth/simple-login-fixed',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"identifier":"wangminchao","password":"4219011oave@"}',
    expect400: false
  },
  {
    name: '创建用户API - 缺少必填字段',
    path: '/api/admin/users/simple',
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-id': 'd191fcda-81e1-4a07-bbf2-bd0d469844e2'
    },
    body: '{"username":"testuser"}',
    expect400: true
  }
];

let completed = 0;
let passed = 0;
let failed = 0;

function runTest(test) {
  const options = {
    method: test.method,
    headers: test.headers,
    timeout: 3000
  };

  const req = http.request(baseUrl + test.path, options, (res) => {
    const is400 = res.statusCode === 400;
    const matchesExpectation = is400 === test.expect400;
    
    console.log(`  ${test.name}`);
    console.log(`    状态: ${res.statusCode} ${matchesExpectation ? '✅' : '❌'} (预期400: ${test.expect400})`);
    
    if (!matchesExpectation) {
      console.log(`    问题: 预期${test.expect400 ? '400' : '非400'}，但得到${res.statusCode}`);
    }
    
    if (matchesExpectation) {
      passed++;
    } else {
      failed++;
    }
    
    completed++;
    if (completed === testCases.length) {
      showSummary();
    }
  });
  
  req.on('error', (err) => {
    console.log(`  ${test.name}`);
    console.log(`    错误: ${err.code} ❌`);
    failed++;
    completed++;
    if (completed === testCases.length) {
      showSummary();
    }
  });
  
  req.on('timeout', () => {
    console.log(`  ${test.name}`);
    console.log(`    超时 ❌`);
    failed++;
    completed++;
    req.destroy();
    if (completed === testCases.length) {
      showSummary();
    }
  });
  
  if (test.body) {
    req.write(test.body);
  }
  req.end();
}

function showSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 诊断结果:');
  console.log('-'.repeat(30));
  console.log(`✅ 通过: ${passed}/${testCases.length}`);
  console.log(`❌ 失败: ${failed}/${testCases.length}`);
  
  console.log('\n🔍 发现的400错误模式:');
  console.log('1. 用户管理API需要 x-user-id 请求头');
  console.log('2. 登录API需要 identifier 和 password 字段');
  console.log('3. 创建用户API需要 username, email, password 字段');
  
  console.log('\n💡 解决方案:');
  console.log('1. 确保前端调用API时传递正确的请求头');
  console.log('2. 检查表单数据是否完整');
  console.log('3. 验证用户权限是否正确');
  
  // 检查具体的前端问题
  checkFrontendIssues();
}

function checkFrontendIssues() {
  console.log('\n' + '='.repeat(50));
  console.log('🔧 检查前端具体问题');
  console.log('='.repeat(50));
  
  const fs = require('fs');
  
  // 检查登录页面
  console.log('\n1. 登录页面检查:');
  try {
    const loginContent = fs.readFileSync('src/pages/login.tsx', 'utf8');
    const hasFormData = loginContent.includes('formData');
    const hasFetchCall = loginContent.includes('fetch');
    const hasErrorHandling = loginContent.includes('setError');
    
    console.log(`   表单数据: ${hasFormData ? '✅' : '❌'}`);
    console.log(`   API调用: ${hasFetchCall ? '✅' : '❌'}`);
    console.log(`   错误处理: ${hasErrorHandling ? '✅' : '❌'}`);
    
    // 检查formData结构
    const formDataMatch = loginContent.match(/formData:\s*{([^}]+)}/);
    if (formDataMatch) {
      console.log(`   表单字段: ${formDataMatch[1].trim()}`);
    }
  } catch (err) {
    console.log(`   读取文件错误: ${err.message}`);
  }
  
  // 检查用户管理页面
  console.log('\n2. 用户管理页面检查:');
  try {
    const userContent = fs.readFileSync('src/pages/admin/users/simple.tsx', 'utf8');
    const hasUserIdHeader = userContent.includes("'x-user-id'");
    const hasFetchUsers = userContent.includes('fetchUsers');
    const hasErrorState = userContent.includes('setError');
    
    console.log(`   用户ID头: ${hasUserIdHeader ? '✅' : '❌'}`);
    console.log(`   获取用户函数: ${hasFetchUsers ? '✅' : '❌'}`);
    console.log(`   错误状态: ${hasErrorState ? '✅' : '❌'}`);
    
    // 检查具体的用户ID值
    const userIdMatch = userContent.match(/'x-user-id':\s*'([^']+)'/);
    if (userIdMatch) {
      console.log(`   使用的用户ID: ${userIdMatch[1]}`);
      console.log(`   ID长度: ${userIdMatch[1].length} 字符`);
      console.log(`   ID格式: ${/^[a-f0-9-]+$/.test(userIdMatch[1]) ? '✅ UUID格式' : '❌ 非标准格式'}`);
    }
  } catch (err) {
    console.log(`   读取文件错误: ${err.message}`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 建议的修复步骤:');
  console.log('='.repeat(50));
  console.log('\n1. 检查浏览器开发者工具中的网络请求');
  console.log('2. 查看具体的请求头和请求体');
  console.log('3. 确保所有必填字段都正确传递');
  console.log('4. 验证用户权限和身份验证');
  console.log('\n📞 如果需要进一步帮助，请提供:');
  console.log('• 具体的错误消息');
  console.log('• 浏览器控制台输出');
  console.log('• 网络请求的详细信息');
}

// 开始测试
console.log('📋 测试场景:');
console.log('-'.repeat(30));
testCases.forEach((test, i) => {
  setTimeout(() => runTest(test), i * 500);
});