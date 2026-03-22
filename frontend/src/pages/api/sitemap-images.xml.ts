import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// 图片sitemap配置
const IMAGES_SITEMAP_CONFIG = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://gamehub.com',
  defaultImage: 'https://gamehub.com/og-image.jpg',
};

// 生成图片sitemap条目
function generateImageSitemapEntry(
  pageUrl: string,
  imageUrl: string,
  caption?: string,
  title?: string,
  license?: string
): string {
  let entry = `  <url>\n    <loc>${pageUrl}</loc>\n`;
  entry += `    <image:image>\n`;
  entry += `      <image:loc>${imageUrl}</image:loc>\n`;
  
  if (caption) {
    entry += `      <image:caption>${escapeXml(caption)}</image:caption>\n`;
  }
  
  if (title) {
    entry += `      <image:title>${escapeXml(title)}</image:title>\n`;
  }
  
  if (license) {
    entry += `      <image:license>${license}</image:license>\n`;
  }
  
  entry += `    </image:image>\n`;
  entry += `  </url>\n`;
  return entry;
}

// 生成多图片sitemap条目
function generateMultiImageSitemapEntry(
  pageUrl: string,
  images: Array<{
    url: string;
    caption?: string;
    title?: string;
    license?: string;
  }>
): string {
  let entry = `  <url>\n    <loc>${pageUrl}</loc>\n`;
  
  for (const image of images) {
    entry += `    <image:image>\n`;
    entry += `      <image:loc>${image.url}</image:loc>\n`;
    
    if (image.caption) {
      entry += `      <image:caption>${escapeXml(image.caption)}</image:caption>\n`;
    }
    
    if (image.title) {
      entry += `      <image:title>${escapeXml(image.title)}</image:title>\n`;
    }
    
    if (image.license) {
      entry += `      <image:license>${image.license}</image:license>\n`;
    }
    
    entry += `    </image:image>\n`;
  }
  
  entry += `  </url>\n`;
  return entry;
}

// XML转义
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// 生成完整的图片sitemap XML
function generateImageSitemapXml(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('')}</urlset>`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 设置响应头
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    
    const entries: string[] = [];
    
    // 1. 首页图片
    entries.push(generateImageSitemapEntry(
      `${IMAGES_SITEMAP_CONFIG.siteUrl}/`,
      IMAGES_SITEMAP_CONFIG.defaultImage,
      'GameHub - 专业的游戏资讯和社区平台',
      'GameHub Logo'
    ));
    
    // 2. 文章图片
    try {
      const articles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() },
          coverImage: { not: null },
        },
        select: {
          slug: true,
          title: true,
          coverImage: true,
          excerpt: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: 500, // 限制数量
      });
      
      for (const article of articles) {
        if (article.coverImage) {
          entries.push(generateImageSitemapEntry(
            `${IMAGES_SITEMAP_CONFIG.siteUrl}/news/${article.slug}`,
            article.coverImage,
            article.excerpt || `阅读${article.title}的完整内容`,
            article.title
          ));
        }
      }
      
      console.log(`✅ 图片sitemap: 添加了 ${articles.length} 篇文章图片`);
      
    } catch (error) {
      console.error('❌ 获取文章图片失败:', error);
    }
    
    // 3. 游戏卡片图片（模拟数据）
    const gameImages = [
      {
        pageUrl: `${IMAGES_SITEMAP_CONFIG.siteUrl}/games/cyberpunk-2077`,
        imageUrl: `${IMAGES_SITEMAP_CONFIG.siteUrl}/images/games/cyberpunk.jpg`,
        title: '赛博朋克 2077',
        caption: '开放世界角色扮演游戏'
      },
      {
        pageUrl: `${IMAGES_SITEMAP_CONFIG.siteUrl}/games/elden-ring`,
        imageUrl: `${IMAGES_SITEMAP_CONFIG.siteUrl}/images/games/elden-ring.jpg`,
        title: '艾尔登法环',
        caption: '黑暗幻想动作RPG'
      },
      {
        pageUrl: `${IMAGES_SITEMAP_CONFIG.siteUrl}/games/baldurs-gate-3`,
        imageUrl: `${IMAGES_SITEMAP_CONFIG.siteUrl}/images/games/baldurs-gate-3.jpg`,
        title: '博德之门 3',
        caption: '史诗级角色扮演游戏'
      },
      {
        pageUrl: `${IMAGES_SITEMAP_CONFIG.siteUrl}/games/the-legend-of-zelda-tears-of-the-kingdom`,
        imageUrl: `${IMAGES_SITEMAP_CONFIG.siteUrl}/images/games/zelda-totk.jpg`,
        title: '塞尔达传说：王国之泪',
        caption: '开放世界冒险游戏'
      }
    ];
    
    for (const game of gameImages) {
      entries.push(generateImageSitemapEntry(
        game.pageUrl,
        game.imageUrl,
        game.caption,
        game.title
      ));
    }
    
    // 4. 用户头像图片（如果有用户数据）
    try {
      const users = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          avatar: { not: null },
        },
        select: {
          username: true,
          displayName: true,
          avatar: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // 限制数量
      });
      
      for (const user of users) {
        if (user.avatar) {
          entries.push(generateImageSitemapEntry(
            `${IMAGES_SITEMAP_CONFIG.siteUrl}/user/${user.username}`,
            user.avatar,
            `${user.displayName || user.username}的头像`,
            `${user.displayName || user.username} - GameHub用户`
          ));
        }
      }
      
      console.log(`✅ 图片sitemap: 添加了 ${users.length} 个用户头像`);
      
    } catch (error) {
      console.error('❌ 获取用户头像失败:', error);
    }
    
    // 生成完整的XML
    const xml = generateImageSitemapXml(entries);
    
    // 发送响应
    res.status(200).send(xml);
    
    console.log(`🎉 图片sitemap生成完成，共 ${entries.length} 个URL`);
    
  } catch (error) {
    console.error('❌ 图片sitemap生成错误:', error);
    
    // 返回错误响应
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Image sitemap generation failed</message>
  <timestamp>${new Date().toISOString()}</timestamp>
</error>`);
  }
}