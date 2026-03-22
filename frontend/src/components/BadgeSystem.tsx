'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Badge, Shield, Star, Crown, Medal, Trophy, Award,
  CheckCircle, XCircle, Lock, Unlock, Users, MessageSquare,
  Heart, Eye, BookOpen, Calendar, TrendingUp, Zap,
  Filter, Search, Grid, List, Share2, Download,
  ChevronRight, Loader2, Sparkles, Gift
} from 'lucide-react';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
  category: 'ACHIEVEMENT' | 'EVENT' | 'SPECIAL' | 'SEASONAL' | 'COMMUNITY';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  requirements: BadgeRequirement[];
  unlockedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  showOnProfile: boolean;
  order: number;
}

interface BadgeRequirement {
  type: 'ACHIEVEMENT' | 'LEVEL' | 'DAYS_ACTIVE' | 'SPECIAL_EVENT' | 'PURCHASE';
  value: string;
  description: string;
}

interface UserBadge {
  badgeId: string;
  unlockedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  showOnProfile: boolean;
}

interface BadgeSystemProps {
  userId?: string;
  onUnlock?: (badgeId: string) => Promise<void>;
  onActivate?: (badgeId: string) => Promise<void>;
  onShare?: (badgeId: string) => Promise<void>;
  initialBadges?: BadgeItem[];
  userBadges?: UserBadge[];
  showLocked?: boolean;
  showExpired?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  requireAuth?: boolean;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({
  userId,
  onUnlock,
  onActivate,
  onShare,
  initialBadges = [],
  userBadges = [],
  showLocked = true,
  showExpired = false,
  showFilters = true,
  showSearch = true,
  requireAuth = true,
}) => {
  const { data: session, status } = useSession();
  const [badges, setBadges] = useState<BadgeItem[]>(initialBadges);
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
  const [activeBadges, setActiveBadges] = useState<Set<string>>(new Set());
  const [profileBadges, setProfileBadges] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterRarity, setFilterRarity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'unlockedAt'>('unlockedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    locked: 0,
    active: 0,
    expired: 0,
    onProfile: 0,
  });

