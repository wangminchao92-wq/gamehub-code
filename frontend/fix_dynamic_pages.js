#!/usr/bin/env node

/**
 * 修复动态页面中的Prisma导入
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复动态页面中的Prisma导入...\n');

// 需要修复的文件列表
const filesToFix = [
  'src/pages/news/[slug].tsx',
  'src/pages/user/[username].tsx',
  'src/pages/community/post/[id].tsx',
];

let fixedCount = 0;

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ 文件不存在: ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    // 检查是否直接导入了PrismaClient
    if (content.includes("import { PrismaClient } from '@prisma/client'")) {
      // 替换导入
      content = content.replace(
        "import { PrismaClient } from '@prisma/client';",
        "import { prisma } from '@/lib/prisma';"
      );
      
      // 移除 const prisma = new PrismaClient();
      content = content.replace(/const prisma = new PrismaClient\(\);\s*\n?/g, '');
      
      updated = true;
      console.log(`✅ ${filePath} - 已修复Prisma导入`);
    } else if (content.includes('new PrismaClient()')) {
      // 只有实例化没有导入的情况
      content = "import { prisma } from '@/lib/prisma';\n" + content;
      content = content.replace(/const prisma = new PrismaClient\(\);\s*\n?/g, '');
      updated = true;
      console.log(`✅ ${filePath} - 已添加并修复Prisma导入`);
    } else if (content.includes("from '@/lib/prisma'")) {
      console.log(`✅ ${filePath} - 已使用正确的Prisma导入`);
    } else {
      console.log(`⚠️  ${filePath} - 未找到Prisma导入，可能需要手动检查`);
    }
    
    if (updated) {
      fs.writeFileSync(fullPath, content);
      fixedCount++;
    }
    
  } catch (error) {
    console.error(`❌ 修复 ${filePath} 失败: ${error.message}`);
  }
});

console.log(`\n📊 修复结果: ${fixedCount}/${filesToFix.length} 个文件已修复`);

if (fixedCount === filesToFix.length) {
  console.log('\n🎉 所有动态页面修复完成！');
} else {
  console.log('\n⚠️  部分文件需要手动修复');
}

console.log('\n🚀 下一步:');
console.log('1. 重启开发服务器');
console.log('2. 重新测试动态页面');
console.log('3. 验证数据库连接正常');