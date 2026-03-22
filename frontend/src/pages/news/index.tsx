import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { Calendar, Eye, Heart, MessageCircle, User, Tag } from 'lucide-react';

// 模拟新闻数据
const mockArticles = [
  {
    id: 'article-001',
    title: '《黑神话：悟空》全球销量突破1000万份',
    slug: 'black-myth-wukong-sales',
    type: 'NEWS',
    excerpt: '国产3A大作《黑神话：悟空》在发售一个月内全球销量突破1000万份，创造了国产单机游戏的新纪录。',
    content: '详细内容...',
    author: '游戏新闻记者',
    views: 125000,
    likes: 8900,
    comments: 342,
    publishedAt: '2026-03-15T10:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop',
    tags: ['国产游戏', '3A大作', '销量记录']
  },
  {
    id: 'article-002',
    title: '《塞尔达传说：王国之泪》获年度游戏大奖',
    slug: 'zelda-tears-kingdom-goty',
    type: 'NEWS',
    excerpt: '任天堂Switch平台独占大作《塞尔达传说：王国之泪》在2026年游戏大奖中荣获年度游戏奖项。',
    content: '详细内容...',
    author: '游戏评测师',
    views: 98000,
    likes: 7500,
    comments: 289,
    publishedAt: '2026-03-10T14:20:00Z',
    coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=450&fit=crop',
    tags: ['年度游戏', '任天堂', 'Switch独占']
  },
  {
    id: 'article-003',
    title: '《最终幻想VII 重生》评测：经典重制的巅峰之作',
    slug: 'final-fantasy-vii-rebirth-review',
    type: 'REVIEW',
    excerpt: 'Square Enix的《最终幻想VII 重生》不仅完美重制了经典，更在画面、剧情和游戏性上达到了新的高度。',
    content: '详细内容...',
    author: '游戏评测师',
    views: 76000,
    likes: 5200,
    comments: 198,
    publishedAt: '2026-03-05T09:15:00Z',
    coverImage: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&h=450&fit=crop',
    tags: ['最终幻想', '重制版', '角色扮演']
  },
  {
    id: 'article-004',
    title: '《星露谷物语2》抢先体验版发布，首日销量破50万',
    slug: 'stardew-valley-2-early-access',
    type: 'NEWS',
    excerpt: '备受期待的农场模拟游戏《星露谷物语2》抢先体验版上线Steam，首日销量突破50万份。',
    content: '详细内容...',
    author: '独立游戏爱好者',
    views: 65000,
    likes: 4800,
    comments: 156,
    publishedAt: '2026-03-01T16:45:00Z',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
    tags: ['独立游戏', '农场模拟', '抢先体验']
  },
  {
    id: 'article-005',
    title: '《使命召唤：现代战争III》多人模式深度评测',
    slug: 'call-of-duty-mw3-multiplayer-review',
    type: 'REVIEW',
    excerpt: '动视年货大作《使命召唤：现代战争III》多人模式评测：经典地图回归，战斗节奏升级。',
    content: '详细内容...',
    author: 'FPS专家',
    views: 89000,
    likes: 6100,
    comments: 245,
    publishedAt: '2026-02-25T11:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
    tags: ['使命召唤', 'FPS', '多人游戏']
  },
  {
    id: 'article-006',
    title: '如何快速提升《艾尔登法环》角色等级：新手攻略',
    slug: 'elden-ring-leveling-guide',
    type: 'GUIDE',
    excerpt: '针对《艾尔登法环》新手的快速升级攻略，包含最佳刷经验地点和效率提升技巧。',
    content: '详细内容...',
    author: '攻略大师',
    views: 112000,
    likes: 7800,
    comments: 321,
    publishedAt: '2026-02-20T13:45:00Z',
    coverImage: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=450&fit=crop',
    tags: ['艾尔登法环', '攻略', '新手指导']
  }
];

export default function NewsPage() {
  return (
    <MainLayout>
      <SEO 
        title="游戏新闻 - GameHub"
        description="最新游戏新闻、行业动态、发布会信息、游戏评测和攻略"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">游戏新闻</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            最新游戏资讯、行业动态、深度评测和专业攻略
          </p>
        </div>

        {/* 筛选栏 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              全部
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              新闻
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              评测
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              攻略
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              视频
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              博客
            </button>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArticles.map((article) => (
            <div key={article.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* 封面图 */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    article.type === 'NEWS' ? 'bg-blue-100 text-blue-800' :
                    article.type === 'REVIEW' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {article.type === 'NEWS' ? '新闻' : 
                     article.type === 'REVIEW' ? '评测' : '攻略'}
                  </span>
                </div>
              </div>

              {/* 文章内容 */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      +{article.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* 元信息 */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-sm">{article.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-sm">{article.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">{article.comments.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={`/news/ultra-simple/${article.slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    阅读全文 →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分页 */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              上一页
            </button>
            
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              2
            </button>
            <button className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              10
            </button>
            
            <button className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              下一页
            </button>
          </nav>
        </div>

        {/* 空状态提示 */}
        {mockArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📰</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              暂无新闻内容
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              当前没有可显示的新闻文章，请稍后再来查看。
            </p>
          </div>
        )}

        {/* 统计信息 */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-4">
            新闻统计
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockArticles.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">文章总数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockArticles.filter(a => a.type === 'NEWS').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">新闻资讯</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mockArticles.filter(a => a.type === 'REVIEW').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">游戏评测</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {mockArticles.filter(a => a.type === 'GUIDE').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">攻略指南</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}