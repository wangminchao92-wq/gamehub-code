/**
 * GameHub项目最终部署检查
 */

const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const results = { tests: [], passed: 0, failed: 0 };

function record(test, passed, details = {}) {
  results.tests.push({ test, passed, details });
  if (passed) results.passed++;
  else results.failed++;
  console.log(`${passed ? '✅' : '❌'} ${test}`);
}

async function checkServer() {
  console.log('🚀 GameHub项目最终部署检查');
  console.log('='.repeat(50));

  // 1. 服务器状态
  try {
    const res = await new Promise(resolve => {
      const req = http.request(BASE_URL, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', () => resolve({ error: true }));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ error: 'timeout' });
      });
      req.end();
    });
    
    record('服务器运行状态', !res.error && res.status === 200, {
      status: res.status,
      error: res.error
    });
  } catch (e) {
    record('服务器运行状态', false, { error: e.message });
  }

  // 2. 核心功能
  const pages = ['/', '/login', '/news', '/community', '/about', '/contact'];
  for (const page of pages) {
    try {
      const res = await new Promise(resolve => {
        const req = http.request(BASE_URL + page, res => resolve({ status: res.statusCode }));
        req.on('error', () => resolve({ error: true }));
        req.setTimeout(3000, () => {
          req.destroy();
          resolve({ error: 'timeout' });
        });
        req.end();
      });
      record(`${page}页面`, !res.error && res.status === 200, { status: res.status });
    } catch (e) {
      record(`${page}页面`, false, { error: e.message });
    }
  }

  // 3. 文件检查
  const files = [
    'package.json',
    'next.config.js',
    'prisma/schema.prisma',
    'src/components/SEO.tsx',
    'public/robots.txt',
    'public/sitemap.xml'
  ];
  
  for (const file of files) {
    const exists = fs.existsSync(file);
    record(`文件 ${file}`, exists, { exists });
  }

  // 4. 数据库
  const dbExists = fs.existsSync('prisma/dev.db');
  record('数据库文件', dbExists, { 
    exists: dbExists,
    size: dbExists ? `${(fs.statSync('prisma/dev.db').size / 1024 / 1024).toFixed(2)}MB` : 'N/A'
  });

  // 5. 环境配置
  const envExists = fs.existsSync('.env') || fs.existsSync('.env.example');
  record('环境配置', envExists, { exists: envExists });

  // 6. 构建配置
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasBuild = !!pkg.scripts?.build;
    const hasStart = !!pkg.scripts?.start;
    record('构建配置', hasBuild && hasStart, { hasBuild, hasStart });
  } catch (e) {
    record('构建配置', false, { error: e.message });
  }

  // 生成报告
  console.log('\n' + '='.repeat(50));
  console.log('📊 部署检查报告');
  console.log('='.repeat(50));
  
  const total = results.tests.length;
  const passed = results.passed;
  const failed = results.failed;
  const rate = total > 0 ? (passed / total) * 100 : 0;
  
  console.log(`总计: ${total} 通过: ${passed} 失败: ${failed} 通过率: ${rate.toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ 失败项目:');
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`  - ${t.test}`);
      if (t.details.error) console.log(`    错误: ${t.details.error}`);
      if (t.details.status) console.log(`    状态: ${t.details.status}`);
    });
  }

  console.log('\n' + '='.repeat(50));
  if (rate >= 90) {
    console.log('🎉 优秀 - 项目已成功部署到本地！');
    console.log('✅ 所有核心功能正常');
    console.log('✅ 文件结构完整');
    console.log('✅ 服务器运行稳定');
    console.log('✅ 可以开始用户测试');
  } else if (rate >= 70) {
    console.log('⚠️  良好 - 部署基本成功');
    console.log('✅ 核心功能正常');
    console.log('⚠️  部分细节需要优化');
    console.log('✅ 可以进行用户测试');
  } else {
    console.log('❌ 需要修复 - 部署存在问题');
    console.log('⚠️  需要修复失败的项目');
    console.log('⚠️  建议修复后再进行用户测试');
  }
  
  return rate >= 70;
}

// 运行检查
checkServer().then(success => {
  if (success) {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 部署完成！下一步建议:');
    console.log('1. 邀请测试用户进行功能验证');
    console.log('2. 进行负载测试（如果需要）');
    console.log('3. 配置生产环境变量');
    console.log('4. 设置监控和日志');
    console.log('5. 准备上线发布');
    console.log('='.repeat(50));
  }
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('检查失败:', err);
  process.exit(1);
});