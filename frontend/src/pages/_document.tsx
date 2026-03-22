import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 字符编码 */}
        <meta charSet="UTF-8" />
        
        {/* 默认页面标题（会被各页面的SEO组件覆盖） */}
        <title>GameHub - Your Ultimate Gaming Destination</title>
        
        {/* Viewport设置（在_app.tsx中设置更佳） */}
        
        {/* 基础SEO标签 */}
        <meta name="description" content="GameHub - Your Ultimate Gaming Destination. IGN-style gaming portal with news, reviews, guides, videos, community, and store." />
        <meta name="keywords" content="gaming, game news, game reviews, game guides, video games, gaming community, game store" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gamehub.com/" />
        <meta property="og:title" content="GameHub - Your Ultimate Gaming Destination" />
        <meta property="og:description" content="IGN-style gaming portal with news, reviews, guides, videos, community, and store." />
        <meta property="og:image" content="https://gamehub.com/og-image.jpg" />
        <meta property="og:site_name" content="GameHub" />
        <meta property="og:locale" content="zh_CN" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://gamehub.com/" />
        <meta property="twitter:title" content="GameHub - Your Ultimate Gaming Destination" />
        <meta property="twitter:description" content="IGN-style gaming portal with news, reviews, guides, videos, community, and store." />
        <meta property="twitter:image" content="https://gamehub.com/og-image.jpg" />
        <meta property="twitter:site" content="@gamehub" />
        <meta property="twitter:creator" content="@gamehub" />
        
        {/* PWA相关 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        
        {/* 字体 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://gamehub.com/" />
        
        {/* 语言设置 */}
        <meta httpEquiv="content-language" content="zh-CN,en" />
        
        {/* 搜索引擎验证 */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="baidu-site-verification" content="your-baidu-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        
        {/* 结构化数据占位符 */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "GameHub",
            "url": "https://gamehub.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://gamehub.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }`}
        </script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}