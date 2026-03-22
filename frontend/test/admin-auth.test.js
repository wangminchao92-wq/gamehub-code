// 权限中间件单元测试
console.log('🧪 **权限中间件单元测试**\n');

// 模拟测试数据
const mockUsers = {
  superAdmin: {
    id: 'super-admin-1',
    username: 'superadmin',
    email: 'superadmin@gamehub.com',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    emailVerified: true,
  },
  admin: {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@gamehub.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    emailVerified: true,
  },
  moderator: {
    id: 'moderator-1',
    username: 'moderator',
    email: 'moderator@gamehub.com',
    role: 'MODERATOR',
    status: 'ACTIVE',
    emailVerified: true,
  },
  editor: {
    id: 'editor-1',
    username: 'editor',
    email: 'editor@gamehub.com',
    role: 'EDITOR',
    status: 'ACTIVE',
    emailVerified: true,
  },
  user: {
    id: 'user-1',
    username: 'user',
    email: 'user@gamehub.com',
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: true,
  },
  inactiveAdmin: {
    id: 'inactive-admin-1',
    username: 'inactiveadmin',
    email: 'inactiveadmin@gamehub.com',
    role: 'ADMIN',
    status: 'SUSPENDED',
    emailVerified: true,
  },
  unverifiedAdmin: {
    id: 'unverified-admin-1',
    username: 'unverifiedadmin',
    email: 'unverifiedadmin@gamehub.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    emailVerified: false,
  },
};

// 模拟请求对象
function createMockRequest(user = null) {
  return {
    headers: user ? { 'x-user-id': user.id } : {},
    cookies: user ? { user_id: user.id } : {},
  };
}

// 模拟Prisma客户端
const mockPrisma = {
  user: {
    findUnique: async ({ where }) => {
      const userId = where.id;
      return Object.values(mockUsers).find(user => user.id === userId) || null;
    },
  },
};

// 替换实际的prisma导入
require.cache[require.resolve('@/lib/prisma')] = {
  exports: { prisma: mockPrisma },
};

// 导入权限中间件（使用动态导入避免缓存问题）
const { 
  hasPermission, 
  getUserPermissions,
  checkPermissions 
} = require('../src/middleware/admin-auth');

// 测试结果统计
let passed = 0;
let failed = 0;

function runTest(name, testFn) {
  try {
    testFn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   错误: ${error.message}`);
    failed++;
  }
}

console.log('📋 **测试1: 权限检查函数**\n');

// 测试1: hasPermission 函数
runTest('SUPER_ADMIN 有 ADMIN 权限', () => {
  const result = hasPermission(mockUsers.superAdmin, 'ADMIN');
  if (!result) throw new Error('SUPER_ADMIN 应该有 ADMIN 权限');
});

runTest('ADMIN 有 MODERATOR 权限', () => {
  const result = hasPermission(mockUsers.admin, 'MODERATOR');
  if (!result) throw new Error('ADMIN 应该有 MODERATOR 权限');
});

runTest('MODERATOR 没有 ADMIN 权限', () => {
  const result = hasPermission(mockUsers.moderator, 'ADMIN');
  if (result) throw new Error('MODERATOR 不应该有 ADMIN 权限');
});

runTest('USER 没有 EDITOR 权限', () => {
  const result = hasPermission(mockUsers.user, 'EDITOR');
  if (result) throw new Error('USER 不应该有 EDITOR 权限');
});

runTest('空用户没有权限', () => {
  const result = hasPermission(null, 'USER');
  if (result) throw new Error('空用户不应该有任何权限');
});

console.log('\n📋 **测试2: 权限列表函数**\n');

// 测试2: getUserPermissions 函数
runTest('SUPER_ADMIN 有完整权限', () => {
  const permissions = getUserPermissions(mockUsers.superAdmin);
  const expectedPermissions = ['view_profile', 'edit_profile', 'create_content', 'edit_any_content', 'moderate_comments', 'manage_users', 'system_settings', 'manage_admins', 'system_maintenance'];
  
  expectedPermissions.forEach(perm => {
    if (!permissions.includes(perm)) {
      throw new Error(`SUPER_ADMIN 缺少权限: ${perm}`);
    }
  });
});

runTest('USER 只有基础权限', () => {
  const permissions = getUserPermissions(mockUsers.user);
  const expectedPermissions = ['view_profile', 'edit_profile'];
  const unexpectedPermissions = ['manage_users', 'system_settings'];
  
  expectedPermissions.forEach(perm => {
    if (!permissions.includes(perm)) {
      throw new Error(`USER 缺少基础权限: ${perm}`);
    }
  });
  
  unexpectedPermissions.forEach(perm => {
    if (permissions.includes(perm)) {
      throw new Error(`USER 不应该有权限: ${perm}`);
    }
  });
});

console.log('\n📋 **测试3: 权限检查集成**\n');

// 测试3: checkPermissions 函数（异步）
async function runAsyncTest(name, testFn) {
  try {
    await testFn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   错误: ${error.message}`);
    failed++;
  }
}

