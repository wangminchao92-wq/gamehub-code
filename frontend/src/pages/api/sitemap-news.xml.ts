import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// 新闻sitemap配置
const NEWS_SITEMAP_CONFIG = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://gamehub.com',
  publicationName: 'GameHub',
  publicationLanguage: 'zh-cn',
};

// 生成新闻sitemap条目
function generateNewsSitemapEntry(
  url: string,
  title: string,
  publicationDate: string,
  keywords?: string[]
): string {
  let entry = `  <url>\n    <loc>${url}</loc>\n`;
  entry += `    <news:news>\n`;
  entry += `      <news:publication>\n`;
  entry += `        <news:name>${NEWS_SITEMAP_CONFIG.publicationName}</news:name>\n`;
  entry += `        <news:language>${NEWS_SITEMAP_CONFIG.publicationLanguage}</news:language>\n`;
  entry += `      </news:publication>\n`;
  entry += `      <news:publication_date>${publicationDate}</news:publication_date>\n`;
  entry += `      <news:title>${escapeXml(title)}</news:title>\n`;
  
  if (keywords && keywords.length > 0) {
    entry += `      <news:keywords>${keywords.slice(0, 10).join(', ')}</news:keywords>\n`;
  }
  
  entry += `    </news:news>\n`;
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

// 生成完整的新闻sitemap XML
function generateNewsSitemapXml(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.join('')}</urlset>`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 设置响应头
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
    
    const entries: string[] = [];
    
    // 获取最近48小时的新闻文章
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
    
    try {
      const newsArticles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          type: 'NEWS',
          publishedAt: {
            gte: fortyEightHoursAgo,
            lte: new Date(),
          },
        },
        select: {
          slug: true,
          title: true,
          publishedAt: true,
          tags: true,
          excerpt: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: 1000, // Google News限制最多1000条
      });
      
      for (const article of newsArticles) {
        const url = `${NEWS_SITEMAP_CONFIG.siteUrl}/news/${article.slug}`;
        const publicationDate = article.publishedAt.toISOString().split('T')[0];
        
        entries.push(generateNewsSitemapEntry(
          url,
          article.title,
          publicationDate,
          article.tags
        ));
      }
      
      console.log(`✅ 新闻sitemap: 添加了 ${newsArticles.length} 篇新闻文章`);
      
    } catch (error) {
      console.error('❌ 获取新闻文章失败:', error);
    }
    
    // 如果没有新闻文章，返回空sitemap
    if (entries.length === 0) {
      entries.push(generateNewsSitemapEntry(
        `${NEWS_SITEMAP_CONFIG.siteUrl}/news`,
        'GameHub最新游戏新闻',
        new Date().toISOString().split('T')[0],
        ['游戏', '新闻', 'GameHub']
      ));
    }
    
    // 生成完整的XML
    const xml = generateNewsSitemapXml(entries);
    
    // 发送响应
    res.status(200).send(xml);
    
    console.log(`🎉 新闻sitemap生成完成，共 ${entries.length} 个URL`);
    
  } catch (error) {
    console.error('❌ 新闻sitemap生成错误:', error);
    
    // 返回错误响应
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>News sitemap generation failed</message>
  <timestamp>${new Date().toISOString()}</timestamp>
</error>`);
  }
}