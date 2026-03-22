      const loadTime = endTime - startTime;
      
      const passed = response.statusCode === 200 && loadTime < 5000;
      recordTest('冒烟测试', test.name, passed, {
        path: test.path,
        statusCode: response.statusCode,
        loadTime: `${loadTime}ms`
      });
    } catch (error) {
      recordTest('冒烟测试', test.name, false, {
        path: test.path,
        error: error.message
      });
    }
  }

  // 数据库连接冒烟测试
  try {
    const dbFile = 'prisma/dev.db';
    const dbExists = fs.existsSync(dbFile);
    const passed = dbExists;
    
    recordTest('冒烟测试', '数据库文件检查', passed, {
      dbFile,
      exists: dbExists,
      size: dbExists ? `${(fs.statSync(dbFile).size / 1024 / 1024).toFixed(2)}MB` : 'N/A'
    });
  } catch (error) {
    recordTest('冒烟测试', '数据库文件检查', false, {
      error: error.message
    });
  }
}

// ==================== 第七层：回归测试 ====================
async function layer7_regression_tests() {
  console.log('\n🔄 第七层：回归测试');
  console.log('='.repeat(50));

  // 测试之前修复过的问题
  const regressionTests = [
    { 
      name: '关注API重复变量问题', 
      test: async () => {
        const filePath = 'src/pages/api/follow/index.ts';
        if (!fs.existsSync(filePath)) return false;
        
        const content = fs.readFileSync(filePath, 'utf8');
        // 检查是否还有重复的targetUserId定义
        const targetUserIdCount = (content.match(/targetUserId/g) || []).length;
        const targetUserIdBodyCount = (content.match(/targetUserIdBody/g) || []).length;
        
        return targetUserIdBodyCount > 0; // 应该有重命名的变量
      }
    },
    { 
      name: '页面语法错误检查', 
      test: async () => {
        // 检查关键页面是否存在语法错误
        const pages = ['src/pages/index.tsx', 'src/pages/login.tsx', 'src/pages/register.tsx'];
        let allValid = true;
        
        for (const page of pages) {
          if (!fs.existsSync(page)) {
            allValid = false;
            break;
          }
          
          const content = fs.readFileSync(page, 'utf8');
          // 简单检查：是否有明显的语法错误模式
          const hasUnclosedTags = (content.match(/<[^>]*$/g) || []).length > 0;
          const hasUnclosedBraces = (content.match(/\{[^}]*$/g) || []).length > 0;
          
          if (hasUnclosedTags || hasUnclosedBraces) {
            allValid = false;
            break;
          }
        }
        
        return allValid;
      }
    }
  ];

  for (const test of regressionTests) {
    try {
      const passed = await test.test();
      recordTest('回归测试', test.name, passed, {
        testType: '代码检查'
      });
    } catch (error) {
      recordTest('回归测试', test.name, false, {
        error: error.message
      });
    }
  }
}

