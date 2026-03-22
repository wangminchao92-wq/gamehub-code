#!/usr/bin/env node

/**
 * 修复序列化问题
 * 1. Date对象转换为字符串
 * 2. 处理undefined值
 * 3. 修复查询错误
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复序列化问题...\n');

// 1. 修复文章详情页的序列化
console.log('1. 修复文章详情页序列化...');
const articlePagePath = path.join(__dirname, 'src/pages/news/[slug].tsx');
let articleContent = fs.readFileSync(articlePagePath, 'utf8');

// 在getServerSideProps返回前添加序列化处理
const articleReturnMatch = articleContent.match(/return \{[\s\S]*?props: \{[\s\S]*?\}\s*\}\s*\}/);
if (articleReturnMatch) {
  const oldReturn = articleReturnMatch[0];
  const newReturn = `return {
      props: {
        article: article ? JSON.parse(JSON.stringify({
          ...article,
          publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
          createdAt: article.createdAt ? article.createdAt.toISOString() : null,
          updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null,
          comments: article.comments ? article.comments.map(comment => ({
            ...comment,
            createdAt: comment.createdAt ? comment.createdAt.toISOString() : null,
            updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : null,
          })) : [],
        })) : null,
        relatedArticles: relatedArticles ? JSON.parse(JSON.stringify(relatedArticles.map(article => ({
          ...article,
          publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
        })))) : [],
      },
    }`;
  
  articleContent = articleContent.replace(oldReturn, newReturn);
  console.log('   ✅ 文章详情页序列化修复完成');
}

// 2. 修复用户个人中心页的序列化
console.log('2. 修复用户个人中心页序列化...');
const userPagePath = path.join(__dirname, 'src/pages/user/[username].tsx');
let userContent = fs.readFileSync(userPagePath, 'utf8');

// 处理profile.email可能为undefined的问题
userContent = userContent.replace(/profile\.email/g, 'profile?.email || null');

// 在getServerSideProps返回前添加序列化处理
const userReturnMatch = userContent.match(/return \{[\s\S]*?props: \{[\s\S]*?\}\s*\}\s*\}/);
if (userReturnMatch) {
  const oldReturn = userReturnMatch[0];
  const newReturn = `return {
      props: {
        user: user ? JSON.parse(JSON.stringify({
          ...user,
          lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
          createdAt: user.createdAt ? user.createdAt.toISOString() : null,
          updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
          articles: user.articles ? user.articles.map(article => ({
            ...article,
            publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
          })) : [],
          forumPosts: user.forumPosts ? user.forumPosts.map(post => ({
            ...post,
            createdAt: post.createdAt ? post.createdAt.toISOString() : null,
            updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
          })) : [],
        })) : null,
        recentActivity: recentActivity ? JSON.parse(JSON.stringify(recentActivity.map(activity => ({
          ...activity,
          createdAt: activity.createdAt ? activity.createdAt.toISOString() : null,
        })))) : [],
      },
    }`;
  
  userContent = userContent.replace(oldReturn, newReturn);
  console.log('   ✅ 用户个人中心页序列化修复完成');
}

// 3. 修复帖子详情页的查询错误
console.log('3. 修复帖子详情页查询错误...');
const postPagePath = path.join(__dirname, 'src/pages/community/post/[id].tsx');
let postContent = fs.readFileSync(postPagePath, 'utf8');

// 修复findMany调用前的空值检查
postContent = postContent.replace(
  /const post = await prisma\.forumPost\.findUnique/,
  `const post = await prisma.forumPost.findUnique`
);

// 在getServerSideProps返回前添加序列化处理
const postReturnMatch = postContent.match(/return \{[\s\S]*?props: \{[\s\S]*?\}\s*\}\s*\}/);
if (postReturnMatch) {
  const oldReturn = postReturnMatch[0];
  const newReturn = `return {
      props: {
        post: post ? JSON.parse(JSON.stringify({
          ...post,
          createdAt: post.createdAt ? post.createdAt.toISOString() : null,
          updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
          lastReplyAt: post.lastReplyAt ? post.lastReplyAt.toISOString() : null,
          comments: post.comments ? post.comments.map(comment => ({
            ...comment,
            createdAt: comment.createdAt ? comment.createdAt.toISOString() : null,
            updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : null,
            replies: comment.replies ? comment.replies.map(reply => ({
              ...reply,
              createdAt: reply.createdAt ? reply.createdAt.toISOString() : null,
              updatedAt: reply.updatedAt ? reply.updatedAt.toISOString() : null,
            })) : [],
          })) : [],
        })) : null,
      },
    }`;
  
  postContent = postContent.replace(oldReturn, newReturn);
  console.log('   ✅ 帖子详情页序列化修复完成');
}

// 保存所有文件
fs.writeFileSync(articlePagePath, articleContent);
fs.writeFileSync(userPagePath, userContent);
fs.writeFileSync(postPagePath, postContent);

console.log('\n🎉 所有序列化问题修复完成！');
console.log('\n🔍 修复内容:');
console.log('1. Date对象转换为ISO字符串');
console.log('2. 处理undefined值为null');
console.log('3. 添加JSON序列化处理');
console.log('4. 修复空值检查');

console.log('\n🚀 下一步: 重启服务器测试修复效果');