// 运行异步测试
(async () => {
  console.log('🔐 测试权限检查...\n');
  
  await runAsyncTest('SUPER_ADMIN 通过超级管理员检查', async () => {
    const req = createMockRequest(mockUsers.superAdmin);
    const result = await checkPermissions(req, {
      allowedRoles: ['SUPER_ADMIN'],
      requireEmailVerified: true,
      requireActiveStatus: true,
    });
    
    if (!result.success) {
      throw new Error('SUPER_ADMIN 应该通过检查');
    }
  });
  
  await runAsyncTest('ADMIN 通过管理员检查', async () => {
    const req = createMockRequest(mockUsers.admin);
    const result = await checkPermissions(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
      requireEmailVerified: true,
      requireActiveStatus: true,
    });
    
    if (!result.success) {
      throw new Error('ADMIN 应该通过检查');
    }
  });
  
  await runAsyncTest('USER 无法通过管理员检查', async () => {
    const req = createMockRequest(mockUsers.user);
    const result = await checkPermissions(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
      requireEmailVerified: true,
      requireActiveStatus: true,
    });
    
    if (result.success) {
      throw new Error('USER 不应该通过管理员检查');
    }
  });
  
  await runAsyncTest('未验证邮箱的管理员被拒绝', async () => {
    const req = createMockRequest(mockUsers.unverifiedAdmin);
    const result = await checkPermissions(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
      requireEmailVerified: true,
      requireActiveStatus: true,
    });
    
    if (result.success) {
      throw new Error('未验证邮箱的管理员应该被拒绝');
    }
  });
  
  await runAsyncTest('非活跃管理员被拒绝', async () => {
    const req = createMockRequest(mockUsers.inactiveAdmin);
    const result = await checkPermissions(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
      requireEmailVerified: true,
      requireActiveStatus: false, // 不要求活跃状态
    });
    
    if (result.success) {
      throw new Error('非活跃管理员应该被拒绝');
    }
  });
  
  await runAsyncTest('未登录用户被拒绝', async () => {
    const req = createMockRequest(); // 无用户
    const result = await checkPermissions(req, {
      allowedRoles: ['USER'],
      requireEmailVerified: false,
      requireActiveStatus: false,
    });
    
    if (result.success) {
      throw new Error('未登录用户应该被拒绝');
    }
  });
  
  // 显示测试结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 **权限中间件单元测试结果**');
  console.log('='.repeat(50));
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📈 成功率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('');
  
  if (failed === 0) {
    console.log('🎉 **所有测试通过！权限中间件功能正常**');
  } else {
    console.log('⚠️  **有测试失败，需要检查权限中间件实现**');
  }
  
  console.log('\n' + '='.repeat(50));
  
})();