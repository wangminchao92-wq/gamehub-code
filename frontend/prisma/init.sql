
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
('test-article-1', '《赛博朋克2077》2.0版本全面评测', 'cyberpunk-2077-2-0-review', 'CD Projekt Red为《赛博朋克2077》带来了革命性的2.0更新，我们进行了全面评测。', '## 游戏体验大幅提升

2.0版本彻底重构了游戏系统...', 'REVIEW', 'test-user-1', 'PUBLISHED', 1250, 89, '2024-03-20 10:00:00'),
('test-article-2', '2024年最值得期待的10款独立游戏', 'top-10-indie-games-2024', '从像素风到3A级画面，这些独立游戏将在2024年掀起波澜。', '## 独立游戏的黄金时代

随着开发工具的普及...', 'NEWS', 'test-user-2', 'PUBLISHED', 890, 45, '2024-03-19 14:30:00');

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
