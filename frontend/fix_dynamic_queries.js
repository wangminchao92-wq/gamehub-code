#!/usr/bin/env node

/**
 * 快速修复动态页面查询
 * 移除简化schema中不存在的字段
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复动态页面查询...\n');

// 修复文章详情页
const articlePagePath = path.join(__dirname, 'src/pages/news/[slug].tsx');
let articleContent = fs.readFileSync(articlePagePath, 'utf8');

// 移除category和tags查询
articleContent = articleContent.replace(
  /,\s*category:\s*\{[^}]+\},\s*tags:\s*\{[^}]+\}/,
  ''
);

// 更新include部分
articleContent = articleContent.replace(
  /include:\s*\{[\s\S]*?author:\s*\{[\s\S]*?\}\s*\},?\s*category:/,
  'include: {\n        author: {\n          select: {\n            id: true,\n            username: true,\n            displayName: true,\n            avatar: true,\n            bio: true,\n            level: true,\n          },\n        },'
);

fs.writeFileSync(articlePagePath, articleContent);
console.log('✅ 修复文章详情页查询');

// 修复用户个人中心页
const userPagePath = path.join(__dirname, 'src/pages/user/[username].tsx');
let userContent = fs.readFileSync(userPagePath, 'utf8');

// 移除forumReplies等不存在的字段
userContent = userContent.replace(
  /_count:\s*\{\s*select:\s*\{[\s\S]*?forumReplies:[\s\S]*?\}\s*\},/,
  '_count: {\n          select: {\n            articles: true,\n            forumPosts: true,\n            comments: true,\n          },\n        },'
);

// 移除不存在的关联查询
userContent = userContent.replace(
  /,\s*forumReplies:\s*true,\s*privateMessages:\s*true,\s*orders:\s*true,\s*notifications:\s*true,\s*userSettings:\s*true/g,
  ''
);

fs.writeFileSync(userPagePath, userContent);
console.log('✅ 修复用户个人中心页查询');

// 修复帖子详情页
const postPagePath = path.join(__dirname, 'src/pages/community/post/[id].tsx');
let postContent = fs.readFileSync(postPagePath, 'utf8');

// 简化查询
postContent = postContent.replace(
  /include:\s*\{[\s\S]*?author:\s*\{[\s\S]*?\},[\s\S]*?category:\s*\{[^}]+\},[\s\S]*?tags:/,
  'include: {\n        author: {\n          select: {\n            id: true,\n            username: true,\n            displayName: true,\n            avatar: true,\n            level: true,\n          },\n        },'
);

// 移除不存在的字段
postContent = postContent.replace(
  /,\s*category:\s*\{[^}]+\},\s*tags:\s*\{[^}]+\}/g,
  ''
);

fs.writeFileSync(postPagePath, postContent);
console.log('✅ 修复帖子详情页查询');

console.log('\n🎉 查询修复完成！');
console.log('\n🚀 下一步:');
console.log('1. 重启开发服务器');
console.log('2. 重新测试动态页面');
console.log('3. 验证数据库查询正常');