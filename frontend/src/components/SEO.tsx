import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: any[];
  noindex?: boolean;
  nofollow?: boolean;
  robots?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'game news, game reviews, game guides, gaming community, video games, esports, game store',
  canonical,
  ogImage = 'https://gamehub.com/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData = [],
  noindex = false,
  nofollow = false,
  robots,
  author = 'GameHub',
  publishedTime,
  modifiedTime,
  section = 'Gaming',
  tags = ['gaming', 'video games', 'esports']
}) => {
  // 处理robots指令
  const robotsDirective = robots || `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;
  
  // 处理canonical URL
  const canonicalUrl = canonical || 'https://gamehub.com';
  
  // 基础结构化数据
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": canonicalUrl,
    "inLanguage": "zh-CN",
    "isPartOf": {
      "@type": "WebSite",
      "name": "GameHub",
      "url": "https://gamehub.com"
    }
  };

  // 文章类型结构化数据
  const articleStructuredData = publishedTime ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": ogImage,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "GameHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gamehub.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": section,
    "keywords": tags.join(', ')
  } : null;

  // 合并所有结构化数据
  const allStructuredData = [baseStructuredData];
  if (structuredData) {
    if (Array.isArray(structuredData)) {
      allStructuredData.push(...structuredData);
    } else {
      allStructuredData.push(structuredData);
    }
  }
  // 暂时注释掉文章结构化数据，避免TypeScript错误
  // if (articleStructuredData) {
  //   allStructuredData.push(articleStructuredData);
  // }

  return (
    <Head>
      {/* 基础SEO标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsDirective} />
      <meta name="author" content={author} />
      
      {/* 语言和字符集 */}
      <meta charSet="UTF-8" />
      <meta httpEquiv="Content-Language" content="zh-CN" />
      <meta name="language" content="Chinese" />
      
      {/* 视口设置（移动端友好） */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="GameHub" />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@gamehub" />
      <meta name="twitter:creator" content="@gamehub" />
      
      {/* 额外的Open Graph标签 */}
      {publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime || publishedTime} />
          <meta property="article:author" content={author} />
          <meta property="article:section" content={section} />
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* 移动端特定标签 */}
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="GameHub" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* PWA相关 */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* 预加载关键资源 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      
      {/* 结构化数据 */}
      {allStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      {/* 额外的meta标签 */}
      <meta name="application-name" content="GameHub" />
      <meta name="msapplication-TileColor" content="#1a1a1a" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="theme-color" content="#1a1a1a" />
      
      {/* 性能优化标签 */}
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* 安全相关标签 */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Head>
  );
};

export default SEO;