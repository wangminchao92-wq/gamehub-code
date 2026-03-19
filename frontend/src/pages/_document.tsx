import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 字符编码 */}
        <meta charSet="UTF-8" />
        
        {/* Viewport设置（在_app.tsx中设置更佳） */}
        
        {/* 基础SEO标签 */}
        <meta name="description" content="GameHub - Your Ultimate Gaming Destination. IGN-style gaming portal with news, reviews, guides, videos, community, and store." />
        <meta name="keywords" content="gaming, game news, game reviews, game guides, video games, gaming community, game store" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gamehub.example.com/" />
        <meta property="og:title" content="GameHub - Your Ultimate Gaming Destination" />
        <meta property="og:description" content="IGN-style gaming portal with news, reviews, guides, videos, community, and store." />
        <meta property="og:image" content="https://gamehub.example.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://gamehub.example.com/" />
        <meta property="twitter:title" content="GameHub - Your Ultimate Gaming Destination" />
        <meta property="twitter:description" content="IGN-style gaming portal with news, reviews, guides, videos, community, and store." />
        <meta property="twitter:image" content="https://gamehub.example.com/og-image.jpg" />
        
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
        <link rel="canonical" href="https://gamehub.example.com/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}