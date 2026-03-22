import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { 
  User, Mail, Calendar, MapPin, Link, Edit, 
  Star, Trophy, TrendingUp, Users, 
  BookOpen, MessageSquare, Heart, Eye,
  Settings, Shield, Gamepad2, Globe, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface UserData {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  role: string;
  level: number;
  experience: number;
  points: number;
  status: string;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

interface Props {
  user: UserData | null;
  isCurrentUser: boolean;
  stats: {
    articles: number;
    posts: number;
    comments: number;
    followers: number;
    following: number;
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const username = context.params?.username as string;

  try {
    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        role: true,
        level: true,
        experience: true,
        points: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return {
        notFound: true,
      };
    }

    // 获取用户统计（简化版）
    const stats = {
      articles: 12, // 模拟数据
      posts: 45,    // 模拟数据
      comments: 128, // 模拟数据
      followers: 89, // 模拟数据
      following: 56, // 模拟数据
    };

    // 检查是否是当前用户
    const isCurrentUser = session?.user?.id === user.id;

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        isCurrentUser,
        stats,
      },
    };
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return {
      props: {
        user: null,
        isCurrentUser: false,
        stats: { articles: 0, posts: 0, comments: 0, followers: 0, following: 0 },
      },
    };
  }
};

export default function NextAuthUserPage({ user, isCurrentUser, stats }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">用户不存在</h1>
            <p className="text-gray-600 dark:text-gray-400">找不到用户</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
              返回首页
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 等级信息
  const levelInfo = {
    currentLevel: user.level,
    currentExp: user.experience,
    nextLevelExp: user.level * 1000,
    expProgress: Math.min((user.experience / (user.level * 1000)) * 100, 100),
  };

  // 标签页
  const tabs = [
    { id: 'overview', label: '概览', icon: <User className="w-4 h-4" /> },
    { id: 'articles', label: '文章', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'posts', label: '帖子', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'activity', label: '动态', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  if (isCurrentUser) {
    tabs.push({ id: 'settings', label: '设置', icon: <Settings className="w-4 h-4" /> });
  }

  // 结构化数据
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "name": `${user.displayName || user.username} - GameHub用户`,
      "description": user.bio || `GameHub用户${user.displayName || user.username}的个人主页`,
      "mainEntity": {
        "@type": "Person",
        "name": user.displayName || user.username,
        "url": `https://gamehub.com/user/${user.username}`,
        "description": user.bio || `GameHub用户，热爱游戏。`,
        "image": user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      }
    }
  ];

  return (
    <MainLayout>
      <SEO
        title={`${user.displayName || user.username} - GameHub用户`}
        description={user.bio || `GameHub用户${user.displayName || user.username}的个人主页`}
        canonical={`https://gamehub.com/user/${user.username}`}
        ogImage={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
        ogType="profile"
        structuredData={structuredData}
        noindex={true}
        nofollow={true}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 用户头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* 头像 */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl border-4 border-white/20 overflow-hidden bg-white">
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.displayName || user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {user.role}
                  </div>
                ) : null}
              </div>

              {/* 基本信息 */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {user.displayName || user.username}
                    </h1>
                    <p className="text-blue-100">@{user.username}</p>
                    {user.bio && (
                      <p className="mt-2 text-white/90">{user.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isCurrentUser ? (
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        设置
                      </Link>
                    ) : (
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <Users className="w-4 h-4 mr-2" />
                        关注
                      </button>
                    )}
                  </div>
                </div>

                {/* 元信息 */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    加入于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    等级 {user.level}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 左侧边栏 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 统计卡片 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">统计</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">文章</span>
                    <span className="font-bold">{stats.articles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">帖子</span>
                    <span className="font-bold">{stats.posts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">评论</span>
                    <span className="font-bold">{stats.comments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">粉丝</span>
                    <span className="font-bold">{stats.followers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">关注</span>
                    <span className="font-bold">{stats.following}</span>
                  </div>
                </div>
              </div>

              {/* 等级卡片 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">等级进度</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    Lv.{levelInfo.currentLevel}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {levelInfo.currentExp}/{levelInfo.nextLevelExp} 经验
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${levelInfo.expProgress}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  {Math.round(levelInfo.expProgress)}% 到下一级
                </div>
              </div>

              {/* 积分卡片 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">积分</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {user.points}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    可用于兑换特权
                  </div>
                </div>
              </div>
            </div>

            {/* 主内容区 */}
            <div className="lg:col-span-3">
              {/* 标签页导航 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
                <div className="flex overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-3 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 标签页内容 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">用户概览</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 用户信息 */}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">基本信息</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600 dark:text-gray-400">邮箱:</span>
                            <span className="ml-2 font-medium">{user.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600 dark:text-gray-400">角色:</span>
                            <span className="ml-2 font-medium">{user.role}</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600 dark:text-gray-400">状态:</span>
                            <span className="ml-2 font-medium">{user.status}</span>
                          </div>
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600 dark:text-gray-400">邮箱验证:</span>
                            <span className={`ml-2 font-medium ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                              {user.emailVerified ? '已验证' : '未验证'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 最近活动 */}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">最近活动</h3>
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <BookOpen className="w-5 h-5 text-blue-500 mr-3" />
                            <div>
                              <div className="font-medium">发布了新文章</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">2小时前</div>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <div className="font-medium">评论了帖子</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">5小时前</div>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <Heart className="w-5 h-5 text-red-500 mr-3" />
                            <div>
                              <div className="font-medium">点赞了文章</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">1天前</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'articles' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">文章 ({stats.articles})</h2>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>这里将显示用户发布的文章列表</p>
                    </div>
                  </div>
                )}

                {activeTab === 'posts' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white