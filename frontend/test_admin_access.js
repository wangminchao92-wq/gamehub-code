console.log('🔐 **测试 GameHub 后台管理服务器管理员访问**\n');

const testUrls = [
  { url: 'http://localhost:3000/', name: '首页' },
  { url: 'http://localhost:3000/login', name: '登录页面' },
  { url: 'http://localhost:3000/admin', name: '后台管理' },
  { url: 'http://localhost:3000/admin/articles', name: '文章管理' },
  { url: 'http://localhost:3000/user/ultra-simple/wangminchao', name: '管理员个人中心' },
];

const { execSync } = require('child_process');

console.log('📡 测试服务器连接...\n');

testUrls.forEach(({ url, name }) => {
  try {
    const status = execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`, { encoding: 'utf8' }).trim();
    const isAccessible = status === '200';
    
    console.log(`${isAccessible ? '✅' : '❌'} ${name}`);
    console.log(`   地址: ${url}`);
    console.log(`   状态: ${status} ${isAccessible ? '(可访问)' : '(不可访问)'}`);
    
    if (isAccessible && (url.includes('admin') || url.includes('user'))) {
      try {
        const content = execSync(`curl -s ${url} | head -c 500`, { encoding: 'utf8' });
        if (content.includes('登录') || content.includes('auth') || content.includes('signin')) {
          console.log(`   🔐 需要登录访问`);
        } else if (content.includes('404') || content.includes('Not Found')) {
          console.log(`   📭 页面不存在`);
        } else {
          console.log(`   📄 页面内容可访问`);
        }
      } catch (e) {
        console.log(`   ⚠️  内容检查失败`);
      }
    }
    
    console.log('');
  } catch (error) {
    console.log(`❌ ${name} - 测试失败: ${error.message}`);
    console.log('');
  }
});

console.log('='.repeat(60));
console.log('🎮 **管理员账户测试信息**');
console.log('='.repeat(60));
console.log('');
console.log('🔐 **登录凭证**:');
console.log('   用户名: wangminchao');
console.log('   密码: 4219011oave@');
console.log('   角色: SUPER_ADMIN');
console.log('');
console.log('🚀 **测试步骤**:');
console.log('   1. 打开浏览器访问 http://localhost:3000/login');
console.log('   2. 输入用户名: wangminchao');
console.log('   3. 输入密码: 4219011oave@');
console.log('   4. 点击登录按钮');
console.log('   5. 验证登录成功');
console.log('   6. 访问后台管理页面');
console.log('');
console.log('📊 **预期结果**:');
console.log('   ✅ 登录成功，显示管理员个人中心');
console.log('   ✅ 可以访问后台管理页面');
console.log('   ✅ 拥有最高权限 (SUPER_ADMIN)');
console.log('   ✅ 可以管理用户和内容');
console.log('');
console.log('⚠️  **注意事项**:');
console.log('   • 当前使用明文密码，仅测试环境');
console.log('   • 生产环境必须使用密码哈希');
console.log('   • 登录功能需要前端表单提交');
console.log('   • 可能需要实现登录API接口');
console.log('');
console.log('='.repeat(60));
console.log('✅ **测试准备完成**');
console.log('='.repeat(60));