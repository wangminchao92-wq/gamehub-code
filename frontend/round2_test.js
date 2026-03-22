// 第二轮测试：登录功能和API测试
const http = require('http');

console.log('🧪 第二轮测试：登录功能和API测试');
console.log('='.repeat(50));

const baseUrl = 'http://localhost:3000';

// 测试管理员账户
const adminCredentials = {
  identifier: 'wangminchao',
  password: '4219011oave@'
};

const testCases = [
  // 登录API测试
  {
    name: '登录API测试',
    test: (callback) => {
      const postData = JSON.stringify(adminCredentials);
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 5000
      };

      const req = http.request(baseUrl + '/api/auth/simple-login-fixed', options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            const isSuccess = res.statusCode === 200 && result.success === true;
            console.log(`  登录API测试 ${res.statusCode} ${isSuccess ? '✅' : '❌'}`);
            callback(isSuccess ? 1 : 0, isSuccess ? 0 : 1);
          } catch (err) {
            console.log(`  登录API测试 解析失败 ❌ (${err.message})`);
            callback(0, 1);
          }
        });
      });

      req.on('error', (err) => {
        console.log(`  登录API测试 连接失败 ❌ (${err.code})`);
        callback(0, 1);
      });

      req.on('timeout', () => {
        console.log(`  登录API测试 超时 ❌`);
        callback(0, 1);
        req.destroy();
      });

      req.write(postData);
      req.end();
    }
  },
  
  // 用户管理API测试（带权限）
  {
    name: '用户API(管理员)',
    test: (callback) => {
      // 先获取管理员ID
      const options = {
        method: 'GET',
        headers: {
          'x-user-id': 'd191fcda-81e1-4a07-bbf2-bd0d469844e2' // 管理员ID
        },
        timeout: 5000
      };

      const req = http.request(baseUrl + '/api/admin/users/simple', options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            const isSuccess = res.statusCode === 200 && result.success === true;
            console.log(`  用户API(管理员) ${res.statusCode} ${isSuccess ? '✅' : '❌'}`);
            if (isSuccess && result.data && result.data.users) {
              console.log(`    返回用户数: ${result.data.users.length}`);
            }
            callback(isSuccess ? 1 : 0, isSuccess ? 0 : 1);
          } catch (err) {
            console.log(`  用户API(管理员) 解析失败 ❌`);
            callback(0, 1);
          }
        });
      });

      req.on('error', (err) => {
        console.log(`  用户API(管理员) 连接失败 ❌`);
        callback(0, 1);
      });

      req.on('timeout', () => {
        console.log(`  用户API(管理员) 超时 ❌`);
        callback(0, 1);
        req.destroy();
      });

      req.end();
    }
  },
  
  // 数据库连接测试
  {
    name: '数据库连接',
    test: (callback) => {
      const { exec } = require('child_process');
      exec('sqlite3 prisma/dev.db "SELECT COUNT(*) FROM User;"', (error, stdout, stderr) => {
        if (error) {
          console.log(`  数据库连接 失败 ❌ (${error.message})`);
          callback(0, 1);
        } else {
          const count = parseInt(stdout.trim());
          const isSuccess = !isNaN(count) && count > 0;
          console.log(`  数据库连接 ${isSuccess ? '✅' : '❌'} (用户数: ${count})`);
          callback(isSuccess ? 1 : 0, isSuccess ? 0 : 1);
        }
      });
    }
  },
  
  // TypeScript编译测试
  {
    name: 'TypeScript编译',
    test: (callback) => {
      const { exec } = require('child_process');
      exec('npx tsc --noEmit 2>&1 | grep -v "prisma/seed.ts" | wc -l', (error, stdout, stderr) => {
        if (error) {
          console.log(`  TypeScript编译 失败 ❌`);
          callback(0, 1);
        } else {
          const errorCount = parseInt(stdout.trim());
          const isSuccess = errorCount === 0;
          console.log(`  TypeScript编译 ${isSuccess ? '✅' : '❌'} (错误数: ${errorCount})`);
          callback(isSuccess ? 1 : 0, isSuccess ? 0 : 1);
        }
      });
    }
  }
];

let passed = 0;
let failed = 0;
let currentTest = 0;

function runTest(testCase) {
  console.log(`\n🔧 ${testCase.name}:`);
  testCase.test((p, f) => {
    passed += p;
    failed += f;
    currentTest++;
    
    if (currentTest < testCases.length) {
      setTimeout(() => runTest(testCases[currentTest]), 500);
    } else {
      showSummary();
    }
  });
}

function showSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 第二轮测试结果:');
  console.log('-'.repeat(30));
  console.log(`✅ 通过: ${passed}/${testCases.length}`);
  console.log(`❌ 失败: ${failed}/${testCases.length}`);
  console.log(`📈 成功率: ${Math.round((passed / testCases.length) * 100)}%`);
  
  if (passed === testCases.length) {
    console.log('\n🎉 第二轮测试全部通过！');
  } else {
    console.log('\n⚠️  第二轮测试有失败项目。');
  }
  
  // 开始第三轮测试
  console.log('\n' + '='.repeat(50));
  console.log('🧪 准备开始第三轮测试...');
  console.log('='.repeat(50));
  
  // 导入并运行第三轮测试
  setTimeout(() => {
    require('./round3_test.js');
  }, 1000);
}

// 开始测试
console.log('📋 测试项目:');
console.log('-'.repeat(30));
runTest(testCases[0]);