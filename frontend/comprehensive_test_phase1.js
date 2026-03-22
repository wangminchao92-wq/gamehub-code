#!/usr/bin/env node

/**
 * GameHub 项目全面测试 - 第一阶段：基础功能测试
 * 测试所有核心页面的可访问性和基本功能
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:3000/api';

// 测试配置
const TEST_CONFIG = {
  timeout: 10000, // 10秒超时
  retryCount: 2, // 重试次数
  parallelRequests: 5, // 并行请求数
};

// 测试结果统计
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  startTime: null,
  endTime: null,
  details: [],
};

// 要测试的页面和API
const TEST_CASES = [
  // 核心页面
  { name: '首页', path: '/', method: 'GET', expectedStatus: 200 },
  { name: '登录页面', path: '/login', method: 'GET', expectedStatus: 200 },
  { name: '注册页面', path: '/register', method: 'GET', expectedStatus: 200 },
  { name: '新闻列表页', path: '/news', method: 'GET', expectedStatus: 200 },
  { name: '社区页面', path: '/community', method: 'GET', expectedStatus: 200 },
  { name: '关于页面', path: '/about', method: 'GET', expectedStatus: 200 },
  { name: '联系页面', path: '/contact', method: 'GET', expectedStatus: 200 },
  
  // 动态页面（需要模拟数据）
  { name: '文章详情页示例', path: '/news/sample-article', method: 'GET', expectedStatus: 200 },
  { name: '用户个人中心示例', path: '/user/admin', method: 'GET', expectedStatus: 200 },
  { name: '帖子详情页示例', path: '/community/post/sample-post', method: 'GET', expectedStatus: 200 },
  
  // API端点
  { name: '健康检查API', path: '/api/health', method: 'GET', expectedStatus: 200 },
  { name: '文章API', path: '/api/articles', method: 'GET', expectedStatus: 200 },
  { name: '帖子API', path: '/api/posts', method: 'GET', expectedStatus: 200 },
  { name: '用户API', path: '/api/users', method: 'GET', expectedStatus: 200 },
  { name: '通知API', path: '/api/notifications', method: 'GET', expectedStatus: 401 }, // 需要认证
  { name: '关注API', path: '/api/follow', method: 'GET', expectedStatus: 401 }, // 需要认证
  { name: '成就API', path: '/api/achievements', method: 'GET', expectedStatus: 401 }, // 需要认证
  
  // SEO和技术页面
  { name: 'Sitemap索引', path: '/api/sitemap-index.xml', method: 'GET', expectedStatus: 200 },
  { name: '主Sitemap', path: '/api/sitemap.xml', method: 'GET', expectedStatus: 200 },
  { name: '新闻Sitemap', path: '/api/sitemap-news.xml', method: 'GET', expectedStatus: 200 },
  { name: '图片Sitemap', path: '/api/sitemap-images.xml', method: 'GET', expectedStatus: 200 },
  { name: 'Robots.txt', path: '/robots.txt', method: 'GET', expectedStatus: 200 },
  { name: 'Humans.txt', path: '/humans.txt', method: 'GET', expectedStatus: 200 },
  
  // 管理页面（需要认证）
  { name: '管理后台登录', path: '/admin/login', method: 'GET', expectedStatus: 200 },
  { name: '文章管理页面', path: '/admin/articles', method: 'GET', expectedStatus: 302 }, // 重定向到登录
  { name: '用户管理页面', path: '/admin/users', method: 'GET', expectedStatus: 302 }, // 重定向到登录
  { name: '设置管理页面', path: '/admin/settings', method: 'GET', expectedStatus: 302 }, // 重定向到登录
];

// HTTP请求函数
async function makeRequest(url, method = 'GET', retry = 0) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      timeout: TEST_CONFIG.timeout,
    };
    
    const req = (url.startsWith('https') ? https : http).request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url,
        });
      });
    });
    
    req.on('error', async (error) => {
      if (retry < TEST_CONFIG.retryCount) {
        console.log(`请求失败，重试 ${retry + 1}/${TEST_CONFIG.retryCount}: ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        resolve(await makeRequest(url, method, retry + 1));
      } else {
        reject(error);
      }
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`请求超时: ${url}`));
    });
    
    req.end();
  });
}

// 运行单个测试
async function runTest(testCase) {
  const startTime = Date.now();
  const fullUrl = testCase.path.startsWith('http') ? testCase.path : 
                  testCase.path.startsWith('/api') ? API_BASE_URL + testCase.path.replace('/api', '') :
                  BASE_URL + testCase.path;
  
  try {
    const response = await makeRequest(fullUrl, testCase.method);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const result = {
      name: testCase.name,
      url: fullUrl,
      expectedStatus: testCase.expectedStatus,
      actualStatus: response.statusCode,
      duration: duration,
      success: response.statusCode === testCase.expectedStatus,
      headers: response.headers,
      dataLength: response.data ? response.data.length : 0,
    };
    
    // 检查内容类型
    if (response.headers['content-type']) {
      result.contentType = response.headers['content-type'];
    }
    
    // 检查重定向
    if (response.statusCode >= 300 && response.statusCode < 400) {
      result.redirect = response.headers.location;
    }
    
    return result;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return {
      name: testCase.name,
      url: fullUrl,
      expectedStatus: testCase.expectedStatus,
      actualStatus: 'ERROR',
      duration: duration,
      success: false,
      error: error.message,
    };
  }
}

// 并行运行测试
async function runTestsInParallel(tests, concurrency = TEST_CONFIG.parallelRequests) {
  const results = [];
  const queue = [...tests];
  
  while (queue.length > 0) {
    const batch = queue.splice(0, concurrency);
    const batchPromises = batch.map(test => runTest(test));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // 显示进度
    const completed = results.length;
    const total = tests.length;
    const percentage = Math.round((completed / total) * 100);
    console.log(`测试进度: ${completed}/${total} (${percentage}%)`);
  }
  
  return results;
}

// 生成测试报告
function generateReport(results) {
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const avgDuration = totalDuration / results.length;
  
  const report = {
    summary: {
      total: results.length,
      passed,
      failed,
      successRate: Math.round((passed / results.length) * 100),
      totalDuration,
      avgDuration: Math.round(avgDuration),
    },
    details: results,
    recommendations: [],
  };
  
  // 分析失败原因
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log('\n❌ 失败测试分析:');
    failures.forEach(failure => {
      console.log(`  - ${failure.name}: 期望 ${failure.expectedStatus}, 实际 ${failure.actualStatus}`);
      if (failure.error) {
        console.log(`    错误: ${failure.error}`);
      }
      if (failure.redirect) {
        console.log(`    重定向到: ${failure.redirect}`);
      }
    });
    
    // 生成建议
    const authFailures = failures.filter(f => f.actualStatus === 401 || f.actualStatus === 403);
    if (authFailures.length > 0) {
      report.recommendations.push('部分API需要用户认证，这是正常行为');
    }
    
    const timeoutFailures = failures.filter(f => f.error && f.error.includes('超时'));
    if (timeoutFailures.length > 0) {
      report.recommendations.push('部分请求超时，请检查服务器性能或增加超时时间');
    }
    
    const serverFailures = failures.filter(f => f.actualStatus >= 500);
    if (serverFailures.length > 0) {
      report.recommendations.push('发现服务器错误，请检查服务器日志');
    }
  }
  
  // 性能分析
  const slowTests = results.filter(r => r.duration > 3000); // 超过3秒
  if (slowTests.length > 0) {
    console.log('\n⚠️  性能警告（响应时间 > 3秒）:');
    slowTests.forEach(test => {
      console.log(`  - ${test.name}: ${test.duration}ms`);
    });
    report.recommendations.push('部分页面响应时间较长，建议优化');
  }
  
  return report;
}

// 主测试函数
async function main() {
  console.log('🚀 GameHub 项目全面测试 - 第一阶段：基础功能测试');
  console.log('='.repeat(60));
  console.log(`测试开始时间: ${new Date().toLocaleString()}`);
  console.log(`测试用例数量: ${TEST_CASES.length}`);
  console.log(`基础URL: ${BASE_URL}`);
  console.log('='.repeat(60));
  
  // 检查服务器是否运行
  try {
    console.log('检查服务器状态...');
    const healthCheck = await makeRequest(`${BASE_URL}/api/health`);
    if (healthCheck.statusCode === 200) {
      console.log('✅ 服务器运行正常');
    } else {
      console.log(`⚠️  服务器健康检查返回 ${healthCheck.statusCode}`);
    }
  } catch (error) {
    console.log('❌ 服务器未运行或无法访问');
    console.log('请先启动开发服务器: npm run dev');
    process.exit(1);
  }
  
  // 运行测试
  console.log('\n开始运行测试...');
  const startTime = Date.now();
  const results = await runTestsInParallel(TEST_CASES);
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // 生成报告
  const report = generateReport(results);
  
  // 输出报告
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试报告');
  console.log('='.repeat(60));
  console.log(`测试完成时间: ${new Date().toLocaleString()}`);
  console.log(`总测试时间: ${totalDuration}ms`);
  console.log(`测试用例总数: ${report.summary.total}`);
  console.log(`通过: ${report.summary.passed} ✅`);
  console.log(`失败: ${report.summary.failed} ❌`);
  console.log(`成功率: ${report.summary.successRate}%`);
  console.log(`平均响应时间: ${report.summary.avgDuration}ms`);
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 建议:');
    report.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
  }
  
  // 保存详细结果
  const fs = require('fs');
  const reportDir = './test-reports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `${reportDir}/phase1-test-report-${timestamp}.json`;
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`\n详细报告已保存到: ${reportFile}`);
  
  // 返回退出码
  if (report.summary.failed > 0) {
    console.log('\n❌ 测试失败，请检查失败用例');
    process.exit(1);
  } else {
    console.log('\n✅ 所有测试通过！');
    process.exit(0);
  }
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('未处理的Promise拒绝:', error);
  process.exit(1);
});

// 运行主函数
main().catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});