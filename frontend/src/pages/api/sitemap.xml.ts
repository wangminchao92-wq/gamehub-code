import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// Sitemap配置
const SITEMAP_CONFIG = {
  // 网站基础URL
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://gamehub.com',
  
  // 页面优先级
  priorities: {
    home: 1.0,
    newsIndex: 0.9,
    article: 0.8,
    community: 0.7,
    user: 0.6,
    guide: 0.7,
    admin: 0.3,
  },
  
  // 更新频率
  changefreq: {
    home: 'daily',
    newsIndex: 'daily',
    article: 'weekly',
    community: 'hourly',
    user: 'monthly',
    guide: 'monthly',
    admin: 'monthly',
  },
};

// 静态页面配置
const STATIC_PAGES = [
  { path: '/', priority: SITEMAP_CONFIG.priorities.home, changefreq: SITEMAP_CONFIG.changefreq.home },
  { path: '/news', priority: SITEMAP_CONFIG.priorities.newsIndex, changefreq: SITEMAP_CONFIG.changefreq.newsIndex },
  { path: '/community', priority: SITEMAP_CONFIG.priorities.community, changefreq: SITEMAP_CONFIG.changefreq.community },
  { path: '/guides', priority: SITEMAP_CONFIG.priorities.guide, changefreq: SITEMAP_CONFIG.changefreq.guide },
  { path: '/login', priority: 0.5, changefreq: 'monthly' },
  { path: '/register', priority: 0.5, changefreq: 'monthly' },
  { path: '/about', priority: 0.4, changefreq: 'monthly' },
  { path: '/contact', priority: 0.4, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
];

// 生成XML sitemap条目
function generateSitemapEntry(url: string, lastmod?: string, changefreq?: string, priority?: number): string {
  let entry = `  <url>\n    <loc>${url}</loc>\n`;
  
  if (lastmod) {
    entry += `    <lastmod>${lastmod}</lastmod>\n`;
  }
  
  if (changefreq) {
    entry += `    <changefreq>${changefreq}</changefreq>\n`;
  }
  
  if (priority !== undefined) {
    entry += `    <priority>${priority.toFixed(1)}</priority>\n`;
  }
  
  entry += `  </url>\n`;
  return entry;
}

// 生成完整的sitemap XML
function generateSitemapXml(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join('')}</urlset>`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 设置响应头
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    
    const entries: string[] = [];
    
    // 1. 添加静态页面
    for (const page of STATIC_PAGES) {
      const url = `${SITEMAP_CONFIG.siteUrl}${page.path}`;
      entries.push(generateSitemapEntry(url, new Date().toISOString().split('T')[0], page.changefreq, page.priority));
    }
    
    // 2. 添加文章页面
    try {
      const articles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() },
        },
        select: {
          slug: true,
          updatedAt: true,
          type: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 1000, // 限制数量，避免sitemap过大
      });
      
      for (const article of articles) {
        const url = `${SITEMAP_CONFIG.siteUrl}/news/${article.slug}`;
        const lastmod = article.updatedAt.toISOString().split('T')[0];
        const priority = SITEMAP_CONFIG.priorities.article;
        const changefreq = article.type === 'NEWS' ? 'daily' : 'weekly';
        
        entries.push(generateSitemapEntry(url, lastmod, changefreq, priority));
      }
      
      console.log(`✅ 添加了 ${articles.length} 篇文章到sitemap`);
    } catch (error) {
      console.error('❌ 获取文章失败:', error);
    }
    
    // 3. 添加社区帖子
    try {
      const posts = await prisma.forumPost.findMany({
        where: {
          status: 'PUBLISHED',
        },
        select: {
          id: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 500, // 限制数量
      });
      
      for (const post of posts) {
        const url = `${SITEMAP_CONFIG.siteUrl}/community/post/${post.id}`;
        const lastmod = post.updatedAt.toISOString().split('T')[0];
        const priority = 0.7;
        const changefreq = 'daily';
        
        entries.push(generateSitemapEntry(url, lastmod, changefreq, priority));
      }
      
      console.log(`✅ 添加了 ${posts.length} 个帖子到sitemap`);
    } catch (error) {
      console.error('❌ 获取帖子失败:', error);
    }
    
    // 4. 添加指南页面
    try {
      const guides = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          type: 'GUIDE',
          publishedAt: { lte: new Date() },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 200,
      });
      
      for (const guide of guides) {
        const url = `${SITEMAP_CONFIG.siteUrl}/guides/${guide.slug}`;
        const lastmod = guide.updatedAt.toISOString().split('T')[0];
        const priority = SITEMAP_CONFIG.priorities.guide;
        const changefreq = 'monthly';
        
        entries.push(generateSitemapEntry(url, lastmod, changefreq, priority));
      }
      
      console.log(`✅ 添加了 ${guides.length} 个指南到sitemap`);
    } catch (error) {
      console.error('❌ 获取指南失败:', error);
    }
    
    // 5. 添加用户页面（可选，通常noindex）
    // 注意：用户页面通常应该noindex，这里可以根据需要开启
    const INCLUDE_USER_PAGES = false;
    if (INCLUDE_USER_PAGES) {
      try {
        const users = await prisma.user.findMany({
          where: {
            status: 'ACTIVE',
          },
          select: {
            username: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: 'desc' },
          take: 100, // 限制活跃用户
        });
        
        for (const user of users) {
          const url = `${SITEMAP_CONFIG.siteUrl}/user/${user.username}`;
          const lastmod = user.updatedAt.toISOString().split('T')[0];
          const priority = SITEMAP_CONFIG.priorities.user;
          const changefreq = 'monthly';
          
          entries.push(generateSitemapEntry(url, lastmod, changefreq, priority));
        }
        
        console.log(`✅ 添加了 ${users.length} 个用户页面到sitemap`);
      } catch (error) {
        console.error('❌ 获取用户失败:', error);
      }
    }
    
    // 生成完整的XML
    const xml = generateSitemapXml(entries);
    
    // 发送响应
    res.status(200).send(xml);
    
    console.log(`🎉 Sitemap生成完成，共 ${entries.length} 个URL`);
    
  } catch (error) {
    console.error('❌ Sitemap生成错误:', error);
    
    // 返回错误响应
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Sitemap generation failed</message>
  <timestamp>${new Date().toISOString()}</timestamp>
</error>`);
  }
}