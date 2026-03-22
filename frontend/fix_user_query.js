#!/usr/bin/env node

/**
 * 修复用户个人中心页查询
 * 适配简化schema
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复用户个人中心页查询...\n');

const userPagePath = path.join(__dirname, 'src/pages/user/[username].tsx');
let content = fs.readFileSync(userPagePath, 'utf8');

// 1. 找到用户查询部分
const userQueryStart = content.indexOf('const user = await prisma.user.findUnique({');
if (userQueryStart === -1) {
  console.log('❌ 未找到用户查询');
  process.exit(1);
}

// 2. 找到查询结束位置
let userQueryEnd = content.indexOf('});', userQueryStart);
if (userQueryEnd === -1) {
  console.log('❌ 未找到用户查询结束');
  process.exit(1);
}
userQueryEnd += 3; // 包含 });

// 3. 创建新的用户查询（适配简化schema）
const newUserQuery = `const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            articles: true,
            forumPosts: true,
            comments: true,
          },
        },
        articles: {
          where: {
            status: 'PUBLISHED',
          },
          take: 5,
          orderBy: {
            publishedAt: 'desc',
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            type: true,
            views: true,
            likes: true,
            publishedAt: true,
          },
        },
        forumPosts: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            title: true,
            content: true,
            views: true,
            likes: true,
            replies: true,
            createdAt: true,
          },
        },
      },
    });`;

// 4. 替换用户查询
content = content.substring(0, userQueryStart) + newUserQuery + content.substring(userQueryEnd);

// 5. 修复最近活动查询
const activityQueryStart = content.indexOf('const recentActivity = await prisma.comment.findMany({');
if (activityQueryStart !== -1) {
  const activityQueryEnd = content.indexOf('});', activityQueryStart) + 3;
  const newActivityQuery = `const recentActivity = await prisma.comment.findMany({
      where: {
        authorId: user?.id,
        status: 'APPROVED',
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        forumPost: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });`;
  
  content = content.substring(0, activityQueryStart) + newActivityQuery + content.substring(activityQueryEnd);
}

// 6. 处理缺失字段的默认值
content = content.replace(/user\._count\.forumReplies/g, '0');
content = content.replace(/user\._count\.privateMessages/g, '0');
content = content.replace(/user\._count\.orders/g, '0');
content = content.replace(/user\._count\.notifications/g, '0');

// 7. 保存文件
fs.writeFileSync(userPagePath, content);
console.log('✅ 用户个人中心页查询修复完成');

// 8. 验证修复
console.log('\n🔍 验证修复:');
console.log('1. 移除了forumReplies等不存在的_count字段');
console.log('2. 简化了文章和帖子查询');
console.log('3. 修复了最近活动查询');
console.log('4. 处理了缺失字段的默认值');

console.log('\n🚀 下一步: 重启服务器测试修复效果');