// 快速本地测试脚本
const http = require('http');

console.log('🚀 GameHub 本地完整测试');
console.log('='.repeat(50));

// 测试的URL列表
const testUrls = [
  { path: '/', name: '首页' },
  { path: '/news/ultra-simple/cyberpunk-2077-2-0-review', name: '文章详情页' },
  { path: '/user/ultra-simple/admin', name: '用户个人中心' },
  { path: '/community/post/ultra-simple/cmn19p2xr0005jd5sb9h1jo0p', name: '帖子详情页' },
  { path: '/login', name: '登录页面' },
  { path: '/register', name: '注册页面' },
  { path: '/news', name: '新闻列表页' },
  { path: '/community', name: '社区页面' },
];

const baseUrl = 'http://localhost:3000';
let passed = 0;
let failed = 0;

console.log('\n📱 页面访问测试:');
console.log('-'.repeat(30));

// 测试每个URL
testUrls.forEach(({ path, name }) => {
  const url = baseUrl + path;
  
  const req = http.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
    const status = res.statusCode;
    const isSuccess = status >= 200 && status < 400;
    
    console.log(`  ${name.padEnd(12)} ${url}`);
    console.log(`   状态: ${status} ${isSuccess ? '✅' : '❌'}`);
    
    if (isSuccess) {
      passed++;
    } else {
      failed++;
    }
    
    // 如果是最后一个测试，显示总结
    if (passed + failed === testUrls.length) {
      showSummary();
    }
  });
  
  req.on('error', (err) => {
    console.log(`  ${name.padEnd(12)} ${url}`);
    console.log(`   状态: 连接失败 ❌ (${err.code || err.message})`);
    failed++;
    
    if (passed + failed === testUrls.length) {
      showSummary();
    }
  });
  
  req.on('timeout', () => {
    console.log(`  ${name.padEnd(12)} ${url}`);
    console.log(`   状态: 超时 ❌`);
    failed++;
    req.destroy();
    
    if (passed + failed === testUrls.length) {
      showSummary();
    }
  });
  
  req.end();
});

function showSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试结果总结:');
  console.log('-'.repeat(30));
  console.log(`✅ 通过: ${passed}/${testUrls.length}`);
  console.log(`❌ 失败: ${failed}/${testUrls.length}`);
  console.log(`📈 成功率: ${Math.round((passed / testUrls.length) * 100)}%`);
  
  if (passed === testUrls.length) {
    console.log('\n🎉 所有页面测试通过！');
  } else {
    console.log('\n⚠️  部分页面测试失败，需要检查。');
  }
  
  // API测试
  console.log('\n🔧 API功能测试:');
  console.log('-'.repeat(30));
  testAPIs();
}

function testAPIs() {
  const apiTests = [
    { path: '/api/health', name: '健康检查API' },
    { path: '/api/admin/users/simple', name: '用户管理API' },
  ];
  
  let apiPassed = 0;
  let apiFailed = 0;
  
  apiTests.forEach(({ path, name }) => {
    const url = baseUrl + path;
    
    const req = http.request(url, { method: 'GET', timeout: 5000 }, (res) => {
      const status = res.statusCode;
      const isSuccess = status >= 200 && status < 400;
      
      console.log(`  ${name.padEnd(16)} ${status} ${isSuccess ? '✅' : '❌'}`);
      
      if (isSuccess) {
        apiPassed++;
      } else {
        apiFailed++;
      }
      
      if (apiPassed + apiFailed === apiTests.length) {
        console.log(`\n  API测试: ${apiPassed}/${apiTests.length} 通过`);
        console.log('\n' + '='.repeat(50));
        console.log('🏆 本地测试完成！');
        console.log('='.repeat(50));
      }
    });
    
    req.on('error', () => {
      console.log(`  ${name.padEnd(16)} 连接失败 ❌`);
      apiFailed++;
      
      if (apiPassed + apiFailed === apiTests.length) {
        console.log(`\n  API测试: ${apiPassed}/${apiTests.length} 通过`);
        console.log('\n' + '='.repeat(50));
        console.log('🏆 本地测试完成！');
        console.log('='.repeat(50));
      }
    });
    
    req.end();
  });
}