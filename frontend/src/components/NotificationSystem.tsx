'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Bell, CheckCircle, XCircle, Eye, EyeOff, Trash2,
  Filter, Search, RefreshCw, Settings, Mail, MessageSquare,
  Heart, Users, Star, Award, Share2, Clock, Loader2,
  ChevronRight, ExternalLink, MoreVertical, BellOff
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'SYSTEM' | 'ACHIEVEMENT' | 'MESSAGE';
  title: string;
  content: string;
  sender?: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
  target?: {
    type: 'ARTICLE' | 'POST' | 'COMMENT' | 'USER';
    id: string;
    title?: string;
    url?: string;
  };
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  actions?: NotificationAction[];
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'VIEW' | 'DISMISS' | 'REPLY' | 'FOLLOW_BACK' | 'ACCEPT' | 'DECLINE';
  url?: string;
}

interface NotificationSystemProps {
  userId?: string;
  onMarkAsRead?: (notificationIds: string[]) => Promise<void>;
  onMarkAllAsRead?: () => Promise<void>;
  onDelete?: (notificationIds: string[]) => Promise<void>;
  onDeleteAll?: () => Promise<void>;
  onAction?: (notificationId: string, actionId: string) => Promise<void>;
  initialNotifications?: Notification[];
  realTimeEnabled?: boolean;
  pollingInterval?: number;
  showUnreadOnly?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  maxNotifications?: number;
  requireAuth?: boolean;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  userId,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  onAction,
  initialNotifications = [],
  realTimeEnabled = true,
  pollingInterval = 30000, // 30秒
  showUnreadOnly = false,
  showFilters = true,
  showSearch = true,
  maxNotifications = 50,
  requireAuth = true,
}) => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    desktopNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    mentionNotifications: true,
    systemNotifications: true,
    achievementNotifications: true,
    messageNotifications: true,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout>();

  // 检查权限
  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      setError('需要登录才能查看通知');
    }
  }, [session, status, requireAuth]);

  // 初始化通知数据
  useEffect(() => {
    if (initialNotifications.length === 0) {
      // 生成模拟通知数据
      const mockNotifications: Notification[] = [
        {
          id: 'notif-001',
          type: 'LIKE',
          title: '新点赞',
          content: '用户"游戏玩家1"点赞了您的文章"《艾尔登法环》全成就达成心得"',
          sender: {
            id: 'user-001',
            username: 'gamer1',
            displayName: '游戏玩家1',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer1',
          },
          target: {
            type: 'ARTICLE',
            id: 'article-001',
            title: '《艾尔登法环》全成就达成心得',
            url: '/article/elden-ring-achievement-guide',
          },
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5分钟前
          priority: 'MEDIUM',
          actions: [
            { id: 'view', label: '查看文章', type: 'VIEW', url: '/article/elden-ring-achievement-guide' },
            { id: 'dismiss', label: '忽略', type: 'DISMISS' },
          ],
        },
        {
          id: 'notif-002',
          type: 'COMMENT',
          title: '新评论',
          content: '用户"硬核玩家"在您的帖子下发表了评论："感谢分享，很有帮助！"',
          sender: {
            id: 'user-002',
            username: 'hardcore_gamer',
            displayName: '硬核玩家',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hardcore',
          },
          target: {
            type: 'POST',
            id: 'post-001',
            title: '游戏开发学习路线图分享',
            url: '/post/game-dev-learning-roadmap',
          },
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
          priority: 'MEDIUM',
          actions: [
            { id: 'view', label: '查看评论', type: 'VIEW', url: '/post/game-dev-learning-roadmap#comments' },
            { id: 'reply', label: '回复', type: 'REPLY' },
            { id: 'dismiss', label: '忽略', type: 'DISMISS' },
          ],
        },
        {
          id: 'notif-003',
          type: 'FOLLOW',
          title: '新粉丝',
          content: '用户"赛博爱好者"开始关注您',
          sender: {
            id: 'user-003',
            username: 'cyber_fan',
            displayName: '赛博爱好者',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyber',
          },
          target: {
            type: 'USER',
            id: 'user-003',
            title: '赛博爱好者',
            url: '/user/cyber_fan',
          },
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
          priority: 'LOW',
          actions: [
            { id: 'view', label: '查看用户', type: 'VIEW', url: '/user/cyber_fan' },
            { id: 'follow_back', label: '回关', type: 'FOLLOW_BACK' },
            { id: 'dismiss', label: '忽略', type: 'DISMISS' },
          ],
        },
        {
          id: 'notif-004',
          type: 'MENTION',
          title: '@提及',
          content: '用户"主机专家"在帖子中提到了您："@admin 您对这个怎么看？"',
          sender: {
            id: 'user-004',
            username: 'console_expert',
            displayName: '主机专家',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=console',
          },
          target: {
            type: 'POST',
            id: 'post-002',
            title: 'PS5 Pro即将发布？传闻汇总',
            url: '/post/ps5-pro-rumors-speculation',
          },
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5小时前
          priority: 'HIGH',
          actions: [
            { id: 'view', label: '查看帖子', type: 'VIEW', url: '/post/ps5-pro-rumors-speculation' },
            { id: 'reply', label: '回复', type: 'REPLY' },
            { id: 'dismiss', label: '忽略', type: 'DISMISS' },
          ],
        },
        {
          id: 'notif-005',
          type: 'ACHIEVEMENT',
          title: '成就解锁',
          content: '恭喜！您已解锁成就"内容创作者"',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
          priority: 'MEDIUM',
          actions: [
            { id: 'view', label: '查看成就', type: 'VIEW', url: '/achievements' },
            { id: 'share', label: '分享', type: 'VIEW', url: '/share/achievement' },
            { id: 'dismiss', label: '忽略', type: 'DISMISS' },
          ],
        },
        {
          id: 'notif-006',
          type: 'SYSTEM',
          title: '系统通知',
          content: 'GameHub将于今晚23:00-01:00进行系统维护，期间可能无法访问',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2天前
          priority: 'URGENT',
          actions: [
            { id: 'view', label: '查看详情', type: 'VIEW', url: '/announcements/maintenance' },
            { id: 'dismiss', label: '知道了', type: 'DISMISS' },
          ],
        },
        {
          id: 'notif-007',
          type: 'MESSAGE',
          title: '新私信',
          content: '用户"最终幻想粉丝"给您发送了一条私信："您好，想请教一个问题..."',
          sender: {
            id: 'user-005',
            username: 'ff_fan',
            displayName: '最终幻想粉丝',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ff',
          },
          target: {
            type: 'USER',
            id: 'user-005',
            title: '最终幻想粉丝',
            url: '/messages/ff_fan',
          },
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3天前
          priority: 'HIGH',
          actions: [
            { id: 'view', label: '查看消息', type: 'VIEW', url: '/messages/ff_fan' },
            { id: 'reply', label: '回复', type: 'REPLY' },
            { id: 'dismiss', label: '忽略', type: 'DISMISS' },
          ],
        },
      ];

      setNotifications(mockNotifications);
    }
  }, [initialNotifications]);

  // 计算统计
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    const total = notifications.length;
    
    setUnreadCount(unread);
    setTotalCount(total);
    
    // 更新浏览器标签页标题
    if (unread > 0) {
      document.title = `(${unread}) GameHub`;
    } else {
      document.title = 'GameHub';
    }
  }, [notifications]);

  // 轮询新通知
  useEffect(() => {
    if (!realTimeEnabled || !requireAuth || status !== 'authenticated') {
      return;
    }

    const pollForNotifications = async () => {
      if (polling) return;
      
      setPolling(true);
      try {
        // 这里应该调用API获取新通知
        // const newNotifications = await fetchNotifications();
        // setNotifications(prev => [...newNotifications, ...prev]);
      } catch (err) {
        console.error('轮询通知失败:', err);
      } finally {
        setPolling(false);
      }
    };

    // 立即执行一次
    pollForNotifications();

    // 设置定时器
    pollingRef.current = setInterval(pollForNotifications, pollingInterval);

    // 清理函数
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [realTimeEnabled, requireAuth, status, pollingInterval, polling]);

  // 过滤和排序通知
  const filteredNotifications = notifications
    .filter(notification => {
      // 未读过滤
      if (showUnreadOnly && notification.read) {
        return false;
      }

      // 类型过滤
      if (filterType !== 'ALL' && notification.type !== filterType) {
        return false;
      }

      // 优先级过滤
      if (filterPriority !== 'ALL' && notification.priority !== filterPriority) {
        return false;
      }

      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          notification.title.toLowerCase().includes(query) ||
          notification.content.toLowerCase().includes(query) ||
          notification.sender?.displayName?.toLowerCase().includes(query) ||
          notification.sender?.username.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .slice(0, maxNotifications) // 限制数量
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'URGENT': 4 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
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

  // 处理标记为已读
  const handleMarkAsRead = async (notificationIds: string[]) => {
    if (!onMarkAsRead || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onMarkAsRead(notificationIds);
      
      // 更新本地状态
      setNotifications(prev => prev.map(notification => 
        notificationIds.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      ));
      
      // 从选中中移除
      const newSelected = new Set(selectedNotifications);
      notificationIds.forEach(id => newSelected.delete(id));
      setSelectedNotifications(newSelected);
      
      setSuccess(`${notificationIds.length}条通知已标记为已读`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '标记失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理标记全部为已读
  const handleMarkAllAsRead = async () => {
    if (!onMarkAllAsRead || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onMarkAllAsRead();
      
      // 更新本地状态
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        read: true,
      })));
      
      // 清空选中
      setSelectedNotifications(new Set());
      
      setSuccess('所有通知已标记为已读');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '标记失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理删除
  const handleDelete = async (notificationIds: string[]) => {
    if (!onDelete || loading) return;

    if (!confirm(`确定要删除选中的 ${notificationIds.length} 条通知吗？`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onDelete(notificationIds);
      
      // 更新本地状态
      setNotifications(prev => prev.filter(
        notification => !notificationIds.includes(notification.id)
      ));
      
      // 从选中中移除
      const newSelected = new Set(selectedNotifications);
      notificationIds.forEach(id => newSelected.delete(id));
      setSelectedNotifications(newSelected);
      
      setSuccess(`${notificationIds.length}条通知已删除`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理删除全部
  const handleDeleteAll = async () => {
    if (!onDeleteAll || loading) return;

    if (!confirm('确定要删除所有通知吗？')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onDeleteAll();
      
      // 清空本地状态
      setNotifications([]);
      setSelectedNotifications(new Set