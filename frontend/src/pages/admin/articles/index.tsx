import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Download,
  Upload,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  type: 'NEWS' | 'REVIEW' | 'GUIDE' | 'VIDEO' | 'BLOG';
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'ARCHIVED';
  featured: boolean;
  pinned: boolean;
  rating?: number;
  views: number;
  likes: number;
  shares: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // 模拟数据
  const mockArticles: Article[] = [
    {
      id: '1',
      title: '新一代游戏引擎技术突破',
      slug: 'new-generation-game-engine-breakthrough',
      excerpt: '最新游戏引擎技术带来革命性的画面表现和性能优化...',
      author: {
        id: 'user1',
        username: 'techguru',
        displayName: '技术专家',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      },
      category: {
        id: 'cat1',
        name: '技术',
        slug: 'technology',
      },
      tags: [
        { id: 'tag1', name: '游戏引擎', slug: 'game-engine' },
        { id: 'tag2', name: '图形技术', slug: 'graphics' },
      ],
      type: 'NEWS',
      status: 'PUBLISHED',
      featured: true,
      pinned: false,
      rating: 4.5,
      views: 12500,
      likes: 850,
      shares: 120,
      publishedAt: '2026-03-20T10:30:00Z',
      createdAt: '2026-03-19T14:20:00Z',
      updatedAt: '2026-03-20T10:30:00Z',
    },
    {
      id: '2',
      title: '年度最佳游戏评选结果公布',
      slug: 'annual-best-game-awards-results',
      excerpt: '年度游戏评选结果揭晓，多款大作获得殊荣...',
      author: {
        id: 'user2',
        username: 'gamenews',
        displayName: '游戏新闻',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      },
      category: {
        id: 'cat2',
        name: '新闻',
        slug: 'news',
      },
      tags: [
        { id: 'tag3', name: '年度游戏', slug: 'game-of-the-year' },
        { id: 'tag4', name: '评选', slug: 'awards' },
      ],
      type: 'NEWS',
      status: 'PUBLISHED',
      featured: true,
      pinned: true,
      views: 8900,
      likes: 620,
      shares: 85,
      publishedAt: '2026-03-19T09:15:00Z',
      createdAt: '2026-03-18T16:45:00Z',
      updatedAt: '2026-03-19T09:15:00Z',
    },
    {
      id: '3',
      title: '《赛博朋克2077》DLC深度评测',
      slug: 'cyberpunk-2077-dlc-review',
      excerpt: '《往日之影》DLC为游戏带来全新内容和改进...',
      author: {
        id: 'user3',
        username: 'reviewmaster',
        displayName: '评测大师',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80',
      },
      category: {
        id: 'cat3',
        name: '评测',
        slug: 'reviews',
      },
      tags: [
        { id: 'tag5', name: '赛博朋克', slug: 'cyberpunk' },
        { id: 'tag6', name: 'DLC', slug: 'dlc' },
      ],
      type: 'REVIEW',
      status: 'PUBLISHED',
      featured: false,
      pinned: false,
      rating: 9.0,
      views: 15600,
      likes: 1200,
      shares: 210,
      publishedAt: '2026-03-18T14:20:00Z',
      createdAt: '2026-03-17T11:30:00Z',
      updatedAt: '2026-03-18T14:20:00Z',
    },
    {
      id: '4',
      title: '新手入门攻略：从零开始学习游戏开发',
      slug: 'beginner-guide-game-development',
      excerpt: '为想要进入游戏开发领域的新手准备的完整指南...',
      author: {
        id: 'user4',
        username: 'devguide',
        displayName: '开发指南',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      },
      category: {
        id: 'cat4',
        name: '攻略',
        slug: 'guides',
      },
      tags: [
        { id: 'tag7', name: '游戏开发', slug: 'game-development' },
        { id: 'tag8', name: '入门', slug: 'beginner' },
      ],
      type: 'GUIDE',
      status: 'DRAFT',
      featured: false,
      pinned: false,
      views: 0,
      likes: 0,
      shares: 0,
      createdAt: '2026-03-22T08:30:00Z',
      updatedAt: '2026-03-22T08:30:00Z',
    },
  ];

  // 加载文章数据
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 应用筛选
        let filteredArticles = [...mockArticles];
        
        if (searchQuery) {
          filteredArticles = filteredArticles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        if (selectedType !== 'ALL') {
          filteredArticles = filteredArticles.filter(article => article.type === selectedType);
        }
        
        if (selectedStatus !== 'ALL') {
          filteredArticles = filteredArticles.filter(article => article.status === selectedStatus);
        }
        
        setArticles(filteredArticles);
        setPagination(prev => ({
          ...prev,
          total: filteredArticles.length,
          pages: Math.ceil(filteredArticles.length / prev.limit),
        }));
        
        setError('');
      } catch (err) {
        setError('加载文章失败，请稍后重试');
        console.error('加载文章错误:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticles();
  }, [searchQuery, selectedType, selectedStatus]);

  // 处理文章选择
  const handleSelectArticle = (id: string) => {
    setSelectedArticles(prev =>
      prev.includes(id)
        ? prev.filter(articleId => articleId !== id)
        : [...prev, id]
    );
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(article => article.id));
    }
  };

  // 处理文章状态更改
  const handleStatusChange = async (id: string, newStatus: Article['status']) => {
    try {
      // 模拟API调用
      setArticles(prev =>
        prev.map(article =>
          article.id === id ? { ...article, status: newStatus } : article
        )
      );
    } catch (err) {
      console.error('更新状态失败:', err);
    }
  };

  // 处理删除文章
  const handleDeleteArticle = async (id: string) => {
    try {
      // 模拟API调用
      setArticles(prev => prev.filter(article => article.id !== id));
      setSelectedArticles(prev => prev.filter(articleId => articleId !== id));
      setShowDeleteConfirm(false);
      setArticleToDelete(null);
    } catch (err) {
      console.error('删除文章失败:', err);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取状态颜色
  const getStatusColor = (status: Article['status']) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500/20 text-green-400';
      case 'DRAFT': return 'bg-yellow-500/20 text-yellow-400';
      case 'HIDDEN': return 'bg-gray-500/20 text-gray-400';
      case 'ARCHIVED': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // 获取状态文本
  const getStatusText = (status: Article['status']) => {
    switch (status) {
      case 'PUBLISHED': return '已发布';
      case 'DRAFT': return '草稿';
      case 'HIDDEN': return '隐藏';
      case 'ARCHIVED': return '归档';
      default: return '未知';
    }
  };

  // 获取类型文本
  const getTypeText = (type: Article['type']) => {
    switch (type) {
      case 'NEWS': return '新闻';
      case 'REVIEW': return '评测';
      case 'GUIDE': return '攻略';
      case 'VIDEO': return '视频';
      case 'BLOG': return '博客';
      default: return '未知';
    }
  };

  return (
    <MainLayout>
      <SEO
        title="文章管理 | GameHub 管理后台"
        description="管理GameHub网站的所有文章内容"
        noindex={true}
        nofollow={true}
      />

      <div className="min-h-screen bg-gray-900">
        {/* 页面头部 */}
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">文章管理</h1>
                <p className="text-gray-400 mt-1">管理网站的所有文章内容</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/articles/new')}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新建文章
                </button>
                
                <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  导出
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* 筛选工具栏 */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 搜索框 */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索文章标题或内容..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* 类型筛选 */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="ALL">所有类型</option>
                  <option value="NEWS">新闻</option>
                  <option value="REVIEW">评测</option>
                  <option value="GUIDE">攻略</option>
                  <option value="VIDEO">视频</option>
                  <option value="BLOG">博客</option>
                </select>
              </div>

              {/* 状态筛选 */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="ALL">所有状态</option>
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">已发布</option>
                  <option value="HIDDEN">隐藏</option>
                  <option value="ARCHIVED">归档</option>
                </select>
              </div>
            </div>

            {/* 批量操作栏 */}
            {selectedArticles.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div className="text-gray-300">
                    已选择 <span className="font-bold text-white">{selectedArticles.length}</span> 篇文章
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        // 批量发布
                        selectedArticles.forEach(id => {
                          handleStatusChange(id, 'PUBLISHED');
                        });
                        setSelectedArticles([]);
                      }}
                      className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      批量发布
                    </button>
                    
                    <button
                      onClick={() => {
                        // 批量隐藏
                        selectedArticles.forEach(id => {
                          handleStatusChange(id, 'HIDDEN');
                        });
                        setSelectedArticles([]);
                      }}
                      className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors flex items-center"
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      批量隐藏
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      批量删除
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 文章列表 */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                <p className="text-gray-400 mt-4">加载文章中...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="p-12 text-center">
                <Filter className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">没有找到符合条件的文章</p>
                <p className="text-gray-500 text-sm mt-2">尝试调整筛选条件或创建新文章</p>
              </div>
            ) : (
              <>
                {/* 表格头部 */}
                <div className="border-b border-gray-700/30">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-400">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedArticles.length === articles.length && articles.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-900"
                      />
                    </div>
                    <div className="col-span-5">标题</div>
                    <div className="col-span-2">作者</div>
                    <div className="col-span-1">类型</div>
                    <div className="col-span-1">状态</div>
                    <div className="col-span-2 text-right">操作</div>
                  </div>
                </div>

                {/* 文章行 */}
                <div className="divide-y divide-gray-700/30">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-800/20 transition-colors"
                    >
                      {/* 选择框 */}
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => handleSelectArticle(article.id)}
                          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-900"
                        />
                      </div>

                      {/* 标题和信息 */}
                      <div className="col-span-5">
                        <div className="flex items-start">
                          <div>
                            <h3 className="font-medium text-white mb-1">{article.title}</h3>
                            {article.excerpt && (
                              <p className="text-sm text-gray-400 line-clamp-1">{article.excerpt}</p>
                            )}
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                {article.publishedAt
                                  ? formatDate(article.publishedAt)
                                  : '未发布'}
                              </span>
                              <span className="mx-2">•</span>
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{article.views}</span>
                            </div>
                          </div>
                          
                          {article.featured && (
                            <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                              推荐
                            </span>
                          )}
                          {article.pinned && (
                            <span className="ml-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                              置顶
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 作者 */}
                      <div className="col-span-2">
                        <div className="flex items-center">
                          {article.author.avatar ? (
                            <img
                              src={article.author.avatar}
                              alt={article.author.username}
                              className="h-8 w-8 rounded-full mr-3"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-white font-medium">
                              {article.author.displayName || article.author.username}
                            </div>
                            <div className="text-xs text-gray-400">
                              @{article.author.username}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 类型 */}
                      <div className="col-span-1">
                        <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                          {getTypeText(article.type)}
                        </span>
                      </div>

                      {/* 状态 */}
                      <div className="col-span-1">
                        <span className={`px-2 py-1 ${getStatusColor(article.status)} text-xs rounded`}>
                          {getStatusText(article.status)}
                        </span>
                      </div>

                      {/* 操作按钮 */}
                      <div className="col-span-2 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => router.push(`/admin/articles/edit/${article.id}`)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="编辑"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => router.push(`/news/${article.slug}`)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="预览"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              setArticleToDelete(article.id);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 分页 */}
                {pagination.pages > 1 && (
                  <div className="border-t border-gray-700/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        显示第 {(pagination.page - 1) * pagination.limit + 1} -{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} 条，
                        共 {pagination.total} 条
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page === 1}
                          className="px-3 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            let pageNum = i + 1;
                            if (pagination.pages > 5) {
                              if (pagination.page <= 3) {
                                pageNum = i + 1;
                              } else if (pagination.page >= pagination.pages - 2) {
                                pageNum = pagination.pages - 4 + i;
                              } else {
                                pageNum = pagination.page - 2 + i;
                              }
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                className={`px-3 py-2 rounded-lg transition-colors ${
                                  pagination.page === pageNum
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page === pagination.pages}
                          className="px-3 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
              <h3 className="text-lg font-bold text-white">确认删除</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              {articleToDelete
                ? '确定要删除这篇文章吗？此操作不可撤销。'
                : `确定要删除选中的 ${selectedArticles.length} 篇文章吗？此操作不可撤销。`}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setArticleToDelete(null);
                }}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              
              <button
                onClick={() => {
                  if (articleToDelete) {
                    handleDeleteArticle(articleToDelete);
                  } else {
                    // 批量删除
                    selectedArticles.forEach(id => handleDeleteArticle(id));
                    setSelectedArticles([]);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}