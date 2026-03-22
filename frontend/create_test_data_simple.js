#!/usr/bin/env node

/**
 * 创建简化版的测试数据
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestData() {
  console.log('📊 创建测试数据...\n');
  
  try {
    // 1. 创建测试用户
    console.log('1. 创建测试用户...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@gamehub.com' },
      update: {},
      create: {
        email: 'admin@gamehub.com',
        username: 'admin',
        displayName: '管理员',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        role: 'ADMIN',
        level: 10,
        experience: 5000,
        points: 10000,
      },
    });
    
    const testUser1 = await prisma.user.upsert({
      where: { email: 'user1@gamehub.com' },
      update: {},
      create: {
        email: 'user1@gamehub.com',
        username: 'player1',
        displayName: '游戏玩家1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
        level: 5,
        experience: 1200,
        points: 2500,
      },
    });
    
    const testUser2 = await prisma.user.upsert({
      where: { email: 'user2@gamehub.com' },
      update: {},
      create: {
        email: 'user2@gamehub.com',
        username: 'gamer2',
        displayName: '硬核玩家',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer2',
        level: 8,
        experience: 3000,
        points: 6000,
      },
    });
    
    console.log(`✅ 创建了3个用户: ${adminUser.username}, ${testUser1.username}, ${testUser2.username}`);
    
    // 2. 创建测试文章
    console.log('\n2. 创建测试文章...');
    const testArticle1 = await prisma.article.upsert({
      where: { slug: 'cyberpunk-2077-2-0-review' },
      update: {},
      create: {
        title: '《赛博朋克2077》2.0版本全面评测',
        slug: 'cyberpunk-2077-2-0-review',
        excerpt: 'CD Projekt Red为《赛博朋克2077》带来了革命性的2.0更新，我们进行了全面评测。',
        content: '## 游戏体验大幅提升\n\n2.0版本彻底重构了游戏系统...',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        type: 'REVIEW',
        authorId: adminUser.id,
        status: 'PUBLISHED',
        featured: true,
        rating: 9.5,
        ratingCount: 1250,
        views: 1250,
        likes: 89,
        shares: 45,
        publishedAt: new Date('2024-03-20T10:00:00Z'),
      },
    });
    
    const testArticle2 = await prisma.article.upsert({
      where: { slug: 'top-10-indie-games-2024' },
      update: {},
      create: {
        title: '2024年最值得期待的10款独立游戏',
        slug: 'top-10-indie-games-2024',
        excerpt: '从像素风到3A级画面，这些独立游戏将在2024年掀起波澜。',
        content: '## 独立游戏的黄金时代\n\n随着开发工具的普及...',
        coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        type: 'NEWS',
        authorId: testUser1.id,
        status: 'PUBLISHED',
        views: 890,
        likes: 45,
        shares: 23,
        publishedAt: new Date('2024-03-19T14:30:00Z'),
      },
    });
    
    console.log(`✅ 创建了2篇文章: "${testArticle1.title}", "${testArticle2.title}"`);
    
    // 3. 创建测试论坛帖子
    console.log('\n3. 创建测试论坛帖子...');
    const testPost1 = await prisma.forumPost.upsert({
      where: { id: 'test-post-1' },
      update: {},
      create: {
        id: 'test-post-1',
        title: '新手求问：如何快速提升游戏等级？',
        content: '刚接触这款游戏，感觉升级好慢，有什么技巧吗？',
        authorId: testUser2.id,
        views: 340,
        likes: 12,
        replies: 8,
      },
    });
    
    const testPost2 = await prisma.forumPost.upsert({
      where: { id: 'test-post-2' },
      update: {},
      create: {
        id: 'test-post-2',
        title: '游戏BUG反馈集中帖',
        content: '大家遇到的BUG可以在这里集中反馈，方便开发者修复。',
        authorId: adminUser.id,
        views: 560,
        likes: 23,
        replies: 15,
        pinned: true,
      },
    });
    
    console.log(`✅ 创建了2个论坛帖子: "${testPost1.title}", "${testPost2.title}"`);
    
    // 4. 创建测试评论
    console.log('\n4. 创建测试评论...');
    const testComment1 = await prisma.comment.create({
      data: {
        content: '这篇评测写得太好了，完全说出了我的心声！',
        authorId: testUser2.id,
        articleId: testArticle1.id,
        likes: 5,
        status: 'APPROVED',
      },
    });
    
    const testComment2 = await prisma.comment.create({
      data: {
        content: '期待这些独立游戏，特别是那款像素风的！',
        authorId: testUser1.id,
        articleId: testArticle2.id,
        likes: 3,
        status: 'APPROVED',
      },
    });
    
    console.log(`✅ 创建了2条评论`);
    
    // 5. 统计结果
    console.log('\n📊 数据统计:');
    const userCount = await prisma.user.count();
    const articleCount = await prisma.article.count();
    const postCount = await prisma.forumPost.count();
    const commentCount = await prisma.comment.count();
    
    console.log(`   用户: ${userCount}`);
    console.log(`   文章: ${articleCount}`);
    console.log(`   论坛帖子: ${postCount}`);
    console.log(`   评论: ${commentCount}`);
    
    console.log('\n🎉 测试数据创建完成！');
    console.log('\n🔗 测试URL:');
    console.log(`   文章详情: http://localhost:3000/news/${testArticle1.slug}`);
    console.log(`   用户个人中心: http://localhost:3000/user/${adminUser.username}`);
    console.log(`   帖子详情: http://localhost:3000/community/post/${testPost1.id}`);
    
  } catch (error) {
    console.error('❌ 创建测试数据失败:', error.message);
    if (error.message.includes('SQLITE_ERROR')) {
      console.log('💡 提示: 可能需要先创建数据库表');
      console.log('   运行: npx prisma db push --schema=./prisma/schema_simple.prisma');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// 运行函数
createTestData();