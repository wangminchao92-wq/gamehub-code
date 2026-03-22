import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { 
  User, Mail, Calendar, Award, Star, Edit, 
  BookOpen, MessageSquare, ThumbsUp, Eye, Gamepad,
  Trophy, Target, TrendingUp, Users, Clock, Share2,
  Heart, Bookmark, Settings, Shield, CheckCircle
} from 'lucide-react';

// 模拟用户数据
const mockUser = {
  id: 'user-admin',
  username: 'admin',
  displayName: '系统管理员',
  email: 'admin@gamehub.test',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  bio: 'GameHub系统管理员，负责内容审核和用户管理，热爱游戏开发和技术研究。',
  role: 'ADMIN',
  level: 10,
  experience: 5000,
  points: 15000,
  status: 'ACTIVE',
  emailVerified: true,
  createdAt: '2026-03-22T04:39:16.755Z',
  lastLoginAt: '2026-03-22T08:08:26.263Z',
  gameHours: 256,
  favoriteGames: ['赛博朋克2077', '艾尔登法环', '最终幻想XVI']
};

// 模拟统计数据
const mockStats = {
  articles: 24,
  forumPosts: 156,
  comments: 892,
  likesReceived: 12500,
  totalViews: 256000,
  followers: 842,
  following: 156,
  achievements: 18
};

// 模拟最近文章
const mockRecentArticles = [
  {
    id: 'article-001',
    title: '《黑神话：悟空》全球销量突破1000万份',
    slug: 'black-myth-wukong-sales',
    views: 125000,
    likes: 8900,
    comments: 342,
    publishedAt: '2026-03-15T10:30:00Z'
  },
  {
    id: 'article-002',
    title: '《塞尔达传说：王国之泪》获年度游戏大奖',
    slug: 'zelda-tears-kingdom-goty',
    views: 98000,
    likes: 7500,
    comments: 289,
    publishedAt: '2026-03-10T14:20:00Z'
  },
  {
    id: 'article-003',
    title: '《最终幻想VII 重生》评测：经典重制的巅峰',
    slug: 'final-fantasy-vii-rebirth-review',
    views: 76000,
    likes: 5200,
    comments: 198,
    publishedAt: '2026-03-05T09:15:00Z'
  }
];

// 模拟最近帖子
const mockRecentPosts = [
  {
    id: 'post-001',
    title: '分享我的《艾尔登法环》全成就达成心得',
    slug: 'elden-ring-achievement-guide',
    views: 45000,
    likes: 3200,
    comments: 156,
    createdAt: '2026-03-18T09:15:00Z'
  },
  {
    id: 'post-002',
    title: '独立游戏《星露谷物语2》抢先体验版发布',
    slug: 'stardew-valley-2-early-access',
    views: 32000,
    likes: 2400,
    comments: 98,
    createdAt: '2026-03-20T16:45:00Z'
  }
];

// 模拟成就
const mockAchievements = [
  { id: 'ach-001', name: '内容创作者', description: '发布10篇文章', icon: '📝', unlocked: true },
  { id: 'ach-002', name: '社区领袖', description: '获得1000个点赞', icon: '👑', unlocked: true },
  { id: 'ach-003', name: '游戏大师', description: '达到等级10', icon: '🎮', unlocked: true },
  { id: 'ach-004', name: '社交达人', description: '拥有500个粉丝', icon: '🤝', unlocked: true },
  { id: 'ach-005', name: '评论专家', description: '发布100条评论', icon: '💬', unlocked: true },
  { id: 'ach-006', name: '探索者', description: '浏览1000篇文章', icon: '🔍', unlocked: false }
];

// 模拟最近活动
const mockActivityLog = [
  { id: 'act-001', type: 'article', action: '发布了文章', title: '《黑神话：悟空》全球销量突破1000万份', time: '2小时前' },
  { id: 'act-002', type: 'comment', action: '评论了', title: '《艾尔登法环》攻略讨论', time: '5小时前' },
  { id: 'act-003', type: 'like', action: '点赞了', title: '《星露谷物语2》抢先体验评测', time: '1天前' },
  { id: 'act-004', type: 'follow', action: '关注了', title: '用户「硬核玩家」', time: '2天前' },
  { id: 'act-005', type: 'achievement', action: '获得了成就', title: '「内容创作者」', time: '3天前' }
];

