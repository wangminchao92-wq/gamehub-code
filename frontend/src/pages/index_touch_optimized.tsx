import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import HeroSection from '@/components/HeroSection';
import GameCard from '@/components/GameCard';
import ArticleCard from '@/components/ArticleCard';

export default function HomePage() {
  // 首页结构化数据
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "GameHub",
      "url": "https://gamehub.com",
      "description": "专业的游戏资讯和社区平台",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://gamehub.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GameHub",
      "url": "https://gamehub.com",
      "logo": "https://gamehub.com/logo.png",
      "sameAs": [
        "https://twitter.com/gamehub",
        "https://facebook.com/gamehub",
        "https://github.com/gamehub"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首页",
          "item": "https://gamehub.com"
        }
      ]
    }
  ];

  return (
    <MainLayout>
      <SEO
        title="GameHub - 专业的游戏资讯和社区平台"
        description="GameHub提供最新的游戏新闻、深度评测、攻略指南和活跃的游戏社区。加入我们，与全球游戏爱好者一起探索游戏世界。"
        keywords="游戏新闻,游戏评测,游戏攻略,游戏社区,视频游戏,电竞赛事,游戏商店"
        canonical="https://gamehub.com"
        ogImage="https://gamehub.com/og-image.jpg"
        ogType="website"
        structuredData={structuredData}
        author="GameHub"
        section="Gaming"
        tags={["gaming", "video games", "esports", "game news", "game reviews"]}
      />
      {/* 英雄区域 */}
      <HeroSection />
      
      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 热门游戏部分 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">🔥 热门游戏</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GameCard
              title="赛博朋克 2077"
              description="开放世界角色扮演游戏"
              image="/images/games/cyberpunk.jpg"
              rating={4.5}
              platform="PC/PS5/Xbox"
            />
            <GameCard
              title="艾尔登法环"
              description="黑暗幻想动作RPG"
              image="/images/games/elden-ring.jpg"
              rating={4.8}
              platform="全平台"
            />
            <GameCard
              title="战神：诸神黄昏"
              description="北欧神话动作冒险"
              image="/images/games/god-of-war.jpg"
              rating={4.7}
              platform="PS5"
            />
            <GameCard
              title="霍格沃茨遗产"
              description="哈利波特世界冒险"
              image="/images/games/hogwarts.jpg"
              rating={4.3}
              platform="全平台"
            />
          </div>
        </section>
        
        {/* 最新新闻部分 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">📰 最新新闻</h2>
            <a href="/news" className="text-blue-600 hover:text-blue-800 font-medium">
              查看全部 →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArticleCard
              title="《黑神话：悟空》发售日期确认"
              excerpt="备受期待的中国神话动作游戏《黑神话：悟空》正式公布发售日期..."
              image="/images/articles/wukong.jpg"
              author="游戏新闻"
              date="2026-03-20"
              readTime="5分钟"
            />
            <ArticleCard
              title="Steam春季特卖开启"
              excerpt="Steam春季特卖即日起至4月3日，数千款游戏参与折扣..."
              image="/images/articles/steam-sale.jpg"
              author="促销资讯"
              date="2026-03-19"
              readTime="3分钟"
            />
            <ArticleCard
              title="《最终幻想7 重制版》第二部分评测"
              excerpt="Square Enix的经典重制作品第二部分带来更加震撼的体验..."
              image="/images/articles/ff7.jpg"
              author="游戏评测"
              date="2026-03-18"
              readTime="8分钟"
            />
          </div>
        </section>
        
        {/* 社区热门 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">💬 社区热门</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-bold text-lg mb-2">你最期待2026年的哪款游戏？</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">社区投票正在进行中，参与讨论赢取积分！</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>👥 1,245人参与</span>
                  <span className="mx-2">•</span>
                  <span>💬 342条评论</span>
                </div>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-bold text-lg mb-2">游戏优化技巧分享</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">分享你的游戏性能优化经验，帮助其他玩家！</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>👥 892人参与</span>
                  <span className="mx-2">•</span>
                  <span>💬 156条评论</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">联机组队招募</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">寻找《地狱潜者2》队友，每晚8-11点在线</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>👥 56人参与</span>
                  <span className="mx-2">•</span>
                  <span>💬 23条评论</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 行动号召 */}
        <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
          <h2 className="text-4xl font-bold mb-4">加入 GameHub 社区</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            与数百万玩家一起发现、讨论、分享游戏的乐趣
          </p>
          <div className="space-x-4">
            <a
              href="/register"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
            >
              立即注册
            </a>
            <a
              href="/community"
              className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              探索社区
            </a>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}