const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { randomUUID } = require('crypto');

console.log('🎮 **GameHub 后台管理服务器默认账户配置**\n');

const dbPath = path.join(__dirname, 'prisma/dev.db');
console.log(`📁 数据库: ${dbPath}`);

// 打开数据库
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`❌ 数据库连接失败: ${err.message}`);
    process.exit(1);
  }
  console.log('✅ 数据库连接成功\n');
});

// 管理员信息
const admin = {
  id: randomUUID(),
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
  emailVerified: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 主函数
async function setupAdmin() {
  try {
    console.log('🔍 检查现有管理员...');
    const existing = await new Promise((resolve) => {
      db.get('SELECT id, username, role FROM User WHERE username = ?', [admin.username], (err, row) => {
        resolve(row);
      });
    });

    if (existing) {
      console.log(`⚠️  用户 ${admin.username} 已存在，更新权限...`);
      
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE User SET 
            role = ?, level = ?, status = ?, updatedAt = ?
           WHERE username = ?`,
          [admin.role, admin.level, admin.status, admin.updatedAt, admin.username],
          function(err) {
            if (err) reject(err);
            else {
              console.log(`✅ 权限更新完成 (影响行数: ${this.changes})`);
              resolve();
            }
          }
        );
      });
      
      admin.id = existing.id;
    } else {
      console.log('📝 创建新管理员账户...');
      
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO User (
            id, username, email, passwordHash, displayName, bio, avatar,
            role, level, experience, points, status, emailVerified, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            admin.id,
            admin.username,
            admin.email,
            admin.password,
            admin.displayName,
            admin.bio,
            admin.avatar,
            admin.role,
            admin.level,
            admin.experience,
            admin.points,
            admin.status,
            admin.emailVerified,
            admin.createdAt,
            admin.updatedAt,
          ],
          function(err) {
            if (err) reject(err);
            else {
              console.log(`✅ 管理员创建成功 (ID: ${admin.id})`);
              resolve();
            }
          }
        );
      });
    }

    // 验证
    console.log('\n🔐 验证管理员权限...');
    const verified = await new Promise((resolve) => {
      db.get(
        'SELECT username, email, role, level, status FROM User WHERE username = ?',
        [admin.username],
        (err, row) => resolve(row)
      );
    });

    if (verified && verified.role === 'SUPER_ADMIN') {
      console.log('✅ 权限验证通过');
      console.log(`   用户名: ${verified.username}`);
      console.log(`   邮箱: ${verified.email}`);
      console.log(`   角色: ${verified.role}`);
      console.log(`   等级: ${verified.level}`);
      console.log(`   状态: ${verified.status}`);
    } else {
      console.log('❌ 权限验证失败');
    }

    // 显示登录信息
    console.log('\n' + '='.repeat(60));
    console.log('🎮 **GameHub 后台管理服务器配置完成**');
    console.log('='.repeat(60));
    console.log('');
    console.log('🔐 **管理员登录凭证**:');
    console.log(`   👤 用户名: ${admin.username}`);
    console.log(`   🔑 密码: ${admin.password}`);
    console.log(`   📧 邮箱: ${admin.email}`);
    console.log(`   👑 角色: ${admin.role} (最高权限)`);
    console.log('');
    console.log('🌐 **访问地址**:');
    console.log('   前台首页: http://localhost:3000/');
    console.log('   登录页面: http://localhost:3000/login');
    console.log('   后台管理: http://localhost:3000/admin');
    console.log('   个人中心: http://localhost:3000/user/ultra-simple/wangminchao');
    console.log('');
    console.log('⚡ **立即测试**:');
    console.log('   1. 确保服务器运行: npm run dev');
    console.log('   2. 访问 http://localhost:3000/login');
    console.log('   3. 使用上述凭证登录');
    console.log('   4. 验证管理员功能');
    console.log('');
    console.log('⚠️  **安全提醒**:');
    console.log('   🔴 此版本使用明文密码，仅用于测试环境！');
    console.log('   🔴 生产环境必须使用密码哈希！');
    console.log('   🔴 立即修改默认密码！');
    console.log('   🔴 不要共享管理员账户！');
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ **配置完成 - 后台管理服务器就绪**');
    console.log('='.repeat(60));

  } catch (error) {
    console.error(`❌ 配置失败: ${error.message}`);
  } finally {
    db.close();
    console.log('\n🔌 数据库连接已关闭');
  }
}

// 执行
setupAdmin();