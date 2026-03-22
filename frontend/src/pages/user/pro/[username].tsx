import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { 
  User, Mail, Calendar, Award, Star, Edit, 
  BookOpen, MessageSquare, ThumbsUp, Eye, Gamepad,
  Trophy, TrendingUp, Users, Clock, Share2, Heart,
  Settings, CheckCircle, Target, BarChart
} from 'lucide-react';

// 模拟用户数据
const mockUser = {
  username: 'admin',
  displayName: '系统管理员',
  email: 'admin@gamehub.test',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  bio: 'GameHub系统管理员，热爱游戏开发和技术研究。',
  role: 'ADMIN',
  level: 10,
  experience: 5000,
  points: 15000,
  createdAt: '2026-03-22',
  gameHours: 256,
  favoriteGames: ['赛博朋克2077', '艾尔登法环']
};

// 模拟统计数据
const mockStats = {
  articles: 24,
  posts: 156,
  comments: 892,
  likes: 12500,
  views: 256000,
  followers: 842,
  following: 156,
  achievements: 18
};

export default function ProUserProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // 经验进度
  const expProgress = (mockUser.level * 1000 + mockUser.experience) % 1000;
  const expPercent = (expProgress / 1000) * 100;

  return (
    <MainLayout>
      <SEO 
        title={`${mockUser.displayName} - GameHub`}
        description={`${mockUser.displayName} 的个人主页`}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 顶部横幅 */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* 操作按钮 */}
          <div className="absolute top-6 right-6 flex space-x-3">
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30">
              <Heart className="w-5 h-5" />
            </button>
            <button className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 flex items-center">
              <Edit className="w-5 h-5 mr-2" />
              编辑
            </button>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="container mx-auto px-4 -mt-32">
          {/* 用户信息卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-start">
              {/* 头像区域 */}
              <div className="mb-8 lg:mb-0 lg:mr-10">
                <div className="relative">
                  <div className="w-48 h-48 rounded-2xl border-8 border-white dark:border-gray-800 overflow-hidden shadow-2xl">
                    <img src={mockUser.avatar} alt={mockUser.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-3 -right-3">
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold shadow-lg">
                      Lv.{mockUser.level}
                    </div>
                  </div>
                </div>
              </div>

              {/* 用户信息 */}
              <div className="flex-1">
                {/* 基本信息 */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mr-4">
                      {mockUser.displayName}
                    </h1>
                    <span className="px-4 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold">
                      {mockUser.role === 'ADMIN' ? '管理员' : '用户'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-xl mb-2">@{mockUser.username}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">{mockUser.bio}</p>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mockStats.followers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">粉丝</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{mockStats.articles}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">文章</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{mockStats.posts}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">帖子</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{mockStats.likes.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">获赞</div>
                  </div>
                </div>

                {/* 经验进度 */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium">经验进度</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {expProgress}/1000 ({expPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${expPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">邮箱</div>
                      <div className="font-medium">{mockUser.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">加入时间</div>
                      <div className="font-medium">{mockUser.createdAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <Award className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">积分</div>
                      <div className="font-medium">{mockUser.points.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <Gamepad className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">游戏时间</div>
                      <div className="font-medium">{mockUser.gameHours} 小时</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 标签页导航 */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: '概览', icon: <User className="w-5 h-5" /> },
                { id: 'articles', label: '文章', icon: <BookOpen className="w-5 h-5" /> },
                { id: 'posts', label: '帖子', icon: <MessageSquare className="w-5 h-5" /> },
                { id: 'achievements', label: '成就', icon: <Trophy className="w-5 h-5" /> },
                { id: 'activity', label: '动态', icon: <Clock className="w-5 h-5" /> },
                { id: 'stats', label: '统计', icon: <BarChart className="w-5 h-5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 标签页内容 */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">个人概览</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 最近活动 */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      最近活动
                    </h3>
                    <div className="space-y-4">
                      {[
                        { action: '发布了文章', title: '《黑神话：悟空》销量突破', time: '2小时前' },
                        { action: '评论了帖子', title: '艾尔登法环攻略讨论', time: '5小时前' },
                        { action: '获得了成就', title: '内容创作者', time: '1天前' },
                        { action: '关注了用户', title: '硬核玩家', time: '2天前' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                            <div className="text-blue-600 dark:text-blue-400">📝</div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {activity.action} <span className="text-blue-600 dark:text-blue-400">{activity.title}</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 热门成就 */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      热门成就
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: '内容创作者', desc: '发布10篇文章', progress: 100, icon: '📝' },
                        { name: '社区领袖', desc: '获得1000个点赞', progress: 100, icon: '👑' },
                        { name: '游戏大师', desc: '达到等级10', progress: 100, icon: '🎮' },
                        { name: '探索者', desc: '浏览1000篇文章', progress: 65, icon: '🔍' },
                      ].map((achievement, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                          <div className="flex items-center mb-2">
                            <div className="text-2xl mr-3">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="font-bold">{achievement.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{achievement.desc}</div>
                            </div>
                            <div className="text-green-600 dark:text-green-400 font-bold">
                              {achievement.progress}%
                            </div>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">我的文章</h2>
                <div className="space-y-4">
                  {[
                    { title: '《黑神话：悟空》全球销量突破1000万份', views: '125K', likes: '8.9K', comments: '342', date: '2026-03-15' },
                    { title: '《塞尔达传说：王国之泪》获年度游戏大奖', views: '98K', likes: '7.5K', comments: '289', date: '2026-03-10' },
                    { title: '《最终幻想VII 重生》评测：经典重制的巅峰', views: '76K', likes: '5.2K', comments: '198', date: '2026-03-05' },
                  ].map((article, index) => (
                    <div key={index} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            {article.views}
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {article.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {article.comments}
                          </div>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">{article.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">数据统计</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 月度活跃度 */}
                  <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white">
                    <h3 className="text-xl font-bold mb-4">月度活跃度</h3>
                    <div className="h-48 flex items-end space-x-2">
                      {[65, 80, 45, 90, 75, 85, 95, 70, 85, 90, 80, 95].map((height, index) => (
                        <div key={index} className="flex-1">
                          <div 
                            className="bg-white/30 rounded-t-lg"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-center text-xs mt-2 opacity-75">{index + 1}月</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 内容分布 */}
                  <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4">内容分布</h3>
                    <div className="space-y-4">
                      {