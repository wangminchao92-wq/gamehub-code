import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Play, Eye, Clock, ThumbsUp, Search, Filter, Video } from 'lucide-react';

// 视频数据
const videos = [
  {
    id: 1,
    title: '2026年最值得期待的10款游戏',
    channel: 'GameHub评测',
    views: '1.2M',
    duration: '12:45',
    likes: '45K',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    title: '游戏画面技术深度解析',
    channel: '技术前沿',
    views: '890K',
    duration: '18:30',
    likes: '32K',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 3,
    title: '独立游戏开发者访谈',
    channel: '开发者故事',
    views: '560K',
    duration: '24:15',
    likes: '28K',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 4,
    title: '电竞比赛精彩集锦',
    channel: '电竞时刻',
    views: '2.3M',
    duration: '15:20',
    likes: '98K',
    thumbnail: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 5,
    title: '游戏硬件评测',
    channel: '硬件实验室',
    views: '780K',
    duration: '22:10',
    likes: '41K',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 6,
    title: '游戏音乐制作幕后',
    channel: '音乐之声',
    views: '420K',
    duration: '28:45',
    likes: '23K',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
];

export default function VideosPage() {
  return (
    <MainLayout>
      {/* 页面头部 */}
      <div className="relative bg-gradient-to-r from-gray-900 to-red-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Video className="h-8 w-8 text-red-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">游戏视频</h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              精彩游戏视频、评测、攻略、幕后，视觉享受的游戏世界
            </p>
            
            {/* 搜索和筛选 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索视频..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-red-500 transition-colors">
                <Filter className="h-5 w-5 mr-2" />
                筛选
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        {/* 特色视频 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">精选视频</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.filter(video => video.featured).map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                  {/* 视频缩略图 */}
                  <div className="relative h-64 overflow-hidden">
                    <div 
                      className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    
                    {/* 播放按钮 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>

                    {/* 时长 */}
                    <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/80 text-white text-sm rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* 视频信息 */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                      {video.title}
                    </h3>
                    <div className="text-sm text-gray-400 mb-3">{video.channel}</div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {video.views}
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {video.likes}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {video.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 视频列表 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">最新视频</h2>
            <div className="text-sm text-gray-400">
              共 {videos.length} 个视频
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:border-red-500/30 transition-colors overflow-hidden">
                  {/* 视频缩略图 */}
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    
                    {/* 播放按钮 */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-0.5" />
                      </div>
                    </div>

                    {/* 时长 */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* 视频信息 */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-red-300 transition-colors">
                      {video.title}
                    </h3>
                    <div className="text-xs text-gray-400 mb-2">{video.channel}</div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {video.views}
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {video.likes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                      ? 'bg-red-500 text-white'
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

      {/* 视频分类 */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-t border-gray-700/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">视频分类</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '游戏评测', count: 156, color: 'from-blue-500 to-cyan-500' },
              { name: '攻略教学', count: 89, color: 'from-emerald-500 to-green-500' },
              { name: '电竞比赛', count: 234, color: 'from-purple-500 to-pink-500' },
              { name: '开发者访谈', count: 67, color: 'from-orange-500 to-red-500' },
            ].map((category) => (
              <div
                key={category.name}
                className={`bg-gradient-to-r ${category.color} rounded-xl p-6 text-center cursor-pointer hover:scale-105 transition-transform`}
              >
                <div className="text-2xl font-bold text-white mb-2">{category.count}</div>
                <div className="text-sm font-medium text-white">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}