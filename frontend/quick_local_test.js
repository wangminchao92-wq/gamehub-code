/**
 * GameHub项目快速本地测试
 * 测试核心功能是否正常工作
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 10000;

async function testPage(url, name) {
  return new Promise((resolve) => {
    const req = http.request(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const success = res.statusCode === 200;
        console.log(`${success ? '✅' : '❌'} ${name}: ${res.statusCode}`);
        resolve({ success, statusCode: res.statusCode, data: data.substring(0, 100) });
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${name}: 错误 - ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.setTimeout(TEST_TIMEOUT, () => {
      req.destroy();
      console.log(`❌ ${name}: 超时`);
      resolve({ success: false, error: '超时' });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 开始GameHub项目快速本地测试');
  console.log('='.repeat(50));

  const tests = [
    { url: `${BASE_URL}/`, name: '首页' },
    { url: `${BASE_URL}/login`, name: '登录页面' },
    { url: `${BASE_URL}/register`, name: '注册页面' },
    { url: `${BASE_URL}/news`, name: '新闻列表页' },
    { url: `${BASE_URL}/community`, name: '社区页面' },
    { url: `${BASE_URL}/guides`, name: '游戏指南页' },
    { url: `${BASE_URL}/about`, name: '关于页面' },
    { url: `${BASE_URL}/contact`, name: '联系页面' },
    { url: `${BASE_URL}/api/health`, name: '健康检查API' },
    { url: `${BASE_URL}/robots.txt`, name: 'robots.txt' },
    { url: `${BASE_URL}/sitemap.xml`, name: 'sitemap.xml' },
    { url: `${BASE_URL}/favicon.ico`, name: 'favicon.ico' },
  ];

  const results = [];
  for (const test of tests) {
    const result = await testPage(test.url, test.name);
    results.push({ ...test, ...result });
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(50));

  const passed = results.filter(r => r.success).length;
  const total = results.length;
  const passRate = (passed / total) * 100;

  console.log(`总计测试: ${total}`);
  console.log(`通过: ${passed}`);
  console.log(`失败: ${total - passed}`);
  console.log(`通过率: ${passRate.toFixed(1)}%`);

  const failedTests = results.filter(r => !r.success);
  if (failedTests.length > 0) {
    console.log('\n❌ 失败测试详情:');
    failedTests.forEach(test => {
      console.log(`  - ${test.name}: ${test.statusCode || test.error}`);
    });
  }

  console.log('\n' + '='.repeat(50));
  if (passRate >= 80) {
    console.log('🎉 优秀 - 项目本地部署成功！');
  } else if (passRate >= 60) {
    console.log('⚠️  良好 - 项目基本可用，建议修复部分问题');
  } else {
    console.log('❌ 需要修复 - 多个核心功能存在问题');
  }
  console.log('='.repeat(50));

  return { passed, total, passRate, results };
}

runTests().then(({ passed, total, passRate }) => {
  process.exit(passRate >= 60 ? 0 : 1);
}).catch(err => {
  console.error('测试执行失败:', err);
  process.exit(1);
});