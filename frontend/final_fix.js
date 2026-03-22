#!/usr/bin/env node

/**
 * 最终修复脚本 - 快速解决所有TypeScript错误
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 运行最终修复...\n');

// 修复列表
const fixes = [
  {
    file: 'src/pages/api/auth/github.ts',
    find: "provider: 'github'",
    replace: "provider: 'GITHUB'",
    description: '修复GitHub provider枚举值'
  },
  {
    file: 'src/pages/api/auth/github.ts',
    find: "{ socialLogins: { some: { provider: 'github', providerId: githubId } } }",
    replace: "{ socialLogins: { some: { provider: 'GITHUB', providerId: githubId } } }",
    description: '修复GitHub查询条件'
  },
  {
    file: 'src/pages/api/auth/google.ts',
    find: "provider: 'google'",
    replace: "provider: 'GOOGLE'",
    description: '修复Google provider枚举值'
  },
  {
    file: 'src/pages/api/auth/google.ts',
    find: "{ socialLogins: { some: { provider: 'google', providerId: googleId } } }",
    replace: "{ socialLogins: { some: { provider: 'GOOGLE', providerId: googleId } } }",
    description: '修复Google查询条件'
  },
  {
    file: 'src/pages/api/auth/github.ts',
    find: "theme: 'dark'",
    replace: "theme: 'DARK'",
    description: '修复主题枚举值'
  },
  {
    file: 'src/pages/api/auth/google.ts',
    find: "theme: 'dark'",
    replace: "theme: 'DARK'",
    description: '修复主题枚举值'
  }
];

// 执行修复
let fixedCount = 0;
let totalCount = fixes.length;

for (const fix of fixes) {
  const filePath = path.join(__dirname, fix.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${fix.file}`);
    continue;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(fix.find)) {
      content = content.replace(new RegExp(fix.find, 'g'), fix.replace);
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${fix.description}`);
      fixedCount++;
    } else {
      console.log(`⚠️  未找到: ${fix.description}`);
    }
  } catch (error) {
    console.error(`❌ 修复失败 ${fix.file}: ${error.message}`);
  }
}

console.log(`\n📊 修复结果: ${fixedCount}/${totalCount}`);

// 创建环境变量文件
console.log('\n🔧 创建环境变量文件...');
const envPath = path.join(__dirname, '.env');
const envContent = `# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/gamehub"

# NextAuth配置
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth配置
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Google OAuth配置
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 其他配置
NODE_ENV="development"
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ 已创建 .env 文件');
} else {
  console.log('✅ .env 文件已存在');
}

console.log('\n🎉 最终修复完成！');
console.log('\n🚀 现在可以运行:');
console.log('1. npx tsc --noEmit --skipLibCheck (检查错误)');
console.log('2. npm run dev (启动开发服务器)');
console.log('3. 访问 http://localhost:3000');