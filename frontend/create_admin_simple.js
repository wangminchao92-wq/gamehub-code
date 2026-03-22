const { PrismaClient } = require('@prisma/client');

// 创建Prisma客户端实例
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    },
  },
});

async function createAdminAccountSimple() {
  console.log('🔧 创建后台管理服务器默认管理员账户 (简化版)...\n');
  
  const adminUsername = 'wangminchao';
  const adminPassword = '4219011oave@'; // 注意：简化版使用明文密码，仅用于测试环境
  const adminEmail = 'wangminchao@gamehub.com';
  
  console.log('📋 账户信息:');
  console.log(`   用户名: ${adminUsername}`);
  console.log(`   密码: ${adminPassword} (明文，测试环境专用)`);
  console.log(`   邮箱: ${adminEmail}`);
  console.log(`   角色: SUPER_ADMIN`);
  console.log('');
  
  try {
    // 检查数据库连接
    console.log('🔌 检查数据库连接...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ 数据库连接正常\n');
    
    // 检查用户是否已存在
    console.log('🔍 检查用户是否已存在...');
    const existingUser = await prisma.user.findUnique({
      where: { username: adminUsername },
    });
    
    if (existingUser) {
      console.log(`⚠️  用户 ${adminUsername} 已存在，更新为管理员权限...`);
      
      // 更新现有用户为超级管理员
      const updatedUser = await prisma.user.update({
        where: { username: adminUsername },
        data: {
          role: 'SUPER_ADMIN',
          email: adminEmail,
          displayName: '王敏超 (管理员)',
          bio: 'GameHub 系统管理员',
          level: 100,
          experience: 10000,
          points: 10000,
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
      });
      
      console.log('✅ 用户权限已更新为 SUPER_ADMIN');
      console.log(`   用户ID: ${updatedUser.id}`);
      console.log(`   角色: ${updatedUser.role}`);
      console.log(`   等级: ${updatedUser.level}`);
      console.log(`   状态: ${updatedUser.status}`);
      console.log('');
      
    } else {
      console.log('📝 创建新管理员账户...');
      
      // 创建超级管理员用户（简化版，使用明文密码）
      const newUser = await prisma.user.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          password: adminPassword, // 注意：生产环境必须使用哈希密码
          displayName: '王敏超 (管理员)',
          bio: 'GameHub 系统管理员',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangminchao',
          role: 'SUPER_ADMIN',
          level: 100,
          experience: 10000,
          points: 10000,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      console.log('✅ 管理员账户创建成功！');
      console.log(`   用户ID: ${newUser.id}`);
      console.log(`   用户名: ${newUser.username}`);
      console.log(`   邮箱: ${newUser.email}`);
      console.log(`   角色: ${newUser.role}`);
      console.log(`   等级: ${newUser.level}`);
      console.log(`   创建时间: ${newUser.createdAt}`);
      console.log('');
    }
    
    // 验证管理员权限
    console.log('🔐 验证管理员权限...');
    const adminUser = await prisma.user.findUnique({
      where: { username: adminUsername },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        level: true,
        status: true,
        createdAt: true,
      },
    });
    
    if (adminUser && adminUser.role === 'SUPER_ADMIN') {
      console.log('✅ 管理员权限验证通过');
      console.log(`   当前角色: ${adminUser.role}`);
      console.log(`   账户状态: ${adminUser.status}`);
      console.log(`   创建时间: ${adminUser.createdAt}`);
      console.log('');
    } else {
      console.log('❌ 管理员权限验证失败');
      console.log(`   当前角色: ${adminUser?.role || '未知'}`);
      console.log('');
    }
    
    // 创建测试文章（如果不存在）
    console.log('📰 创建管理员测试文章...');
    const existingArticle = await prisma.article.findUnique({
      where: { slug: 'admin-welcome-guide' },
    });
    
    if (!existingArticle) {
      const testArticle = await prisma.article.create({
        data: {
          title: 'GameHub 后台管理系统使用指南',
          slug: 'admin-welcome-guide',
          content: `# 🎮 GameHub 后台管理系统使用指南

欢迎使用 GameHub 后台管理系统！作为系统管理员，您拥有最高权限，可以管理整个平台。

## 📋 管理员账户信息

**用户名**: ${adminUsername}
**角色**: SUPER_ADMIN
**权限级别**: 最高

## 🛠️ 管理功能概述

### 1. 用户管理
- 查看所有注册用户
- 修改用户权限和角色
- 管理用户状态（激活/禁用）
- 重置用户密码

### 2. 内容管理
- 发布、编辑、删除文章
- 审核用户提交的内容
- 管理文章分类和标签
- 设置特色内容和置顶文章

### 3. 社区管理
- 管理论坛帖子和评论
- 处理用户举报
- 维护社区秩序
- 设置社区规则

### 4. 系统设置
- 配置网站基本信息
- 管理功能开关
- 设置邮件通知
- 查看系统日志

## 🔐 安全提醒

1. **密码安全**: 请立即修改默认密码
2. **权限管理**: 不要随意分配管理员权限
3. **操作日志**: 所有管理操作都会被记录
4. **定期检查**: 定期检查系统状态和用户活动

## 🚀 快速开始

1. **登录后台**: http://localhost:3000/admin
2. **查看仪表板**: 了解系统概况
3. **用户管理**: 熟悉用户管理功能
4. **内容审核**: 练习内容管理操作

## 📞 技术支持

如有任何问题，请联系技术团队。

---

*GameHub 管理团队*
*创建时间: ${new Date().toLocaleDateString('zh-CN')}*`,
          excerpt: 'GameHub 后台管理系统完整使用指南，包含管理员权限、功能概述和安全提醒',
          type: 'GUIDE',
          status: 'PUBLISHED',
          featured: true,
          pinned: true,
          rating: 5.0,
          views: 0,
          likes: 0,
          shares: 0,
          author: {
            connect: { username: adminUsername },
          },
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      console.log('✅ 管理员测试文章创建成功');
      console.log(`   文章ID: ${testArticle.id}`);
      console.log(`   标题: ${testArticle.title}`);
      console.log(`   类型: ${testArticle.type}`);
      console.log(`   状态: ${testArticle.status}`);
      console.log(`   发布时间: ${testArticle.publishedAt}`);
      console.log('');
    } else {
      console.log('✅ 测试文章已存在');
      console.log(`   文章ID: ${existingArticle.id}`);
      console.log(`   标题: ${existingArticle.title}`);
      console.log(`   状态: ${existingArticle.status}`);
      console.log('');
    }
    
    // 创建管理员专属帖子
    console.log('💬 创建管理员社区帖子...');
    const existingPost = await prisma.post.findUnique({
      where: { slug: 'admin-community-welcome' },
    });
    
    if (!existingPost) {
      const adminPost = await prisma.post.create({
        data: {
          title: '👋 欢迎来到 GameHub 社区 - 管理员公告',
          slug: 'admin-community-welcome',
          content: '大家好！我是 GameHub 的系统管理员。欢迎加入我们的游戏社区！\n\n这是一个由游戏爱好者创建的社区，我们致力于打造最好的游戏资讯和讨论平台。\n\n作为管理员，我会：\n1. 维护社区秩序和环境\n2. 及时处理用户反馈\n3. 持续优化平台功能\n4. 为大家提供最好的服务\n\n如果有任何问题或建议，欢迎随时联系！\n\n祝大家在 GameHub 玩得开心！🎮',
          excerpt: 'GameHub 社区管理员欢迎公告和社区规则说明',
          author: {
            connect: { username: adminUsername },
          },
          views: 0,
          likes: 0,
          commentsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      console.log('✅ 管理员社区帖子创建成功');
      console.log(`   帖子ID: ${adminPost.id}`);
      console.log(`   标题: ${adminPost.title}`);
      console.log(`   创建时间: ${adminPost.createdAt}`);
      console.log('');
    }
    
    // 显示完整的登录信息
    console.log('='.repeat(60));
    console.log('🎮 **GameHub 后台管理服务器配置完成**');
    console.log('='.repeat(60));
    console.log('');
    console.log('🔐 **管理员登录凭证**:');
    console.log(`   👤 用户名: ${adminUsername}`);
    console.log(`   🔑 密码: ${adminPassword}`);
    console.log(`   📧 邮箱: ${adminEmail}`);
    console.log(`   👑 角色: SUPER_ADMIN (最高权限)`);
    console.log('');
    console.log('🌐 **访问地址**:');
    console.log('   前台首页: http://localhost:3000/');
    console.log('   登录页面: http://localhost:3000/login');
    console.log('   后台管理: http://localhost:3000/admin');
    console.log('   个人中心: http://localhost:3000/user/ultra-simple/wangminchao');
    console.log('');
    console.log('📊 **管理员专属内容**:');
    console.log('   1. 欢迎文章: /news/ultra-simple/admin-welcome-guide');
    console.log('   2. 社区帖子: /community/post/ultra-simple/admin-community-welcome');
    console.log('   3. 个人中心: 完整的管理员信息展示');
    console.log('');
    console.log('⚡ **立即测试**:');
    console.log('   1. 打开浏览器访问 http://localhost:3000/login');
    console.log('   2. 使用上述凭证登录');
    console.log('   3. 检查管理员权限和功能');
    console.log('   4. 访问后台管理页面');
    console.log('');
    console.log('⚠️  **重要安全提醒**:');
    console.log('   🔴 生产环境必须使用哈希密码！');
    console.log('   🔴 立即修改默认密码！');
    console.log('   🔴 不要共享管理员账户！');
    console.log('   🔴 定期检查系统日志！');
    console.log('');
    console.log('🛡️  **生产环境建议**:');
    console.log('   1. 安装 bcryptjs: npm install bcryptjs');
    console.log('   2. 修改密码哈希逻辑');
    console.log('   3. 配置环境变量加密');
    console.log('   4. 启用双因素认证');
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ **后台管理服务器默认账户配置完成**');
    console.log('='.repeat(60));
    console.log('');
    console.log('🚀 **GameHub 后台管理服务器现已就绪！**');
    console.log('');
    
  } catch (error) {
    console.error('❌ 创建管理员账户时出错:');
    console.error(`   错误信息: ${error.message}`);
    console.error('');
    
    // 显示详细的错误信息
    if (error.code === 'P1001') {
      console.error('💡 数据库连接失败，请检查:');
      console.error('   1. 数据库服务是否运行');
      console.error('   2. DATABASE_URL 环境变量配置');
      console.error('   3. 数据库文件权限');
    } else if (error.code === 'P2025') {
      console.error('💡 记录未找到，请检查数据库表结构');
    } else {
      console.error('💡 未知错误，建议检查:');
      console.error('   1. Prisma schema 配置');
      console.error('   2. 数据库迁移状态');
      console.error('   3. 环境变量设置');
    }
    
    console.error('');
    console.error('🔄 尝试手动创建SQL:');
    console.error(`
      INSERT INTO User (username, email, password, displayName, role, level, status, createdAt, updatedAt)
      VALUES (
        '${adminUsername}',
        '${adminEmail}',
        '${adminPassword}',
        '王敏超 (管理员)',
        'SUPER_ADMIN',
        100,
        'ACTIVE',
        datetime('now'),
        datetime('now')
      );
    `);
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 数据库连接已关闭');
  }
}

// 执行创建
createAdminAccountSimple().catch(console.error);