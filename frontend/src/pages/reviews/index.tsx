import React from 'react';
import SEO from '@/components/SEO';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { Star, Gamepad2, Calendar, User, Filter, Search, Trophy, Award } from 'lucide-react';

// 评测数据
const reviews = [
  {
    id: 1,
    title: '赛博朋克2077：往日之影 - 夜之城的完美救赎',
    game: '赛博朋克2077：往日之影',
    platform: 'PC/PS5/Xbox',
    score: 9.5,
    excerpt: 'CD Projekt Red通过这个DLC不仅修复了游戏的问题，更将其提升到了新的高度。',
    author: '评测专家',
    date: '2026-03-18',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    tags: ['角色扮演', '开放世界', '剧情丰富'],
    featured: true,
  },
  {
    id: 2,
    title: '艾尔登法环：黄金树之影 - 魂系游戏的又一巅峰',
    game: '艾尔登法环：黄金树之影',
    platform: '全平台',
    score: 9.8,
    excerpt: 'FromSoftware再次证明了自己在动作角色扮演游戏领域的统治地位。',
    author: '魂系爱好者',
    date: '2026-03-17',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    tags: ['动作RPG', '高难度', '探索'],
    featured: true,
  },
  {
    id: 3,
    title: '博德之门3 - CRPG的文艺复兴之作',
    game: '博德之门3',
    platform: 'PC/PS5',
    score: 9.6,
    excerpt: '拉瑞安工作室用这款游戏重新定义了现代CRPG的标准。',
    author: 'RPG大师',
    date: '2026-03-16',
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=800&q=80',
    tags: ['CRPG', '策略', '多人合作'],
    featured: false,
  },
  {
    id: 4,
    title: '星空 - Bethesda的太空史诗',
    game: '星空',
    platform: 'PC/Xbox',
    score: 8.7,
    excerpt: '宏大的太空探索体验，但技术问题影响了整体表现。',
    author: '太空探索者',
    date: '2026-03-15',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    tags: ['太空', '探索', 'RPG'],
    featured: false,
  },
  {
    id: 5,
    title: '最终幻想VII 重生 - 经典的重生与创新',
    game: '最终幻想VII 重生',
    platform: 'PS5',
    score: 9.3,
    excerpt: 'Square Enix成功地将经典与现代游戏设计完美结合。',
    author: '最终幻想粉丝',
    date: '2026-03-14',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80',
    tags: ['JRPG', '重制版', '剧情驱动'],
    featured: false,
  },
  {
    id: 6,
    title: '地狱潜者2 - 合作射击的极致乐趣',
    game: '地狱潜者2',
    platform: 'PC/PS5',
    score: 8.9,
    excerpt: '简单而纯粹的合作射击乐趣，让人欲罢不能。',
    author: '射击游戏专家',
    date: '2026-03-13',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
    tags: ['射击', '合作', '多人'],
    featured: false,
  },
];

const platforms = ['全部', 'PC', 'PlayStation', 'Xbox', 'Nintendo', '移动端'];
const genres = ['全部', '角色扮演', '动作', '射击', '策略', '冒险', '体育', '模拟'];

