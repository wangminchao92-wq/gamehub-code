// 第一轮测试：基础功能测试
const http = require('http');

console.log('🧪 第一轮测试：基础功能测试');
console.log('='.repeat(50));

const baseUrl = 'http://localhost:3000';
const testCases = [
  // 核心页面测试
  { path: '/', name: '首页', method: 'GET', expected: 200 },
  { path: '/news', name: '新闻列表', method: 'GET', expected: 200 },
  { path: '/community', name: '社区页面', method: 'GET', expected: 200 },
  { path: '/login', name: '登录页面', method: 'GET', expected: 200 },
  { path: '/register', name: '注册页面', method: 'GET', expected: 200 },
  
  // 动态页面测试
  { path: '/news/ultra-simple/cyberpunk-2077-2-0-review', name: '文章详情', method: 'GET', expected: 200 },
  { path: '/user/ultra-simple/admin', name: '用户中心', method: 'GET', expected: 200 },
  { path: '/community/post/ultra-simple/cmn19p2xr0005jd5sb9h1jo0p', name: '帖子详情', method: 'GET', expected: 200 },
  
  // API测试
  { path: '/api/health', name: '健康检查', method: 'GET', expected: 200 },
  { path: '/api/admin/users/simple', name: '用户API(无权限)', method: 'GET', expected: 401 },
];

let passed = 0;
let failed = 0;
let currentTest = 0;

function runTest(test) {
  const url = baseUrl + test.path;
  const options = {
    method: test.method,
    timeout: 3000
  };

  const req = http.request(url, options, (res) => {
    const status = res.statusCode;
    const isSuccess = status === test.expected;
    
    console.log(`  ${test.name.padEnd(15)} ${status} ${isSuccess ? '✅' : '❌'} (预期: ${test.expected})`);
    
    if (isSuccess) {
      passed++;
    } else {
      failed++;
    }
    
    nextTest();
  });
  
  req.on('error', (err) => {
    console.log(`  ${test.name.padEnd(15)} 连接失败 ❌ (${err.code || err.message})`);
    failed++;
    nextTest();
  });
  
  req.on('timeout', () => {
    console.log(`  ${test.name.padEnd(15)} 超时 ❌`);
    failed++;
    req.destroy();
    nextTest();
  });
  
  req.end();
}

function nextTest() {
  currentTest++;
  if (currentTest < testCases.length) {
    runTest(testCases[currentTest]);
  } else {
    showSummary();
  }
}

function showSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 第一轮测试结果:');
  console.log('-'.repeat(30));
  console.log(`✅ 通过: ${passed}/${testCases.length}`);
  console.log(`❌ 失败: ${failed}/${testCases.length}`);
  console.log(`📈 成功率: ${Math.round((passed / testCases.length) * 100)}%`);
  
  if (passed === testCases.length) {
    console.log('\n🎉 第一轮测试全部通过！');
  } else {
    console.log('\n⚠️  第一轮测试有失败项目。');
  }
  
  // 开始第二轮测试
  console.log('\n' + '='.repeat(50));
  console.log('🧪 准备开始第二轮测试...');
  console.log('='.repeat(50));
  
  // 导入并运行第二轮测试
  setTimeout(() => {
    require('./round2_test.js');
  }, 1000);
}

// 开始测试
console.log('📋 测试项目:');
console.log('-'.repeat(30));
runTest(testCases[0]);