#!/usr/bin/env node

/**
 * 测试Prisma配置
 */

console.log('🔧 测试Prisma配置...\n');

// 方法1: 直接测试Prisma客户端
try {
  console.log('方法1: 直接创建PrismaClient');
  const { PrismaClient } = require('@prisma/client');
  
  // 尝试不同的配置方式
  const configs = [
    { name: '无参数', config: {} },
    { name: '带datasourceUrl', config: { datasourceUrl: process.env.DATABASE_URL } },
    { name: '带datasources', config: { datasources: { db: { url: process.env.DATABASE_URL } } } },
  ];
  
  for (const cfg of configs) {
    console.log(`\n尝试: ${cfg.name}`);
    try {
      const prisma = new PrismaClient(cfg.config);
      // 尝试简单查询
      const users = await prisma.user.findMany({ take: 1 });
      console.log(`✅ 成功! 找到 ${users.length} 个用户`);
      await prisma.$disconnect();
      break;
    } catch (error) {
      console.log(`❌ 失败: ${error.message.split('\n')[0]}`);
    }
  }
  
} catch (error) {
  console.log('❌ Prisma测试失败:', error.message);
}

// 方法2: 检查环境变量
console.log('\n📋 环境变量检查:');
console.log('DATABASE_URL:', process.env.DATABASE_URL || '未设置');

// 方法3: 检查数据库文件
console.log('\n🗄️ 数据库文件检查:');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'prisma/dev.db');

if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log(`✅ 数据库文件存在`);
  console.log(`   大小: ${(stats.size / 1024).toFixed(2)} KB`);
  
  // 检查是否是有效的SQLite文件
  const fileContent = fs.readFileSync(dbPath, 'utf8', 0, 100);
  if (stats.size > 0) {
    console.log(`   可能是有效的SQLite数据库`);
  } else {
    console.log(`   ⚠️  数据库文件为空`);
  }
} else {
  console.log(`❌ 数据库文件不存在: ${dbPath}`);
}

console.log('\n💡 建议:');
console.log('1. 检查Prisma 7.5.0文档: https://pris.ly/d/client-constructor');
console.log('2. 尝试降级Prisma到7.4.0版本');
console.log('3. 使用SQLite命令行工具验证数据库');
console.log('4. 创建最小化的测试用例');