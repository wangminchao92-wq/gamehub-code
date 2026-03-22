// 用户管理API测试脚本（使用真实管理员账户）
console.log('🧪 **用户管理API功能测试（真实账户）**\n');

const { execSync } = require('child_process');
const baseUrl = 'http://localhost:3000';

// 获取真实的管理员用户ID
function getAdminUserId() {
  try {
    const output = execSync(
      `sqlite3 prisma/dev.db "SELECT id FROM User WHERE username='wangminchao' LIMIT 1;"`,
      { encoding: 'utf8' }
    ).trim();
    
    if (output) {
      console.log(`🔐 使用管理员账户: wangminchao (ID: ${output})`);
      return output;
    }
  } catch (error) {
    console.log('⚠️  无法获取管理员ID，使用模拟ID');
  }
  
  // 回退到模拟ID
  return 'd191fcda-81e1-4a07-bbf2-bd0d469844e2';
}

const adminUserId = getAdminUserId();

// 测试结果
const results = [];

// 发送HTTP请求
function makeRequest(method, endpoint, data = null, customHeaders = {}) {
  const url = `${baseUrl}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-user-id': adminUserId, // 使用真实的管理员ID
  };
  
  const allHeaders = { ...defaultHeaders, ...customHeaders };
  
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

// 清理测试用户
function cleanupTestUser(usernamePrefix) {
  try {
    execSync(
      `sqlite3 prisma/dev.db "DELETE FROM User WHERE username LIKE '${usernamePrefix}%';"`,
      { encoding: 'utf8' }
    );
    console.log(`   清理测试用户: ${usernamePrefix}*`);
  } catch (error) {
    // 忽略清理错误
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
    console.log(`   总用户数: ${result.data.pagination.total}`);
  });
  
  // 测试2: 带查询参数的用户列表
  runTest('带搜索条件的用户列表', () => {
    const result = makeRequest('GET', '/api/admin/users?search=admin&limit=5');
    
    if (!result.success) {
      throw new Error(`搜索API失败: ${result.error}`);
    }
    
    console.log(`   搜索"admin"结果: ${result.data.users.length}个用户`);
  });
  
  console.log('\n📋 **测试2: 创建用户API**\n');
  
  // 先清理旧的测试用户
  cleanupTestUser('testuser_');
  
  // 测试3: 创建新用户
  runTest('创建新用户 (POST /api/admin/users)', () => {
    const timestamp = Date.now();
    const testUser = {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@gamehub.com`,
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
    global.testUsername = testUser.username;
  });
  
  console.log('\n📋 **测试3: 用户详情API**\n');
  
  // 测试4: 获取用户详情
  runTest('获取用户详情 (GET /api/admin/users/[id])', () => {
    if (!global.testUserId) {
      throw new Error('没有可用的测试用户ID');
    }
    
    const result = makeRequest('GET', `/api/admin/users/${global.testUserId}`);
    
    if (!result.success) {
      throw new Error(`获取用户详情失败: ${result.error}`);
    }
    
    console.log(`   用户详情: ${result.data.user.username} (${result.data.user.role})`);
    console.log(`   关联统计: ${result.data.user._count.articles}篇文章, ${result.data.user._count.comments}条评论`);
  });
  
  console.log('\n📋 **测试4: 更新用户API**\n');
  
  // 测试5: 更新用户
  runTest('更新用户信息 (PUT /api/admin/users/[id])', () => {
    if (!global.testUserId) {
      throw new Error('没有可用的测试用户ID');
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
    
    // 显示状态分布
    if (result.data.distributions && result.data.distributions.status) {
      console.log(`   状态分布:`);
      result.data.distributions.status.forEach(item => {
        console.log(`     • ${item.status}: ${item.count} (${item.percentage}%)`);
      });
    }
  });
  
  console.log('\n📋 **测试6: 批量操作API**\n');
  
  // 测试7: 批量操作（激活用户）
  runTest('批量激活用户 (POST /api/admin/users/batch)', () => {
    if (!global.testUserId) {
      console.log('   跳过: 没有可用的测试用户ID');
      return;
    }
    
    const batchData = {
      action: 'activate',
      userIds: [global.testUserId],
      reason: '测试批量操作',
    };
    
    const result = makeRequest('POST', '/api/admin/users/batch', batchData);
    
    if (!result.success) {
      throw new Error(`批量操作失败: ${result.error}`);
    }
    
    console.log(`   批量操作: ${result.message}`);
    console.log(`   影响用户数: ${result.data.affectedCount}`);
  });
  
  console.log('\n📋 **测试7: 权限验证测试**\n');
  
  // 测试8: 权限验证（使用普通用户身份）
  runTest('普通用户无权访问管理API', () => {
    // 获取一个普通用户ID
    const userResult = makeRequest('GET', '/api/admin/users?role=USER&limit=1');
    
    if (!userResult.success || userResult.data.users.length === 0) {
      console.log('   跳过: 没有可用的普通用户');
      return;
    }
    
    const normalUserId = userResult.data.users[0].id;
    
    // 使用普通用户ID尝试访问
    const result = makeRequest('GET', '/api/admin/users', null, {
      'x-user-id': normalUserId,
    });
    
    // 普通用户应该被拒绝访问
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
  
  // 清理测试用户
  if (global.testUsername) {
    cleanupTestUser(global.testUsername);
  }
}

// 检查服务器是否运行
function checkServer() {
  console.log('🔌 检查服务器连接...');
  try {
    const status = execSync(`curl -s -o /dev/null -w "%{http_code}" ${baseUrl}/`, { encoding: 'utf8' }).trim();
    if (status === '200') {
      console.log(`✅ 服务器运行正常 (端口: 3000)\n`);
      return true;
    } else {
      console.log(`❌ 服务器返回状态: ${status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ 无法连接到服务器');
    console.log('💡 请确保开发服务器正在运行: npm run dev');
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