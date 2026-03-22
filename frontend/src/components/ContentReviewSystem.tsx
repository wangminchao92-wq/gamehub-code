'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Shield, CheckCircle, XCircle, AlertCircle, Eye, Edit2,
  Clock, User, Tag, MessageSquare, ThumbsUp, Flag,
  Filter, Search, RefreshCw, Loader2, Lock, Globe,
  BarChart, TrendingUp, Users, Calendar, Star
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'ARTICLE' | 'POST' | 'COMMENT' | 'USER';
  title?: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    role: string;
    level: number;
  };
  createdAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'DELETED';
  flags: Flag[];
  score: number; // 内容质量评分 0-100
  category?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
}

interface Flag {
  id: string;
  type: 'SPAM' | 'HARASSMENT' | 'HATE_SPEECH' | 'MISINFORMATION' | 'COPYRIGHT' | 'OTHER';
  reason: string;
  reporter: {
    id: string;
    username: string;
  };
  createdAt: Date;
  resolved: boolean;
}

interface ReviewAction {
  id: string;
  contentId: string;
  reviewerId: string;
  action: 'APPROVE' | 'REJECT' | 'FLAG' | 'DELETE' | 'WARN';
  reason?: string;
  createdAt: Date;
}

interface ContentReviewSystemProps {
  onReview?: (contentId: string, action: string, reason?: string) => Promise<void>;
  onBulkAction?: (contentIds: string[], action: string, reason?: string) => Promise<void>;
  initialContent?: ContentItem[];
  autoReviewEnabled?: boolean; // 是否启用自动审核
  aiAssistanceEnabled?: boolean; // 是否启用AI辅助
  requireAuth?: boolean;
  requiredRole?: string; // 需要的角色 (MODERATOR, ADMIN, SUPER_ADMIN)
}

