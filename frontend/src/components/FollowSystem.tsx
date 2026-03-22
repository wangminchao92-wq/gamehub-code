'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Users, UserPlus, UserMinus, UserCheck, UserX,
  Search, Filter, Grid, List, Star, TrendingUp,
  Calendar, MapPin, Link, MessageSquare, Mail,
  Shield, Crown, Award, CheckCircle, XCircle,
  MoreVertical, Loader2, RefreshCw, ExternalLink
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  role: string;
  level: number;
  experience: number;
  points: number;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  commentsCount: likesCount: number;
  lastActiveAt: Date;
  createdAt: Date;
  isFollowing: boolean;
  isFollowedBy: boolean;
  isBlocked: boolean;
  mutualFriends?: number;
  commonInterests?: string[];
}

interface FollowSystemProps {
  userId?: string;
  mode: 'FOLLOWERS' | 'FOLLOWING' | 'SUGGESTIONS' | 'SEARCH';
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  onBlock?: (userId: string) => Promise<void>;
  onUnblock?: (userId: string) => Promise<void>;
  onMessage?: (userId: string) => Promise<void>;
  initialUsers?: UserProfile[];
  showStats?: boolean;
  showActions?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  maxUsers?: number;
  requireAuth?: boolean;
}

const FollowSystem: React.FC<FollowSystemProps> = ({
  userId,
  mode = 'FOLLOWERS',
  onFollow,
  onUnfollow,
  onBlock,
  onUnblock,
  onMessage,
  initialUsers = [],
  showStats = true,
  showActions = true,
  showFilters = true,
  showSearch = true,
  maxUsers = 50,
  requireAuth = true,
}) => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'followers' | 'lastActive'>('followers');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    following: 0,
    followers: 0,
    mutual: 0,
    online: 0,
  });
  const [activeTab, setActiveTab] = useState(mode);

  // 检查权限
  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      setError('需要登录才能使用关注系统');
    }
  }, [session, status, requireAuth]);

  // 初始化用户数据
  useEffect(() => {
    if (initialUsers.length === 0) {
      // 生成模拟用户数据
      const mockUsers: UserProfile[] = [
        {
          id: 'user-001',
          username: 'hardcore_gamer',
          displayName: '硬核玩家',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hardcore',
          bio: '热爱挑战高难度游戏，全成就收集者',
          location: '北京',
          website: 'hardcoregamer.com',
          role: 'USER',
          level: 42,
          experience: 12500,
          points: 2840,
          followersCount: 156,
          followingCount: 89,
          postsCount: 45,
          commentsCount: 230,
          likesCount: 1250,
          lastActiveAt: new Date(Date.now() - 1000 * 60 * 5), // 5分钟前
          createdAt: new Date('2025-01-15'),
          isFollowing: true,
          isFollowedBy: true,
          isBlocked: false,
          mutualFriends: 12,
          commonInterests: ['艾尔登法环', '黑暗之魂', '只狼'],
        },
        {
          id: 'user-002',
          username: 'gamer1',
          displayName: '游戏玩家1',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer1',
          bio: '休闲玩家，喜欢各种类型的游戏',
          location: '上海',
          role: 'USER',
          level: 28,
          experience: 8500,
          points: 1560,
          followersCount: 89,
          followingCount: 156,
          postsCount: 23,
          commentsCount: 156,
          likesCount: 780,
          lastActiveAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
          createdAt: new Date('2025-03-20'),
          isFollowing: true,
          isFollowedBy: false,
          isBlocked: false,
          mutualFriends: 8,
          commonInterests: ['星露谷物语', '动物森友会', '独立游戏'],
        },
        {
          id: 'user-003',
          username: 'cyber_fan',
          displayName: '赛博爱好者',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyber',
          bio: '赛博朋克文化爱好者，技术宅',
          location: '深圳',
          website: 'cyberfan.blog',
          role: 'EDITOR',
          level: 35,
          experience: 10500,
          points: 2150,
          followersCount: 210,
          followingCount: 145,
          postsCount: 67,
          commentsCount: 320,
          likesCount: 1560,
          lastActiveAt: new Date(Date.now() - 1000 * 60 * 60), // 1小时前
          createdAt: new Date('2025-02-10'),
          isFollowing: false,
          isFollowedBy: true,
          isBlocked: false,
          mutualFriends: 5,
          commonInterests: ['赛博朋克2077', 'Deus Ex', '科幻游戏'],
        },
        {
          id: 'user-004',
          username: 'console_expert',
          displayName: '主机专家',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=console',
          bio: '主机游戏收藏家，拥有所有世代的主机',
          location: '广州',
          role: 'MODERATOR',
          level: 48,
          experience: 14200,
          points: 3250,
          followersCount: 320,
          followingCount: 210,
          postsCount: 89,
          commentsCount: 450,
          likesCount: 2340,
          lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3小时前
          createdAt: new Date('2024-11-05'),
          isFollowing: true,
          isFollowedBy: true,
          isBlocked: false,
          mutualFriends: 18,
          commonInterests: ['PS5', 'Xbox', '任天堂', '复古游戏'],
        },
        {
          id: 'user-005',
          username: 'dev_learner',
          displayName: '开发学习者',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
          bio: '正在学习游戏开发，希望有一天能做出自己的游戏',
          location: '杭州',
          role: 'USER',
          level: 18,
          experience: 5200,
          points: 980,
          followersCount: 45,
          followingCount: 120,
          postsCount: 12,
          commentsCount: 89,
          likesCount: 340,
          lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
          createdAt: new Date('2025-05-15'),
          isFollowing: false,
          isFollowedBy: false,
          isBlocked: false,
          mutualFriends: 3,
          commonInterests: ['Unity', '游戏开发', '编程学习'],
        },
        {
          id: 'user-006',
          username: 'ff_fan',
          displayName: '最终幻想粉丝',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ff',
          bio: '最终幻想系列死忠粉，收集所有相关周边',
          location: '成都',
          role: 'USER',
          level: 31,
          experience: 9500,
          points: 1780,
          followersCount: 120,
          followingCount: 95,
          postsCount: 34,
          commentsCount: 210,
          likesCount: 890,
          lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12小时前
          createdAt: new Date('2025-04-01'),
          isFollowing: true,
          isFollowedBy: false,
          isBlocked: false,
          mutualFriends: 7,
          commonInterests: ['最终幻想', 'JRPG', '角色扮演游戏'],
        },
        {
          id: 'user-007',
          username: 'indie_lover',
          displayName: '独立游戏爱好者',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=indie',
          bio: '热爱独立游戏，支持小型开发团队',
          location: '南京',
          role: 'USER',
          level: 25,
          experience: 7500,
          points: 1420,
          followersCount: 78,
          followingCount: 110,
          postsCount: 28,
          commentsCount: 165,
          likesCount: 720,
          lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6小时前
          createdAt: new Date('2025-06-10'),
          isFollowing: false,
          isFollowedBy: true,
          isBlocked: false,
          mutualFriends: 4,
          commonInterests: ['独立游戏', '创意游戏', '艺术游戏'],
        },
        {
          id: 'user-008',
          username: 'esports_pro',
          displayName: '电竞选手',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=esports',
          bio: '职业电竞选手，主攻MOBA和FPS游戏',
          location: '重庆',
          role: 'USER',
          level: 55,
          experience: 16800,
          points: 3890,
          followersCount: 450,
          followingCount: 180,
          postsCount: 56,
          commentsCount: 120,
          likesCount: 1560,
          lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
          createdAt: new Date('2024-09-20'),
          isFollowing: false,
          isFollowedBy: false,
          isBlocked: false,
          mutualFriends: 2,
          commonInterests: ['英雄联盟', 'CS:GO', '电竞比赛'],
        },
      ];

      setUsers(mockUsers);
    }
  }, [initialUsers]);

  // 计算统计
  useEffect(() => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 1000 * 60 * 5);
    
    const total = users.length;
    const following = users.filter(u => u.isFollowing).length;
    const followers = users.filter(u => u.isFollowedBy).length;
    const mutual = users.filter(u => u.isFollowing && u.isFollowedBy).length;
    const online = users.filter(u => new Date(u.lastActiveAt) > fiveMinutesAgo).length;

    setStats({
      total,
      following,
      followers,
      mutual,
      online,
    });
  }, [users]);

  // 根据模式过滤用户
  const getFilteredUsersByMode = () => {
    switch (activeTab) {
      case 'FOLLOWERS':
        return users.filter(user => user.isFollowedBy);
      case 'FOLLOWING':
        return users.filter(user => user.isFollowing);
      case 'SUGGESTIONS':
        // 推荐算法：非关注、有共同兴趣、活跃用户
        return users.filter(user => 
          !user.isFollowing && 
          !user.isBlocked &&
          (user.mutualFriends || 0) > 0
        );
      case 'SEARCH':
        return users;
      default:
        return users;
    }
  };

  // 过滤和排序用户
  const filteredUsers = getFilteredUsersByMode()
    .filter(user => {
      // 角色过滤
      if (filterRole !== 'ALL' && user.role !== filterRole) {
        return false;
      }

      // 等级过滤
      if (filterLevel !== 'ALL') {
        const level = user.level;
        switch (filterLevel) {
          case 'BEGINNER':
            if (level >= 10) return false;
            break;
          case 'INTERMEDIATE':
            if (level < 10 || level >= 30) return false;
            break;
          case 'ADVANCED':
            if (level < 30 || level >= 50) return false;
            break;
          case 'EXPERT':
            if (level < 50) return false;
            break;
        }
      }

      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.username.toLowerCase().includes(query) ||
          user.displayName?.toLowerCase().includes(query) ||
          user.bio?.toLowerCase().includes(query) ||
          user.location?.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .slice(0, maxUsers) // 限制数量
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = (a.displayName || a.username).toLowerCase();
          bValue = (b.displayName || b.username).toLowerCase();
          break;
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        case 'followers':
          aValue = a.followersCount;
          bValue = b.followersCount;
          break;
        case 'lastActive':
          aValue = new Date(a.lastActiveAt).getTime();
          bValue = new Date(b.lastActiveAt).getTime();
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

  // 处理关注
  const handleFollow = async (userId: string) => {
    if (!onFollow || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onFollow(userId);
      
      // 更新本地状态
      setUsers(prev => prev.map(user => 
        user.id === userId
          ? { ...user, isFollowing: true, followersCount: user.followersCount + 1 }
          : user
      ));
      
      setSuccess('关注成功');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '关注失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消关注
  const handleUnfollow = async (userId: string) => {
    if (!onUnfollow || loading) return;

    if (!confirm('确定要取消关注吗？')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onUnfollow(userId);
      
      // 更新本地状态
      setUsers(prev => prev.map(user => 
        user.id === userId
          ? { ...user, isFollowing: false, followersCount: Math.max(0, user.followersCount - 1) }
          : user
      ));
      
      setSuccess('已取消关注');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '取消关注失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理屏蔽
  const handleBlock = async (userId: string) => {
    if (!onBlock || loading) return;

    if (!confirm('确定要屏蔽此用户吗？屏蔽后您将看不到该用户的内容。')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onBlock(userId);
      
      // 更新本地状态
      setUsers(prev => prev.map(user => 
        user.id === userId
          ? { ...user, isBlocked: true, isFollowing: false, isFollowedBy: false }
          : user
      ));
      
      setSuccess('用户已屏蔽');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '屏蔽失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消屏蔽
  const handleUnblock = async (userId: string) => {
    if (!onUn