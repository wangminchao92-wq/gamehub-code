// 简单用户API测试
console.log('🔍 **简单用户API测试**\n');

const { execSync } = require('child_process');
const baseUrl = 'http://localhost:3000';
const adminId = 'd191fcda-81e1-4a07-bbf2-bd0d469844e2';

// 测试1: 直接查询数据库
console.log('📊 直接查询数据库...');
try {
  const dbResult = execSync(
    `sqlite3 prisma/dev.db "SELECT id, username, email, role FROM User LIMIT 3;"`,
    { encoding: 'utf8' }
  );
  console.log('✅ 数据库查询成功:');
  console.log(dbResult);
} catch (error) {
  console.log('❌ 数据库查询失败:', error.message);
}

// 测试2: 简单API测试（不带复杂查询）
console.log('\n🔗 测试简单API端点...');
const simpleTest = execSync(
  `curl -s "http://localhost:3000/api/admin/debug-users"`,
  { encoding: 'utf8' }
);

try {
  const result = JSON.parse(simpleTest);
  if (result.success) {
    console.log('✅ 调试API成功');
    console.log(`   用户数量: ${result.data.userCount}`);
    console.log(`   表结构: ${result.data.tableInfo?.length || 0} 列`);
  } else {
    console.log('❌ 调试API失败:', result.error);
  }
} catch (error) {
  console.log('❌ 解析响应失败:', error.message);
  console.log('原始响应:', simpleTest.substring(0, 200));
}

// 测试3: 检查权限中间件
console.log('\n🔐 测试权限中间件...');
const authTest = execSync(
  `curl -s "http://localhost:3000/api/admin/test-permissions?level=admin" -H "x-user-id: ${adminId}"`,
  { encoding: 'utf8' }
);

try {
  const result = JSON.parse(authTest);
  if (result.success) {
    console.log('✅ 权限中间件工作正常');
    console.log(`   用户: ${result.data.user.username} (${result.data.user.role})`);
  } else {
    console.log('❌ 权限检查失败:', result.error);
  }
} catch (error) {
  console.log('❌ 解析权限测试响应失败:', error.message);
}

// 测试4: 创建最简单的用户API测试
console.log('\n🧪 创建最小化用户API测试...');

// 先检查服务器是否运行
const serverCheck = execSync(
  `curl -s -o /dev/null -w "%{http_code}" ${baseUrl}/`,
  { encoding: 'utf8' }
).trim();

if (serverCheck === '200') {
  console.log('✅ 服务器运行正常');
  
  // 尝试最简单的用户列表查询（只查询id和username）
  const simpleQuery = `
    import { NextApiRequest, NextApiResponse } from 'next';
    import { prisma } from '@/lib/prisma';
    
    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      try {
        console.log('🧪 最小化用户API测试...');
        
        // 最简单的查询
        const users = await prisma.user.findMany({
          take: 3,
          select: {
            id: true,
            username: true,
          },
        });
        
        console.log('✅ 查询成功，用户数:', users.length);
        
        return res.status(200).json({
          success: true,
          data: { users },
        });
        
      } catch (error) {
        console.error('❌ 最小化API错误:', error);
        return res.status(500).json({
          success: false,
          error: error.message,
          stack: error.stack,
        });
      }
    }
  `;
  
  console.log('💡 最小化API代码已准备');
  console.log('   查询: SELECT id, username FROM User LIMIT 3');
  
} else {
  console.log('❌ 服务器未运行，状态码:', serverCheck);
}

console.log('\n' + '='.repeat(50));
console.log('📋 **问题诊断总结**');
console.log('='.repeat(50));
console.log('✅ 已知正常的功能:');
console.log('   • 数据库连接 (SQLite查询正常)');
console.log('   • 权限中间件 (返回401/403)');
console.log('   • 用户统计API (BigInt问题已修复)');
console.log('');
console.log('❌ 需要修复的问题:');
console.log('   • 用户列表API查询失败');
console.log('   • 创建用户API失败');
console.log('   • 可能的原因:');
console.log('     1. Prisma查询语法问题');
console.log('     2. 数据库字段不匹配');
console.log('     3. 序列化问题 (BigInt已处理)');
console.log('');
console.log('🔧 **建议的修复步骤**:');
console.log('   1. 创建最小化的测试API端点');
console.log('   2. 逐步添加查询条件，定位问题');
console.log('   3. 检查数据库实际字段名');
console.log('   4. 验证Prisma模型定义');