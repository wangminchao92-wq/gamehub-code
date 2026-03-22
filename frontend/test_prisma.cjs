// CommonJS模块测试Prisma
const { PrismaClient } = require('@prisma/client');

console.log('🔧 测试Prisma配置...\n');

// 设置环境变量
process.env.DATABASE_URL = 'file:./prisma/dev.db';

// 尝试不同的配置
const configs = [
  { name: '默认配置', config: undefined },
  { name: '空对象', config: {} },
  { name: 'datasourceUrl', config: { datasourceUrl: process.env.DATABASE_URL } },
  { name: 'datasources', config: { datasources: { db: { url: process.env.DATABASE_URL } } } },
];

async function testPrisma() {
  for (const cfg of configs) {
    console.log(`尝试: ${cfg.name}`);
    
    try {
      const prisma = cfg.config ? new PrismaClient(cfg.config) : new PrismaClient();
      
      // 测试连接
      console.log('  测试数据库连接...');
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log(`  ✅ 连接成功:`, result);
      
      // 测试查询
      console.log('  测试用户查询...');
      const users = await prisma.user.findMany({ take: 1 });
      console.log(`  ✅ 查询成功: 找到 ${users.length} 个用户`);
      
      await prisma.$disconnect();
      console.log(`  🎉 ${cfg.name} 配置成功!\n`);
      return cfg.config;
      
    } catch (error) {
      console.log(`  ❌ 失败: ${error.message.split('\n')[0]}`);
      if (error.message.includes('datasourceUrl')) {
        console.log('  提示: datasourceUrl参数不被接受');
      } else if (error.message.includes('datasources')) {
        console.log('  提示: datasources参数不被接受');
      }
      console.log();
    }
  }
  
  console.log('❌ 所有配置尝试都失败了');
  return null;
}

// 运行测试
testPrisma().then(successConfig => {
  if (successConfig) {
    console.log('✅ 找到可用的Prisma配置:');
    console.log(JSON.stringify(successConfig, null, 2));
    
    // 更新lib/prisma.ts
    const fs = require('fs');
    const prismaFile = './src/lib/prisma.ts';
    
    if (fs.existsSync(prismaFile)) {
      let content = fs.readFileSync(prismaFile, 'utf8');
      
      // 替换配置
      if (successConfig === undefined) {
        content = content.replace(/new PrismaClient\([\s\S]*?\)/, 'new PrismaClient()');
      } else {
        const configStr = JSON.stringify(successConfig, null, 2);
        content = content.replace(/new PrismaClient\([\s\S]*?\)/, `new PrismaClient(${configStr})`);
      }
      
      fs.writeFileSync(prismaFile, content);
      console.log('\n✅ 已更新Prisma配置');
    }
  } else {
    console.log('\n💡 建议:');
    console.log('1. 检查Prisma版本: npx prisma --version');
    console.log('2. 查看官方文档: https://pris.ly/d/client-constructor');
    console.log('3. 尝试降级: npm install @prisma/client@7.4.0');
  }
}).catch(error => {
  console.error('测试过程中发生错误:', error);
});