  // 检查权限
  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      setError('需要登录才能查看徽章系统');
    }
  }, [session, status, requireAuth]);

  // 初始化徽章数据
  useEffect(() => {
    if (initialBadges.length === 0) {
      // 生成模拟徽章数据
      const mockBadges: BadgeItem[] = [
        {
          id: 'welcome_badge',
          name: '欢迎徽章',
          description: '欢迎来到GameHub！',
          icon: '👋',
          color: '#ffffff',
          backgroundColor: '#3b82f6',
          category: 'SPECIAL',
          rarity: 'COMMON',
          requirements: [{ type: 'ACHIEVEMENT', value: 'welcome', description: '完成注册' }],
          isActive: true,
          showOnProfile: true,
          order: 1,
        },
        {
          id: 'content_creator',
          name: '内容创作者',
          description: '发布高质量内容的证明',
          icon: '📝',
          color: '#ffffff',
          backgroundColor: '#10b981',
          category: 'ACHIEVEMENT',
          rarity: 'UNCOMMON',
          requirements: [{ type: 'ACHIEVEMENT', value: 'first_post', description: '发布第一篇文章' }],
          isActive: true,
          showOnProfile: true,
          order: 2,
        },
        {
          id: 'social_king',
          name: '社交之王',
          description: '社区活跃度的象征',
          icon: '👑',
          color: '#ffffff',
          backgroundColor: '#8b5cf6',
          category: 'COMMUNITY',
          rarity: 'RARE',
          requirements: [{ type: 'ACHIEVEMENT', value: 'social_butterfly', description: '获得10个粉丝' }],
          isActive: true,
          showOnProfile: true,
          order: 3,
        },
        {
          id: 'game_master',
          name: '游戏大师',
          description: '游戏等级和经验的证明',
          icon: '🎮',
          color: '#ffffff',
          backgroundColor: '#f59e0b',
          category: 'ACHIEVEMENT',
          rarity: 'EPIC',
          requirements: [{ type: 'LEVEL', value: '20', description: '达到等级20' }],
          isActive: true,
          showOnProfile: true,
          order: 4,
        },
        {
          id: 'legendary_player',
          name: '传奇玩家',
          description: '长期活跃和贡献的荣誉',
          icon: '🌟',
          color: '#ffffff',
          backgroundColor: '#ef4444',
          category: 'SPECIAL',
          rarity: 'LEGENDARY',
          requirements: [{ type: 'DAYS_ACTIVE', value: '365', description: '连续活跃365天' }],
          isActive: true,
          showOnProfile: true,
          order: 5,
        },
        {
          id: 'event_participant',
          name: '活动参与者',
          description: '参与社区活动的纪念',
          icon: '🎉',
          color: '#ffffff',
          backgroundColor: '#ec4899',
          category: 'EVENT',
          rarity: 'COMMON',
          requirements: [{ type: 'SPECIAL_EVENT', value: 'spring_event_2026', description: '参与2026春季活动' }],
          isActive: true,
          showOnProfile: true,
          expiresAt: new Date('2026-12-31'),
          order: 6,
        },
        {
          id: 'early_supporter',
          name: '早期支持者',
          description: 'GameHub早期用户的荣誉',
          icon: '🚀',
          color: '#ffffff',
          backgroundColor: '#06b6d4',
          category: 'SPECIAL',
          rarity: 'EPIC',
          requirements: [{ type: 'ACHIEVEMENT', value: 'early_adopter', description: '首月注册用户' }],
          isActive: true,
          showOnProfile: true,
          order: 7,
        },
        {
          id: 'comment_expert',
          name: '评论专家',
          description: '积极参与讨论的证明',
          icon: '💬',
          color: '#ffffff',
          backgroundColor: '#84cc16',
          category: 'COMMUNITY',
          rarity: 'UNCOMMON',
          requirements: [{ type: 'ACHIEVEMENT', value: 'comment_expert', description: '发布1000条评论' }],
          isActive: true,
          showOnProfile: true,
          order: 8,
        },
        {
          id: 'trend_setter',
          name: '潮流引领者',
          description: '创建热门内容的荣誉',
          icon: '🔥',
          color: '#ffffff',
          backgroundColor: '#f97316',
          category: 'ACHIEVEMENT',
          rarity: 'RARE',
          requirements: [{ type: 'ACHIEVEMENT', value: 'trend_setter', description: '帖子获得10000次浏览' }],
          isActive: true,
          showOnProfile: true,
          order: 9,
        },
        {
          id: 'winter_2025',
          name: '2025冬季徽章',
          description: '2025冬季活动的纪念',
          icon: '❄️',
          color: '#ffffff',
          backgroundColor: '#0ea5e9',
          category: 'SEASONAL',
          rarity: 'RARE',
          requirements: [{ type: 'SPECIAL_EVENT', value: 'winter_event_2025', description: '参与2025冬季活动' }],
          isActive: true,
          showOnProfile: true,
          expiresAt: new Date('2026-03-31'),
          order: 10,
        },
        {
          id: 'premium_member',
          name: '高级会员',
          description: '高级会员身份的象征',
          icon: '⭐',
          color: '#ffffff',
          backgroundColor: '#fbbf24',
          category: 'SPECIAL',
          rarity: 'EPIC',
          requirements: [{ type: 'PURCHASE', value: 'premium_subscription', description: '购买高级会员' }],
          isActive: true,
          showOnProfile: true,
          order: 11,
        },
        {
          id: 'moderator',
          name: '社区版主',
          description: '社区管理职责的荣誉',
          icon: '🛡️',
          color: '#ffffff',
          backgroundColor: '#6366f1',
          category: 'COMMUNITY',
          rarity: 'LEGENDARY',
          requirements: [{ type: 'SPECIAL', value: 'moderator_role', description: '被任命为社区版主' }],
          isActive: true,
          showOnProfile: true,
          order: 12,
        },
      ];

      setBadges(mockBadges);
    }
  }, [initialBadges]);

  // 初始化用户徽章数据
  useEffect(() => {
    const unlockedIds = new Set(userBadges.map(ub => ub.badgeId));
    const activeIds = new Set(userBadges.filter(ub => ub.isActive).map(ub => ub.badgeId));
    const profileIds = new Set(userBadges.filter(ub => ub.showOnProfile).map(ub => ub.badgeId));
    
    setUnlockedBadges(unlockedIds);
    setActiveBadges(activeIds);
    setProfileBadges(profileIds);
  }, [userBadges]);

  // 计算统计
  useEffect(() => {
    const now = new Date();
    const total = badges.length;
    const unlocked = badges.filter(b => unlockedBadges.has(b.id)).length;
    const locked = total - unlocked;
    const active = badges.filter(b => activeBadges.has(b.id)).length;
    const expired = badges.filter(b => {
      if (!b.expiresAt) return false;
      return new Date(b.expiresAt) < now;
    }).length;
    const onProfile = badges.filter(b => profileBadges.has(b.id)).length;

    setStats({
      total,
      unlocked,
      locked,
      active,
      expired,
      onProfile,
    });
  }, [badges, unlockedBadges, activeBadges, profileBadges]);

  // 过滤和排序徽章
  const filteredBadges = badges
    .filter(badge => {
      const now = new Date();
      const isUnlocked = unlockedBadges.has(badge.id);
      const isExpired = badge.expiresAt && new Date(badge.expiresAt) < now;

      // 过期徽章过滤
      if (isExpired && !showExpired && !isUnlocked) {
        return false;
      }

      // 状态过滤
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'UNLOCKED' && !isUnlocked) return false;
        if (filterStatus === 'LOCKED' && isUnlocked) return false;
        if (filterStatus === 'ACTIVE' && !activeBadges.has(badge.id)) return false;
        if (filterStatus === 'EXPIRED' && !isExpired) return false;
      }

      // 分类过滤
      if (filterCategory !== 'ALL' && badge.category !== filterCategory) {
        return false;
      }

      // 稀有度过滤
      if (filterRarity !== 'ALL' && badge.rarity !== filterRarity) {
        return false;
      }

      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          badge.name.toLowerCase().includes(query) ||
          badge.description.toLowerCase().includes(query)
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
        case 'rarity':
          const rarityOrder = { 'COMMON': 1, 'UNCOMMON': 2, 'RARE': 3, 'EPIC': 4, 'LEGENDARY': 5 };
          aValue = rarityOrder[a.rarity] || 0;
          bValue = rarityOrder[b.rarity] || 0;
          break;
        case 'unlockedAt':
          // 这里需要从用户徽章数据中获取解锁时间
          aValue = unlockedBadges.has(a.id) ? 1 : 0;
          bValue = unlockedBadges.has(b.id) ? 1 : 0;
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

  // 处理解锁徽章
  const handleUnlock = async (badgeId: string) => {
    if (!onUnlock || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onUnlock(badgeId);
      
      setUnlockedBadges(prev => new Set([...prev, badgeId]));
      setActiveBadges(prev => new Set([...prev, badgeId]));
      setSuccess('徽章已解锁！');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '解锁失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理激活/停用徽章
  const handleActivate = async (badgeId: string) => {
    if (!onActivate || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onActivate(badgeId);
      
      setActiveBadges(prev => {
        const newSet = new Set(prev);
        if (newSet.has(badgeId)) {
          newSet.delete(badgeId);
        } else {
          newSet.add(badgeId);
        }
        return newSet;
      });
      
      const isActive = activeBadges.has(badgeId);
      setSuccess(`徽章已${isActive ? '停用' : '激活'}！`);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理分享徽章
  const handleShare = async (badgeId: string) => {
    if (!onShare || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onShare(badgeId);
      setSuccess('徽章已分享！');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '分享失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理显示在个人资料
  const handleToggleProfile = (badgeId: string) => {
    setProfileBadges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(badgeId)) {
        newSet.delete(badgeId);
      } else {
        newSet.add(badgeId);
      }
      return newSet;
    });
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
