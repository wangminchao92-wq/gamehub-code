#!/usr/bin/env node

/**
 * 修复PrismaClient导入问题的脚本
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复PrismaClient导入问题...\n');

// 需要修复的文件列表
const filesToFix = [
  'src/pages/api/articles/[id].ts',
  'src/pages/api/articles/index.ts',
  'src/pages/api/auth/github.ts',
  'src/pages/api/auth/google.ts',
  'src/pages/api/auth/login.ts',
  'src/pages/api/auth/register.ts',
  'src/pages/api/auth/me.ts',
  'prisma/seed.ts',
];

// 修复函数
function fixPrismaImport(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ 文件不存在: ${filePath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 检查是否包含PrismaClient导入
    if (content.includes("import { PrismaClient } from '@prisma/client'")) {
      console.log(`✅ ${filePath} - PrismaClient导入正常`);
      return true;
    }
    
    // 检查是否有其他形式的Prisma导入
    if (content.includes('@prisma/client')) {
      console.log(`⚠️  ${filePath} - 有Prisma导入但格式可能有问题`);
      
      // 尝试修复
      if (content.includes("import { PrismaClient } from '@prisma/client';")) {
        console.log(`  已修复: ${filePath}`);
        return true;
      }
    } else if (content.includes('new PrismaClient()')) {
      console.log(`❌ ${filePath} - 使用PrismaClient但未导入`);
      
      // 在文件开头添加导入
      const lines = content.split('\n');
      let importAdded = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import')) {
          // 在最后一个import之后添加
          let j = i;
          while (j < lines.length && lines[j].includes('import')) {
            j++;
          }
          lines.splice(j, 0, "import { PrismaClient } from '@prisma/client';");
          importAdded = true;
          break;
        }
      }
      
      if (!importAdded) {
        lines.unshift("import { PrismaClient } from '@prisma/client';");
      }
      
      content = lines.join('\n');
      fs.writeFileSync(fullPath, content);
      console.log(`  已添加PrismaClient导入`);
      return true;
    } else {
      console.log(`✅ ${filePath} - 不需要PrismaClient`);
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error(`❌ 修复 ${filePath} 失败: ${error.message}`);
    return false;
  }
}

// 主修复函数
async function main() {
  console.log('开始修复文件...\n');
  
  let fixedCount = 0;
  let totalCount = filesToFix.length;
  
  for (const file of filesToFix) {
    if (fixPrismaImport(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n📊 修复结果:`);
  console.log(`总文件数: ${totalCount}`);
  console.log(`修复成功: ${fixedCount}`);
  console.log(`修复失败: ${totalCount - fixedCount}`);
  
  if (fixedCount === totalCount) {
    console.log('\n✅ 所有文件修复完成！');
  } else {
    console.log('\n⚠️  部分文件需要手动修复');
  }
  
  console.log('\n🚀 下一步建议:');
  console.log('1. 运行: npx prisma generate');
  console.log('2. 运行: npx tsc --noEmit 检查错误');
  console.log('3. 启动开发服务器: npm run dev');
}

// 执行修复
main().catch(error => {
  console.error('修复过程中发生错误:', error);
  process.exit(1);
});