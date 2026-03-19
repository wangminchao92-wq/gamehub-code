import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useEffect } from 'react';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/next';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 添加暗色主题类
    document.documentElement.classList.add('dark');
    
    // 防止FOUC (Flash of Unstyled Content)
    const style = document.getElementById('style-fouc');
    if (style) {
      style.parentNode?.removeChild(style);
    }
  }, []);

  return (
    <>
      <Head>
        {/* Viewport设置 - 移动端友好 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        
        {/* 防止电话号码自动识别 */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* 防止邮箱地址自动识别 */}
        <meta name="format-detection" content="email=no" />
        
        {/* 防止地址自动识别 */}
        <meta name="format-detection" content="address=no" />
        
        {/* 防止Safari工具栏颜色 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* 防止iOS Safari缩放 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* 防止Android Chrome工具栏颜色 */}
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="msapplication-navbutton-color" content="#0a0a0a" />
        
        {/* 防止翻译 */}
        <meta name="google" content="notranslate" />
        
        {/* 防止搜索引擎索引开发环境 */}
        {process.env.NODE_ENV === 'development' && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
        <Analytics />
      </ThemeProvider>
    </>
  );
}