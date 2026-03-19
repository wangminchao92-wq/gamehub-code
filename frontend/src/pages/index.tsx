import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import HeroSection from '@/components/HeroSection';
import SEO from '@/components/SEO';
import { Gamepad2, Trophy, Users, Star, TrendingUp, Calendar, Video, MessageSquare } from 'lucide-react';

// 热门游戏数据
const popularGames = [
  {
    id: 1,
    title: '赛博朋克2077',
    genre: '角色扮演',
    platform: 'PC/PS5/Xbox',
    rating: 9.2,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    players: '2.4M',
  },
  {
    id: 2,
    title: '艾尔登法环',
    genre: '动作角色扮演',
    platform: '全平台',
    rating: 9.8,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    players: '3.1M',
  },
  {
    id: 3,
    title: '博德之门3',
    genre: '角色扮演',
    platform: 'PC/PS5',
    rating: 9.6,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=400&q=80',
    players: '1.8M',
  },
];

// 社区亮点
const communityHighlights = [
  {
    id: 1,
    title: '最佳游戏MOD合集',
    author: 'ModMaster',
    likes: '2.4K',
    comments: '356',
    type: 'MOD',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: '游戏开发经验分享',
    author: 'DevGuru',
    likes: '1.8K',
    comments: '214',
    type: '教程',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: '电竞比赛直播',
    author: 'EsportsTV',
    likes: '5.2K',
    comments: '892',
    type: '直播',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=400&q=80',
  },
];

// 最新视频
const latestVideos = [
  {
    id: 1,
    title: '2026年最值得期待的游戏',
    duration: '12:45',
    views: '1.2M',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: '游戏画面技术解析',
    duration: '18:30',
    views: '890K',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: '独立游戏开发者访谈',
    duration: '24:15',
    views: '560K',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80',
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      {/* SEO优化 */}
      <SEO
        title="GameHub - Your Ultimate Gaming Destination"
        description="IGN-style gaming portal with the latest game news, reviews, guides, videos, community discussions, and store. Join millions of gamers worldwide."
        ogImage="https://gamehub.example.com/images/og-home.jpg"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'GameHub Home',
          description: 'Your ultimate gaming destination with news, reviews, guides, videos, community, and store.',
          url: 'https://gamehub.example.com',
          mainEntity: {
            '@type': 'WebSite',
            name: 'GameHub',
            url: 'https://gamehub.example.com',
          },
        }}
      >
        {/* 额外的结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  item: {
                    '@type': 'VideoGame',
                    name: 'Cyberpunk 2077',
                    description: 'Open-world action-adventure RPG set in Night City',
                    playMode: 'Single-player',
                    gamePlatform: 'PC, PlayStation, Xbox',
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  item: {
                    '@type': 'VideoGame',
                    name: 'Elden Ring',
                    description: 'Action RPG developed by FromSoftware',
                    playMode: 'Single-player, Multiplayer',
                    gamePlatform: 'PC, PlayStation, Xbox',
                  },
                },
              ],
            }),
          }}
        />
      </SEO>
      
      {/* Hero Banner */}
      <HeroSection />

      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-12">
        {/* 热门游戏区域 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">热门游戏</h2>
              <p className="text-gray-400 mt-2">当前最受欢迎的游戏推荐</p>
            </div>
            <a 
              href="/games" 
              className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
            >
              查看全部
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularGames.map((game) => (
              <div key={game.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                  {/* 游戏图片 */}
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${game.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    
                    {/* 评分 */}
                    <div className="absolute top-4 right-4 flex items-center bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-lg font-bold text-white">{game.rating}</span>
                    </div>
                  </div>

                  {/* 游戏信息 */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Gamepad2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-400">{game.platform}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-400">{game.players}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                      {game.title}
                    </h3>
                    
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-primary-400 mr-2" />
                      <span className="text-sm text-gray-300">{game.genre}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：最新新闻和评测 */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">最新资讯</h2>
                <div className="flex items-center text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">实时更新</span>
                </div>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-primary-500/30 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                          <TrendingUp className="h-8 w-8 text-primary-400" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 text-xs font-bold bg-primary-500/20 text-primary-300 rounded-full">
                            {item === 1 ? '新闻' : item === 2 ? '评测' : '攻略'}
                          </span>
                          <span className="text-sm text-gray-400">3小时前</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {item === 1 && '新一代游戏引擎技术突破'}
                          {item === 2 && '年度最佳游戏评选结果公布'}
                          {item === 3 && '多人游戏战术配合指南'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {item === 1 && '最新游戏引擎技术带来革命性的画面表现和性能优化...'}
                          {item === 2 && '经过专业评审和玩家投票，年度最佳游戏榜单正式出炉...'}
                          {item === 3 && '掌握这些战术技巧，让你在多人游戏中脱颖而出...'}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-4">阅读时间: 5分钟</span>
                          <span>作者: GameHub编辑</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 社区亮点 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">社区亮点</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {communityHighlights.map((highlight) => (
                  <div key={highlight.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
                      <div className="relative h-40 overflow-hidden">
                        <div 
                          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${highlight.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs font-bold bg-primary-500 text-white rounded">
                            {highlight.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
                          {highlight.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>by {highlight.author}</span>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {highlight.likes}
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {highlight.comments}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 右侧：视频和趋势 */}
          <div className="space-y-8">
            {/* 最新视频 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">最新视频</h3>
                <Video className="h-5 w-5 text-primary-400" />
              </div>
              <div className="space-y-4">
                {latestVideos.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden">
                        <div 
                          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${video.thumbnail})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-xs text-white rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-primary-300 transition-colors">
                          {video.title}
                        </h4>
                        <div className="text-xs text-gray-400">
                          {video.views} 次观看
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 热门趋势 */}
            <section>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">热门趋势</h3>
                  <TrendingUp className="h-5 w-5 text-primary-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { tag: '#AI游戏', posts: '12.4K' },
                    { tag: '#云游戏', posts: '8.7K' },
                    { tag: '#独立游戏', posts: '15.2K' },
                    { tag: '#电竞', posts: '23.8K' },
                  ].map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/20 hover:bg-gray-700/40 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-primary-300">{index + 1}</span>
                        </div>
                        <span className="font-medium text-white">{trend.tag}</span>
                      </div>
                      <span className="text-sm text-gray-400">{trend.posts} 讨论</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 平台统计 */}
            <section>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-xl font-bold text-white mb-4">平台分布</h3>
                <div className="space-y-3">
                  {[
                    { platform: 'PC', percentage: 45, color: 'from-blue-500 to-cyan-500' },
                    { platform: 'PlayStation', percentage: 28, color: 'from-blue-600 to-indigo-600' },
                    { platform: 'Xbox', percentage: 18, color: 'from-green-500 to-emerald-500' },
                    { platform: 'Nintendo', percentage: 9, color: 'from-red-500 to-pink-500' },
                  ].map((item) => (
                    <div key={item.platform} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.platform}</span>
                        <span className="text-white font-medium">{item.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}