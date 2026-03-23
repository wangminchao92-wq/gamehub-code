'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Trophy, Award, Star, Medal, Crown, Target, Zap, Flame,
  Users, MessageSquare, Heart, Eye, BookOpen, Calendar,
  TrendingUp, Lock, Unlock, CheckCircle, XCircle,
  Gift, Sparkles, Clock, BarChart, Filter, Search,
  Share2, Download, Loader2, ChevronRight
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'CONTENT' | 'SOCIAL' | 'GAMING' | 'COMMUNITY' | 'SPECIAL';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  points: number;
  requirements: AchievementRequirement[];
  unlockedAt?: Date;
  progress?: number; // 0-100
  totalRequired?: number;
  currentProgress?: number;
  isSecret: boolean;
  isHidden: boolean;
  order: number;
}

interface AchievementRequirement {
  type: 'POST_COUNT' | 'COMMENT_COUNT' | 'LIKE_COUNT' | 'FOLLOWER_COUNT' | 'LEVEL' | 'DAYS_ACTIVE' | 'SPECIAL';
  value: number;
  description: string;
}

interface UserAchievement {
  achievementId: string;
  unlockedAt: Date;
  shared: boolean;
  progress?: number;
}

interface AchievementSystemProps {
  userId?: string;
  onUnlock?: (achievementId: string) => Promise<void>;
  onShare?: (achievementId: string) => Promise<void>;
  onClaimReward?: (achievementId: string) => Promise<void>;
  initialAchievements?: Achievement[];
  userAchievements?: UserAchievement[];
  showLocked?: boolean;
  showSecret?: boolean;
  showProgress?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  requireAuth?: boolean;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  userId,
  onUnlock,
  onShare,
  onClaimReward,
  initialAchievements = [],
  userAchievements = [],
  showLocked = true,
  showSecret = false,
  showProgress = true,
  showFilters = true,
  showSearch = true,
  requireAuth = true,
}) => {
  const { data: session, status } = useSession();
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [progressData, setProgressData] = useState<Record<string, number>>({});
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterRarity, setFilterRarity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'rarity' | 'progress'>('points');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    locked: 0,
    secret: 0,
    totalPoints: 0,
    earnedPoints: 0,
    completionRate: 0,
  });

  // 检查权限
  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      setError('需要登录才能查看成就系统');
    }
  }, [session, status, requireAuth]);

  // 初始化成就数据
  useEffect(() => {
    if (initialAchievements.length === 0) {
      // 生成模拟成就数据
      const mockAchievements: Achievement[] = [
        {
          id: 'welcome',
          name: '初来乍到',
          description: '注册GameHub账户',
          icon: '🎉',
          category: 'SPECIAL',
          rarity: 'COMMON',
          points: 10,
          requirements: [{ type: 'SPECIAL', value: 1, description: '完成注册' }],
          isSecret: false,
          isHidden: false,
          order: 1,
        },
        {
          id: 'first_post',
          name: '内容创作者',
          description: '发布第一篇文章',
          icon: '📝',
          category: 'CONTENT',
          rarity: 'COMMON',
          points: 20,
          requirements: [{ type: 'POST_COUNT', value: 1, description: '发布1篇文章' }],
          isSecret: false,
          isHidden: false,
          order: 2,
        },
        {
          id: 'social_butterfly',
          name: '社交达人',
          description: '获得10个粉丝',
          icon: '👥',
          category: 'SOCIAL',
          rarity: 'UNCOMMON',
          points: 50,
          requirements: [{ type: 'FOLLOWER_COUNT', value: 10, description: '获得10个粉丝' }],
          isSecret: false,
          isHidden: false,
          order: 3,
        },
        {
          id: 'community_leader',
          name: '社区领袖',
          description: '发布100个帖子并获得500个赞',
          icon: '👑',
          category: 'COMMUNITY',
          rarity: 'RARE',
          points: 100,
          requirements: [
            { type: 'POST_COUNT', value: 100, description: '发布100个帖子' },
            { type: 'LIKE_COUNT', value: 500, description: '获得500个赞' },
          ],
          isSecret: false,
          isHidden: false,
          order: 4,
        },
        {
          id: 'game_master',
          name: '游戏大师',
          description: '达到等级20',
          icon: '🎮',
          category: 'GAMING',
          rarity: 'EPIC',
          points: 200,
          requirements: [{ type: 'LEVEL', value: 20, description: '达到等级20' }],
          isSecret: false,
          isHidden: false,
          order: 5,
        },
        {
          id: 'legendary_contributor',
          name: '传奇贡献者',
          description: '连续活跃365天',
          icon: '🌟',
          category: 'SPECIAL',
          rarity: 'LEGENDARY',
          points: 500,
          requirements: [{ type: 'DAYS_ACTIVE', value: 365, description: '连续活跃365天' }],
          isSecret: false,
          isHidden: false,
          order: 6,
        },
        {
          id: 'secret_achiever',
          name: '秘密成就',
          description: '发现隐藏的成就',
          icon: '🔍',
          category: 'SPECIAL',
          rarity: 'RARE',
          points: 75,
          requirements: [{ type: 'SPECIAL', value: 1, description: '发现隐藏成就' }],
          isSecret: true,
          isHidden: true,
          order: 7,
        },
        {
          id: 'comment_expert',
          name: '评论专家',
          description: '发布1000条评论',
          icon: '💬',
          category: 'COMMUNITY',
          rarity: 'UNCOMMON',
          points: 80,
          requirements: [{ type: 'COMMENT_COUNT', value: 1000, description: '发布1000条评论' }],
          isSecret: false,
          isHidden: false,
          order: 8,
        },
        {
          id: 'trend_setter',
          name: '潮流引领者',
          description: '创建的热门帖子获得10000次浏览',
          icon: '🔥',
          category: 'CONTENT',
          rarity: 'RARE',
          points: 150,
          requirements: [{ type: 'SPECIAL', value: 10000, description: '帖子获得10000次浏览' }],
          isSecret: false,
          isHidden: false,
          order: 9,
        },
        {
          id: 'early_adopter',
          name: '早期采用者',
          description: '在GameHub上线首月注册',
          icon: '🚀',
          category: 'SPECIAL',
          rarity: 'EPIC',
          points: 250,
          requirements: [{ type: 'SPECIAL', value: 1, description: '首月注册用户' }],
          isSecret: false,
          isHidden: false,
          order: 10,
        },
      ];

      setAchievements(mockAchievements);
    }
  }, [initialAchievements]);

  // 初始化用户成就数据
  useEffect(() => {
    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
    setUnlockedAchievements(unlockedIds);

    // 计算进度数据
    const progress: Record<string, number> = {};
    userAchievements.forEach(ua => {
      if (ua.progress !== undefined) {
        progress[ua.achievementId] = ua.progress;
      }
    });
    setProgressData(progress);
  }, [userAchievements]);

  // 计算统计
  useEffect(() => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => unlockedAchievements.has(a.id)).length;
    const locked = total - unlocked;
    const secret = achievements.filter(a => a.isSecret).length;
    const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
    const earnedPoints = achievements
      .filter(a => unlockedAchievements.has(a.id))
      .reduce((sum, a) => sum + a.points, 0);
    const completionRate = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    setStats({
      total,
      unlocked,
      locked,
      secret,
      totalPoints,
      earnedPoints,
      completionRate,
    });
  }, [achievements, unlockedAchievements]);

  // 过滤和排序成就
  const filteredAchievements = achievements
    .filter(achievement => {
      // 秘密成就过滤
      if (achievement.isSecret && !showSecret && !unlockedAchievements.has(achievement.id)) {
        return false;
      }

      // 隐藏成就过滤
      if (achievement.isHidden && !unlockedAchievements.has(achievement.id)) {
        return false;
      }

      // 状态过滤
      if (filterStatus !== 'ALL') {
        const isUnlocked = unlockedAchievements.has(achievement.id);
        if (filterStatus === 'UNLOCKED' && !isUnlocked) return false;
        if (filterStatus === 'LOCKED' && isUnlocked) return false;
      }

      // 分类过滤
      if (filterCategory !== 'ALL' && achievement.category !== filterCategory) {
        return false;
      }

      // 稀有度过滤
      if (filterRarity !== 'ALL' && achievement.rarity !== filterRarity) {
        return false;
      }

      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          achievement.name.toLowerCase().includes(query) ||
          achievement.description.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        case 'rarity':
          const rarityOrder = { 'COMMON': 1, 'UNCOMMON': 2, 'RARE': 3, 'EPIC': 4, 'LEGENDARY': 5 };
          aValue = rarityOrder[a.rarity] || 0;
          bValue = rarityOrder[b.rarity] || 0;
          break;
        case 'progress':
          const aProgress = progressData[a.id] || 0;
          const bProgress = progressData[b.id] || 0;
          const aUnlocked = unlockedAchievements.has(a.id) ? 100 : aProgress;
          const bUnlocked = unlockedAchievements.has(b.id) ? 100 : bProgress;
          aValue = aUnlocked;
          bValue = bUnlocked;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // 处理解锁成就
  const handleUnlock = async (achievementId: string) => {
    if (!onUnlock || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onUnlock(achievementId);
      
      setUnlockedAchievements(prev => {
        const newSet = new Set(prev);
        newSet.add(achievementId);
        return newSet;
      });
      setSuccess('成就已解锁！');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '解锁失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理分享成就
  const handleShare = async (achievementId: string) => {
    if (!onShare || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onShare(achievementId);
      setSuccess('成就已分享！');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '分享失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理领取奖励
  const handleClaimReward = async (achievementId: string) => {
    if (!onClaimReward || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onClaimReward(achievementId);
      setSuccess('奖励已领取！');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '领取失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取稀有度颜色
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'text-gray-600 dark:text-gray-400';
      case 'UNCOMMON': return 'text-green-600 dark:text-green-400';
      case 'RARE': return 'text-blue-600 dark:text-blue-400';
      case 'EPIC': return 'text-purple-600 dark:text-purple-400';
      case 'LEGENDARY': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600';
    }
  };

  // 获取稀有度背景颜色
  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'bg-gray-100 dark:bg-gray-800';
      case 'UNCOMMON': return 'bg-green-100 dark:bg-green-900/20';
      case 'RARE': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'EPIC': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'LEGENDARY': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-gray-100';
    }
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CONTENT': return <BookOpen className="w-4 h-4" />;
      case 'SOCIAL': return <Users className="w-4 h-4" />;
      case 'GAMING': return <Trophy className="w-4 h-4" />;
      case 'COMMUNITY': return <MessageSquare className="w-4 h-4" />;
      case 'SPECIAL': return <Star className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CONTENT': return 'text-blue-600 dark:text-blue-400';
      case 'SOCIAL': return 'text-green-600 dark:text-green-400';
      case 'GAMING': return 'text-purple-600 dark:text-purple-400';
      case 'COMMUNITY': return 'text-orange-600 dark:text-orange-400';
      case 'SPECIAL': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600';
    }
  };

  // 权限检查
  if (requireAuth && status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-