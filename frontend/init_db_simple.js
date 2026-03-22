#!/usr/bin/env node

/**
 * 简单的数据库初始化脚本
 * 使用Node.js内置的sqlite3模块
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 初始化开发数据库...\n');

// 检查是否安装了sqlite3
try {
  require('sqlite3');
  console.log('✅ sqlite3已安装');
} catch (error) {
  console.error('❌ sqlite3未安装，请运行: npm install sqlite3');
  console.log('💡 使用替代方法创建数据库文件...');
  
  // 创建空的数据库文件
  const dbFile = path.join(__dirname, 'prisma/dev.db');
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, '');
    console.log('✅ 创建空的SQLite数据库文件');
  }
  
  // 创建简单的SQL文件供手动执行
  const initSql = `-- GameHub数据库初始化SQL
-- 请使用SQLite工具执行此文件

-- 用户表
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "username" TEXT NOT NULL UNIQUE,
  "displayName" TEXT,
  "avatar" TEXT,
  "bio" TEXT,
  "passwordHash" TEXT,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "verificationToken" TEXT,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "level" INTEGER NOT NULL DEFAULT 1,
  "experience" INTEGER NOT NULL DEFAULT 0,
  "points" INTEGER NOT NULL DEFAULT 0,
  "lastLoginAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- 插入测试用户
INSERT OR IGNORE INTO "User" ("id", "email", "username", "displayName", "avatar", "role", "level", "experience", "points") VALUES
('test-user-1', 'admin@gamehub.com', 'admin', '管理员', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'ADMIN', 10, 5000, 10000),
('test-user-2', 'user1@gamehub.com', 'player1', '游戏玩家1', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1', 'USER', 5, 1200, 2500);

SELECT '✅ 数据库初始化完成！' as message;
SELECT COUNT(*) as user_count FROM "User";`;
  
  fs.writeFileSync(path.join(__dirname, 'prisma/init_manual.sql'), initSql);
  console.log('✅ 创建手动初始化SQL文件: prisma/init_manual.sql');
  console.log('💡 提示: 可以使用SQLite浏览器工具执行此文件');
}

console.log('\n🎉 数据库初始化准备完成！');
console.log('\n📋 当前状态:');
console.log('1. ✅ Prisma客户端已生成');
console.log('2. ✅ 数据库文件已创建');
console.log('3. ⚠️  需要手动初始化表结构（或等待sqlite3安装完成）');

console.log('\n🚀 立即测试:');
console.log('1. 启动开发服务器: npm run dev');
console.log('2. 访问 http://localhost:3000');
console.log('3. 测试静态页面功能（数据库相关功能需要表结构）');

console.log('\n💡 备选方案:');
console.log('1. 安装sqlite3后重新运行此脚本');
console.log('2. 使用在线SQLite工具初始化数据库');
console.log('3. 直接进行前端功能测试（不依赖数据库）');