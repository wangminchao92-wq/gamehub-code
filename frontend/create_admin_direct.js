const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔧 直接创建后台管理服务器默认管理员账户...\n');

const dbPath = path.join(__dirname, 'prisma/dev.db');
console.log(`📁 数据库路径: ${dbPath}`);

// 检查数据库文件是否存在
const fs = require('fs');
if (!fs.existsSync(dbPath)) {
  console.error(`❌ 数据库文件不存在: ${dbPath}`);
  console.error('💡 请先运行数据库初始化脚本');
  process.exit(1);
}

// 打开数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`❌ 无法打开数据库: ${err.message}`);
    process.exit(1);
  }
  console.log('✅ 数据库连接成功\n');
});

// 管理员账户信息
const adminInfo = {
  username: 'wangminchao',
  password: '4219011oave@',
  email: 'wangminchao@gamehub.com',
  displayName: '王敏超 (管理员)',
  bio: 'GameHub 系统管理员',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangminchao',
  role: 'SUPER_ADMIN',
  level: 100,
  experience: 10000,
  points: 10000,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 检查用户表结构
function checkTableStructure() {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(User)`, (err, rows) => {
      if (err) {
        console.error(`❌ 无法获取表结构: ${err.message}`);
        reject(err);
        return;
      }
      
      console.log('📊 用户表结构:');
      rows.forEach(row => {
        console.log(`   ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : ''} ${row.pk ? 'PRIMARY KEY' : ''}`);
      });
      console.log('');
      resolve(rows);
    });
  });
}

// 检查用户是否已存在
function checkUserExists(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id, username, role FROM User WHERE username = ?`, [username], (err, row) => {
      if (err) {
        console.error(`❌ 查询用户失败: ${err.message}`);
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

// 创建或更新管理员用户
function createOrUpdateAdmin() {
  return new Promise((resolve, reject) => {
    // 先检查用户是否存在
    checkUserExists(adminInfo.username).then(existingUser => {
      if (existingUser) {
        console.log(`⚠️  用户 ${adminInfo.username} 已存在，更新为管理员权限...`);
        
        // 更新现有用户
        const updateSql = `
          UPDATE User SET 
            email = ?, 
            passwordHash = ?, 
            displayName = ?, 
            bio = ?, 
            avatar = ?, 
            role = ?, 
            level = ?, 
            experience = ?, 
            points = ?, 
            status = ?, 
            updatedAt = ?
          WHERE username = ?
        `;
        
        const updateParams = [
          adminInfo.email,
          adminInfo.password,
          adminInfo.displayName,
          adminInfo.bio,
          adminInfo.avatar,
          adminInfo.role,
          adminInfo.level,
          adminInfo.experience,
          adminInfo.points,
          adminInfo.status,
          adminInfo.updatedAt,
          adminInfo.username,
        ];
        
        db.run(updateSql, updateParams, function(err) {
          if (err) {
            console.error(`❌ 更新用户失败: ${err.message}`);
            reject(err);
            return;
          }
          
          console.log('✅ 用户权限已更新为 SUPER_ADMIN');
          console.log(`   受影响行数: ${this.changes}`);
          resolve({ action: 'updated', id: existingUser.id });
        });
        
      } else {
        console.log('📝 创建新管理员账户...');
        
        // 创建新用户
        const insertSql = `
          INSERT INTO User (
            id, username, email, passwordHash, displayName, bio, avatar, 
            role, level, experience, points, status, emailVerified, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // 生成UUID
        const { randomUUID } = require('crypto');
        const userId = randomUUID();
        
        const insertParams = [
          userId,
          adminInfo.username,
          adminInfo.email,
          adminInfo.password,
          adminInfo.displayName,
          adminInfo.bio,
          adminInfo.avatar,
          adminInfo.role,
          adminInfo.level,
          adminInfo.experience,
          adminInfo.points,
          adminInfo.status,
          1, // emailVerified
          adminInfo.createdAt,
          adminInfo.updatedAt,
        ];
        
        db.run(insertSql, insertParams, function(err) {
          if (err) {
            console.error(`❌ 创建用户失败: ${err.message}`);
            reject(err);
            return;
          }
          
          console.log('✅ 管理员账户创建成功！');
          console.log(`   用户ID: ${this.lastID}`);
          resolve({ action: 'created', id: this.lastID });
        });
      }
    }).catch(reject);
  });
}

// 验证管理员权限
function verifyAdminPermission() {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, username, email, role, level, status, createdAt FROM User WHERE username = ?`,
      [adminInfo.username],
      (err, row) => {
        if (err) {
          console.error(`❌ 验证权限失败: ${err.message}`);
          reject(err);
          return;
        }
        
        if (row && row.role === 'SUPER_ADMIN') {
          console.log('✅ 管理员权限验证通过');
          console.log(`   用户ID: ${row.id}`);
          console.log(`   用户名: ${row.username}`);
          console.log(`   邮箱: ${row.email}`);
          console.log(`   角色: ${row.role}`);
          console.log(`   等级: ${row.level}`);
          console.log(`   状态: ${row.status}`);
          console.log(`   创建时间: ${row.createdAt}`);
          console.log('');
          resolve(row);
        } else {
          console.log('❌ 管理员权限验证失败');
          console.log(`   当前角色: ${row?.role || '未知'}`);
          reject(new Error('权限验证失败'));
        }
      }
    );
  });
}

// 创建测试文章
function createTestArticle(userId) {
  return new Promise((resolve, reject) => {
    const articleSlug = 'admin-welcome-guide';
    
    // 先检查文章是否存在
    db.get(`SELECT id FROM Article WHERE slug = ?`, [articleSlug], (err, existingArticle) => {
      if (err) {
        console.error(`❌ 检查文章失败: ${err.message}`);
        reject(err);
        return;
      }
      
      if (existingArticle) {
        console.log('✅ 测试文章已存在');
        console.log(`   文章ID: ${existingArticle.id}`);
        resolve(existingArticle);
        return;
      }
      
      console.log('📰 创建管理员测试文章...');
      
      const articleData = {
        title: 'GameHub 后台管理系统使用指南',
        slug: articleSlug,
        content: `# 🎮 GameHub 后台管理系统使用指南

欢迎使用 GameHub 后台管理系统！作为系统管理员，您拥有最高权限。

## 管理员账户信息
**用户名**: ${adminInfo.username}
**角色**: ${adminInfo.role}

## 管理功能
1. 用户管理
2. 内容管理  
3. 社区管理
4. 系统设置

## 安全提醒
- 立即修改默认密码
- 不要共享管理员账户
- 定期检查系统日志

*GameHub 管理团队*`,
        excerpt: 'GameHub 后台管理系统完整使用指南',
        type: 'GUIDE',
        status: 'PUBLISHED',
        featured: 1,
        pinned: 1,
        rating: 5.0,
        views: 0,
        likes: 0,
        shares: 0,
        authorId: userId,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const insertSql = `
        INSERT INTO Article (
          title, slug, content, excerpt, type, status, featured, pinned,
          rating, views, likes, shares, authorId, publishedAt, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const insertParams = [
        articleData.title,
        articleData.slug,
        articleData.content,
        articleData.excerpt,
        articleData.type,
        articleData.status,
        articleData.featured,
        articleData.pinned,
        articleData.rating,
        articleData.views,
        articleData.likes,
        articleData.shares,
        articleData.authorId,
        articleData.publishedAt,
        articleData.createdAt,
        articleData.updatedAt,
      ];
      
      db.run(insertSql, insertParams, function(err) {
        if (err) {
          console.error(`❌ 创建文章失败: ${err.message}`);
          reject(err);
          return;
        }
        
        console.log('✅ 管理员测试文章创建成功');
        console.log(`   文章ID: ${this.lastID}`);
        console.log(`   标题: ${articleData.title}`);
        console.log(`   类型: ${articleData.type}`);
        console.log(`   状态: ${articleData.status}`);
        console.log('');
        resolve({ id: this.lastID, ...articleData });
      });
    });
  });
}

// 主执行函数
async function main() {
  try {
    // 检查表结构
    await checkTableStructure();
    
    // 创建或更新管理员
    const result = await createOrUpdateAdmin();
    
    // 验证权限
    const adminUser = await verifyAdminPermission();
    
    // 创建测试文章
    await createTestArticle(adminUser.id);
    
    // 显示完成信息
    console.log('='.repeat(60));
    console.log('🎮 **GameHub 后台管理服务器配置完成**');
    console.log('='.repeat(60));
    console.log('');
    console.log('🔐 **管理员登录凭证**:');
    console.log(`   👤 用户名: ${adminInfo.username}`);
    console.log(`   🔑 密码: ${adminInfo.password}`);
    console.log(`   📧 邮箱: ${adminInfo.email}`);
    console.log(`   👑 角色: ${adminInfo.role}`);
    console.log('');
    console.log('🌐 **访问地址**:');
    console.log('   前台首页: http://localhost:3000/');
    console.log('   登录页面: http://localhost:3000/login');
    console.log('   后台管理: http://localhost:3000/admin');
    console.log('   个人中心: http://localhost:3000/user/ultra-simple/wangminchao');
    console.log('');
    console.log('📊 **测试内容**:');
    console.log('   欢迎文章: /news/ultra-simple/admin-welcome-guide');
    console.log('');
    console.log('⚡ **立即测试**:');
    console.log('   1. 确保开发服务器运行: npm run dev');
    console.log('   2. 访问 http://localhost:3000/login');
    console.log('   3. 使用管理员凭证登录');
    console.log('   4. 验证管理员功能');
    console.log('');
    console.log('⚠️  **安全提醒**:');
    console.log('   🔴 此版本使用明文密码，仅用于测试环境！');
    console.log('   🔴 生产环境必须使用密码哈希！');
    console.log('   🔴 立即修改默认密码！');
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ **后台管理服务器默认账户配置完成**');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error(`❌ 配置过程出错: ${error.message}`);
  } finally {
    // 关闭数据库连接
    db.close((err) => {
      if (err) {
        console.error(`❌ 关闭数据库失败: ${err.message}`);
      } else {
        console.log('\n🔌 数据库连接已关闭');
      }
    });
  }
}

// 执行
main();