export default function ReviewsPage() {
  return (
    <MainLayout>
      {/* SEO优化 */}
      <SEO
        title="游戏评测 | GameHub - 专业游戏评测和评分"
        description="阅读专业的游戏评测、评分和游戏分析。GameHub提供公正和深入的游戏评测。"
        keywords="游戏评测, 游戏评分, 游戏分析, 游戏评论, 游戏评价"
        canonical="https://gamehub.com/reviews"
      />
      
      {/* 传统meta标签作为SEO检查备用 */}
      <title>游戏评测 | GameHub - 专业游戏评测和评分</title>
      <meta name="description" content="阅读专业的游戏评测、评分和游戏分析。GameHub提供公正和深入的游戏评测。" />
      {/* 页面头部 */}
      <div className="relative bg-gradient-to-r from-gray-900 to-purple-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">游戏评测</h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              专业、客观、深度的游戏评测，帮助你找到最适合的游戏
            </p>
            
            {/* 搜索和筛选 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索游戏评测..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-primary-500 transition-colors">
                <Filter className="h-5 w-5 mr-2" />
                高级筛选
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：筛选器 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 平台筛选 */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Gamepad2 className="h-5 w-5 mr-2 text-primary-400" />
                  平台
                </h3>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <label key={platform} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-3 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500" />
                      <span className="text-gray-300">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 类型筛选 */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-lg font-bold text-white mb-4">游戏类型</h3>
                <div className="space-y-2">
                  {genres.map((genre) => (
                    <label key={genre} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-3 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500" />
                      <span className="text-gray-300">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 评分筛选 */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-lg font-bold text-white mb-4">评分范围</h3>
                <div className="space-y-3">
                  {[
                    { label: '9分以上（神作）', value: 9 },
                    { label: '8-9分（优秀）', value: 8 },
                    { label: '7-8分（良好）', value: 7 },
                    { label: '6-7分（一般）', value: 6 },
                  ].map((range) => (
                    <label key={range.value} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-3 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500" />
                      <span className="text-gray-300">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 编辑推荐 */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-400" />
                  编辑推荐
                </h3>
                <div className="space-y-4">
                  {reviews.filter(r => r.featured).slice(0, 3).map((review) => (
                    <Link key={review.id} href={`/reviews/${review.id}`}>
                      <div className="group cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                            <div 
                              className="h-full w-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${review.image})` }}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white line-clamp-1 group-hover:text-primary-300 transition-colors">
                              {review.game}
                            </div>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(review.score / 2)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-sm font-bold text-white">{review.score}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：评测列表 */}
          <div className="lg:col-span-3">
            {/* 特色评测 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">编辑精选</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.filter(review => review.featured).map((review) => (
                  <Link key={review.id} href={`/reviews/${review.id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                        {/* 评分徽章 */}
                        <div className="absolute top-4 right-4 z-10">
                          <div className="flex items-center bg-black/80 backdrop-blur-sm px-3 py-2 rounded-full">
                            <div className="text-2xl font-bold text-white mr-1">{review.score}</div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(review.score / 2)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 图片 */}
                        <div className="relative h-48 overflow-hidden">
                          <div 
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${review.image})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                        </div>

                        {/* 内容 */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Gamepad2 className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-400">{review.platform}</span>
                            </div>
                            <div className="text-sm text-gray-400">{review.date}</div>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                            {review.title}
                          </h3>
                          <p className="text-gray-400 mb-4 line-clamp-2">
                            {review.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-4 w-4 mr-1" />
                              {review.author}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {review.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 最新评测 */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">最新评测</h2>
                <div className="text-sm text-gray-400">
                  共 {reviews.length} 篇评测
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <Link key={review.id} href={`/reviews/${review.id}`}>
                    <div className="group cursor-pointer">
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-primary-500/30 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start">
                          {/* 图片和评分 */}
                          <div className="md:w-48 md:flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                            <div className="relative h-40 md:h-32 rounded-lg overflow-hidden mb-3">
                              <div 
                                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${review.image})` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="text-3xl font-bold text-white mr-2">{review.score}</div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(review.score / 2)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 内容 */}
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 text-xs font-bold bg-primary-500/20 text-primary-300 rounded-full">
                                  {review.platform}
                                </span>
                                {review.featured && (
                                  <span className="px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-300 rounded-full">
                                    精选
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-400">{review.date}</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                              {review.title}
                            </h3>
                            <div className="text-sm text-gray-400 mb-2">{review.game}</div>
                            <p className="text-gray-400 mb-4 line-clamp-2">
                              {review.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <User className="h-4 w-4 mr-1" />
                                {review.author}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {review.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
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

      {/* 评分标准说明 */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-t border-gray-700/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-bold text-white mb-4 text-center">我们的评分标准</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { score: '9-10', label: '杰作', desc: '必玩之作，定义了游戏类型' },
              { score: '8-8.9', label: '优秀', desc: '高度推荐，具有突出优点' },
              { score: '7-7.9', label: '良好', desc: '值得一玩，有明显亮点' },
              { score: '6-6.9', label: '一般', desc: '有优点但也有明显缺点' },
            ].map((standard) => (
              <div key={standard.score} className="text-center">
                <div className="text-2xl font-bold text-white mb-2">{standard.score}</div>
                <div className="text-lg font-bold text-primary-300 mb-1">{standard.label}</div>
                <div className="text-sm text-gray-400">{standard.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
