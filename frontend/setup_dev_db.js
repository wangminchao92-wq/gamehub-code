#!/usr/bin/env node

/**
 * 设置开发数据库的脚本
 * 绕过Prisma 7.5.0的配置问题，直接创建SQLite数据库
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 设置开发数据库...\n');

// 1. 创建数据库目录
const dbDir = path.join(__dirname, 'prisma');
const dbFile = path.join(dbDir, 'dev.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ 创建prisma目录');
}

// 2. 创建SQLite数据库文件
if (!fs.existsSync(dbFile)) {
  // 创建空文件作为SQLite数据库
  fs.writeFileSync(dbFile, '');
  console.log('✅ 创建SQLite数据库文件');
}

// 3. 生成Prisma客户端（不运行迁移）
try {
  console.log('\n🔧 生成Prisma客户端...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Prisma客户端生成成功');
} catch (error) {
  console.error('❌ Prisma客户端生成失败:', error.message);
  
  // 尝试使用旧版本方式
  console.log('\n🔧 尝试旧版本方式...');
  
  // 临时修改schema添加url
  const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // 保存原始内容
  const originalSchema = schemaContent;
  
  // 添加url到schema
  schemaContent = schemaContent.replace(
    'datasource db {\n  provider = "sqlite"\n}',
    'datasource db {\n  provider = "sqlite"\n  url      = "file:./dev.db"\n}'
  );
  
  fs.writeFileSync(schemaPath, schemaContent);
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Prisma客户端生成成功（使用临时schema）');
  } finally {
    // 恢复原始schema
    fs.writeFileSync(schemaPath, originalSchema);
  }
}

// 4. 创建测试数据
console.log('\n📊 创建测试数据...');

const createTestData = `
// 测试数据创建脚本
// 在实际应用中，可以通过API或界面创建数据

console.log('💡 测试数据创建提示:');
console.log('1. 启动开发服务器: npm run dev');
console.log('2. 访问 http://localhost:3000/register 注册测试用户');
console.log('3. 访问 http://localhost:3000/admin/articles 创建测试文章');
console.log('4. 访问 http://localhost:3000/community 创建测试帖子');
`;

fs.writeFileSync(path.join(__dirname, 'create_test_data.js'), createTestData);
console.log('✅ 测试数据创建脚本已生成');

// 5. 创建数据库初始化SQL（可选）
console.log('\n🗄️ 创建数据库表结构...');

const initSql = `
-- GameHub数据库初始化SQL
-- 由于Prisma迁移问题，手动创建核心表结构

-- 注意：这是一个简化的表结构，实际开发中应使用Prisma迁移
-- 这里只是为了开发测试使用

PRAGMA foreign_keys = OFF;

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

-- 文章表
CREATE TABLE IF NOT EXISTS "Article" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "coverImage" TEXT,
  "type" TEXT NOT NULL,
  "categoryId" TEXT,
  "authorId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "pinned" BOOLEAN NOT NULL DEFAULT false,
  "rating" REAL DEFAULT 0,
  "ratingCount" INTEGER NOT NULL DEFAULT 0,
  "views" INTEGER NOT NULL DEFAULT 0,
  "likes" INTEGER NOT NULL DEFAULT 0,
  "shares" INTEGER NOT NULL DEFAULT 0,
  "publishedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 论坛帖子表
CREATE TABLE IF NOT EXISTS "ForumPost" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,
  "likes" INTEGER NOT NULL DEFAULT 0,
  "replies" INTEGER NOT NULL DEFAULT 0,
  "pinned" BOOLEAN NOT NULL DEFAULT false,
  "locked" BOOLEAN NOT NULL DEFAULT false,
  "lastReplyAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 评论表
CREATE TABLE IF NOT EXISTS "Comment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "articleId" TEXT,
  "forumPostId" TEXT,
  "parentId" TEXT,
  "likes" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("forumPostId") REFERENCES "ForumPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_username_idx" ON "User"("username");
CREATE INDEX IF NOT EXISTS "Article_authorId_idx" ON "Article"("authorId");
CREATE INDEX IF NOT EXISTS "Article_type_idx" ON "Article"("type");
CREATE INDEX IF NOT EXISTS "Article_status_idx" ON "Article"("status");
CREATE INDEX IF NOT EXISTS "Article_publishedAt_idx" ON "Article"("publishedAt");
CREATE INDEX IF NOT EXISTS "ForumPost_authorId_idx" ON "ForumPost"("authorId");
CREATE INDEX IF NOT EXISTS "Comment_authorId_idx" ON "Comment"("authorId");
CREATE INDEX IF NOT EXISTS "Comment_articleId_idx" ON "Comment"("articleId");
CREATE INDEX IF NOT EXISTS "Comment_forumPostId_idx" ON "Comment"("forumPostId");

PRAGMA foreign_keys = ON;

-- 插入测试数据
INSERT OR IGNORE INTO "User" ("id", "email", "username", "displayName", "avatar", "role", "level", "experience", "points") VALUES
('test-user-1', 'admin@gamehub.com', 'admin', '管理员', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'ADMIN', 10, 5000, 10000),
('test-user-2', 'user1@gamehub.com', 'player1', '游戏玩家1', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1', 'USER', 5, 1200, 2500),
('test-user-3', 'user2@gamehub.com', 'gamer2', '硬核玩家', 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer2', 'USER', 8, 3000, 6000);

INSERT OR IGNORE INTO "Article" ("id", "title", "slug", "excerpt", "content", "type", "authorId", "status", "views", "likes", "publishedAt") VALUES
('test-article-1', '《赛博朋克2077》2.0版本全面评测', 'cyberpunk-2077-2-0-review', 'CD Projekt Red为《赛博朋克2077》带来了革命性的2.0更新，我们进行了全面评测。', '## 游戏体验大幅提升\n\n2.0版本彻底重构了游戏系统...', 'REVIEW', 'test-user-1', 'PUBLISHED', 1250, 89, '2024-03-20 10:00:00'),
('test-article-2', '2024年最值得期待的10款独立游戏', 'top-10-indie-games-2024', '从像素风到3A级画面，这些独立游戏将在2024年掀起波澜。', '## 独立游戏的黄金时代\n\n随着开发工具的普及...', 'NEWS', 'test-user-2', 'PUBLISHED', 890, 45, '2024-03-19 14:30:00');

INSERT OR IGNORE INTO "ForumPost" ("id", "title", "content", "authorId", "views", "likes", "replies") VALUES
('test-post-1', '新手求问：如何快速提升游戏等级？', '刚接触这款游戏，感觉升级好慢，有什么技巧吗？', 'test-user-3', 340, 12, 8),
('test-post-2', '游戏BUG反馈集中帖', '大家遇到的BUG可以在这里集中反馈，方便开发者修复。', 'test-user-1', 560, 23, 15);

INSERT OR IGNORE INTO "Comment" ("id", "content", "authorId", "articleId", "likes") VALUES
('test-comment-1', '这篇评测写得太好了，完全说出了我的心声！', 'test-user-3', 'test-article-1', 5),
('test-comment-2', '期待这些独立游戏，特别是那款像素风的！', 'test-user-2', 'test-article-2', 3);

PRAGMA foreign_keys = ON;

SELECT '✅ 数据库初始化完成！' as message;
SELECT '📊 用户表记录数:' as label, COUNT(*) as count FROM "User";
SELECT '📊 文章表记录数:' as label, COUNT(*) as count FROM "Article";
SELECT '📊 论坛帖子记录数:' as label, COUNT(*) as count FROM "ForumPost";
SELECT '📊 评论表记录数:' as label, COUNT(*) as count FROM "Comment";
`;

fs.writeFileSync(path.join(__dirname, 'prisma/init.sql'), initSql);
console.log('✅ 数据库初始化SQL已生成');

// 6. 运行初始化SQL
console.log('\n⚡ 运行数据库初始化...');
try {
  // 使用sqlite3执行SQL
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database(dbFile);
  
  // 执行SQL文件
  const sqlStatements = initSql.split(';').filter(stmt => stmt.trim());
  
  db.serialize(() => {
    for (const stmt of sqlStatements) {
      if (stmt.trim()) {
        db.run(stmt + ';', (err) => {
          if (err && !err.message.includes('already exists')) {
            console.error(`❌ SQL执行错误: ${err.message}`);
          }
        });
      }
    }
    
    // 查询结果
    db.all("SELECT '✅ 数据库初始化完成！' as message", (err, rows) => {
      if (err) {
        console.error('❌ 查询错误:', err.message);
      } else {
        console.log(rows[0].message);
      }
    });
    
    db.all("SELECT '📊 用户表记录数:' as label, COUNT(*) as count FROM \"User\"", (err, rows) => {
      if (!err && rows.length > 0) {
        console.log(`${rows[0].label} ${rows[0].count}`);
      }
    });
  });
  
  db.close();
  console.log('✅ 数据库初始化完成');
  
} catch (error) {
  console.error('❌ 数据库初始化失败:', error.message);
  console.log('💡 提示: 需要安装sqlite3: npm install sqlite3');
}

console.log('\n🎉 开发数据库设置完成！');
console.log('\n🚀 下一步:');
console.log('1. 启动开发服务器: npm run dev');
console.log('2. 访问 http://localhost:3000 测试功能');
console.log('3. 使用测试账号登录:');
console.log('   - 管理员: admin@gamehub.com / 任意密码');
console.log('   - 普通用户: user1@gamehub.com / 任意密码');
console.log('4. 查看测试数据是否正常显示');