const ContentReviewSystem: React.FC<ContentReviewSystemProps> = ({
  onReview,
  onBulkAction,
  initialContent = [],
  autoReviewEnabled = true,
  aiAssistanceEnabled = true,
  requireAuth = true,
  requiredRole = 'MODERATOR',
}) => {
  const { data: session, status } = useSession();
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [selectedContent, setSelectedContent] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'flags' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [reviewing, setReviewing] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkReason, setBulkReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
    deleted: 0,
    today: 0,
    avgReviewTime: 0,
  });
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, any>>({});
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // 检查权限
  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      setError('需要登录才能访问审核系统');
    }
    
    if (requireAuth && status === 'authenticated' && requiredRole) {
      const userRole = session?.user?.role;
      const roleHierarchy = ['USER', 'EDITOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
      const userLevel = roleHierarchy.indexOf(userRole || 'USER');
      const requiredLevel = roleHierarchy.indexOf(requiredRole);
      
      if (userLevel < requiredLevel) {
        setError(`需要${requiredRole}权限才能访问审核系统`);
      }
    }
  }, [session, status, requireAuth, requiredRole]);

  // 计算统计
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const statsData = {
      total: content.length,
      pending: content.filter(item => item.status === 'PENDING').length,
      approved: content.filter(item => item.status === 'APPROVED').length,
      rejected: content.filter(item => item.status === 'REJECTED').length,
      flagged: content.filter(item => item.status === 'FLAGGED').length,
      deleted: content.filter(item => item.status === 'DELETED').length,
      today: content.filter(item => new Date(item.createdAt) >= today).length,
      avgReviewTime: 0, // 这里可以计算平均审核时间
    };
    
    setStats(statsData);
  }, [content]);

  // AI分析内容
  const analyzeContent = async (contentItem: ContentItem) => {
    if (!aiAssistanceEnabled) return;
    
    setLoadingAnalysis(true);
    
    try {
      // 模拟AI分析
      const analysis = {
        toxicityScore: Math.floor(Math.random() * 100),
        spamScore: Math.floor(Math.random() * 100),
        qualityScore: Math.floor(Math.random() * 100),
        sentiment: Math.random() > 0.5 ? 'POSITIVE' : 'NEGATIVE',
        keywords: ['游戏', '社区', '讨论'].slice(0, Math.floor(Math.random() * 3) + 1),
        suggestedAction: contentItem.score > 70 ? 'APPROVE' : 'REVIEW',
        confidence: Math.floor(Math.random() * 100),
        issues: [] as string[],
      };
      
      // 根据分数添加问题
      if (analysis.toxicityScore > 70) {
        analysis.issues.push('可能包含攻击性内容');
      }
      if (analysis.spamScore > 70) {
        analysis.issues.push('可能为垃圾内容');
      }
      if (analysis.qualityScore < 30) {
        analysis.issues.push('内容质量较低');
      }
      
      setAiAnalysis(prev => ({
        ...prev,
        [contentItem.id]: analysis,
      }));
    } catch (err) {
      console.error('AI分析失败:', err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // 过滤和排序内容
  const filteredContent = content
    .filter(item => {
      // 状态过滤
      if (filterStatus !== 'ALL' && item.status !== filterStatus) {
        return false;
      }
      
      // 类型过滤
      if (filterType !== 'ALL' && item.type !== filterType) {
        return false;
      }
      
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title?.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.author.username.toLowerCase().includes(query) ||
          item.author.displayName?.toLowerCase().includes(query) ||
          item.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'flags':
          aValue = a.flags.length;
          bValue = b.flags.length;
          break;
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
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

  // 处理审核
  const handleReview = async (contentId: string, action: string, reason?: string) => {
    if (!onReview || reviewing) return;
    
    setReviewing(true);
    setError(null);
    
    try {
      await onReview(contentId, action, reason);
      
      // 更新状态
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, status: action as any }
          : item
      ));
      
      // 从选中中移除
      const newSelected = new Set(selectedContent);
      newSelected.delete(contentId);
      setSelectedContent(newSelected);
      
      setSuccess(`内容已${getActionLabel(action)}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '审核失败');
    } finally {
      setReviewing(false);
    }
  };

  // 处理批量操作
  const handleBulkAction = async () => {
    if (!onBulkAction || !bulkAction || selectedContent.size === 0) return;
    
    if (!confirm(`确定要对选中的 ${selectedContent.size} 条内容执行"${getActionLabel(bulkAction)}"操作吗？`)) {
      return;
    }
    
    setReviewing(true);
    setError(null);
    
    try {
      await onBulkAction(Array.from(selectedContent), bulkAction, bulkReason);
      
      // 更新状态
      setContent(prev => prev.map(item => 
        selectedContent.has(item.id)
          ? { ...item, status: bulkAction as any }
          : item
      ));
      
      // 清空选中
      setSelectedContent(new Set());
      setBulkAction('');
      setBulkReason('');
      
      setSuccess(`成功${getActionLabel(bulkAction)} ${selectedContent.size} 条内容`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '批量操作失败');
    } finally {
      setReviewing(false);
    }
  };

  // 获取操作标签
  const getActionLabel = (action: string) => {
    switch (action) {
      case 'APPROVE': return '通过';
      case 'REJECT': return '拒绝';
      case 'FLAG': return '标记';
      case 'DELETE': return '删除';
      case 'WARN': return '警告';
      default: return action;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'APPROVED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'FLAGGED': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'DELETED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ARTICLE': return <Edit2 className="w-4 h-4" />;
      case 'POST': return <MessageSquare className="w-4 h-4" />;
      case 'COMMENT': return <MessageSquare className="w-4 h-4" />;
      case 'USER': return <User className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 权限检查
  if (requireAuth && status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">检查权限...</span>
      </div>
    );
  }

  if (requireAuth && status === 'unauthenticated') {
    return (
      <div className="text-center p-8">
        <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          需要登录
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          请登录后访问审核系统
        </p>
      </div>
    );
  }

  if (error && error.includes('需要') && error.includes('权限')) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          权限不足
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
      {/* 顶部统计 */}
      <div className="border-b border-gray-300 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              内容审核系统
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {autoReviewEnabled && (
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                自动审核已启用
              </span>
            )}
            {aiAssistanceEnabled && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
                <Star className="w-3 h-3 inline mr-1" />
                AI辅助已启用
              </span>
            )}
          </div>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              总内容
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              待审核
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.approved}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              已通过
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.rejected}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              已拒绝
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.flagged}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              已标记
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.today}
            </div