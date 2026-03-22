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
    slug: 'cyberpunk-2077'
  },
  {
    id: 2,
    title: '艾尔登法环',
    genre: '动作角色扮演',
    platform: '全平台',
    rating: 9.8,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    players: '3.1M',
    slug: 'elden-ring'
  },
  {
    id: 3,
    title: '博德之门3',
    genre: '角色扮演',
    platform: 'PC/PS5',
    rating: 9.6,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=400&q=80',
    players: '1.8M',
    slug: 'baldurs-gate-3'
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
    slug: 'best-game-mods-collection'
  },
  {
    id: 2,
    title: '游戏开发经验分享',
    author: 'DevGuru',
    likes: '1.8K',
    comments: '214',
    type: '教程',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=400&q=80',
    slug: 'game-development-experience-sharing'
  },
  {
    id: 3,
    title: '电竞比赛直播',
    author: 'EsportsTV',
    likes: '5.2K',
    comments: '892',
    type: '直播',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=400&q=80',
    slug: 'esports-tournament-live'
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
    slug: 'most-anticipated-games-2026'
  },
  {
    id: 2,
    title: '游戏画面技术解析',
    duration: '18:30',
    views: '890K',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
    slug: 'game-graphics-technology-analysis'
  },
  {
    id: 3,
    title: '独立游戏开发者访谈',
    duration: '24:15',
    views: '560K',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80',
    slug: 'indie-game-developer-interview'
  },
];

export default function HomePage() {
  // 结构化数据（JSON-LD）
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GameHub",
    "description": "IGN-style gaming portal with the latest game news, reviews, guides, videos, community discussions, and store.",
    "url": "https://gamehub.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gamehub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const gameStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": popularGames.map((game, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoGame",
        "name": game.title,
        "genre": game.genre,
        "gamePlatform": game.platform,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": game.rating,
          "bestRating": "10",
          "ratingCount": "1000"
        },
        "url": `https://gamehub.com/games/${game.slug}`
      }
    }))
  };

  return (
    <MainLayout>
      {/* SEO优化 */}
      <SEO
        title="GameHub - Your Ultimate Gaming Destination | Latest Game News, Reviews & Guides"
        description="IGN-style gaming portal with the latest game news, reviews, guides, videos, community discussions, and store. Join millions of gamers worldwide."
        keywords="game news, game reviews, game guides, gaming community, video games, esports, game store"
        canonical="https://gamehub.com"
        structuredData={[structuredData, gameStructuredData]}
      />
      
      {/* 传统meta标签作为SEO检查备用 */}
      <meta name="description" content="IGN-style gaming portal with the latest game news, reviews, guides, videos, community discussions, and store. Join millions of gamers worldwide." />

      {/* 语义化主标题区域 */}
      <main id="main-content" role="main">
        {/* Hero Section with proper heading hierarchy */}
        <HeroSection />
        
        {/* 主标题（h1）应该在主要内容区域 */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white text-center mb-4 sr-only">
            GameHub - Your Ultimate Gaming Destination
          </h1>
          <p className="text-gray-400 text-center max-w-3xl mx-auto">
            Discover the latest game news, reviews, guides, videos, and connect with millions of gamers worldwide.
          </p>
        </div>

        {/* 热门游戏区域 - 使用article和section */}
        <section aria-labelledby="popular-games-heading" className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <header className="mb-8">
              <h2 id="popular-games-heading" className="text-3xl font-bold text-white mb-2">
                热门游戏
              </h2>
              <p className="text-gray-400">Discover the most popular games right now</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularGames.map((game) => (
                <article 
                  key={game.id} 
                  className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-transform"
                  itemScope
                  itemType="https://schema.org/VideoGame"
                >
                  <a href={`/games/${game.slug}`} className="block">
                    <div className="relative">
                      <img 
                        src={game.image} 
                        alt={`${game.title} game cover`}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        width="400"
                        height="200"
                      />
                      <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {game.rating}/10
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2" itemProp="name">
                        {game.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Gamepad2 className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300" itemProp="genre">{game.genre}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300">{game.players} players</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm" itemProp="gamePlatform">
                          Platform: {game.platform}
                        </span>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 社区亮点区域 */}
        <section aria-labelledby="community-highlights-heading" className="py-12 bg-gray-800">
          <div className="container mx-auto px-4">
            <header className="mb-8">
              <h2 id="community-highlights-heading" className="text-3xl font-bold text-white mb-2">
                社区亮点
              </h2>
              <p className="text-gray-400">Top discussions and content from our gaming community</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {communityHighlights.map((highlight) => (
                <article key={highlight.id} className="bg-gray-900 rounded-xl overflow-hidden">
                  <a href={`/community/${highlight.slug}`} className="block">
                    <img 
                      src={highlight.image} 
                      alt={highlight.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      width="400"
                      height="200"
                    />
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {highlight.type}
                        </span>
                        <span className="text-gray-400 text-sm">By {highlight.author}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-4">
                        {highlight.title}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-gray-300">{highlight.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4 text-blue-400" />
                            <span className="text-gray-300">{highlight.comments}</span>
                          </div>
                        </div>
                        <span className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 最新视频区域 */}
        <section aria-labelledby="latest-videos-heading" className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <header className="mb-8">
              <h2 id="latest-videos-heading" className="text-3xl font-bold text-white mb-2">
                最新视频
              </h2>
              <p className="text-gray-400">Watch the latest gaming content and tutorials</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestVideos.map((video) => (
                <article key={video.id} className="group">
                  <a href={`/videos/${video.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="400"
                        height="200"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <Video className="h-4 w-4 mr-1" />
                      <span>{video.views} views</span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 特色功能区域 */}
        <section aria-labelledby="features-heading" className="py-12 bg-gray-800">
          <div className="container mx-auto px-4">
            <header className="text-center mb-12">
              <h2 id="features-heading" className="text-3xl font-bold text-white mb-4">
                Why Choose GameHub?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need for your gaming journey in one place
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">专业评测</h3>
                <p className="text-gray-400">In-depth game reviews from professional critics</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">最新资讯</h3>
                <p className="text-gray-400">Stay updated with the latest gaming news</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">活跃社区</h3>
                <p className="text-gray-400">Connect with millions of gamers worldwide</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">活动日历</h3>
                <p className="text-gray-400">Never miss important gaming events</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 面包屑导航（结构化数据） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://gamehub.com"
              }
            ]
          })
        }}
      />
    </MainLayout>
  );
}