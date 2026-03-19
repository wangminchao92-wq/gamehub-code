import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: Record<string, any>;
  children?: React.ReactNode;
}

const defaultSEO = {
  title: 'GameHub - Your Ultimate Gaming Destination',
  description: 'IGN-style gaming portal with the latest game news, reviews, guides, videos, community discussions, and store.',
  ogImage: 'https://gamehub.example.com/images/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  siteName: 'GameHub',
  twitterHandle: '@gamehub',
};

export default function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  canonical,
  ogImage = defaultSEO.ogImage,
  ogType = defaultSEO.ogType,
  twitterCard = defaultSEO.twitterCard,
  noindex = false,
  nofollow = false,
  structuredData,
  children,
}: SEOProps) {
  const router = useRouter();
  const currentUrl = `https://gamehub.example.com${router.asPath}`;
  
  // 构建完整的标题
  const fullTitle = title === defaultSEO.title ? title : `${title} | GameHub`;
  
  // 构建结构化数据
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GameHub',
    url: 'https://gamehub.example.com',
    description: defaultSEO.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://gamehub.example.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* 基础SEO标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* 关键词（Google已忽略，但其他搜索引擎可能使用） */}
      <meta name="keywords" content="gaming, game news, game reviews, game guides, video games, gaming community, game store, IGN style" />
      
      {/* 作者和版权 */}
      <meta name="author" content="GameHub Team" />
      <meta name="copyright" content="GameHub" />
      
      {/* 机器人指令 */}
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />
      
      {/* 多语言hreflang */}
      <link rel="alternate" href="https://gamehub.example.com/" hrefLang="x-default" />
      <link rel="alternate" href="https://gamehub.example.com/" hrefLang="en" />
      <link rel="alternate" href="https://gamehub.example.com/zh/" hrefLang="zh" />
      <link rel="alternate" href="https://gamehub.example.com/fr/" hrefLang="fr" />
      <link rel="alternate" href="https://gamehub.example.com/de/" hrefLang="de" />
      <link rel="alternate" href="https://gamehub.example.com/es/" hrefLang="es" />
      <link rel="alternate" href="https://gamehub.example.com/ja/" hrefLang="ja" />
      <link rel="alternate" href="https://gamehub.example.com/ko/" hrefLang="ko" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:type" content="image/jpeg" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={defaultSEO.twitterHandle} />
      <meta name="twitter:creator" content={defaultSEO.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      
      {/* Facebook App ID（如果需要） */}
      {/* <meta property="fb:app_id" content="your-app-id" /> */}
      
      {/* 结构化数据（JSON-LD） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData),
        }}
      />
      
      {/* 额外的结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'GameHub',
            url: 'https://gamehub.example.com',
            logo: 'https://gamehub.example.com/images/logo.png',
            sameAs: [
              'https://twitter.com/gamehub',
              'https://facebook.com/gamehub',
              'https://instagram.com/gamehub',
              'https://youtube.com/gamehub',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-555-123-4567',
              contactType: 'customer service',
              availableLanguage: ['English', 'Chinese'],
            },
          }),
        }}
      />
      
      {/* 面包屑结构化数据 */}
      {router.asPath !== '/' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://gamehub.example.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: title,
                  item: currentUrl,
                },
              ],
            }),
          }}
        />
      )}
      
      {/* 额外的head内容 */}
      {children}
    </Head>
  );
}

// 预定义的SEO配置
export const newsSEO = {
  title: 'Latest Gaming News',
  description: 'Stay updated with the latest gaming news, industry updates, and game releases from around the world.',
  ogType: 'article',
};

export const reviewsSEO = {
  title: 'Game Reviews & Ratings',
  description: 'Read professional game reviews, ratings, and in-depth analysis from our expert gaming editors.',
  ogType: 'article',
};

export const guidesSEO = {
  title: 'Game Guides & Walkthroughs',
  description: 'Find comprehensive game guides, walkthroughs, tips, and strategies for all popular games.',
  ogType: 'article',
};

export const videosSEO = {
  title: 'Gaming Videos & Highlights',
  description: 'Watch the latest gaming videos, gameplay highlights, trailers, and esports tournaments.',
  ogType: 'video.other',
};

export const communitySEO = {
  title: 'Gaming Community',
  description: 'Join our gaming community to discuss games, share experiences, and connect with fellow gamers.',
  ogType: 'website',
};

export const storeSEO = {
  title: 'Game Store',
  description: 'Browse and purchase the latest games, DLCs, and gaming accessories at competitive prices.',
  ogType: 'website',
};