'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Heart,
  Share2,
  MessageCircle,
  MoreVertical,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye
} from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  views: number;
  likes: number;
  createdAt: string;
  lastReplyAt?: string;
  pinned: boolean;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    level: number;
  };
  forum: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  _count: {
    replies: number;
  };
  replies: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
      displayName?: string;
      avatar?: string;
    };
  }>;
}

interface Forum {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  _count: {
    posts: number;
  };
  children?: Forum[];
}

export default function CommunityForum() {
  const router = useRouter();
  
  // 状态管理
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeForum, setActiveForum] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'lastReplyAt' | 'createdAt' | 'views' | 'likes'>('lastReplyAt');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  
  // 新帖子表单
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    forumId: '',
  });
  
  // 获取论坛列表
  const fetchForums = async () => {
    try {
      const response = await fetch('/api/forum/forums');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取论坛失败');
      }
      
      setForums(result.data);
      if (result.data.length > 0 && !activeForum) {
        setActiveForum(result.data[0].id);
        setNewPost(prev => ({ ...prev, forumId: result.data[0].id }));
      }
    } catch (err) {
      console.error('获取论坛错误:', err);
    }
  };
  
  // 获取帖子列表
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '20',
        sortBy,
        sortOrder: 'desc',
      });
      
      if (activeForum) {
        queryParams.append('forumId', activeForum);
      }
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/forum/posts?${queryParams}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取帖子失败');
      }
      
      setPosts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取帖子失败');
      console.error('获取帖子错误:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchForums();
  }, []);
  
  useEffect(() => {
    if (activeForum) {
      fetchPosts();
    }
  }, [activeForum, sortBy]);
  
  // 处理新帖子提交
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '发布失败');
      }
      
      setSuccess('帖子发布成功！');
      setNewPost({
        title: '',
        content: '',
        forumId: activeForum,
      });
      setShowNewPostForm(false);
      
      // 刷新帖子列表
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };
  
  // 获取用户等级颜色
  const getLevelColor = (level: number) => {
    if (level >= 50) return 'from-red-500 to-orange-500';
    if (level >= 30) return 'from-purple-500 to-pink-500';
    if (level >= 20) return 'from-blue-500 to-cyan-500';
    if (level >= 10) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-gray-600';
  };
  
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      {/* 消息提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-400">{success}</p>
          </div>
        </div>
      )}
      
      {/* 头部 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">游戏社区论坛</h2>
          <p className="text-gray-400 mt-1">与全球玩家交流游戏心得</p>
        </div>
        
        <button
          onClick={() => setShowNewPostForm(true)}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          发新帖
        </button>
      </div>
      
      {/* 新帖子表单 */}
      {showNewPostForm && (
        <div className="mb-8 bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">发布新帖子</h3>
            <button
              onClick={() => setShowNewPostForm(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                选择版块
              </label>
              <select
                value={newPost.forumId}
                onChange={(e) => setNewPost(prev => ({ ...prev, forumId: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                required
              >
                <option value="">请选择版块</option>
                {forums.map(forum => (
                  <option key={forum.id} value={forum.id}>
                    {forum.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                帖子标题
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                placeholder="请输入帖子标题"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                帖子内容
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                placeholder="请输入帖子内容（支持Markdown格式）"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading || !newPost.title || !newPost.content || !newPost.forumId}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                发布帖子
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧：论坛导航 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4">论坛版块</h3>
            <div className="space-y-2">
              {forums.map(forum => (
                <button
                  key={forum.id}
                  onClick={() => setActiveForum(forum.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                    activeForum === forum.id
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-3" />
                    <span>{forum.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{forum._count.posts}</span>
                </button>
              ))}
            </div>
            
            {/* 排序选项 */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <h4 className="text-sm font-medium text-gray-300 mb-3">排序方式</h4>
              <div className="space-y-2">
                {[
                  { value: 'lastReplyAt', label: '最新回复', icon: Clock },
                  { value: 'createdAt', label: '发布时间', icon: TrendingUp },
                  { value: 'views', label: '浏览最多', icon: Users },
                  { value: 'likes', label: '点赞最多', icon: Heart },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${
                        sortBy === option.value
                          ? 'bg-primary-500/20 text-primary-300'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：帖子列表 */}
        <div className="lg:col-span-3">
          {/* 搜索栏 */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchPosts()}
                placeholder="搜索帖子..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
          
          {/* 加载状态 */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 text-primary-400 animate-spin mx-auto" />
              <p className="text-gray-400 mt-2">加载中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto" />
              <p className="text-gray-400 mt-4">暂无帖子</p>
              <button
                onClick={() => setShowNewPostForm(true)}
                className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                发布第一个帖子
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-primary-500/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/community/post/${post.id}`)}
                >
                  <div className="flex items-start">
                    {/* 作者信息 */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="relative">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.username}
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br ${getLevelColor(post.author.level)} flex items-center justify-center text-xs font-bold text-white`}>
                          {post.author.level}
                        </div>
                      </div>
                    </div>
                    
                    {/* 帖子内容 */}
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-white">
                            {post.author.displayName || post.author.username}
                          </span>
                          <span className="text-sm text-gray-400 ml-2">
                            {formatDate(post.createdAt)}
                          </span>
                          {post.pinned && (
                            <span className="ml-2 px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded">
                              置顶
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-400">
                          {post.forum.name}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      
                      {/* 帖子统计 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-400">
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="text-sm">{post.views}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Heart className="h-4 w-4 mr-1" />
                            <span className="text-sm">{post.likes}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">{post._count.replies}</span>
                          </div>
                        </div>
                        
                        {/* 最新回复 */}
                        {post.replies.length > 0 && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            最后回复: {formatDate(post.replies[0].createdAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
