const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    },
  },
});

async function createAdminAccount() {
  console.log('🔧 创建后台管理服务器默认管理员账户...\n');
  
  const adminUsername = 'wangminchao';
  const adminPassword = '4219011oave@';
  const adminEmail = 'wangminchao@gamehub.com';
  
  console.log('📋 账户信息:');
  console.log(`   用户名: ${adminUsername}`);
  console.log(`   密码: ${adminPassword}`);
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
        },
      });
      
      console.log('✅ 用户权限已更新为 SUPER_ADMIN');
      console.log(`   用户ID: ${updatedUser.id}`);
      console.log(`   角色: ${updatedUser.role}`);
      console.log(`   等级: ${updatedUser.level}`);
      console.log('');
      
    } else {
      console.log('📝 创建新管理员账户...');
      
      // 哈希密码
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // 创建超级管理员用户
      const newUser = await prisma.user.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          password: hashedPassword,
          displayName: '王敏超 (管理员)',
          bio: 'GameHub 系统管理员',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangminchao',
          role: 'SUPER_ADMIN',
          level: 100,
          experience: 10000,
          points: 10000,
          status: 'ACTIVE',
        },
      });
      
      console.log('✅ 管理员账户创建成功！');
      console.log(`   用户ID: ${newUser.id}`);
      console.log(`   用户名: ${newUser.username}`);
      console.log(`   邮箱: ${newUser.email}`);
      console.log(`   角色: ${newUser.role}`);
      console.log(`   等级: ${newUser.level}`);
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
      },
    });
    
    if (adminUser && adminUser.role === 'SUPER_ADMIN') {
      console.log('✅ 管理员权限验证通过');
      console.log(`   当前角色: ${adminUser.role}`);
      console.log(`   账户状态: ${adminUser.status}`);
      console.log('');
    } else {
      console.log('❌ 管理员权限验证失败');
      console.log(`   当前角色: ${adminUser?.role || '未知'}`);
      console.log('');
    }
    
    // 创建测试文章（如果不存在）
    console.log('📰 创建测试内容...');
    const existingArticle = await prisma.article.findUnique({
      where: { slug: 'admin-welcome-article' },
    });
    
    if (!existingArticle) {
      const testArticle = await prisma.article.create({
        data: {
          title: '欢迎使用 GameHub 后台管理系统',
          slug: 'admin-welcome-article',
          content: '# 欢迎使用 GameHub 后台管理系统\n\n这是管理员专属的欢迎文章，用于测试后台管理功能。\n\n## 功能概述\n\n1. **用户管理** - 管理所有用户账户和权限\n2. **内容管理** - 发布、编辑、审核文章和内容\n3. **社区管理** - 管理论坛帖子和评论\n4. **系统设置** - 配置网站参数和功能\n\n## 管理员职责\n\n作为超级管理员，您拥有系统的最高权限，请妥善保管账户信息。\n\n---\n\n*GameHub 管理团队*',
          excerpt: 'GameHub 后台管理系统使用指南和功能介绍',
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
        },
      });
      
      console.log('✅ 测试文章创建成功');
      console.log(`   文章ID: ${testArticle.id}`);
      console.log(`   标题: ${testArticle.title}`);
      console.log(`   类型: ${testArticle.type}`);
      console.log('');
    } else {
      console.log('✅ 测试文章已存在');
      console.log(`   文章ID: ${existingArticle.id}`);
      console.log(`   标题: ${existingArticle.title}`);
      console.log('');
    }
    
    // 显示管理员登录信息
    console.log('='.repeat(50));
    console.log('🎮 **GameHub 后台管理登录信息**');
    console.log('='.repeat(50));
    console.log('');
    console.log('🔐 **登录凭证**:');
    console.log(`   用户名: ${adminUsername}`);
    console.log(`   密码: ${adminPassword}`);
    console.log(`   邮箱: ${adminEmail}`);
    console.log('');
    console.log('🚀 **登录方式**:');
    console.log('   1. 访问: http://localhost:3000/login');
    console.log('   2. 使用上述凭证登录');
    console.log('   3. 登录后访问: http://localhost:3000/admin');
    console.log('');
    console.log('⚡ **管理员权限**:');
    console.log('   • SUPER_ADMIN: 最高权限，可管理所有功能');
    console.log('   • 用户管理: 查看、编辑、删除用户');
    console.log('   • 内容管理: 发布、审核、管理所有内容');
    console.log('   • 系统设置: 配置网站参数');
    console.log('');
    console.log('🔧 **测试功能**:');
    console.log('   1. 登录后台管理');
    console.log('   2. 查看文章管理页面');
    console.log('   3. 测试用户权限');
    console.log('   4. 验证管理员功能');
    console.log('');
    console.log('⚠️  **安全提醒**:');
    console.log('   • 请立即修改默认密码');
    console.log('   • 不要共享管理员账户');
    console.log('   • 定期检查系统日志');
    console.log('');
    console.log('='.repeat(50));
    console.log('✅ **后台管理服务器默认账户配置完成**');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ 创建管理员账户时出错:');
    console.error(error.message);
    console.error('');
    console.error('💡 建议检查:');
    console.error('   1. 数据库连接是否正常');
    console.error('   2. 数据库表结构是否完整');
    console.error('   3. 环境变量配置是否正确');
    console.error('');
    
    // 尝试使用简化schema创建
    console.log('🔄 尝试使用简化schema创建用户...');
    try {
      // 检查bcrypt是否可用
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(adminPassword, 10);
      } catch (bcryptError) {
        console.log('⚠️  bcrypt不可用，使用明文密码（仅测试环境）');
        hashedPassword = adminPassword;
      }
      
      // 直接使用SQLite插入（如果Prisma失败）
      const simpleUser = {
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        displayName: '王敏超 (管理员)',
        role: 'SUPER_ADMIN',
        level: 100,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log('📝 简化用户数据:');
      console.log(JSON.stringify(simpleUser, null, 2));
      console.log('');
      console.log('⚠️  需要手动插入数据库或检查Prisma配置');
      
    } catch (simpleError) {
      console.error('❌ 简化创建也失败:');
      console.error(simpleError.message);
    }
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 数据库连接已关闭');
  }
}

// 执行创建
createAdminAccount().catch(console.error);