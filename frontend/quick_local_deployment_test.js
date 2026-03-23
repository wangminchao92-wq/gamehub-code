#!/usr/bin/env node

/**
 * GameHub 本地部署快速测试脚本
 * 测试核心功能和API端点
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';
const TEST_ENDPOINTS = [
  '/',
  '/news',
  '/reviews',
  '/guides',
  '/community',
  '/api/health',
  '/api/news',
  '/api/reviews',
  '/api/guides',
  '/api/community/posts'
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint}`;
    const startTime = Date.now();
    
    http.get(url, (res) => {
      const duration = Date.now() - startTime;
      const data = [];
      
      res.on('data', (chunk) => {
        data.push(chunk);
      });
      
      res.on('end', () => {
        const responseTime = `${duration}ms`;
        const status = res.statusCode;
        const size = Buffer.concat(data).length;
        
        resolve({
          endpoint,
          status,
          responseTime,
          size: `${Math.round(size / 1024 * 100) / 100} KB`,
          success: status >= 200 && status < 400
        });
      });
    }).on('error', (err) => {
      resolve({
        endpoint,
        status: 'ERROR',
        responseTime: 'N/A',
        size: 'N/A',
        success: false,
        error: err.message
      });
    }).setTimeout(10000, () => {
      resolve({
        endpoint,
        status: 'TIMEOUT',
        responseTime: '>10s',
        size: 'N/A',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function runTests() {
  console.log('🚀 GameHub 本地部署测试开始');
  console.log(`📡 测试服务器: ${BASE_URL}`);
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const endpoint of TEST_ENDPOINTS) {
    process.stdout.write(`测试 ${endpoint}... `);
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.status} (${result.responseTime}, ${result.size})`);
    } else {
      console.log(`❌ ${result.status} - ${result.error || '失败'}`);
    }
  }
  
  console.log('='.repeat(60));
  
  // 统计结果
  const total = results.length;
  const passed = results.filter(r => r.success).length;
  const failed = total - passed;
  
  console.log(`📊 测试结果: ${passed}/${total} 通过 (${Math.round(passed/total*100)}%)`);
  
  if (failed > 0) {
    console.log('\n❌ 失败的端点:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ${r.endpoint}: ${r.status} - ${r.error || '未知错误'}`);
    });
  }
  
  // 性能分析
  const successfulResults = results.filter(r => r.success && r.responseTime !== 'N/A');
  if (successfulResults.length > 0) {
    const avgResponseTime = successfulResults.reduce((sum, r) => {
      const time = parseInt(r.responseTime.replace('ms', ''));
      return sum + (isNaN(time) ? 0 : time);
    }, 0) / successfulResults.length;
    
    console.log(`⏱️  平均响应时间: ${Math.round(avgResponseTime)}ms`);
  }
  
  console.log('\n🎯 核心功能状态:');
  const corePages = ['/', '/news', '/reviews', '/guides', '/community'];
  const coreStatus = corePages.map(page => {
    const result = results.find(r => r.endpoint === page);
    return result?.success ? '✅' : '❌';
  });
  
  console.log(`  首页 ${coreStatus[0]} | 新闻 ${coreStatus[1]} | 评测 ${coreStatus[2]} | 攻略 ${coreStatus[3]} | 社区 ${coreStatus[4]}`);
  
  console.log('\n💡 测试完成！');
  process.exit(failed > 0 ? 1 : 0);
}

// 运行测试
runTests().catch(err => {
  console.error('测试执行错误:', err);
  process.exit(1);
});