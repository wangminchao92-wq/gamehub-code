#!/usr/bin/env node

/**
 * 修复Prisma客户端配置
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复Prisma客户端配置...\n');

// 修复src/lib/prisma.ts
const prismaFilePath = path.join(__dirname, 'src/lib/prisma.ts');
let prismaContent = fs.readFileSync(prismaFilePath, 'utf8');

// 检查当前配置
if (prismaContent.includes('datasourceUrl:')) {
  console.log('✅ Prisma配置已正确设置');
} else if (prismaContent.includes('datasources:')) {
  // 更新为正确格式
  prismaContent = prismaContent.replace(
    /datasources:\s*\{\s*db:\s*\{\s*url:\s*process\.env\.DATABASE_URL,\s*\}\s*\},/,
    'datasourceUrl: process.env.DATABASE_URL,'
  );
  fs.writeFileSync(prismaFilePath, prismaContent);
  console.log('✅ 更新Prisma配置格式');
} else {
  // 添加配置
  prismaContent = prismaContent.replace(
    'export const prisma = globalForPrisma.prisma ?? new PrismaClient();',
    'export const prisma = globalForPrisma.prisma ?? new PrismaClient({\n  datasourceUrl: process.env.DATABASE_URL,\n});'
  );
  fs.writeFileSync(prismaFilePath, prismaContent);
  console.log('✅ 添加Prisma配置');
}

// 检查环境变量
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('DATABASE_URL')) {
    console.log('✅ 环境变量配置正确');
  } else {
    console.log('❌ 环境变量缺少DATABASE_URL');
  }
} else {
  console.log('❌ .env文件不存在');
}

// 重新生成Prisma客户端
console.log('\n🔄 重新生成Prisma客户端...');
try {
  const { execSync } = require('child_process');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Prisma客户端重新生成成功');
} catch (error) {
  console.error('❌ Prisma客户端生成失败:', error.message);
}

console.log('\n🎉 修复完成！');
console.log('\n🚀 下一步:');
console.log('1. 重启开发服务器');
console.log('2. 重新测试动态页面');
console.log('3. 验证数据库连接');