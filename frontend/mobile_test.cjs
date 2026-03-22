const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('📱 移动端兼容性测试开始\n');

// 测试URL
const testUrls = [
  { url: 'http://localhost:3000/', name: '首页' },
  { url: 'http://localhost:3000/news/ultra-simple/cyberpunk-2077-2-0-review', name: '文章详情页' },
  { url: 'http://localhost:3000/user/ultra-simple/admin', name: '用户个人中心' },
  { url: 'http://localhost:3000/community/post/ultra-simple/cmn19p2xr0005jd5sb9h1jo0p', name: '帖子详情页' },
];

// 移动端用户代理
const mobileUserAgents = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
];

async function testMobileCompatibility(url, name) {
  const results = [];
  
  for (const userAgent of mobileUserAgents) {
    const result = await new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: new URL(url).pathname,
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
        },
        timeout: 10000
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          // 分析移动端兼容性
          const hasViewport = data.includes('viewport');
          const hasTouchFriendly = data.includes('touch-action') || data.includes('user-scalable');
          const hasResponsiveCSS = data.includes('@media') || data.includes('max-width') || data.includes('min-width');
          const hasMobileNavigation = data.includes('hamburger') || data.includes('menu-toggle') || data.includes('nav-toggle');
          const hasTapTargets = (data.match(/min-height:[^}]*48px|min-width:[^}]*48px/g) || []).length > 0;
          const hasReadableFonts = data.includes('font-size') && (data.includes('16px') || data.includes('1rem'));
          
          resolve({
            userAgent: userAgent.split(' ')[2] || 'Unknown',
            success: res.statusCode === 200,
            statusCode: res.statusCode,
            compatibility: {
              hasViewport,
              hasTouchFriendly,
              hasResponsiveCSS,
              hasMobileNavigation,
              hasTapTargets,
              hasReadableFonts,
            }
          });
        });
      });
      
      req.on('error', (error) => {
        resolve({
          userAgent: userAgent.split(' ')[2] || 'Unknown',
          success: false,
          error: error.message,
          compatibility: null
        });
      });
      
      req.end();
    });
    
    results.push(result);
  }
  
  // 汇总结果
  const successfulTests = results.filter(r => r.success);
  if (successfulTests.length === 0) {
    return {
      name,
      url,
      success: false,
      error: '所有移动端测试失败'
    };
  }
  
  // 计算兼容性分数
  const compatibilityScores = {
    viewport: successfulTests.filter(r => r.compatibility.hasViewport).length / successfulTests.length * 100,
    touchFriendly: successfulTests.filter(r => r.compatibility.hasTouchFriendly).length / successfulTests.length * 100,
    responsiveCSS: successfulTests.filter(r => r.compatibility.hasResponsiveCSS).length / successfulTests.length * 100,
    mobileNavigation: successfulTests.filter(r => r.compatibility.hasMobileNavigation).length / successfulTests.length * 100,
    tapTargets: successfulTests.filter(r => r.compatibility.hasTapTargets).length / successfulTests.length * 100,
    readableFonts: successfulTests.filter(r => r.compatibility.hasReadableFonts).length / successfulTests.length * 100,
  };
  
  const overallScore = Math.round(
    Object.values(compatibilityScores).reduce((sum, score) => sum + score, 0) / 
    Object.keys(compatibilityScores).length
  );
  
  return {
    name,
    url,
    success: true,
    overallScore,
    compatibilityScores,
    deviceCount: successfulTests.length
  };
}

