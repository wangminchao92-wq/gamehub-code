import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { 
  User, Mail, Calendar, MapPin, Link, Edit, 
  Star, Trophy, Award, TrendingUp, Users, 
  BookOpen, MessageSquare, Heart, Eye, 
  Settings, Shield, Bell, LogOut, Plus,
  ChevronRight, CheckCircle, XCircle, Clock,
  Gamepad2, Palette, Globe, Lock, Unlock
} from 'lucide-react';
import Link from 'next/link';

// 用户数据类型
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
  updatedAt: Date;
  settings: {
    theme: string;
    language: string;
    notifications: boolean;
    privacy: string;
  } | null;
  profile: {
    bio: string | null;
    location: string | null;
    website: string | null;
    socialLinks: any;
  } | null;
  _count?: {
    articles?: number;
    forumPosts?: number;
    comments?: number;
    followers?: number;
    following?: number;
  };
}

interface Props {
  user: UserData | null;
  isCurrentUser: boolean;
  currentUserRole: string;
}

export default function NextAuthEnhancedUserPage({ user, isCurrentUser, currentUserRole }: Props) {
  const router = useRouter();
  const { username } = router.query;
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  // 标签页配置
  const tabs = [
    { id: 'overview', label: '概览', icon: <User className="w-4 h-4" /> },
    { id: 'articles', label: '文章', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'posts', label: '帖子', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'comments', label: '评论', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'achievements', label: '成就', icon: <Trophy className="w-4 h-4" /> },
    { id: 'activity', label: '动态', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'followers', label: '粉丝', icon: <Users className="w-4 h-4" /> },
    { id: 'following', label: '关注', icon: <Users className="w-4 h-4" /> },
  ];

  // 如果是当前用户，添加设置标签
  if (isCurrentUser) {
    tabs.push({ id: 'settings', label: '设置', icon: <Settings className="w-4 h-4" /> });
  }

  // 用户统计
  const userStats = {
    articles: user?._count?.articles || 0,
    posts: user?._count?.forumPosts || 0,
    comments: user?._count?.comments || 0,
    likes: 156, // 模拟数据
    views: 2842, // 模拟数据
    followers: user?._count?.followers || 0,
    following: user?._count?.following || 0,
  };

  // 用户等级信息
  const levelInfo = {
    currentLevel: user?.level || 1,
    currentExp: user?.experience || 0,
    nextLevelExp: (user?.level || 1) * 1000,
    expProgress: ((user?.experience || 0) / ((user?.level || 1) * 1000)) * 100,
  };

  // 用户成就
  const achievements = [
    { id: 1, name: '初来乍到', description: '注册账户', icon: '🎉', earned: true, date: '2026-03-22' },
    { id: 2, name: '内容创作者', description: '发布第一篇文章', icon: '📝', earned: userStats.articles > 0, date: userStats.articles > 0 ? '2026-03-22' : null },
    { id: 3, name: '社区活跃者', description: '发布10个帖子', icon: '💬', earned: userStats.posts >= 10, date: userStats.posts >= 10 ? '2026-03-22' : null },
    { id: 4, name: '社交达人', description: '获得50个粉丝', icon: '👥', earned: userStats.followers >= 50, date: userStats.followers >= 50 ? '2026-03-22' : null },
    { id: 5, name: '游戏大师', description: '达到10级', icon: '🎮', earned: levelInfo.currentLevel >= 10, date: levelInfo.currentLevel >= 10 ? '2026-03-22' : null },
  ];

  // 最近活动
  const recentActivities = [
    { id: 1, type: 'article', title: '发布了新文章', description: '《游戏开发的艺术》', time: '2小时前', icon: <BookOpen className="w-4 h-4" /> },
    { id: 2, type: 'comment', title: '评论了文章', description: '《React最佳实践》', time: '5小时前', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 3, type: 'like', title: '点赞了帖子', description: '《游戏引擎比较》', time: '1天前', icon: <Heart className="w-4 h-4" /> },
    { id: 4, type: 'follow', title: '关注了新用户', description: '@game_developer', time: '2天前', icon: <Users className="w-4 h-4" /> },
    { id: 5, type: 'level', title: '升级了', description: '达到等级5', time: '3天前', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // 处理编辑表单
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      // 这里应该调用API更新用户信息
      console.log('保存编辑:', editForm);
      setIsEditing(false);
      // 可以添加成功提示
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 如果没有用户数据
  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">用户不存在</h1>
            <p className="text-gray-600 dark:text-gray-400">找不到用户 "{username}"</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
              返回首页
            </Link>
          </div>
        </div>
      </MainLayout>
    );
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
        "memberOf": {
          "@type": "Organization",
          "name": "GameHub"
        }
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
          "name": user.displayName || user.username,
          "item": `https://gamehub.com/user/${user.username}`
        }
      ]
    }
  ];

  return (
    <MainLayout>
      <SEO
        title={`${user.displayName || user.username} - GameHub用户`}
        description={user.bio || `GameHub用户${user.displayName || user.username}的个人主页，等级${user.level}，${user.points}积分。`}
        keywords={`${user.displayName || user.username}, GameHub用户, 游戏玩家, 社区成员`}
        canonical={`https://gamehub.com/user/${user.username}`}
        ogImage={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
        ogType="profile"
        structuredData={structuredData}
        noindex={true}  // 用户页面通常noindex保护隐私
        nofollow={true}
        author={user.displayName || user.username}
        section="User Profile"
        tags={["user profile", "gamer", "community member"]}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 用户头部信息 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* 用户头像 */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white/20 overflow-hidden bg-white">
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
                ) : user.role === 'MODERATOR' ? (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    版主
                  </div>
                ) : null}
              </div>

              {/* 用户基本信息 */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {user.displayName || user.username}
                    </h1>
                    <p className="text-blue-100">@{user.username}</p>
                    {user.bio && (
                      <p className="mt-2 text-white/90 max-w-2xl">{user.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isCurrentUser ? (
                      <>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {isEditing ? '取消编辑' : '编辑资料'}
                        </button>
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          设置
                        </Link>
                      </>
                    ) : (
                      <>
                        <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                          <Users className="w-4 h-4 mr-2" />
                          关注
                        </button>
                        <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          私信
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 用户元信息 */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <a 
                      href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline"
                    >
                      <Link className="w-4 h-4 mr-1" />
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    加入于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    最后登录 {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('zh-CN') : '从未登录'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 左侧边栏 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 用户统计卡片 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">用户统计</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">等级</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">Lv.{levelInfo.currentLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">积分</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{user.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">经验值</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{levelInfo.currentExp}/{levelInfo.nextLevelExp}</span>
                  </div>
                  
                  {/* 经验进度条 */}
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${Math.min(levelInfo.expProgress, 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                      {Math.round(levelInfo.expProgress)}% 到下一级
                    </div>
                  </div>
                </div>
              </div>

              {/* 详细统计 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">详细数据</h3>
                <div className="space-y-3">
                  {[
                    { label: '文章', value: userStats.articles, icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-600' },
                    { label: '帖子', value