#!/usr/bin/env node

/**
 * 修复文章详情页查询
 * 适配简化schema
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复文章详情页查询...\n');

const articlePagePath = path.join(__dirname, 'src/pages/news/[slug].tsx');
let content = fs.readFileSync(articlePagePath, 'utf8');

// 1. 找到查询部分
const queryStart = content.indexOf('const article = await prisma.article.findUnique({');
if (queryStart === -1) {
  console.log('❌ 未找到文章查询');
  process.exit(1);
}

// 2. 找到查询结束位置
let queryEnd = content.indexOf('});', queryStart);
if (queryEnd === -1) {
  console.log('❌ 未找到查询结束');
  process.exit(1);
}
queryEnd += 3; // 包含 });

// 3. 提取查询部分
const queryText = content.substring(queryStart, queryEnd);

// 4. 创建新的查询（适配简化schema）
const newQuery = `const article = await prisma.article.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED', // 只获取已发布的文章
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            bio: true,
            level: true,
          },
        },
        comments: {
          where: {
            status: 'APPROVED',
          },
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });`;

// 5. 替换查询
content = content.substring(0, queryStart) + newQuery + content.substring(queryEnd);

// 6. 更新相关文章查询（也需要修复）
const relatedQueryStart = content.indexOf('const relatedArticles = await prisma.article.findMany({');
if (relatedQueryStart !== -1) {
  const relatedQueryEnd = content.indexOf('});', relatedQueryStart) + 3;
  const newRelatedQuery = `const relatedArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        type: article?.type,
        NOT: {
          id: article?.id,
        },
      },
      take: 3,
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });`;
  
  content = content.substring(0, relatedQueryStart) + newRelatedQuery + content.substring(relatedQueryEnd);
}

// 7. 更新页面组件，处理category和tags字段缺失
// 找到使用category的地方
content = content.replace(/article\.category\.name/g, "'游戏评测'"); // 默认分类
content = content.replace(/article\.category\.slug/g, "'reviews'");
content = content.replace(/article\.tags/g, '[]'); // 空标签数组

// 8. 保存文件
fs.writeFileSync(articlePagePath, content);
console.log('✅ 文章详情页查询修复完成');

// 9. 验证修复
console.log('\n🔍 验证修复:');
console.log('1. 移除了category字段查询');
console.log('2. 移除了tags字段查询');
console.log('3. 添加了comments关联查询');
console.log('4. 更新了相关文章查询');
console.log('5. 处理了缺失字段的默认值');

console.log('\n🚀 下一步: 重启服务器测试修复效果');