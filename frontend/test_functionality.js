#!/usr/bin/env node

/**
 * GameHub功能完整测试脚本
 * 测试所有核心功能模块
 */

const http = require('http');
const { execSync } = require('child_process');

console.log('🎮 GameHub功能完整测试\n');
console.log('测试时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
console.log('服务器地址: http://localhost:3000\n');

// 测试页面列表
const testPages = [
  { path: '/', name: '首页', expected: 200 },
  { path: '/login', name: '登录页面', expected: 200 },
  { path: '/register', name: '注册页面', expected: 200 },
  { path: '/news', name: '新闻列表', expected: 200 },
  { path: '/news/test-article', name: '文章详情页（测试）', expected: 200 },
  { path: '/community', name: '社区页面', expected: 200 },
  { path: '/community/post/test-post', name: '帖子详情页（测试）', expected: 200 },
  { path: '/user/admin', name: '用户个人中心', expected: 200 },
  { path: '/admin/articles', name: '文章管理后台', expected: 200 },
  { path: '/videos', name: '视频页面', expected: 200 },
  { path: '/guides', name: '指南页面', expected: 200 },
  { path: '/store', name: '商店页面', expected: 200 },
  { path: '/reviews', name: '评测页面', expected: 200 },
];

// 测试API端点
const testApis = [
  { path: '/api/articles', name: '文章API', method: 'GET' },
  { path: '/api/forum/posts', name: '论坛帖子API', method: 'GET' },
  { path: '/api/comments', name: '评论API', method: 'GET' },
];

// 测试函数
function testPage(url, name, expectedStatus) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      const status = res.statusCode;
      const success = status === expectedStatus;
      
      console.log(`${success ? '✅' : '❌'} ${name}`);
      console.log(`   地址: ${url}`);
      console.log(`   状态: ${status} ${success ? '(符合预期)' : `(预期: ${expectedStatus})`}`);
      console.log(`   内容类型: ${res.headers['content-type']?.split(';')[0] || '未知'}`);
      console.log();
      
      resolve({ success, status, name });
    });

    req.on('error', (error) => {
      console.log(`❌ ${name}`);
      console.log(`   地址: ${url}`);
      console.log(`   错误: ${error.message}`);
      console.log();
      resolve({ success: false, error: error.message, name });
    });

    req.on('timeout', () => {
      console.log(`❌ ${name}`);
      console.log(`   地址: ${url}`);
      console.log(`   错误: 请求超时`);
      console.log();
      req.destroy();
      resolve({ success: false, error: 'timeout', name });
    });

    req.end();
  });
}

// 测试数据库连接
function testDatabase() {
  console.log('🗄️ 数据库连接测试\n');
  
  try {
    // 检查数据库文件
    const fs = require('fs');
    const dbPath = './prisma/dev.db';
    
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      console.log(`✅ 数据库文件存在`);
      console.log(`   路径: ${dbPath}`);
      console.log(`   大小: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   修改时间: ${stats.mtime.toLocaleString('zh-CN')}`);
    } else {
      console.log(`❌ 数据库文件不存在: ${dbPath}`);
    }
    
    // 尝试使用Prisma查询
    console.log('\n🔍 测试数据库查询...');
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // 简单查询测试
      prisma.user.findMany({ take: 1 })
        .then(users => {
          console.log(`✅ 数据库查询成功`);
          console.log(`   用户数量: ${users.length}`);
          if (users.length > 0) {
            console.log(`   示例用户: ${users[0].username} (${users[0].email})`);
          }
          console.log();
          prisma.$disconnect();
        })
        .catch(error => {
          console.log(`⚠️  数据库查询错误: ${error.message}`);
          console.log(`   提示: 可能是表结构未创建或连接问题`);
          console.log();
        });
    } catch (error) {
      console.log(`⚠️  Prisma客户端错误: ${error.message}`);
      console.log();
    }
    
  } catch (error) {
    console.log(`❌ 数据库测试失败: ${error.message}`);
    console.log();
  }
}

// 测试TypeScript编译
function testTypeScript() {
  console.log('📝 TypeScript编译测试\n');
  
  try {
    const result = execSync('npx tsc --noEmit --skipLibCheck 2>&1', { encoding: 'utf8', cwd: process.cwd() });
    
    // 检查是否有错误
    const errorLines = result.split('\n').filter(line => line.includes('error TS'));
    
    if (errorLines.length === 0) {
      console.log('✅ TypeScript编译通过，无语法错误');
    } else {
      console.log(`❌ 发现 ${errorLines.length} 个TypeScript错误:`);
      errorLines.slice(0, 5).forEach(line => {
        console.log(`   ${line}`);
      });
      if (errorLines.length > 5) {
        console.log(`   ... 还有 ${errorLines.length - 5} 个错误`);
      }
    }
    console.log();
    
  } catch (error) {
    console.log(`⚠️  TypeScript测试失败: ${error.message}`);
    console.log();
  }
}

// 测试SEO优化
function testSEO() {
  console.log('🔍 SEO优化测试\n');
  
  // 测试首页的SEO元素
  testPage('/', '首页SEO检查', 200).then(result => {
    if (result.success) {
      console.log('✅ 首页可访问');
      console.log('💡 提示: 使用浏览器开发者工具检查以下SEO元素:');
      console.log('   1. <title>标签');
      console.log('   2. <meta name="description">');
      console.log('   3. <h1>标题');
      console.log('   4. 结构化数据 (JSON-LD)');
      console.log('   5. Open Graph标签');
      console.log('   6. Twitter Card标签');
    }
    console.log();
  });
}

// 主测试函数
async function runTests() {
  console.log('='.repeat(60));
  console.log('开始功能完整测试\n');
  
  // 1. 测试页面访问
  console.log('🌐 页面访问测试\n');
  const pageResults = [];
  
  for (const page of testPages) {
    const result = await testPage(page.path, page.name, page.expected);
    pageResults.push(result);
  }
  
  // 2. 测试数据库
  testDatabase();
  
  // 3. 测试TypeScript
  testTypeScript();
  
  // 4. 测试SEO
  testSEO();
  
  // 统计结果
  console.log('='.repeat(60));
  console.log('📊 测试结果统计\n');
  
  const successfulPages = pageResults.filter(r => r.success).length;
  const totalPages = pageResults.length;
  
  console.log(`页面测试: ${successfulPages}/${totalPages} 通过 (${((successfulPages / totalPages) * 100).toFixed(1)}%)`);
  
  if (successfulPages === totalPages) {
    console.log('\n🎉 所有页面测试通过！');
  } else {
    console.log('\n⚠️  部分页面测试失败，需要检查:');
    pageResults.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.error || `状态码 ${r.status}`}`);
    });
  }
  
  console.log('\n🚀 下一步建议:');
  console.log('1. 手动测试用户注册和登录功能');
  console.log('2. 测试文章发布和编辑功能');
  console.log('3. 测试社区发帖和评论功能');
  console.log('4. 进行移动端响应式测试');
  console.log('5. 使用Lighthouse进行性能测试');
  
  console.log('\n💡 快速测试命令:');
  console.log('   # 用户注册测试');
  console.log('   curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d \'{"email":"test@example.com","username":"testuser","password":"Test123!"}\'');
  
  console.log('\n   # 文章列表测试');
  console.log('   curl http://localhost:3000/api/articles');
  
  console.log('\n🎮 GameHub功能测试完成！');
  console.log('='.repeat(60));
}

// 运行测试
runTests().catch(error => {
  console.error('测试过程中发生错误:', error);
  process.exit(1);
});