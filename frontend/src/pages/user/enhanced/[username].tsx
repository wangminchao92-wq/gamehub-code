import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { 
  User, Mail, Calendar, Award, Star, Edit, Settings, 
  BookOpen, MessageSquare, ThumbsUp, Eye, Gamepad,
  Trophy, Target, TrendingUp, Users, Clock, Share2,
  Bell, Heart, Bookmark, Download, Upload, Shield
} from 'lucide-react';

interface EnhancedUserProfilePageProps {
  user: any;
  stats: {
    articles: number;
    forumPosts: number;
    comments: number;
    likesReceived: number;
    totalViews: number;
    followers: number;
    following: number;
  };
  recentArticles: any[];
  recentPosts: any[];
  achievements: any[];
  activityLog: any[];
}

export default function EnhancedUserProfilePage({ 
  user, 
  stats, 
  recentArticles, 
  recentPosts, 
  achievements,
  activityLog 
}: EnhancedUserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'posts' | 'activity' | 'achievements'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 格式化时间
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    return formatDate(dateString);
  };

  // 获取等级徽章颜色
  const getLevelColor = (level: number) => {
    if (level >= 50) return 'bg-purple-100 text-purple-800';
    if (level >= 30) return 'bg-red-100 text-red-800';
    if (level >= 20) return 'bg-blue-100 text-blue-800';
    if (level >= 10) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  // 获取角色徽章
  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      'SUPER_ADMIN': { 
        color: 'bg-purple-100 text-purple-800', 
        label: '超级管理员',
        icon: <Shield className="w-4 h-4" />
      },
      'ADMIN': { 
        color: 'bg-red-100 text-red-800', 
        label: '管理员',
        icon: <Shield className="w-4 h-4" />
      },
      'MODERATOR': { 
        color: 'bg-blue-100 text-blue-800', 
        label: '审核员',
        icon: <Shield className="w-4 h-4" />
      },
      'EDITOR': { 
        color: 'bg-green-100 text-green-800', 
        label: '编辑',
        icon: <Edit className="w-4 h-4" />
      },
      'USER': { 
        color: 'bg-gray-100 text-gray-800', 
        label: '用户',
        icon: <User className="w-4 h-4" />
      },
    };
    
    const config = roleConfig[role] || roleConfig.USER;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  // 经验进度条
  const experienceProgress = (user.level * 1000 + user.experience) % 1000;
  const experiencePercentage = (experienceProgress / 1000) * 100;

  return (
    <MainLayout>
      <SEO 
        title={`${user.displayName || user.username} - GameHub 用户`}
        description={`${user.displayName || user.username} 的 GameHub 个人主页，等级 ${user.level}，${stats.articles} 篇文章，${stats.forumPosts} 个帖子`}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 用户头部信息 */}
        <div className="max-w-6xl mx-auto mb-8">
          {/* 横幅背景 */}
          <div className="relative h-48 rounded-t-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* 横幅操作按钮 */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 flex items-center"
              >
                <Edit className="w-5 h-5 mr-1" />
                编辑
              </button>
            </div>
          </div>
          
          {/* 用户信息卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-b-lg p-6 shadow-lg -mt-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
              {/* 头像区域 */}
              <div className="mb-6 lg:mb-0 lg:mr-8">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-xl">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.displayName || user.username} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-6xl">
                        {user.displayName?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  
                  {/* 在线状态 */}
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  
                  {/* 等级徽章 */}
                  <div className="absolute -top-2 -right-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getLevelColor(user.level)}`}>
                      Lv.{user.level}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 用户信息 */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mr-3">
                        {user.displayName || user.username}
                      </h1>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">@{user.username}</p>
                    
                    {/* 用户简介 */}
                    {user.bio && (
                      <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      私信
                    </button>
                    <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      关注
                    </button>
                    <button className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* 用户统计 */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.followers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">粉丝</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.following}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">关注</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.articles}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">文章</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.forumPosts}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">帖子</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.comments}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">评论</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.likesReceived.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">获赞</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">浏览</div>
                  </div>
                </div>
                
                {/* 经验进度条 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        经验值: {user.experience} / 1000
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      升级还需 {1000 - experienceProgress} 经验
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${experiencePercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* 基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>加入于 {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Award className="w-5 h-5 mr-3" />
                    <span>{user.points.toLocaleString()} 积分</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Gamepad className="w-5 h-5 mr-3" />
                    <span>游戏时间: 256 小时</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex flex-wrap -mb-px">
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <User className="w-4 h-4 mr-2" />
                概览
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'articles'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setActiveTab('articles')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                文章 ({stats.articles})
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setActiveTab('posts')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                帖子 ({stats.forumPosts})
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'achievements'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setActiveTab('achievements')}
              >
                <Trophy className="w-4 h-4 mr-2" />
                成就 ({achievements.length})
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setActiveTab('activity')}
              >
                <Clock className="w-4 h-4 mr-2" />
                动态
              </button>
            </nav>
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左侧：最近活动 */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    最近活动
                  </h3>
                  
                  <div className="space-y-4">
                    {activityLog.slice(0, 5).map((