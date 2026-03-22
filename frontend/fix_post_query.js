#!/usr/bin/env node

/**
 * 修复帖子详情页查询
 * 适配简化schema
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复帖子详情页查询...\n');

const postPagePath = path.join(__dirname, 'src/pages/community/post/[id].tsx');
let content = fs.readFileSync(postPagePath, 'utf8');

// 1. 找到帖子查询部分
const postQueryStart = content.indexOf('const post = await prisma.forumPost.findUnique({');
if (postQueryStart === -1) {
  console.log('❌ 未找到帖子查询');
  process.exit(1);
}

// 2. 找到查询结束位置
let postQueryEnd = content.indexOf('});', postQueryStart);
if (postQueryEnd === -1) {
  console.log('❌ 未找到帖子查询结束');
  process.exit(1);
}
postQueryEnd += 3; // 包含 });

// 3. 创建新的帖子查询（适配简化schema）
const newPostQuery = `const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
            experience: true,
          },
        },
        comments: {
          where: {
            status: 'APPROVED',
          },
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                level: true,
              },
            },
            replies: {
              where: {
                status: 'APPROVED',
              },
              orderBy: {
                createdAt: 'asc',
              },
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
    });`;

// 4. 替换帖子查询
content = content.substring(0, postQueryStart) + newPostQuery + content.substring(postQueryEnd);

// 5. 处理缺失字段的默认值
content = content.replace(/post\.category\.name/g, "'社区讨论'");
content = content.replace(/post\.category\.slug/g, "'community'");
content = content.replace(/post\.tags/g, '[]');

// 6. 保存文件
fs.writeFileSync(postPagePath, content);
console.log('✅ 帖子详情页查询修复完成');

// 7. 验证修复
console.log('\n🔍 验证修复:');
console.log('1. 移除了category字段查询');
console.log('2. 移除了tags字段查询');
console.log('3. 简化了评论查询结构');
console.log('4. 处理了缺失字段的默认值');

console.log('\n🚀 下一步: 重启服务器测试修复效果');