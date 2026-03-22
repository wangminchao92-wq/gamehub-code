import { NextApiRequest, NextApiResponse } from 'next';

// Sitemap索引配置
const SITEMAP_INDEX_CONFIG = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://gamehub.com',
};

// 生成sitemap索引条目
function generateSitemapIndexEntry(sitemapUrl: string, lastmod?: string): string {
  let entry = `  <sitemap>\n    <loc>${sitemapUrl}</loc>\n`;
  
  if (lastmod) {
    entry += `    <lastmod>${lastmod}</lastmod>\n`;
  }
  
  entry += `  </sitemap>\n`;
  return entry;
}

// 生成完整的sitemap索引 XML
function generateSitemapIndexXml(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}</sitemapindex>`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 设置响应头
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800'); // 24小时缓存
    
    const entries: string[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    // 主sitemap
    entries.push(generateSitemapIndexEntry(
      `${SITEMAP_INDEX_CONFIG.siteUrl}/api/sitemap.xml`,
      today
    ));
    
    // 新闻sitemap
    entries.push(generateSitemapIndexEntry(
      `${SITEMAP_INDEX_CONFIG.siteUrl}/api/sitemap-news.xml`,
      today
    ));
    
    // 图片sitemap
    entries.push(generateSitemapIndexEntry(
      `${SITEMAP_INDEX_CONFIG.siteUrl}/api/sitemap-images.xml`,
      today
    ));
    
    // 视频sitemap（预留）
    // entries.push(generateSitemapIndexEntry(
    //   `${SITEMAP_INDEX_CONFIG.siteUrl}/api/sitemap-videos.xml`,
    //   today
    // ));
    
    // 生成完整的XML
    const xml = generateSitemapIndexXml(entries);
    
    // 发送响应
    res.status(200).send(xml);
    
    console.log(`🎉 Sitemap索引生成完成，共 ${entries.length} 个sitemap`);
    
  } catch (error) {
    console.error('❌ Sitemap索引生成错误:', error);
    
    // 返回错误响应
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Sitemap index generation failed</message>
  <timestamp>${new Date().toISOString()}</timestamp>
</error>`);
  }
}