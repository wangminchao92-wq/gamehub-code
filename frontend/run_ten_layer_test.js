/**
 * GameHub项目十层全面测试 - 主运行文件
 */

const fs = require('fs');
const path = require('path');

// 读取两个部分的测试代码
const part1 = fs.readFileSync(path.join(__dirname, 'comprehensive_ten_layer_test.js'), 'utf8');
const part2 = fs.readFileSync(path.join(__dirname, 'comprehensive_ten_layer_test_part2.js'), 'utf8');

// 合并并执行
const fullTestCode = part1 + part2;

// 写入临时文件并执行
const tempFile = path.join(__dirname, 'ten_layer_test_full.js');
fs.writeFileSync(tempFile, fullTestCode);

console.log('🚀 准备执行十层全面测试...');
console.log('='.repeat(60));

// 执行测试
require(tempFile).runAllTests().then(results => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 十层全面测试完成！');
  console.log('='.repeat(60));
  
  const passRate = (results.summary.passedTests / results.summary.totalTests) * 100;
  
  if (passRate >= 80) {
    console.log('✅ 测试通过 - 项目质量优秀，可以进行本地部署测试！');
    process.exit(0);
  } else {
    console.log('❌ 测试未通过 - 需要修复问题后再进行部署测试');
    process.exit(1);
  }
}).catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});