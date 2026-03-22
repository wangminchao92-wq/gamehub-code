import React from 'react';
import SEO from '@/components/SEO';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { BookOpen, Target, Zap, Shield, Sword, Heart, Search, Filter, TrendingUp, Eye } from 'lucide-react';

// 攻略数据
const guides = [
  {
    id: 1,
    title: '艾尔登法环：黄金树之影 - 全BOSS打法攻略',
    game: '艾尔登法环：黄金树之影',
    difficulty: '困难',
    time: '45分钟',
    author: '魂系大师',
    date: '2026-03-19',
    views: '25.4K',
    likes: '3.2K',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    tags: ['BOSS战', '技巧', '全收集'],
    featured: true,
  },
  {
    id: 2,
    title: '赛博朋克2077：往日之影 - 最佳技能搭配指南',
    game: '赛博朋克2077：往日之影',
    difficulty: '中等',
    time: '30分钟',
    author: '夜之城专家',
    date: '2026-03-18',
    views: '18.7K',
    likes: '2.4K',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    tags: ['技能', '配装', '优化'],
    featured: true,
  },
  {
    id: 3,
    title: '博德之门3 - 最佳队伍配置和战术',
    game: '博德之门3',
    difficulty: '中等',
    time: '60分钟',
    author: '策略大师',
    date: '2026-03-17',
    views: '12.3K',
    likes: '1.8K',
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=800&q=80',
    tags: ['队伍', '战术', '职业'],
    featured: false,
  },
  {
    id: 4,
    title: '最终幻想VII 重生 - 全魔晶石收集指南',
    game: '最终幻想VII 重生',
    difficulty: '简单',
    time: '25分钟',
    author: '收集达人',
    date: '2026-03-16',
    views: '9.8K',
    likes: '1.2K',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80',
    tags: ['收集', '魔晶石', '隐藏要素'],
    featured: false,
  },
  {
    id: 5,
    title: '地狱潜者2 - 高效刷资源攻略',
    game: '地狱潜者2',
    difficulty: '简单',
    time: '20分钟',
    author: '效率专家',
    date: '2026-03-15',
    views: '15.6K',
    likes: '2.1K',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
    tags: ['资源', '效率', '合作'],
    featured: false,
  },
  {
    id: 6,
    title: '星空 - 飞船建造完全指南',
    game: '星空',
    difficulty: '困难',
    time: '90分钟',
    author: '太空工程师',
    date: '2026-03-14',
    views: '22.1K',
    likes: '3.5K',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    tags: ['飞船', '建造', '自定义'],
    featured: false,
  },
];

const categories = [
  { name: '全部', icon: BookOpen, count: 156 },
  { name: 'BOSS攻略', icon: Sword, count: 42 },
  { name: '收集指南', icon: Target, count: 38 },
  { name: '技巧教学', icon: Zap, count: 45 },
  { name: '配装推荐', icon: Shield, count: 31 },
];

const difficulties = ['全部', '简单', '中等', '困难', '专家'];

