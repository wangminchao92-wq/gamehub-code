const fs = require('fs');
const path = require('path');

console.log('🔧 生产环境配置测试\n');

// 检查的文件列表
const requiredFiles = [
  '.env.production',
  'next.config.js',
  'Dockerfile',
  'docker-compose.yml',
  'deploy.sh',
  'DEPLOYMENT.md',
  'src/pages/api/health.ts',
  'nginx.conf',
  'prometheus.yml',
];

// 检查的目录
const requiredDirs = [
  'grafana/provisioning/dashboards',
  'grafana/provisioning/datasources',
];

// 环境变量检查
const requiredEnvVars = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_URL',
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

async function runTests() {
  console.log('='.repeat(60));
  console.log('🎯 生产环境配置测试');
  console.log('='.repeat(60));
  
  let allPassed = true;
  
  // 1. 检查必需文件
  console.log('\n📁 文件完整性检查:');
  console.log('-' .repeat(40));
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      const stats = fs.statSync(filePath);
      const size = stats.size;
      console.log(`  ✅ ${file.padEnd(30)} ${size} bytes`);
    } else {
      console.log(`  ❌ ${file.padEnd(30)} 文件不存在`);
      allPassed = false;
    }
  }
  
  // 2. 检查目录
  console.log('\n📂 目录完整性检查:');
  console.log('-' .repeat(40));
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(__dirname, dir);
    const exists = fs.existsSync(dirPath);
    
    if (exists) {
      console.log(`  ✅ ${dir}`);
    } else {
      console.log(`  ❌ ${dir} 目录不存在`);
      allPassed = false;
    }
  }
  
  // 3. 检查环境配置文件
  console.log('\n⚙️ 环境配置检查:');
  console.log('-' .repeat(40));
  
  const envFile = path.join(__dirname, '.env.production');
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    const lines = content.split('\n');
    
    // 检查必需的环境变量
    for (const envVar of requiredEnvVars) {
      const hasVar = lines.some(line => 
        line.trim().startsWith(`${envVar}=`) && 
        !line.trim().startsWith('#')
      );
      
      if (hasVar) {
        console.log(`  ✅ ${envVar}`);
      } else {
        console.log(`  ❌ ${envVar} 未配置`);
        allPassed = false;
      }
    }
    
    // 检查敏感信息
    const sensitivePatterns = [
      /password\s*=\s*[^#\n]+/i,
      /secret\s*=\s*[^#\n]+/i,
      /key\s*=\s*[^#\n]+/i,
    ];
    
    let hasSensitiveInfo = false;
    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        const matches = content.match(pattern);
        if (matches && !matches[0].includes('your-') && !matches[0].includes('change-this')) {
          hasSensitiveInfo = true;
          break;
        }
      }
    }
    
    if (hasSensitiveInfo) {
      console.log(`  ⚠️  发现可能的敏感信息，请在生产环境中替换`);
    } else {
      console.log(`  ✅ 无敏感信息泄露`);
    }
    
  } else {
    console.log(`  ❌ .env.production 文件不存在`);
    allPassed = false;
  }
  
  // 4. 检查部署脚本权限
  console.log('\n🚀 部署脚本检查:');
  console.log('-' .repeat(40));
  
  const deployScript = path.join(__dirname, 'deploy.sh');
  if (fs.existsSync(deployScript)) {
    const stats = fs.statSync(deployScript);
    const isExecutable = (stats.mode & 0o111) !== 0;
    
    if (isExecutable) {
      console.log(`  ✅ deploy.sh 可执行`);
    } else {
      console.log(`  ⚠️  deploy.sh 不可执行，运行: chmod +x deploy.sh`);
    }
    
    // 检查脚本内容
    const scriptContent = fs.readFileSync(deployScript, 'utf8');
    const hasShebang = scriptContent.startsWith('#!/bin/bash');
    const hasErrorHandling = scriptContent.includes('set -e');
    
    if (hasShebang) {
      console.log(`  ✅ 包含正确的 shebang`);
    } else {
      console.log(`  ❌ 缺少 shebang`);
      allPassed = false;
    }
    
    if (hasErrorHandling) {
      console.log(`  ✅ 包含错误处理`);
    } else {
      console.log(`  ⚠️  建议添加错误处理: set -e`);
    }
    
  } else {
    console.log(`  ❌ deploy.sh 文件不存在`);
    allPassed = false;
  }
  
  // 5. 检查 Docker 配置
  console.log('\n🐳 Docker 配置检查:');
  console.log('-' .repeat(40));
  
  const dockerfile = path.join(__dirname, 'Dockerfile');
  if (fs.existsSync(dockerfile)) {
    const content = fs.readFileSync(dockerfile, 'utf8');
    
    const checks = {
      hasBaseImage: content.includes('FROM node:'),
      hasWorkdir: content.includes('WORKDIR'),
      hasCopy: content.includes('COPY'),
      hasExpose: content.includes('EXPOSE'),
      hasNonRootUser: content.includes('adduser') || content.includes('USER'),
    };
    
    for (const [check, passed] of Object.entries(checks)) {
      const checkName = check.replace(/([A-Z])/g, ' $1').toLowerCase();
      console.log(`  ${passed ? '✅' : '❌'} ${checkName}`);
      if (!passed) allPassed = false;
    }
  } else {
    console.log(`  ❌ Dockerfile 文件不存在`);
    allPassed = false;
  }
  
  // 6. 检查监控配置
  console.log('\n📊 监控配置检查:');
  console.log('-' .repeat(40));
  
  const prometheusConfig = path.join(__dirname, 'prometheus.yml');
  if (fs.existsSync(prometheusConfig)) {
    const content = fs.readFileSync(prometheusConfig, 'utf8');
    
    const checks = {
      hasScrapeConfigs: content.includes('scrape_configs'),
      hasGamehubJob: content.includes("job_name: 'gamehub'"),
      hasInterval: content.includes('scrape_interval'),
    };
    
    for (const [check, passed] of Object.entries(checks)) {
      const checkName = check.replace(/([A-Z])/g, ' $1').toLowerCase();
      console.log(`  ${passed ? '✅' : '❌'} ${checkName}`);
      if (!passed) allPassed = false;
    }
  } else {
    console.log(`  ❌ prometheus.yml 文件不存在`);
    allPassed = false;
  }
  
  // 生成总结报告
  console.log('\n' + '='.repeat(60));
  console.log('📋 测试总结');
  console.log('='.repeat(60));
  
  if (allPassed) {
    console.log('🎉 所有检查通过！生产环境配置完整。');
    console.log('\n🚀 下一步:');
    console.log('  1. 配置真实的数据库和 OAuth 密钥');
    console.log('  2. 获取 SSL 证书');
    console.log('  3. 设置域名解析');
    console.log('  4. 运行部署测试: ./deploy.sh prod setup');
  } else {
    console.log('⚠️  发现配置问题，请修复后再继续。');
    console.log('\n🔧 需要修复的问题:');
    console.log('  1. 检查缺失的文件和目录');
    console.log('  2. 配置必需的环境变量');
    console.log('  3. 确保部署脚本可执行');
    console.log('  4. 检查 Docker 配置完整性');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🔧 生产环境配置测试完成');
  console.log('='.repeat(60));
}

runTests().catch(console.error);