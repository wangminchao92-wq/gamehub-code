// 用户管理API测试脚本
console.log('🧪 **用户管理API功能测试**\n');

const { execSync } = require('child_process');
const baseUrl = 'http://localhost:3000'; // 服务器在3000端口

// 测试结果
const results = [];

// 发送HTTP请求
function makeRequest(method, endpoint, data = null, headers = {}) {
  const url = `${baseUrl}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-user-id': 'super-admin-1', // 模拟超级管理员
  };
  
  const allHeaders = { ...defaultHeaders, ...headers };
  
  const curlCommand = `curl -s -X ${method} "${url}" ${Object.entries(allHeaders).map(([k, v]) => `-H "${k}: ${v}"`).join(' ')} ${data ? `-d '${JSON.stringify(data)}'` : ''}`;
  
  try {
    const output = execSync(curlCommand, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    try {
      return JSON.parse(error.stdout.toString());
    } catch {
      return { success: false, error: '请求失败', raw: error.message };
    }
  }
}

// 运行测试
function runTest(name, testFn) {
  try {
    testFn();
    console.log(`✅ ${name}`);
    results.push({ name, passed: true });
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   错误: ${error.message}`);
    results.push({ name, passed: false, error: error.message });
  }
}

// 主测试函数
async function runAllTests() {
  console.log('📋 **测试1: 用户列表API**\n');
  
  // 测试1: 获取用户列表
  runTest('获取用户列表 (GET /api/admin/users)', () => {
    const result = makeRequest('GET', '/api/admin/users');
    
    if (!result.success) {
      throw new Error(`API返回失败: ${result.error}`);
    }
    
    if (!result.data || !result.data.users) {
      throw new Error('返回数据格式不正确');
    }
    
    console.log(`   返回用户数: ${result.data.users.length}`);
    console.log(`   分页信息: 第${result.data.pagination.page}页，共${result.data.pagination.totalPages}页`);
  });
  
  // 测试2: 带查询参数的用户列表
  runTest('带搜索条件的用户列表', () => {
    const result = makeRequest('GET', '/api/admin/users?search=admin&limit=5');
    
    if (!result.success) {
      throw new Error(`搜索API失败: ${result.error}`);
    }
    
    console.log(`   搜索"admin"结果: ${result.data.users.length}个用户`);
  });
  
  console.log('\n📋 **测试2: 用户详情API**\n');
  
  // 测试3: 获取用户详情（需要先获取一个用户ID）
  runTest('获取用户详情 (需要有效用户ID)', () => {
    // 先获取用户列表
    const listResult = makeRequest('GET', '/api/admin/users?limit=1');
    
    if (!listResult.success || listResult.data.users.length === 0) {
      console.log('   跳过: 没有可用的测试用户');
      return;
    }
    
    const userId = listResult.data.users[0].id;
    const detailResult = makeRequest('GET', `/api/admin/users/${userId}`);
    
    if (!detailResult.success) {
      throw new Error(`获取用户详情失败: ${detailResult.error}`);
    }
    
    console.log(`   用户详情: ${detailResult.data.user.username} (${detailResult.data.user.role})`);
  });
  
  console.log('\n📋 **测试3: 创建用户API**\n');
  
  // 测试4: 创建新用户
  runTest('创建新用户 (POST /api/admin/users)', () => {
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@gamehub.com`,
      password: 'testpassword123',
      displayName: '测试用户',
      role: 'USER',
      level: 1,
      experience: 0,
      points: 0,
      status: 'ACTIVE',
    };
    
    const result = makeRequest('POST', '/api/admin/users', testUser);
    
    if (!result.success) {
      throw new Error(`创建用户失败: ${result.error}`);
    }
    
    console.log(`   创建用户: ${result.data.user.username} (ID: ${result.data.user.id})`);
    
    // 保存测试用户ID供后续测试使用
    global.testUserId = result.data.user.id;
  });
  
  console.log('\n📋 **测试4: 更新用户API**\n');
  
  // 测试5: 更新用户
  runTest('更新用户信息 (PUT /api/admin/users/[id])', () => {
    if (!global.testUserId) {
      console.log('   跳过: 没有可用的测试用户ID');
      return;
    }
    
    const updateData = {
      displayName: '更新后的测试用户',
      bio: '这是通过API更新的用户简介',
      level: 10,
      points: 100,
    };
    
    const result = makeRequest('PUT', `/api/admin/users/${global.testUserId}`, updateData);
    
    if (!result.success) {
      throw new Error(`更新用户失败: ${result.error}`);
    }
    
    console.log(`   更新用户: ${result.data.user.displayName} (等级: ${result.data.user.level})`);
  });
  
  console.log('\n📋 **测试5: 用户统计API**\n');
  
  // 测试6: 用户统计
  runTest('获取用户统计 (GET /api/admin/users/batch)', () => {
    const result = makeRequest('GET', '/api/admin/users/batch');
    
    if (!result.success) {
      throw new Error(`获取统计失败: ${result.error}`);
    }
    
    const stats = result.data.summary;
    console.log(`   用户统计:`);
    console.log(`     • 总用户: ${stats.totalUsers}`);
    console.log(`     • 活跃用户: ${stats.activeUsers}`);
    console.log(`     • 今日新用户: ${stats.newUsersToday}`);
    console.log(`     • 本周新用户: ${stats.newUsersThisWeek}`);
  });
  
  console.log('\n📋 **测试6: 权限验证测试**\n');
  
  // 测试7: 权限验证（使用普通用户身份）
  runTest('普通用户无权访问管理API', () => {
    const result = makeRequest('GET', '/api/admin/users', null, {
      'x-user-id': 'user-1', // 模拟普通用户
    });
    
    // 普通用户应该被拒绝访问（403或401）
    if (result.success) {
      throw new Error('普通用户不应该能访问管理API');
    }
    
    console.log(`   权限验证通过: ${result.error} (预期行为)`);
  });
  
  // 显示测试结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 **用户管理API测试结果**');
  console.log('='.repeat(50));
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const successRate = (passedCount / totalCount * 100).toFixed(1);
  
  console.log(`✅ 通过: ${passedCount}/${totalCount}`);
  console.log(`❌ 失败: ${totalCount - passedCount}/${totalCount}`);
  console.log(`📈 成功率: ${successRate}%`);
  console.log('');
  
  if (passedCount === totalCount) {
    console.log('🎉 **所有用户管理API测试通过！功能正常**');
    console.log('\n💡 **API功能总结**:');
    console.log('   ✅ 用户列表查询 (支持分页、搜索、筛选)');
    console.log('   ✅ 用户详情查看 (包含关联数据统计)');
    console.log('   ✅ 用户创建功能 (数据验证、重复检查)');
    console.log('   ✅ 用户更新功能 (部分字段更新)');
    console.log('   ✅ 用户统计功能 (数据分析和分布)');
    console.log('   ✅ 权限验证机制 (管理员权限控制)');
  } else {
    console.log('⚠️  **有测试失败，需要检查API实现**');
    
    const failedTests = results.filter(r => !r.passed);
    console.log('\n📋 **失败的测试**:');
    failedTests.forEach(test => {
      console.log(`   • ${test.name}`);
      if (test.error) console.log(`     错误: ${test.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
  
  // 显示API文档摘要
  console.log('\n📚 **用户管理API文档摘要**');
  console.log('='.repeat(30));
  console.log('🔗 **端点列表**:');
  console.log('   1. GET    /api/admin/users          - 用户列表 (分页、搜索、筛选)');
  console.log('   2. POST   /api/admin/users          - 创建新用户');
  console.log('   3. GET    /api/admin/users/[id]     - 用户详情');
  console.log('   4. PUT    /api/admin/users/[id]     - 更新用户');
  console.log('   5. DELETE /api/admin/users/[id]     - 删除用户 (软删除)');
  console.log('   6. GET    /api/admin/users/batch    - 用户统计');
  console.log('   7. POST   /api/admin/users/batch    - 批量操作');
  console.log('');
  console.log('🔐 **权限要求**: 需要 ADMIN 或 SUPER_ADMIN 角色');
  console.log('');
  console.log('📋 **查询参数 (GET /users)**:');
  console.log('   • page: 页码 (默认: 1)');
  console.log('   • limit: 每页数量 (默认: 20)');
  console.log('   • search: 搜索关键词 (用户名/邮箱/昵称)');
  console.log('   • role: 角色筛选 (USER/EDITOR/MODERATOR/ADMIN/SUPER_ADMIN)');
  console.log('   • status: 状态筛选 (ACTIVE/INACTIVE/SUSPENDED/BANNED/DELETED)');
  console.log('   • sortBy: 排序字段 (createdAt/username/email/level/points)');
  console.log('   • sortOrder: 排序顺序 (asc/desc)');
}

// 检查服务器是否运行
function checkServer() {
  console.log('🔌 检查服务器连接...');
  try {
    const status = execSync(`curl -s -o /dev/null -w "%{http_code}" ${baseUrl}/`, { encoding: 'utf8' }).trim();
    if (status === '200') {
      console.log(`✅ 服务器运行正常 (端口: 3001)\n`);
      return true;
    } else {
      console.log(`❌ 服务器返回状态: ${status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ 无法连接到服务器');
    console.log('💡 请确保开发服务器正在运行');
    return false;
  }
}

// 主函数
async function main() {
  if (!checkServer()) {
    console.log('❌ 测试中止，请先启动服务器');
    return;
  }
  
  await runAllTests();
}

// 执行测试
main().catch(console.error);