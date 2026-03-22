import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { MessageSquare, ThumbsUp, Eye, User, Calendar, Tag, Search, Filter, TrendingUp, Fire, Clock, Users } from 'lucide-react';

// 模拟社区帖子数据
const mockPosts = [
  {
    id: 'post-001',
    title: '分享我的《艾尔登法环》全成就达成心得',
    slug: 'elden-ring-achievement-guide',
    excerpt: '经过150小时的奋战，终于达成了《艾尔登法环》的全成就！在这里分享一些心得和技巧。',
    content: '详细内容...',
    author: '硬核玩家',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hardcore',
    views: 45000,
    likes: 3200,
    comments: 156,
    createdAt: '2026-03-18T09:15:00Z',
    tags: ['艾尔登法环', '成就', '攻略', '心得分享'],
    category: '攻略分享',
    isHot: true,
    isPinned: false
  },
  {
    id: 'post-002',
    title: '独立游戏《星露谷物语2》抢先体验版发布',
    slug: 'stardew-valley-2-early-access',
    excerpt: '备受期待的农场模拟游戏《星露谷物语2》的抢先体验版已在Steam平台上线，售价98元。',
    content: '详细内容...',
    author: '游戏玩家1',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
    views: 32000,
    likes: 2400,
    comments: 98,
    createdAt: '2026-03-20T16:45:00Z',
    tags: ['星露谷物语', '独立游戏', '抢先体验', '农场模拟'],
    category: '游戏新闻',
    isHot: true,
    isPinned: true
  },
  {
    id: 'post-003',
    title: '《赛博朋克2077 2.0》新DLC「往日之影」剧情讨论',
    slug: 'cyberpunk-2077-phantom-liberty-discussion',
    excerpt: '新DLC「往日之影」带来了全新的故事线和角色，大家来聊聊对剧情的看法和解读。',
    content: '详细内容...',
    author: '赛博爱好者',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyber',
    views: 28000,
    likes: 1900,
    comments: 87,
    createdAt: '2026-03-22T10:30:00Z',
    tags: ['赛博朋克2077', 'DLC', '剧情讨论', '角色扮演'],
    category: '剧情讨论',
    isHot: false,
    isPinned: false
  },
  {
    id: 'post-004',
    title: 'PS5 Pro即将发布？传闻汇总和性能预测',
    slug: 'ps5-pro-rumors-speculation',
    excerpt: '关于PS5 Pro的各种传闻和泄露信息汇总，以及对其性能和价格的预测分析。',
    content: '详细内容...',
    author: '硬件达人',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hardware',
    views: 38000,
    likes: 2100,
    comments: 124,
    createdAt: '2026-03-19T14:20:00Z',
    tags: ['PS5', '硬件', '传闻', '性能分析'],
    category: '硬件讨论',
    isHot: true,
    isPinned: false
  },
  {
    id: 'post-005',
    title: '求推荐适合情侣一起玩的合作游戏',
    slug: 'coop-games-for-couples',
    excerpt: '想和女朋友一起玩游戏，求大家推荐一些适合情侣的合作游戏，最好是轻松有趣的。',
    content: '详细内容...',
    author: '寻找乐趣',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=couple',
    views: 22000,
    likes: 1500,
    comments: 76,
    createdAt: '2026-03-21T11:45:00Z',
    tags: ['合作游戏', '情侣游戏', '推荐', '休闲游戏'],
    category: '游戏推荐',
    isHot: false,
    isPinned: false
  },
  {
    id: 'post-006',
    title: '《最终幻想XVI》全召唤兽收集攻略',
    slug: 'final-fantasy-xvi-eikon-collection-guide',
    excerpt: '详细攻略《最终幻想XVI》中所有召唤兽的获取方法和位置，包含隐藏召唤兽的解锁条件。',
    content: '详细内容...',
    author: '攻略大师',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    views: 31000,
    likes: 1800,
    comments: 92,
    createdAt: '2026-03-17T16:10:00Z',
    tags: ['最终幻想', '攻略', '收集', '召唤兽'],
    category: '攻略分享',
    isHot: false,
    isPinned: false
  }
];

// 社区分类
const categories = [
  { id: 'all', name: '全部', count: mockPosts.length },
  { id: 'guide', name: '攻略分享', count: mockPosts.filter(p => p.category === '攻略分享').length },
  { id: 'news', name: '游戏新闻', count: mockPosts.filter(p => p.category === '游戏新闻').length },
  { id: 'discussion', name: '剧情讨论', count: mockPosts.filter(p => p.category === '剧情讨论').length },
  { id: 'hardware', name: '硬件讨论', count: mockPosts.filter(p => p.category === '硬件讨论').length },
  { id: 'recommendation', name: '游戏推荐', count: mockPosts.filter(p => p.category === '游戏推荐').length }
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('hot');

  // 过滤帖子
  const filteredPosts = mockPosts.filter(post => {
    // 分类过滤
    if (selectedCategory !== 'all') {
      const categoryMap = {
        'guide': '攻略分享',
        'news': '游戏新闻', 
        'discussion': '剧情讨论',
        'hardware': '硬件讨论',
        'recommendation': '游戏推荐'
      };
      if (post.category !== categoryMap[selectedCategory]) return false;
    }
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // 排序帖子
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'hot':
        return (b.views + b.likes * 10 + b.comments * 5) - (a.views + a.likes * 10 + a.comments * 5);
      case 'new':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  return (
    <MainLayout>
      <SEO 
        title="游戏社区 - GameHub"
        description="游戏爱好者交流社区，分享攻略、讨论剧情、推荐游戏、交流心得"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">游戏社区</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            与全球游戏爱好者交流心得、分享攻略、讨论游戏
          </p>
        </div>

        {/* 社区统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">6,842</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">社区成员</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockPosts.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">今日帖子</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <Fire className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">热门讨论</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">98.7%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">活跃度</div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索帖子、标签或用户..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 排序选项 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hot">热门排序</option>
                  <option value="new">最新发布</option>
                  <option value="popular">最多浏览</option>
                </select>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                发新帖子
              </button>
            </div>
          </div>

          {/* 分类标签 */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="ml-2 text-xs opacity-75">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 置顶帖子 */}
        {mockPosts.filter(p => p.isPinned).length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-yellow-600" />
              置顶帖子
            </h3>
            <div className="space-y-4">
              {mockPosts.filter(p => p.isPinned).map((post) => (
                <div key={post.id} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">
                          置顶
                        </span>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{post.category}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        <a href={`/community/post/ultra-simple/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {post.title}
                        </a>
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center mr-4">
                            <User className="w-4 h-4 mr-1" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="text-sm">{post.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            <span className="text-sm">{post.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            <span className="text-sm">{post.comments.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 帖子列表 */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            {sortBy === 'hot' && <Fire className="w-5 h-5 mr-2 text-orange-600" />}
            {sortBy === 'new' && <Clock className="w-5 h-5 mr-2 text-blue-600" />}
            {sortBy === 'popular' && <TrendingUp className="w-5 h-5 mr-2 text-green-600" />}
            {sortBy === 'hot' ? '热门帖子' : sortBy === 'new' ? '最新帖子' : '热门浏览'}
          </h3>
          
          {sortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                没有找到相关帖子
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                尝试调整搜索关键词或选择其他分类
              </p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <div key={post.id} className