export default function GuidesPage() {
  return (
    <MainLayout>
      {/* SEO优化 */}
      <SEO
        title="游戏攻略 | GameHub - 专业游戏攻略和技巧"
        description="查找专业的游戏攻略、技巧、通关指南和游戏策略。GameHub提供全面的游戏攻略资源。"
        keywords="游戏攻略, 游戏技巧, 通关指南, 游戏策略, 游戏教程"
        canonical="https://gamehub.com/guides"
      />
      
      {/* 传统meta标签作为SEO检查备用 */}
      <title>游戏攻略 | GameHub - 专业游戏攻略和技巧</title>
      <meta name="description" content="查找专业的游戏攻略、技巧、通关指南和游戏策略。GameHub提供全面的游戏攻略资源。" />
      {/* 页面头部 */}
      <div className="relative bg-gradient-to-r from-gray-900 to-emerald-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-emerald-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">游戏攻略</h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              专业游戏攻略、技巧教学、收集指南，助你轻松通关
            </p>
            
            {/* 搜索和筛选 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索攻略..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-emerald-500 transition-colors">
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
            <div className="sticky top-24 space-y-6">
              {/* 攻略分类 */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h2 className="text-xl font-bold text-white mb-4">攻略分类</h2>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.name}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <Icon className="h-5 w-5 mr-3 text-emerald-400" />
                          <span className="text-gray-300">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 难度筛选 */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-lg font-bold text-white mb-4">难度等级</h3>
                <div className="space-y-2">
                  {difficulties.map((difficulty) => (
                    <label key={difficulty} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-3 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500" />
                      <span className="text-gray-300">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 热门攻略 */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-400" />
                  热门攻略
                </h3>
                <div className="space-y-4">
                  {guides.slice(0, 3).map((guide) => (
                    <Link key={guide.id} href={`/guides/${guide.id}`}>
                      <div className="group cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                            <div 
                              className="h-full w-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${guide.image})` }}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                              {guide.game}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                              {guide.title}
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <Heart className="h-3 w-3 mr-1" />
                              {guide.likes}
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

          {/* 右侧：攻略列表 */}
          <div className="lg:col-span-3">
            {/* 特色攻略 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">精选攻略</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.filter(guide => guide.featured).map((guide) => (
                  <Link key={guide.id} href={`/guides/${guide.id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                        {/* 难度标签 */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            guide.difficulty === '困难' ? 'bg-red-500/20 text-red-300' :
                            guide.difficulty === '中等' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {guide.difficulty}
                          </span>
                        </div>

                        {/* 图片 */}
                        <div className="relative h-48 overflow-hidden">
                          <div 
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${guide.image})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                        </div>

                        {/* 内容 */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm text-gray-400">{guide.game}</div>
                            <div className="flex items-center text-sm text-gray-400">
                              <span>{guide.time}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                            {guide.title}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <span>by {guide.author}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {guide.views}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {guide.likes}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {guide.tags.map((tag) => (
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
                  </Link>
                ))}
              </div>
            </div>

            {/* 最新攻略 */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">最新攻略</h2>
                <div className="text-sm text-gray-400">
                  共 {guides.length} 篇攻略
                </div>
              </div>

              <div className="space-y-6">
                {guides.map((guide) => (
                  <Link key={guide.id} href={`/guides/${guide.id}`}>
                    <div className="group cursor-pointer">
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-emerald-500/30 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start">
                          {/* 图片和难度 */}
                          <div className="md:w-48 md:flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                            <div className="relative h-40 md:h-32 rounded-lg overflow-hidden mb-3">
                              <div 
                                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${guide.image})` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                guide.difficulty === '困难' ? 'bg-red-500/20 text-red-300' :
                                guide.difficulty === '中等' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {guide.difficulty}
                              </span>
                              <div className="text-sm text-gray-400">{guide.time}</div>
                            </div>
                          </div>

                          {/* 内容 */}
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm text-gray-400">{guide.game}</div>
                              <div className="text-sm text-gray-400">{guide.date}</div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                              {guide.title}
                            </h3>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <span>作者: {guide.author}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {guide.views}
                                </div>
                                <div className="flex items-center">
                                  <Heart className="h-4 w-4 mr-1" />
                                  {guide.likes}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {guide.tags.map((tag) => (
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
                          ? 'bg-emerald-500 text-white'
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

      {/* 攻略编写指南 */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-t border-gray-700/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6 text-center">如何编写优质攻略</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: '明确目标',
                  desc: '明确攻略的目标读者和解决的问题',
                },
                {
                  icon: BookOpen,
                  title: '结构清晰',
                  desc: '使用清晰的标题和分段，便于阅读',
                },
                {
                  icon: Zap,
                  title: '实用技巧',
                  desc: '提供实际可用的技巧和解决方案',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div className="text-lg font-bold text-white mb-2">{item.title}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                我要投稿攻略
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}