export default function CompleteUserProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'posts' | 'achievements' | 'activity'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 获取等级徽章颜色
  const getLevelColor = (level: number) => {
    if (level >= 50) return 'from-purple-500 to-pink-500';
    if (level >= 30) return 'from-red-500 to-orange-500';
    if (level >= 20) return 'from-blue-500 to-cyan-500';
    if (level >= 10) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-gray-700';
  };

  // 获取角色徽章
  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; label: string }> = {
      'SUPER_ADMIN': { color: 'bg-gradient-to-r from-purple-500 to-pink-500', label: '超级管理员' },
      'ADMIN': { color: 'bg-gradient-to-r from-red-500 to-orange-500', label: '管理员' },
      'MODERATOR': { color: 'bg-gradient-to-r from-blue-500 to-cyan-500', label: '审核员' },
      'EDITOR': { color: 'bg-gradient-to-r from-green-500 to-emerald-500', label: '编辑' },
      'USER': { color: 'bg-gradient-to-r from-gray-500 to-gray-700', label: '用户' },
    };
    
    const config = roleConfig[role] || roleConfig.USER;
    return (
      <span className={`px-4 py-1 rounded-full text-white text-sm font-bold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // 经验进度
  const experienceProgress = (mockUser.level * 1000 + mockUser.experience) % 1000;
  const experiencePercentage = (experienceProgress / 1000) * 100;

  return (
    <MainLayout>
      <SEO 
        title={`${mockUser.displayName} - GameHub 用户`}
        description={`${mockUser.displayName} 的 GameHub 个人主页，等级 ${mockUser.level}，${mockStats.articles} 篇文章，${mockStats.forumPosts} 个帖子`}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 用户头部信息 */}
        <div className="max-w-6xl mx-auto mb-8">
          {/* 横幅背景 */}
          <div className="relative h-48 rounded-t-2xl overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${getLevelColor(mockUser.level)}`}></div>
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* 横幅操作按钮 */}
            <div className="absolute top-6 right-6 flex space-x-3">
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors flex items-center"
              >
                <Edit className="w-5 h-5 mr-2" />
                编辑资料
              </button>
            </div>
          </div>
          
          {/* 用户信息卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-b-2xl p-8 shadow-2xl -mt-20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
              {/* 头像区域 */}
              <div className="mb-8 lg:mb-0 lg:mr-10">
                <div className="relative">
                  <div className="w-48 h-48 rounded-2xl border-6 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-2xl">
                    <img 
                      src={mockUser.avatar} 
                      alt={mockUser.displayName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* 在线状态 */}
                  <div className="absolute bottom-6 right-6 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                  
                  {/* 等级徽章 */}
                  <div className="absolute -top-4 -right-4">
                    <div className={`px-5 py-2 rounded-full text-white font-bold text-lg bg-gradient-to-r ${getLevelColor(mockUser.level)} shadow-lg`}>
                      Lv.{mockUser.level}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 用户信息 */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <h1 className="text-5xl font-bold text-gray-900 dark:text-white mr-4">
                        {mockUser.displayName}
                      </h1>
                      {getRoleBadge(mockUser.role)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xl mb-2">@{mockUser.username}</p>
                    
                    {/* 用户简介 */}
                    <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg max-w-3xl">
                      {mockUser.bio}
                    </p>
                  </div>
                </div>
                
                {/* 用户统计 */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
                  {[
                    { label: '粉丝', value: mockStats.followers, icon: <Users className="w-6 h-6" /> },
                    { label: '关注', value: mockStats.following, icon: <User className="w-6 h-6" /> },
                    { label: '文章', value: mockStats.articles, icon: <BookOpen className="w-6 h-6" /> },
                    { label: '帖子', value: mockStats.forumPosts, icon: <MessageSquare className="w-6 h-6" /> },
                    { label: '评论', value: mockStats.comments, icon: <MessageSquare className="w-6 h-6" /> },
                    { label: '获赞', value: mockStats.likesReceived.toLocaleString(), icon: <ThumbsUp className="w-6 h-6" /> },
                    { label: '浏览', value: mockStats.totalViews.toLocaleString(), icon: <Eye className="w-6 h-6" /> },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                {/* 经验进度条 */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        经验值: {mockUser.experience} / 1000
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      升级还需 <span className="font-bold">{1000 - experienceProgress}</span> 经验
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${getLevelColor(mockUser.level)}`}
                      style={{ width: `${experiencePercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* 基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <Mail className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-4" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">邮箱</div>
                      <div className="font-medium">{mockUser.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <Calendar className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-4" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">加入时间</div>
                      <div className="font-medium">{formatDate(mockUser.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <Award className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-4" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">积分</div>
                      <div className="font-medium">{mockUser.points.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <Gamepad className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-4" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">游戏时间</div>
                      <div className="font-medium">{mockUser.gameHours} 小时</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: '概览', icon: <User className="w-5 h-5" /> },
                { id: 'articles', label: `文章 (${mockStats.articles})`, icon: <BookOpen className="w-5 h-5" /> },
                { id: 'posts', label: `帖子 (${mockStats.forumPosts})`, icon: <MessageSquare className="w-5 h-5" /> },
                { id: 'achievements', label: `成就 (${mockStats.achievements})`, icon: <Trophy className="w-5 h-5" /> },
                { id: 'activity', label: '动态', icon: <Clock className="w-5 h-5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{