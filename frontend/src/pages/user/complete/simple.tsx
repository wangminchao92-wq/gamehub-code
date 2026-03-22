import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';

export default function CompleteUserPage() {
  // 用户页面结构化数据 (noindex用于用户隐私)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "name": "系统管理员 - GameHub用户",
      "description": "GameHub系统管理员的个人主页",
      "mainEntity": {
        "@type": "Person",
        "name": "系统管理员",
        "url": "https://gamehub.com/user/admin",
        "description": "GameHub系统管理员，热爱游戏开发和技术研究。"
      }
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
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "用户",
          "item": "https://gamehub.com/user"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "系统管理员",
          "item": "https://gamehub.com/user/admin"
        }
      ]
    }
  ];
  const [activeTab, setActiveTab] = useState('overview');

  const user = {
    name: '系统管理员',
    username: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    bio: 'GameHub系统管理员，热爱游戏开发和技术研究。',
    level: 10,
    points: 15000,
    joinDate: '2026-03-22',
    email: 'admin@gamehub.test'
  };

  const stats = {
    articles: 24,
    posts: 156,
    followers: 842,
    likes: 12500
  };

  return (
    <MainLayout>
      <SEO
        title="系统管理员 - GameHub用户"
        description="GameHub系统管理员的个人主页，等级10，15000积分，24篇文章，156个帖子。"
        keywords="GameHub用户,系统管理员,游戏爱好者,内容创作者"
        canonical="https://gamehub.com/user/admin"
        ogImage="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
        ogType="profile"
        structuredData={structuredData}
        noindex={true}  // 用户页面通常noindex保护隐私
        nofollow={true}
        author="系统管理员"
        section="User Profile"
        tags={["user profile", "gamer", "content creator", "community member"]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部横幅 */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>

      {/* 用户卡片 */}
      <div className="container mx-auto px-4 -mt-24">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* 头像和基本信息 */}
          <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mr-4">{user.name}</h1>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-bold">
                  管理员
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">@{user.username}</p>
              <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.articles}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">文章</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.posts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">帖子</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.followers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">粉丝</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.likes.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">获赞</div>
            </div>
          </div>

          {/* 标签页导航 */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex space-x-8">
              {['概览', '文章', '帖子', '成就', '动态'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-medium ${
                    activeTab === tab
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 标签页内容 */}
          <div>
            {activeTab === '概览' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">最近活动</h3>
                  <div className="space-y-3">
                    {[
                      { action: '发布了文章', title: '《黑神话：悟空》销量突破', time: '2小时前' },
                      { action: '评论了帖子', title: '艾尔登法环攻略', time: '5小时前' },
                      { action: '获得了成就', title: '内容创作者', time: '1天前' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                          <span className="text-blue-600 dark:text-blue-400">📝</span>
                        </div>
                        <div className="flex-1">
                          <div>
                            {item.action} <span className="text-blue-600 dark:text-blue-400 font-medium">{item.title}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">用户信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">邮箱</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">加入时间</div>
                      <div className="font-medium">{user.joinDate}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">等级</div>
                      <div className="font-medium">Lv.{user.level}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">积分</div>
                      <div className="font-medium">{user.points.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === '文章' && (
              <div>
                <h3 className="text-xl font-bold mb-4">我的文章</h3>
                <div className="space-y-4">
                  {[
                    { title: '《黑神话：悟空》全球销量突破1000万份', views: '125K', date: '2026-03-15' },
                    { title: '《塞尔达传说：王国之泪》获年度游戏大奖', views: '98K', date: '2026-03-10' },
                    { title: '《最终幻想VII 重生》评测', views: '76K', date: '2026-03-05' },
                  ].map((article, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <h4 className="font-bold mb-2">{article.title}</h4>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>浏览: {article.views}</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
