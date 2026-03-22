#!/usr/bin/env node

/**
 * 更新PrismaClient导入使用新的配置
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 更新PrismaClient导入...\n');

// 需要更新的文件列表
const filesToUpdate = [
  'src/pages/api/articles/[id].ts',
  'src/pages/api/articles/index.ts',
  'src/pages/api/auth/github.ts',
  'src/pages/api/auth/google.ts',
  'src/pages/api/auth/login.ts',
  'src/pages/api/auth/register.ts',
  'src/pages/api/auth/me.ts',
  'src/pages/api/auth/[...nextauth].ts',
  'prisma/seed.ts',
];

// 更新函数
function updatePrismaImport(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ 文件不存在: ${filePath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    // 替换旧的PrismaClient导入和实例化
    if (content.includes("import { PrismaClient } from '@prisma/client'")) {
      // 替换导入
      content = content.replace(
        "import { PrismaClient } from '@prisma/client';",
        "import { prisma } from '@/lib/prisma';"
      );
      
      // 移除 const prisma = new PrismaClient();
      content = content.replace(/const prisma = new PrismaClient\(\);\s*\n?/g, '');
      
      updated = true;
      console.log(`✅ ${filePath} - 已更新PrismaClient导入`);
    } else if (content.includes('@prisma/client') && content.includes('new PrismaClient()')) {
      // 另一种格式的替换
      content = content.replace(
        /import.*from ['"]@prisma\/client['"];?\s*\n?/g,
        "import { prisma } from '@/lib/prisma';\n"
      );
      content = content.replace(/const prisma = new PrismaClient\(\);\s*\n?/g, '');
      updated = true;
      console.log(`✅ ${filePath} - 已更新PrismaClient导入`);
    } else if (content.includes('new PrismaClient()')) {
      // 只有实例化没有导入的情况
      content = "import { prisma } from '@/lib/prisma';\n" + content;
      content = content.replace(/const prisma = new PrismaClient\(\);\s*\n?/g, '');
      updated = true;
      console.log(`✅ ${filePath} - 已添加并更新PrismaClient导入`);
    } else {
      console.log(`✅ ${filePath} - 不需要更新`);
    }
    
    if (updated) {
      fs.writeFileSync(fullPath, content);
    }
    
    return true;
    
  } catch (error) {
    console.error(`❌ 更新 ${filePath} 失败: ${error.message}`);
    return false;
  }
}

// 主更新函数
async function main() {
  console.log('开始更新文件...\n');
  
  let updatedCount = 0;
  let totalCount = filesToUpdate.length;
  
  for (const file of filesToUpdate) {
    if (updatePrismaImport(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n📊 更新结果:`);
  console.log(`总文件数: ${totalCount}`);
  console.log(`更新成功: ${updatedCount}`);
  
  console.log('\n✅ 更新完成！');
  console.log('\n🚀 下一步:');
  console.log('1. 运行: npx prisma generate');
  console.log('2. 运行: npx tsc --noEmit 检查错误');
  console.log('3. 启动开发服务器: npm run dev');
}

// 执行更新
main().catch(error => {
  console.error('更新过程中发生错误:', error);
  process.exit(1);
});