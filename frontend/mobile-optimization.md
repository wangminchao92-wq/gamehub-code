# 移动端优化配置指南

## 1. Viewport Meta标签配置
在 `_app.tsx` 或 `_document.tsx` 中添加：

```tsx
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

## 2. Tailwind CSS响应式配置
在 `tailwind.config.js` 中配置：

```javascript
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
```

## 3. 移动端导航组件
创建 `src/components/MobileNavigation.tsx`：

```tsx
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
```

## 4. 触摸友好样式
在全局CSS中添加：

```css
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
```

## 5. 图片懒加载优化
使用Next.js Image组件：

```tsx
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
```

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