async function runAllTests() {
  console.log('='.repeat(60));
  console.log('📱 移动端兼容性测试');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const page of testUrls) {
    console.log(`📊 测试: ${page.name}`);
    console.log(`🔗 URL: ${page.url}`);
    
    const result = await testMobileCompatibility(page.url, page.name);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ 移动端设备: ${result.deviceCount}/3 支持`);
      console.log(`     总体兼容性: ${result.overallScore}/100 ${getScoreEmoji(result.overallScore)}`);
      console.log(`     视口配置: ${result.compatibilityScores.viewport.toFixed(0)}% ${getCoverageEmoji(result.compatibilityScores.viewport)}`);
      console.log(`     触摸友好: ${result.compatibilityScores.touchFriendly.toFixed(0)}% ${getCoverageEmoji(result.compatibilityScores.touchFriendly)}`);
      console.log(`     响应式CSS: ${result.compatibilityScores.responsiveCSS.toFixed(0)}% ${getCoverageEmoji(result.compatibilityScores.responsiveCSS)}`);
      console.log(`     移动导航: ${result.compatibilityScores.mobileNavigation.toFixed(0)}% ${getCoverageEmoji(result.compatibilityScores.mobileNavigation)}`);
      console.log(`     点击目标: ${result.compatibilityScores.tapTargets.toFixed(0)}% ${getCoverageEmoji(result.compatibilityScores.tapTargets)}`);
      console.log(`     可读字体: ${result.compatibilityScores.readableFonts.toFixed(0)}% ${getCoverageEmoji(result.compatibilityScores.readableFonts)}`);
    } else {
      console.log(`  ❌ 测试失败: ${result.error}`);
    }
    
    console.log(''); // 空行分隔
  }
  
  // 生成总结报告
  console.log('='.repeat(60));
  console.log('📋 移动端兼容性总结');
  console.log('='.repeat(60));
  
  const successfulTests = results.filter(r => r.success);
  
  if (successfulTests.length > 0) {
    console.log(`📊 测试页面: ${successfulTests.length}/${testUrls.length} 成功`);
    console.log('');
    
    // 计算平均分
    const avgScores = {
      overall: Math.round(successfulTests.reduce((sum, r) => sum + r.overallScore, 0) / successfulTests.length),
      viewport: Math.round(successfulTests.reduce((sum, r) => sum + r.compatibilityScores.viewport, 0) / successfulTests.length),
      touchFriendly: Math.round(successfulTests.reduce((sum, r) => sum + r.compatibilityScores.touchFriendly, 0) / successfulTests.length),
      responsiveCSS: Math.round(successfulTests.reduce((sum, r) => sum + r.compatibilityScores.responsiveCSS, 0) / successfulTests.length),
      mobileNavigation: Math.round(successfulTests.reduce((sum, r) => sum + r.compatibilityScores.mobileNavigation, 0) / successfulTests.length),
      tapTargets: Math.round(successfulTests.reduce((sum, r) => sum + r.compatibilityScores.tapTargets, 0) / successfulTests.length),
      readableFonts: Math.round(successfulTests.reduce((sum, r) => sum + r.compatibilityScores.readableFonts, 0) / successfulTests.length),
    };
    
    console.log('🏆 平均兼容性得分:');
    console.log(`   总体兼容性: ${avgScores.overall}/100 ${getScoreEmoji(avgScores.overall)}`);
    console.log(`   视口配置: ${avgScores.viewport}/100 ${getScoreEmoji(avgScores.viewport)}`);
    console.log(`   触摸友好: ${avgScores.touchFriendly}/100 ${getScoreEmoji(avgScores.touchFriendly)}`);
    console.log(`   响应式CSS: ${avgScores.responsiveCSS}/100 ${getScoreEmoji(avgScores.responsiveCSS)}`);
    console.log(`   移动导航: ${avgScores.mobileNavigation}/100 ${getScoreEmoji(avgScores.mobileNavigation)}`);
    console.log(`   点击目标: ${avgScores.tapTargets}/100 ${getScoreEmoji(avgScores.tapTargets)}`);
    console.log(`   可读字体: ${avgScores.readableFonts}/100 ${getScoreEmoji(avgScores.readableFonts)}`);
    console.log('');
    
    console.log('💡 移动端优化建议:');
    
    if (avgScores.overall < 80) {
      console.log('   • 总体兼容性需要提升:');
      console.log('     - 确保所有页面都有正确的viewport配置');
      console.log('     - 添加触摸友好的交互元素');
      console.log('     - 实现完整的响应式设计');
    }
    
    if (avgScores.mobileNavigation < 70) {
      console.log('   • 移动导航需要改进:');
      console.log('     - 添加汉堡菜单或移动端导航');
      console.log('     - 确保导航元素在移动端可点击');
      console.log('     - 优化移动端菜单体验');
    }
    
    if (avgScores.tapTargets < 70) {
      console.log('   • 点击目标需要优化:');
      console.log('     - 确保按钮和链接至少有48x48像素的可点击区域');
      console.log('     - 增加触摸目标之间的间距');
      console.log('     - 避免过小的交互元素');
    }
    
    if (avgScores.readableFonts < 70) {
      console.log('   • 字体可读性需要改进:');
      console.log('     - 确保正文字体至少16px');
      console.log('     - 使用相对单位(rem/em)而非固定像素');
      console.log('     - 确保足够的行高和字间距');
    }
    
    console.log('');
    console.log('🚀 快速移动端优化方案:');
    console.log('   1. 在<head>中添加正确的viewport meta标签');
    console.log('   2. 使用Tailwind CSS的响应式工具类');
    console.log('   3. 实现移动端优先的导航菜单');
    console.log('   4. 确保所有交互元素触摸友好');
    console.log('   5. 测试不同移动设备的显示效果');
    
    // 创建移动端优化配置
    createMobileOptimizationConfig();
    
  } else {
    console.log('❌ 所有移动端测试失败');
  }
  
  console.log('');
  console.log('='.repeat(60));
  console.log('📱 移动端兼容性测试完成');
  console.log('='.repeat(60));
}

function getScoreEmoji(score) {
  if (score >= 90) return '🏆';
  if (score >= 80) return '✅';
  if (score >= 60) return '⚠️';
  return '❌';
}

function getCoverageEmoji(coverage) {
  if (coverage >= 90) return '🏆';
  if (coverage >= 70) return '✅';
  if (coverage >= 50) return '⚠️';
  return '❌';
}

function createMobileOptimizationConfig() {
  const configPath = path.join(__dirname, 'mobile-optimization.md');
  const configContent = `# 移动端优化配置指南

## 1. Viewport Meta标签配置
在 \`_app.tsx\` 或 \`_document.tsx\` 中添加：

\`\`\`tsx
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
\`\`\`

## 2. Tailwind CSS响应式配置
在 \`tailwind.config.js\` 中配置：

\`\`\`javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // 移动端优化
      spacing: {
        'touch': '48px', // 最小触摸目标尺寸
      },
      fontSize: {
        'base': '16px', // 移动端基础字体大小
      },
    },
  },
  plugins: [],
}
\`\`\`

## 3. 移动端导航组件
创建 \`src/components/MobileNavigation.tsx\`：

\`\`\`tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 汉堡菜单按钮 */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="菜单"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 移动端菜单 */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="p-4">
            <button
              className="absolute top-4 right-4 p-2"
              onClick={() => setIsOpen(false)}
              aria-label="关闭菜单"
            >
              <X size={24} />
            </button>
            
            <nav className="mt-12">
              <ul className="space-y-4">
                <li>
                  <a href="/" className="block py-3 text-lg">首页</a>
                </li>
                <li>
                  <a href="/news" className="block py-3 text-lg">新闻</a>
                </li>
                <li>
                  <a href="/community" className="block py-3 text-lg">社区</a>
                </li>
                <li>
                  <a href="/store" className="block py-3 text-lg">商店</a>
                </li>
                <li>
                  <a href="/login" className="block py-3 text-lg">登录</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
\`\`\`

## 4. 触摸友好样式
在全局CSS中添加：

\`\`\`css
/* 触摸友好样式 */
.touch-target {
  min-height: 48px;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 防止双击缩放 */
* {
  touch-action: manipulation;
}

/* 移动端优化滚动 */
@media (max-width: 768px) {
  html {
    -webkit-overflow-scrolling: touch;
  }
  
  body {
    overflow-x: hidden;
  }
}
\`\`\`

## 5. 图片懒加载优化
使用Next.js Image组件：

\`\`\`tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt, width, height }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      className="rounded-lg"
    />
  );
}
\`\`\`

## 6. 测试清单
- [ ] 所有页面在iPhone上正常显示
- [ ] 所有页面在Android设备上正常显示
- [ ] 所有交互元素触摸友好
- [ ] 导航在移动端可用
- [ ] 字体大小可读
- [ ] 图片响应式
- [ ] 表单输入正常
- [ ] 页面加载速度可接受

## 7. 性能优化
- 使用WebP格式图片
- 启用代码分割
- 实现图片懒加载
- 优化CSS交付
- 减少JavaScript包大小
`;

  fs.writeFileSync(configPath, configContent);
  console.log(`📁 创建移动端优化指南: ${configPath}`);
}

runAllTests().catch(console.error);