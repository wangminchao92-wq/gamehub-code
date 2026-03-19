import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { Calendar, User, Eye, MessageSquare, TrendingUp, Filter, Search } from 'lucide-react';

// 新闻数据
const newsArticles = [
  {
    id: 1,
    title: '赛博朋克2077：往日之影DLC获得年度最佳扩展包奖',
    excerpt: 'CD Projekt Red宣布，《赛博朋克2077：往日之影》在今年的游戏大奖中荣获年度最佳扩展包奖。',
    category: '新闻',
    date: '2026-03-19',
    author: 'GameHub编辑',
    views: '12.4K',
    comments: 342,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    title: '艾尔登法环：黄金树之影DLC正式发售日期公布',
    excerpt: 'FromSoftware正式公布《艾尔登法环：黄金树之影》DLC将于2026年6月21日全球同步发售。',
    category: '新闻',
    date: '2026-03-18',
    author: '游戏前线',
    views: '8.7K',
    comments: 189,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 3,
    title: '任天堂Switch 2规格泄露，性能大幅提升',
    excerpt: '据内部消息透露，任天堂下一代主机Switch 2将采用定制NVIDIA芯片，性能达到当前机型的3倍。',
    category: '硬件',
    date: '2026-03-17',
    author: '硬件观察',
    views: '15.2K',
    comments: 521,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 4,
    title: '微软宣布Xbox Game Pass新增50款游戏',
    excerpt: '微软在今日的发布会上宣布，Xbox Game Pass将在本月新增50款游戏，包括多款首发作品。',
    category: '订阅服务',
    date: '2026-03-16',
    author: '订阅观察',
    views: '6.8K',
    comments: 124,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 5,
    title: '独立游戏《星海旅人》销量突破100万份',
    excerpt: '由国内独立游戏团队开发的《星海旅人》在发售三个月后，全球销量正式突破100万份。',
    category: '独立游戏',
    date: '2026-03-15',
    author: '独立之光',
    views: '5.3K',
    comments: 89,
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 6,
    title: 'PlayStation VR2 Pro版传闻：更高分辨率，更轻设计',
    excerpt: '据索尼内部人士透露，PlayStation VR2 Pro版正在开发中，预计2027年发布。',
    category: 'VR/AR',
    date: '2026-03-14',
    author: 'VR前沿',
    views: '4.2K',
    comments: 76,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
];

const categories = [
  { name: '全部', count: 156 },
  { name: '新闻', count: 42 },
  { name: '评测', count: 28 },
  { name: '硬件', count: 19 },
  { name: '独立游戏', count: 35 },
  { name: 'VR/AR', count: 12 },
  { name: '电竞', count: 20 },
];

export default function NewsPage() {
  return (
    <MainLayout>
      {/* 新闻页面头部 */}
      <div className="relative bg-gradient-to-r from-gray-900 to-primary-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">游戏新闻</h1>
            <p className="text-xl text-gray-300 mb-8">
              最新游戏资讯、行业动态、技术前沿，第一时间掌握游戏世界的最新动向
            </p>
            
            {/* 搜索和筛选 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索新闻..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-primary-500 transition-colors">
                <Filter className="h-5 w-5 mr-2" />
                筛选
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：分类导航 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 mb-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary-400" />
                  新闻分类
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors text-left"
                    >
                      <span className="text-gray-300">{category.name}</span>
                      <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 热门标签 */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-lg font-bold text-white mb-4">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  {['#赛博朋克2077', '#艾尔登法环', '#独立游戏', '#VR', '#电竞', '#游戏开发', '#云游戏'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-sm bg-gray-700/50 text-gray-300 rounded-full hover:bg-primary-500/20 hover:text-primary-300 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：新闻列表 */}
          <div className="lg:col-span-3">
            {/* 特色新闻 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">特色报道</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsArticles.filter(article => article.featured).map((article) => (
                  <Link key={article.id} href={`/news/${article.id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                        {/* 图片 */}
                        <div className="relative h-48 overflow-hidden">
                          <div 
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${article.image})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 text-xs font-bold bg-primary-500 text-white rounded-full">
                              {article.category}
                            </span>
                          </div>
                        </div>

                        {/* 内容 */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {article.author}
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {article.date}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {article.views}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {article.comments}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 最新新闻 */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">最新新闻</h2>
                <div className="text-sm text-gray-400">
                  共 {newsArticles.length} 篇文章
                </div>
              </div>

              <div className="space-y-6">
                {newsArticles.map((article) => (
                  <Link key={article.id} href={`/news/${article.id}`}>
                    <div className="group cursor-pointer">
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-primary-500/30 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start">
                          {/* 图片 */}
                          <div className="md:w-48 md:flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                            <div className="relative h-40 md:h-32 rounded-lg overflow-hidden">
                              <div 
                                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${article.image})` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                            </div>
                          </div>

                          {/* 内容 */}
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 text-xs font-bold bg-primary-500/20 text-primary-300 rounded-full">
                                  {article.category}
                                </span>
                                {article.featured && (
                                  <span className="px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-300 rounded-full">
                                    推荐
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-400">{article.date}</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-gray-400 mb-4 line-clamp-2">
                              {article.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <User className="h-4 w-4 mr-1" />
                                {article.author}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {article.views}
                                </div>
                                <div className="flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  {article.comments}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 分页 */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
                    上一页
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === 1
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
                    下一页
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}