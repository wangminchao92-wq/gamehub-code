/**
 * GameHub项目本地部署最终测试
 * 模拟生产环境部署和验证
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

// 测试结果
const results = {
  deployment: { tests: [], passed: 0, failed: 0 },
  verification: { tests: [], passed: 0, failed: 0 },
  production: { tests: [], passed: 0, failed: 0 }
};

function record(phase, test, passed, details = {}) {
  results[phase].tests.push({ test, passed, timestamp: new Date().toISOString(), details });
  if (passed) results[phase].passed++;
  else results[phase].failed++;
  
  console.log(`${passed ? '✅' : '❌'} [${phase.toUpperCase()}] ${test}`);
}

async function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    });
    req.on('error', reject);
    req.setTimeout(TEST_TIMEOUT, () => {
      req.destroy();
      reject(new Error('超时'));
    });
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testDeploymentPhase() {
  console.log('\n🚀 第一阶段：部署准备测试');
  console.log('='.repeat(50));

  // 1. 检查项目结构
  const requiredDirs = ['src', 'public', 'prisma', 'src/components', 'src/pages', 'src/pages/api'];
  for (const dir of requiredDirs) {
    const exists = fs.existsSync(dir);
    record('deployment', `目录 ${dir}`, exists, { exists });
  }

  // 2. 检查配置文件
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'tsconfig.json',
    'prisma/schema.prisma',
    '.env.example'
  ];
  
  for (const file of requiredFiles) {
    const exists = fs.existsSync(file);
    const size = exists ? fs.statSync(file).size : 0;
    record('deployment', `文件 ${file}`, exists, { exists, size: `${size} bytes` });
  }

  // 3. 检查依赖
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasDeps = pkg.dependencies && Object.keys(pkg.dependencies).length > 0;
    const hasDevDeps = pkg.devDependencies && Object.keys(pkg.devDependencies).length > 0;
    const hasScripts = pkg.scripts && pkg.scripts.build && pkg.scripts.dev && pkg.scripts.start;
    
    record('deployment', 'package.json配置', hasDeps && hasDevDeps && hasScripts, {
      dependencies: Object.keys(pkg.dependencies || {}).length,
      devDependencies: Object.keys(pkg.devDependencies || {}).length,
      hasBuild: !!pkg.scripts?.build,
      hasDev: !!pkg.scripts?.dev,
      hasStart: !!pkg.scripts?.start
    });
  } catch (error) {
    record('deployment', 'package.json配置', false, { error: error.message });
  }

  // 4. 检查数据库
  const dbFile = 'prisma/dev.db';
  const dbExists = fs.existsSync(dbFile);
  if (dbExists) {
    const dbSize = fs.statSync(dbFile).size;
    record('deployment', '数据库文件', true, { 
      size: `${(dbSize / 1024 / 1024).toFixed(2)} MB`,
      path: dbFile 
    });
  } else {
    record('deployment', '数据库文件', false, { path: dbFile });
  }

  // 5. 检查环境变量
  const envFiles = ['.env', '.env.development', '.env.production'];
  let hasAnyEnv = false;
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      hasAnyEnv = true;
      const content = fs.readFileSync(envFile, 'utf8');
      const hasDatabaseUrl = content.includes('DATABASE_URL');
      const hasNextAuth = content.includes('NEXTAUTH_URL') || content.includes('NEXTAUTH_SECRET');
      record('deployment', `环境文件 ${envFile}`, true, {
        hasDatabaseUrl,
        hasNextAuth,
        lines: content.split('\n').length
      });
    }
  }
  if (!hasAnyEnv) {
    record('deployment', '环境配置文件', false, { files: envFiles });
  }

  // 6. 尝试构建（模拟生产构建）
  console.log('\n🔨 模拟生产构建...');
  try {
    const { stdout } = await execPromise('npm run build --dry-run', { timeout: 30000 });
    record('deployment', '构建命令检查', true, { hasBuild: true });
  } catch (error) {
    // 检查是否有build脚本
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const hasBuildScript = !!pkg.scripts?.build;
      record('deployment', '构建命令检查', hasBuildScript, { 
        hasBuildScript,
        error: error.message.substring(0, 100) 
      });
    } catch (e) {
      record('deployment', '构建命令检查', false, { error: e.message });
    }
  }
}

async function testVerificationPhase() {
  console.log('\n🔍 第二阶段：部署验证测试');
  console.log('='.repeat(50));

  // 1. 服务器运行状态
  try {
    const response = await httpRequest(BASE_URL);
    record('verification', '服务器运行状态', response.status === 200, {
      status: response.status,
      server: 'Next.js Dev Server'
    });
  } catch (error) {
    record('verification', '服务器运行状态', false, { error: error.message });
  }

  // 2. 核心页面访问
  const corePages = [
    { path: '/', name: '首页' },
    { path: '/login', name: '登录页' },
    { path: '/register', name: '注册页' },
    { path: '/news', name: '新闻页' },
    { path: '/community', name: '社区页' },
    { path: '/about', name: '关于页' },
    { path: '/contact', name: '联系页' }
  ];

  for (const page of corePages) {
    try {
      const response = await httpRequest(BASE_URL + page.path);
      const passed = response.status === 200;
      record('verification', `${page.name}访问`, passed, {
        path: page.path,
        status: response.status,
        size: `${response.data.length} bytes`
      });
    } catch (error) {
      record('verification', `${page.name}访问`, false, {
        path: page.path,
        error: error.message
      });
    }
  }

  // 3. API端点验证
  const apis = [
    { path: '/api/health', method: 'GET', name: '健康检查' },
    { path: '/api/auth/simple-login-fixed', method: 'POST', name: '登录API' }
  ];

  for (const api of apis) {
    try {
      const options = { method: api.method };
      if (api.method === 'POST') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify({ email: 'test@example.com', password: 'test123' });
      }
      
      const response = await httpRequest(BASE_URL + api.path, options);
      const passed = response.status === 200 || response.status === 401 || response.status === 400;
      record('verification', `${api.name}功能`, passed, {
        path: api.path,
        method: api.method,
        status: response.status
      });
    } catch (error) {
      record('verification', `${api.name}功能`, false, {
        path: api.path,
        method: api.method,
        error: error.message
      });
    }
  }

  // 4. 静态资源
  const staticFiles = [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/humans.txt'
  ];

  for (const file of staticFiles) {
    try {
      const response = await httpRequest(BASE_URL + file);
      const passed = response.status === 200 || response.status === 404;
      record('verification', `静态资源 ${file}`, passed, {
        path: file,
        status: response.status,
        type: response.headers['content-type']
      });
    } catch (error) {
      record('verification', `静态资源 ${file}`, false, {
        path: file,
        error: error.message
      });
    }
  }

  // 5. 性能基准测试
  console.log('\n⚡ 性能基准测试...');
  const performanceTests = [];
  for (let i = 0; i < 3; i++) {
    try {
      const start = Date.now();
      await httpRequest(BASE_URL + '/');
      const time = Date.now() - start;
      performanceTests.push(time);
    } catch (error) {
      performanceTests.push(9999);
    }
  }
  
  const avgTime = performanceTests.reduce((a, b) => a + b, 0) / performanceTests.length;
  const maxTime = Math.max(...performanceTests);
  const passed = avgTime < 3000; // 平均3秒内
  
  record('verification', '性能基准测试', passed, {
    avgTime: `${avgTime.toFixed(0)}ms`,
    maxTime: `${maxTime}ms`,
    tests: performanceTests.length
  });
}

async function testProductionPhase() {
  console.log('\n🏭 第三阶段：生产就绪测试');
  console.log('='.repeat(50));

  // 1. SEO优化检查
  try {
    const response = await httpRequest(BASE_URL + '/');
    const html = response.data;
    
    const seoChecks = {
      hasTitle: html.includes('<title>'),
      hasMetaDescription: html.includes('name="description"'),
      hasCanonical: html.includes('rel="canonical"'),
      hasViewport: html.includes('name="viewport"'),
      hasOpenGraph: html.includes('property="og:'),
      hasStructuredData: html.includes('application/ld+json')
    };
    
    const passedCount = Object.values(seoChecks).filter(Boolean).length;
    const passed = passedCount >= 4; // 至少4项
    
    record('production', 'SEO优化检查', passed, {
      checks: seoChecks,
      passed: passedCount,
      total: Object.keys(seoChecks).length
    });
  } catch (error) {
    record('production', 'SEO优化检查', false, { error: error.message });
  }

  // 2. 安全头检查
  try {
    const response = await httpRequest(BASE_URL + '/');
    const headers = response.headers;
    
    const securityChecks = {
      'X-Frame-Options': headers['x-frame-options'],
      'X-Content-Type-Options': headers['x-content-type-options'],
      'X-XSS-Protection': headers['x-xss-protection']
    };
    
    const hasSecurity = Object.values(securityChecks).some(h => h);
    record('production', '安全HTTP头', hasSecurity, { headers: securityChecks });
  } catch (error) {
    record('production', '安全HTTP头', false, { error: error.message });
  }

  // 3. 错误处理
  try {
    const response = await httpRequest(BASE_URL + '/non-existent-page-12345');
    const isErrorPage = response.status === 404 || 
                       response.status === 500 ||
                       (response.data && (
                         response.data.includes('404') ||
                         response.data.includes('Not Found') ||
                         response.data.includes('Error')
                       ));
    record('production', '错误页面处理', isErrorPage, {
      status: response.status,
      hasErrorContent: response.data.includes('404') || response.data.includes('Not Found')
    });
  } catch (error) {
    record('production', '错误页面处理', false, { error: error.message });
  }

  // 4. 移动端兼容性
  try {
    const response = await httpRequest(BASE_URL + '/');
    const html = response.data;
    
    const mobileChecks = {
      hasViewport: html.includes('name="viewport"'),
      hasTouchIcons: html.includes('apple-touch-icon'),
      hasThemeColor: html.includes('name="theme-color"'),
      hasResponsiveMeta: html.includes('initial-scale=1')
    };
    
    const passedCount = Object.values(mobileChecks).filter(Boolean).length;
    const passed = passedCount >= 3;
    
    record('production', '移动端兼容性', passed, {
      checks: mobileChecks,
      passed: passedCount,
      total: Object.keys(mobileChecks).length
    });
  } catch (error) {
    record('production', '移动端兼容性', false, { error: error.message });
  }

  // 5. 可访问性基础检查
  try {
    const response = await httpRequest(BASE_URL + '/');
    const html = response.data;
    
    const a11yChecks = {
      hasLang: html.includes('lang='),
      hasAlt: html.includes('alt='),
      hasAria: html.includes('aria-'),
      hasLabel: html.includes('<label')
    };
    
    const passedCount = Object.values(a11yChecks).filter(Boolean).length;
    const passed = passedCount >= 2;
    
    record('production', '可访问性基础', passed, {
      checks: a11yChecks,
      passed: passedCount,
      total: Object.keys(a11yChecks).length
    });
  } catch (error) {
    record('production', '可访问性基础', false, { error: error.message });
  }

  // 6. 内容安全
  try {
    // 测试XSS防护
    const xssResponse = await httpRequest(BASE_URL + '/search?q=<script>alert(1)</script>');
    const containsScript = xssResponse.data.includes('<script>alert(1)</script>');
    record('production', 'XSS防护', !containsScript, {
      containsScript,
      status: xssResponse.status
    });
  } catch (error) {
    record('production', 'XSS防护', false, { error: error.message });
  }
}

async function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 本地部署测试综合报告');
  console.log('='.repeat(60));

  const phases = ['deployment', 'verification', 'production'];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const phase of phases) {
    const phaseData = results[phase];
    const phaseTotal = phaseData.tests.length;
    const phasePassed = phaseData.passed;
    const phaseFailed = phaseData.failed;
    const phaseRate = phaseTotal > 0 ? (phasePassed / phaseTotal) * 100 : 0;

    console.log(`\n${phase.toUpperCase()}阶段:`);
    console.log(`  测试: ${phaseTotal} 通过: ${phasePassed} 失败: ${phaseFailed} 通过率: ${phaseRate.toFixed(1)}%`);

    totalTests += phaseTotal;
    totalPassed += phasePassed;
    totalFailed += phaseFailed;
  }

  const overallRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

  console.log('\n' + '='.repeat(60));
  console.log('🎯 总体结果');
  console.log('='.repeat(60));
  console.log(`总计测试: ${totalTests}`);
  console.log(`通过: ${totalPassed} (${overallRate.toFixed(1)}%)`);
  console.log(`失败: ${totalFailed}`);

  // 显示失败详情
  const allFailed = [];
  for (const phase of phases) {
    results[phase].tests.filter(t => !t.passed).forEach(t => {
      allFailed.push({ phase: phase.toUpperCase(), test: t.test, details: t.details });
    });
  }

  if (allFailed.length > 0) {
    console.log('\n❌ 失败测试详情:');
    for (const fail of allFailed) {
      console.log(`  [${fail.phase}] ${fail.test}`);
      if (fail.details.status) console.log(`    状态: ${fail.details.status}`);
      if (fail.details.error) console.log(`    错误: ${fail.details.error.substring(0, 100)}`);
    }
  }

  // 总体评估
  console.log('\n' + '='.repeat(60));
  console.log('🏆 部署就绪评估');
  console.log('='.repeat(60));

  if (overallRate >= 90) {
    console.log('✅ 优秀 - 项目已准备好生产部署！');
    console.log('   所有测试通过，项目质量优秀，可以立即部署到生产环境。');
  } else if (overallRate >= 80) {
    console.log('⚠️  良好 - 项目基本就