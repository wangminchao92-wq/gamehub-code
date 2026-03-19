'use client';

import React from 'react';
import { Play, Calendar, Users, Star, Gamepad2, Trophy, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const featuredNews = [
  {
    id: 1,
    title: '赛博朋克2077：往日之影DLC深度评测',
    category: '评测',
    date: '2小时前',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    score: 9.5,
    platform: 'PC/PS5/Xbox',
  },
  {
    id: 2,
    title: '艾尔登法环：黄金树之影DLC正式公布',
    category: '新闻',
    date: '5小时前',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    score: null,
    platform: '全平台',
  },
  {
    id: 3,
    title: '本周末必玩的10款热门游戏推荐',
    category: '攻略',
    date: '1天前',
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=800&q=80',
    score: null,
    platform: '多平台',
  },
];

const stats = [
  { value: '50K+', label: '活跃会员', icon: Users },
  { value: '10K+', label: '游戏评测', icon: Star },
  { value: '5K+', label: '攻略指南', icon: Trophy },
  { value: '24/7', label: '在线支持', icon: Zap },
];

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 min-h-[90vh]">
      {/* 主背景图片 */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-transparent" />
      </div>

      {/* 动态粒子背景 */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="py-16 lg:py-32">
          {/* 主标题区域 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            {/* 特色标签 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 mb-8"
            >
              <Star className="h-4 w-4 mr-2 text-white" />
              <span className="text-sm font-bold text-white">特色报道</span>
            </motion.div>

            {/* 主标题 */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              探索游戏世界的
              <span className="block mt-2 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                无限可能
              </span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              最新游戏资讯、深度评测、专业攻略，与全球玩家一起探索游戏世界的精彩
            </p>

            {/* 行动按钮 */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
              >
                <Play className="h-5 w-5 mr-2" />
                观看预告片
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm text-white font-bold rounded-lg border border-gray-700 hover:border-primary-500 transition-all duration-300 flex items-center"
              >
                <Users className="h-5 w-5 mr-2" />
                加入社区
              </motion.button>
            </div>

            {/* 统计数据 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="h-8 w-8 text-primary-400" />
                    </div>
                    <div className="text-3xl font-bold text-white text-center mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400 text-center">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* 特色新闻区域 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">精选新闻</h2>
                <p className="text-gray-400 mt-2">最新游戏动态和深度报道</p>
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="text-sm">2026年3月19日</span>
              </div>
            </div>

            {/* 新闻卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 h-full">
                    {/* 图片区域 */}
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${news.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                      
                      {/* 平台标签 */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full">
                          <Gamepad2 className="h-3 w-3 mr-1 text-gray-300" />
                          <span className="text-xs text-gray-300">{news.platform}</span>
                        </div>
                      </div>
                      
                      {/* 评分 */}
                      {news.score && (
                        <div className="absolute top-4 right-4 flex items-center bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-sm font-bold text-white">{news.score}</span>
                        </div>
                      )}
                    </div>

                    {/* 内容区域 */}
                    <div className="p-6">
                      {/* 分类标签 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 text-xs font-bold bg-primary-500/20 text-primary-300 rounded-full">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-400">{news.date}</span>
                      </div>

                      {/* 标题 */}
                      <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors">
                        {news.title}
                      </h3>

                      {/* 阅读更多 */}
                      <div className="flex items-center text-primary-400 group-hover:text-primary-300 transition-colors">
                        <span className="text-sm font-medium mr-2">阅读全文</span>
                        <TrendingUp className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 查看更多链接 */}
            <div className="text-center mt-12">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/news"
                className="inline-flex items-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-white font-medium rounded-lg border border-gray-700 hover:border-primary-500 transition-all duration-300"
              >
                查看更多新闻
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}