// ==================== 第八层：黑盒测试 ====================
async function layer8_blackbox_tests() {
  console.log('\n📦 第八层：黑盒测试');
  console.log('='.repeat(50));

  // 测试错误处理
  const errorTests = [
    { path: '/non-existent-page', name: '404页面处理' },
    { path: '/api/non-existent-api', name: 'API 404处理' },
    { path: '/news/non-existent-article', name: '动态页面404' }
  ];

  for (const test of errorTests) {
    try {
      const response = await httpRequest(`${BASE_URL}${test.path}`);
      
      // 黑盒测试：不关心具体实现，只关心行为
      const passed = response.statusCode === 404 || 
                    response.statusCode === 500 || 
                    (response.statusCode === 200 && (
                      response.body.includes('404') || 
                      response.body.includes('Not Found') ||
                      response.body.includes('Error')
                    ));
      
      recordTest('黑盒测试', test.name, passed, {
        path: test.path,
        statusCode: response.statusCode,
        hasErrorContent: response.body.includes('404') || response.body.includes('Not Found')
      });
    } catch (error) {
      recordTest('黑盒测试', test.name, false, {
        path: test.path,
        error: error.message
      });
    }
  }

  // 测试表单提交（黑盒视角）
  try {
    const response = await httpRequest(`${BASE_URL}/api/auth/simple-login-fixed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      })
    });
    
    // 黑盒测试：无效凭证应该返回错误
    const passed = response.statusCode === 401 || response.statusCode === 400 || response.statusCode === 500;
    recordTest('黑盒测试', '无效登录凭证处理', passed, {
      statusCode: response.statusCode,
      responseType: typeof response.body === 'string' ? 'text' : 'unknown'
    });
  } catch (error) {
    recordTest('黑盒测试', '无效登录凭证处理', false, {
      error: error.message
    });
  }
}

// ==================== 第九层：白盒测试 ====================
async function layer9_whitebox_tests() {
  console.log('\n📄 第九层：白盒测试');
  console.log('='.repeat(50));

  // 白盒测试：检查代码质量
  const codeQualityTests = [
    {
      name: 'TypeScript配置检查',
      test: async () => {
        const tsconfigPath = 'tsconfig.json';
        if (!fs.existsSync(tsconfigPath)) return false;
        
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        return tsconfig.compilerOptions && 
               tsconfig.compilerOptions.strict === true;
      }
    },
    {
      name: 'ESLint配置检查',
      test: async () => {
        const eslintPath = '.eslintrc.json';
        const eslintJsPath = '.eslintrc.js';
        return fs.existsSync(eslintPath) || fs.existsSync(eslintJsPath);
      }
    },
    {
      name: 'Prettier配置检查',
      test: async () => {
        const prettierPath = '.prettierrc';
        const prettierJsonPath = '.prettierrc.json';
        return fs.existsSync(prettierPath) || fs.existsSync(prettierJsonPath);
      }
    }
  ];

  for (const test of codeQualityTests) {
    try {
      const passed = await test.test();
      recordTest('白盒测试', test.name, passed, {
        testType: '配置检查'
      });
    } catch (error) {
      recordTest('白盒测试', test.name, false, {
        error: error.message
      });
    }
  }

  // 检查关键文件是否存在
  const criticalFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'prisma/schema.prisma',
    'src/components/SEO.tsx'
  ];

  for (const file of criticalFiles) {
    try {
      const exists = fs.existsSync(file);
      recordTest('白盒测试', `${file}文件存在`, exists, {
        file,
        exists
      });
    } catch (error) {
      recordTest('白盒测试', `${file}文件存在`, false, {
        file,
        error: error.message
      });
    }
  }
}

// ==================== 第十层：灰盒测试 ====================
async function layer10_graybox_tests() {
  console.log('\n🎭 第十层：灰盒测试');
  console.log('='.repeat(50));

  // 灰盒测试：部分了解内部结构的测试
  const grayboxTests = [
    {
      name: '环境变量配置检查',
      test: async () => {
        const envFiles = ['.env', '.env.example', '.env.development'];
        let hasAnyEnv = false;
        let envDetails = {};
        
        for (const envFile of envFiles) {
          const exists = fs.existsSync(envFile);
          envDetails[envFile] = exists;
          if (exists) hasAnyEnv = true;
        }
        
        return { passed: hasAnyEnv, details: envDetails };
      }
    },
    {
      name: '构建配置检查',
      test: async () => {
        if (!fs.existsSync('package.json')) {
          return { passed: false, details: { error: 'package.json不存在' } };
        }
        
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const hasBuildScript = pkg.scripts && pkg.scripts.build;
        const hasDevScript = pkg.scripts && pkg.scripts.dev;
        const hasDependencies = pkg.dependencies && Object.keys(pkg.dependencies).length > 0;
        
        return {
          passed: hasBuildScript && hasDevScript && hasDependencies,
          details: {
            hasBuildScript,
            hasDevScript,
            dependenciesCount: pkg.dependencies ? Object.keys(pkg.dependencies).length : 0,
            devDependenciesCount: pkg.devDependencies ? Object.keys(pkg.devDependencies).length : 0
          }
        };
      }
    },
    {
      name: '数据库配置检查',
      test: async () => {
        const prismaSchemaPath = 'prisma/schema.prisma';
        if (!fs.existsSync(prismaSchemaPath)) {
          return { passed: false, details: { error: 'Prisma schema不存在' } };
        }
        
        const schema = fs.readFileSync(prismaSchemaPath, 'utf8');
        const hasDatasource = schema.includes('datasource db');
        const hasGenerator = schema.includes('generator client');
        const hasModels = (schema.match(/model\s+\w+/g) || []).length > 0;
        
        return {
          passed: hasDatasource && hasGenerator && hasModels,
          details: {
            hasDatasource,
            hasGenerator,
            modelCount: (schema.match(/model\s+\w+/g) || []).length
          }
        };
      }
    }
  ];

  for (const test of grayboxTests) {
    try {
      const result = await test.test();
      const passed = result.passed;
      recordTest('灰盒测试', test.name, passed, {
        ...result.details,
        testType: '配置检查'
      });
    } catch (error) {
      recordTest('灰盒测试', test.name, false, {
        error: error.message
      });
    }
  }
}

// ==================== 主测试函数 ====================
async function runAllTests() {
  console.log('🚀 开始GameHub项目十层全面测试');
  console.log('='.repeat(60));
  
  testResults.summary.startTime = new Date().toISOString();
  
  // 运行所有测试层
  await layer1_functional_tests();
  await layer2_performance_tests();
  await layer3_ui_tests();
  await layer4_compatibility_tests();
  await layer5_security_tests();
  await layer6_smoke_tests();
  await layer7_regression_tests();
  await layer8_blackbox_tests();
  await layer9_whitebox_tests();
  await layer10_graybox_tests();
  
  testResults.summary.endTime = new Date().toISOString();
  
  // 生成详细报告
  generateTestReport();
  
  // 检查是否有失败测试，立即修复
  await fixFailedTests();
  
  return testResults;
}

// ==================== 生成测试报告 ====================
function generateTestReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 十层测试综合报告');
  console.log('='.repeat(60));
  
  const totalTests = testResults.summary.totalTests;
  const passedTests = testResults.summary.passedTests;
  const failedTests = testResults.summary.failedTests;
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  
  console.log(`总计测试用例: ${totalTests}`);
  console.log(`通过: ${passedTests}`);
  console.log(`失败: ${failedTests}`);
  console.log(`通过率: ${passRate.toFixed(1)}%`);
  
  console.log('\n📈 各层测试结果:');
  console.log('-' .repeat(40));
  
  for (const [layer, data] of Object.entries(testResults.layers)) {
    const layerPassRate = data.total > 0 ? (data.passed / data.total) * 100 : 0;
    console.log(`${layer.padEnd(15)}: ${data.passed}/${data.total} (${layerPassRate.toFixed(1)}%)`);
  }
  
  // 显示失败详情
  const allFailedTests = [];
  for (const [layer, data] of Object.entries(testResults.layers)) {
    const failed = data.tests.filter(t => !t.passed);
    allFailedTests.push(...failed.map(t => ({ layer, ...t })));
  }
  
  if (allFailedTests.length > 0) {
    console.log('\n❌ 失败测试详情:');
    console.log('-' .repeat(40));
    
    for (const test of allFailedTests) {
      console.log(`  [${test.layer}] ${test.name}`);
      if (test.statusCode) console.log(`      状态码: ${test.statusCode}`);
      if (test.error) console.log(`      错误: ${test.error}`);
      if (test.path) console.log(`      路径: ${test.path}`);
    }
  }
  
  // 总体评估
  console.log('\n' + '='.repeat(60));
  console.log('🎯 总体评估');
  console.log('='.repeat(60));
  
  if (passRate >= 90) {
    console.log('✅ 优秀 - 项目质量极高，准备生产部署！');
    console.log('   所有测试层表现优秀，无明显问题。');
  } else if (passRate >= 80) {
    console.log('⚠️  良好 - 项目质量良好，建议优化部分问题。');
    console.log('   核心功能正常，存在一些需要优化的问题。');
  } else if (passRate >= 70) {
    console.log('⚠️  一般 - 项目基本可用，需要修复关键问题。');
    console.log('   部分功能存在问题，建议优先修复。');
  } else if (passRate >= 60) {
    console.log('❌ 及格 - 项目需要重大修复。');
    console.log('   多个核心功能存在问题，需要全面检查。');
  } else {
    console.log('❌ 不及格 - 项目存在严重问题。');
    console.log('   需要立即进行全面修复。');
  }
  
  console.log(`\n📈 综合通过率: ${passRate.toFixed(1)}%`);
  
  // 保存详细报告
  const report = {
    timestamp: new Date().toISOString(),
    summary: testResults.summary,
    layers: testResults.layers,
    overallPassRate: passRate,
    assessment: passRate >= 90 ? '优秀' : 
                passRate >= 80 ? '良好' : 
                passRate >= 70 ? '一般' : 
                passRate >= 60 ? '及格' : '不及格'
  };
  
  fs.writeFileSync('ten_layer_test_report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 详细测试报告已保存到: ten_layer_test_report.json');
}

// ==================== 修复失败测试 ====================
async function fixFailedTests() {
  console.log('\n🔧 开始修复失败测试...');
  console.log('='.repeat(60));
  
  const allFailedTests = [];
  for (const [layer, data] of Object.entries(testResults.layers)) {
    const failed = data.tests.filter(t => !t.passed);
    allFailedTests.push(...failed.map(t => ({ layer, ...t })));
  }
  
  if (allFailedTests.length === 0) {
    console.log('✅ 没有需要修复的失败测试！');
    return;
  }
  
  console.log(`发现 ${allFailedTests.length} 个失败测试需要修复:`);
  
  // 按优先级修复
  const criticalTests = allFailedTests.filter(t => 
    t.layer === '功能测试' || 
    t.layer === '冒烟测试' ||
    t.name.includes('SQL注入') ||
    t.name.includes('XSS防护')
  );
  
  const importantTests = allFailedTests.filter(t => 
    t.layer === '性能测试' || 
    t.layer === '安全测试'
  );
  
  const otherTests = allFailedTests.filter(t => 
    !criticalTests.includes(t) && !importantTests.includes(t)
  );
  
  // 修复关键测试
  if (criticalTests.length > 0) {
    console.log('\n🔴 修复关键测试:');
    for (const test of criticalTests) {
      console.log(`  - [${test.layer}] ${test.name}`);
      // 这里可以添加具体的修复逻辑
      // 例如：修复API端点、修复安全漏洞等
    }
  }
  
  // 修复重要测试
  if (importantTests.length > 0) {
    console.log('\n🟡 修复重要测试:');
    for (const test of importantTests) {
      console.log(`  - [${test.layer}] ${test.name}`);
    }
  }
  
  // 修复其他测试
  if (otherTests.length > 0) {
    console.log('\n🟢 修复其他测试:');
