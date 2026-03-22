#!/usr/bin/env node

/**
 * GameHub SEO检查脚本
 * 检查所有页面的SEO实现情况
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// 检查结果统计
const stats = {
  total: 0,
  hasSeo: 0,
  missingSeo: 0,
  hasStructuredData: 0,
  errors: []
};

// 查找所有页面文件
function findPageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // 跳过node_modules和隐藏目录
      if (!item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...findPageFiles(fullPath));
      }
    } else if (item.name.endsWith('.tsx') || item.name.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 检查单个文件的SEO实现
function checkFileSeo(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  stats.total++;
  
  // 检查是否包含SEO组件
  const hasSeoComponent = content.includes('<SEO') || content.includes('import SEO');
  const hasStructuredData = content.includes('structuredData') || content.includes('@context');
  
  if (hasSeoComponent) {
    stats.hasSeo++;
    
    // 检查SEO组件是否被正确使用
    if (!content.includes('title=') || !content.includes('description=')) {
      stats.errors.push({
        file: relativePath,
        issue: 'SEO组件缺少title或description属性',
        severity: 'high'
      });
    }
  } else {
    stats.missingSeo++;
    stats.errors.push({
      file: relativePath,
      issue: '缺少SEO组件',
      severity: 'critical'
    });
  }
  
  if (hasStructuredData) {
    stats.hasStructuredData++;
  }
  
  return {
    path: relativePath,
    hasSeo: hasSeoComponent,
    hasStructuredData: hasStructuredData
  };
}

// 主函数
function main() {
  console.log(`${colors.cyan}🔍 GameHub SEO检查脚本${colors.reset}`);
  console.log(`${colors.cyan}=========================${colors.reset}\n`);
  
  const pagesDir = path.join(process.cwd(), 'src/pages');
  const pageFiles = findPageFiles(pagesDir);
  
  console.log(`${colors.blue}📁 找到 ${pageFiles.length} 个页面文件${colors.reset}\n`);
  
  const results = [];
  for (const file of pageFiles) {
    results.push(checkFileSeo(file));
  }
  
  // 输出结果
  console.log(`${colors.cyan}📊 SEO检查结果:${colors.reset}`);
  console.log(`${colors.green}✅ 有SEO组件: ${stats.hasSeo}/${stats.total} (${((stats.hasSeo/stats.total)*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.red}❌ 缺少SEO组件: ${stats.missingSeo}/${stats.total} (${((stats.missingSeo/stats.total)*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.yellow}📝 有结构化数据: ${stats.hasStructuredData}/${stats.total} (${((stats.hasStructuredData/stats.total)*100).toFixed(1)}%)${colors.reset}`);
  
  // 输出错误
  if (stats.errors.length > 0) {
    console.log(`\n${colors.red}🚨 发现 ${stats.errors.length} 个SEO问题:${colors.reset}`);
    
    const criticalErrors = stats.errors.filter(e => e.severity === 'critical');
    const highErrors = stats.errors.filter(e => e.severity === 'high');
    const mediumErrors = stats.errors.filter(e => e.severity === 'medium');
    
    if (criticalErrors.length > 0) {
      console.log(`\n${colors.red}🔴 严重问题 (必须立即修复):${colors.reset}`);
      criticalErrors.forEach(error => {
        console.log(`  ${colors.red}• ${error.file}: ${error.issue}${colors.reset}`);
      });
    }
    
    if (highErrors.length > 0) {
      console.log(`\n${colors.yellow}🟡 重要问题 (本周修复):${colors.reset}`);
      highErrors.forEach(error => {
        console.log(`  ${colors.yellow}• ${error.file}: ${error.issue}${colors.reset}`);
      });
    }
    
    if (mediumErrors.length > 0) {
      console.log(`\n${colors.blue}🔵 一般问题 (下月修复):${colors.reset}`);
      mediumErrors.forEach(error => {
        console.log(`  ${colors.blue}• ${error.file}: ${error.issue}${colors.reset}`);
      });
    }
  } else {
    console.log(`\n${colors.green}🎉 所有页面都符合SEO规范！${colors.reset}`);
  }
  
  // 输出建议
  console.log(`\n${colors.cyan}💡 SEO优化建议:${colors.reset}`);
  console.log(`  1. 确保所有页面都有唯一的title和description`);
  console.log(`  2. 为关键页面添加结构化数据`);
  console.log(`  3. 优化图片的alt标签`);
  console.log(`  4. 确保页面加载速度 (LCP < 2.5s)`);
  console.log(`  5. 移动端友好测试`);
  
  // 保存报告
  const report = {
    timestamp: new Date().toISOString(),
    stats: stats,
    errors: stats.errors,
    summary: {
      seoCoverage: `${((stats.hasSeo/stats.total)*100).toFixed(1)}%`,
      structuredDataCoverage: `${((stats.hasStructuredData/stats.total)*100).toFixed(1)}%`,
      criticalIssues: criticalErrors.length,
      totalIssues: stats.errors.length
    }
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'seo-check-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`\n${colors.green}📄 SEO检查报告已保存到: seo-check-report.json${colors.reset}`);
  
  // 返回退出码
  process.exit(criticalErrors.length > 0 ? 1 : 0);
}

// 运行主函数
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`${colors.red}❌ 检查过程中出错:${colors.reset}`, error.message);
    process.exit(1);
  }
}

module.exports = { checkFileSeo, findPageFiles };