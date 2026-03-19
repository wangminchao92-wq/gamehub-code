import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Users, MessageSquare, TrendingUp, Trophy, Heart, Share2, Search, Filter } from 'lucide-react';

// 社区帖子数据
const communityPosts = [
  {
    id: 1,
    title: '分享我的《赛博朋克2077》摄影作品',
    author: '夜之城摄影师',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    content: '在夜之城拍摄的一些精彩瞬间，希望大家喜欢！',
    likes: 245,
    comments: 42,
    shares: 18,
    time: '2小时前',
    category: '作品分享',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    title: '《艾尔登法环》DLC全收集攻略讨论',
    author: '魂系收集者',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    content: '大家一起来讨论DLC中的隐藏物品和收集技巧吧！',
    likes: 189,
    comments: 56,
    shares: 12,
    time: '5小时前',
    category: '攻略讨论',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
];

// 热门话题
const hotTopics = [
  { name: '#赛博朋克2077', posts: '12.4K' },
  { name: '#艾尔登法环', posts: '8.7K' },
  { name: '#独立游戏', posts: '5.2K' },
  { name: '#电竞比赛', posts: '15.8K' },
];

export default function CommunityPage() {
  return (
    <MainLayout>
      {/* 页面头部 */}
      <div className="relative bg-gradient-to-r from-gray-900 to-blue-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-blue-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">游戏社区</h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              与全球玩家交流、分享、讨论，一起探索游戏世界的精彩
            </p>
            
            {/* 搜索和筛选 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索社区内容..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-blue-500 transition-colors">
                <Filter className="h-5 w-5 mr-2" />
                筛选
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">社区功能开发中</h2>
          <p className="text-xl text-gray-300 mb-8">
            社区模块正在积极开发中，即将上线！
          </p>
          <div className="max-w-2xl mx-auto bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">用户交流</h3>
                <p className="text-gray-400">与全球玩家实时交流讨论</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">内容分享</h3>
                <p className="text-gray-400">分享游戏心得、作品和攻略</p>
              </div>
            </div>
            <div className="text-center">
              <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                订阅更新通知
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}