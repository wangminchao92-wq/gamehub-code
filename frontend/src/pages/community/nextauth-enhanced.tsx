import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { 
  MessageSquare, ThumbsUp, Eye, User, Calendar, Tag, Fire, 
  Search, Filter, TrendingUp, Clock, Star, Plus, Edit,
  Heart, Share2, Bookmark, MoreVertical, ChevronRight,
  Users, Hash, Pin, Lock, Globe, Shield
} from 'lucide-react';
import Link from 'next/link';

// 模拟社区帖子数据
const mockPosts = [
  {
    id: 'post-001',
    title: '分享我的《艾尔登法环》全成就达成心得',
    slug: 'elden-ring-achievement-guide',
    excerpt: '经过150小时的奋战，终于达成了《艾尔登法环》的全成就！在这里分享一些心得和技巧。',
    author: { username: 'hardcore_gamer', displayName: '硬核玩家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hardcore' },
    views: 45000,
    likes: 3200,
    comments: 156,
    createdAt: '2026-03-18T09:15:00Z',
    tags: ['艾尔登法环', '成就', '攻略'],
    category: '攻略',
    isHot: true,
    isPinned: true,
    isLocked: false,
  },
  {
    id: 'post-002',
    title: '独立游戏《星露谷物语2》抢先体验版发布',
    slug: 'stardew-valley-2-early-access',
    excerpt: '备受期待的农场模拟游戏《星露谷物语2》的抢先体验版已在Steam平台上线。',
    author: { username: 'gamer1', displayName: '游戏玩家1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer1' },
    views: 32000,
    likes: 2400,
    comments: 98,
    createdAt: '2026-03-20T16:45:00Z',
    tags: ['星露谷物语', '独立游戏', '抢先体验'],
    category: '新闻',
    isHot: true,
    isPinned: false,
    isLocked: false,
  },
  {
    id: 'post-003',
    title: '《赛博朋克2077 2.0》新DLC剧情讨论',
    slug: 'cyberpunk-2077-phantom-liberty-discussion',
    excerpt: '新DLC「往日之影」带来了全新的故事线和角色，大家来聊聊对剧情的看法。',
    author: { username: 'cyber_fan', displayName: '赛博爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyber' },
    views: 28000,
    likes: 1900,
    comments: 87,
    createdAt: '2026-03-22T10:30:00Z',
    tags: ['赛博朋克2077', 'DLC', '剧情讨论'],
    category: '讨论',
    isHot: false,
    isPinned: false,
    isLocked: false,
  },
  {
    id: 'post-004',
    title: 'PS5 Pro即将发布？传闻汇总',
    slug: 'ps5-pro-rumors-speculation',
    excerpt: '根据多个消息源，索尼可能在今年晚些时候发布PS5 Pro，这里汇总了所有传闻和规格预测。',
    author: { username: 'console_expert', displayName: '主机专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=console' },
    views: 38000,
    likes: 2800,
    comments: 210,
    createdAt: '2026-03-21T14:20:00Z',
    tags: ['PS5', '主机', '传闻'],
    category: '硬件',
    isHot: true,
    isPinned: false,
    isLocked: false,
  },
  {
    id: 'post-005',
    title: '游戏开发学习路线图分享',
    slug: 'game-dev-learning-roadmap',
    excerpt: '从零开始学习游戏开发，这是我整理的一份详细的学习路线图和资源推荐。',
    author: { username: 'dev_learner', displayName: '开发学习者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev' },
    views: 22000,
    likes: 1500,
    comments: 65,
    createdAt: '2026-03-19T11:10:00Z',
    tags: ['游戏开发', '学习', '教程'],
    category: '教程',
    isHot: false,
    isPinned: false,
    isLocked: false,
  },
  {
    id: 'post-006',
    title: '《最终幻想16》通关感想',
    slug: 'final-fantasy-xvi-review',
    excerpt: '刚刚通关了《最终幻想16》，来分享一下我的游戏体验和感想。',
    author: { username: 'ff_fan', displayName: '最终幻想粉丝', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ff' },
    views: 19000,
    likes: 1200,
    comments: 45,
    createdAt: '2026-03-22T08:45:00Z',
    tags: ['最终幻想', '评测', 'RPG'],
    category: '评测',
    isHot: false,
    isPinned: false,
    isLocked: false,
  },
];

// 社区分类
const categories = [
  { id: 'all', name: '全部', count: 156, icon: <Globe className="w-4 h-4" /> },
  { id: 'news', name: '新闻', count: 42, icon: <Fire className="w-4 h-4" /> },
  { id: 'discussion', name: '讨论', count: 68, icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'guide', name: '攻略', count: 25, icon: <Star className="w-4 h-4" /> },
  { id: 'review', name: '评测', count: 18, icon: <ThumbsUp className="w-4 h-4" /> },
  { id: 'hardware', name: '硬件', count: 12, icon: <Shield className="w-4 h-4" /> },
  { id: 'tutorial', name: '教程', count: 8, icon: <Bookmark className="w-4 h-4" /> },
];

// 热门标签
const popularTags = [
  { name: '艾尔登法环', count: 156, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  { name: '赛博朋克2077', count: 128, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  { name: '星露谷物语', count: 89, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  { name: 'PS5', count: 76, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' },
  { name: '游戏开发', count: 54, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  { name: '最终幻想', count: 42, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  { name: '独立游戏', count: 38, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' },
  { name: 'RPG', count: 35, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
];

export default function NextAuthEnhancedCommunityPage() {
  const { data: session, status } = useSession();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('hot');
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());

  // 过滤和排序帖子
  useEffect(() => {
    let result = [...mockPosts];
    
    // 按分类过滤
    if (activeCategory !== 'all') {
      result = result.filter(post => post.category === activeCategory);
    }
    
    // 按搜索查询过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.displayName.toLowerCase().includes(query)
      );
    }
    
    // 排序
    switch (sortBy) {
      case 'hot':
        result.sort((a, b) => {
          const aScore = a.likes * 2 + a.comments * 3 + (a.isHot ? 1000 : 0);
          const bScore = b.likes * 2 + b.comments * 3 + (b.isHot ? 1000 : 0);
          return bScore - aScore;
        });
        break;
      case 'new':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'top':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'comments':
        result.sort((a, b) => b.comments - a.comments);
        break;
    }
    
    setFilteredPosts(result);
  }, [activeCategory, searchQuery, sortBy]);

  // 处理点赞
  const handleLike = (postId: string) => {
    if (status !== 'authenticated') {
      // 这里可以跳转到登录页面
      return;
    }
    
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // 处理收藏
  const handleBookmark = (postId: string) => {
    if (status !== 'authenticated') {
      // 这里可以跳转到登录页面
      return;
    }
    
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return '刚刚';
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else {
      return `${Math.floor(diffHours / 24)}天前`;
    }
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 1000).toFixed(1)}k`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // 结构化数据
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "DiscussionForumPosting",
      "headline": "GameHub社区 - 游戏讨论和交流",
      "description": "加入GameHub社区，与全球游戏爱好者交流心得、分享攻略、讨论游戏",
      "author": {
        "@type": "Organization",
        "name": "GameHub"
      },
      "datePublished": "2026-03-22T08:00:00+08:00",
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": 156
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
          "name": "社区",
          "item": "https://gamehub.com/community"
        }
      ]
    }
  ];

  return (
    <MainLayout>
      <SEO
        title="GameHub社区 - 游戏讨论和交流平台"
        description="加入GameHub社区，与全球游戏爱好者交流心得、分享攻略、讨论游戏。每日156+新帖子，6842+活跃成员。"
        keywords="游戏社区,游戏讨论,游戏攻略分享,玩家交流,游戏论坛,电竞赛事讨论"
        canonical="https://gamehub.com/community"
        ogImage="https://gamehub.com/og-community.jpg"
        ogType="website"
        structuredData={structuredData}
        author="GameHub"
        section="Gaming Community"
        tags={["game community", "forum", "discussion", "gaming forum", "player community"]}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 社区头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                GameHub社区
              </h1>
              <p className="text-xl opacity-90 mb-8">
                与全球游戏爱好者交流心得、分享攻略、讨论游戏
              </p>
              
              {/* 社区统计 */}
              <div className="flex flex-wrap justify-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">156+</div>
                  <div className="text-sm opacity-80">今日新帖</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">6,842</div>
                  <div className="text-sm opacity-80">活跃成员</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">284K</div>
                  <div className="text-sm opacity-80">总帖子</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">1.2M</div>
                  <div className="text-sm opacity-80">总评论</div>
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
              {/* 发布新帖按钮 */}
              {status === 'authenticated' ? (
                <Link
                  href="/community/create"
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 text-center font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    发布新帖
                  </div>
                </Link>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 text-center shadow-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Lock className="w-5 h-5 mr-2" />
                    登录后发帖
                  </div>
                  <Link
                    href="/login"
                    className="text-sm underline opacity-90 hover:opacity-100"
                  >
                    立即登录
                  </Link>
                </div>
              )}

              {/* 分类导航 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  分类
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className