import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { MessageSquare, ThumbsUp, Eye, User, Calendar, Tag, Fire } from 'lucide-react';

// 模拟社区帖子数据
const mockPosts = [
  {
    id: 'post-001',
    title: '分享我的《艾尔登法环》全成就达成心得',
    slug: 'elden-ring-achievement-guide',
    excerpt: '经过150小时的奋战，终于达成了《艾尔登法环》的全成就！在这里分享一些心得和技巧。',
    author: '硬核玩家',
    views: 45000,
    likes: 3200,
    comments: 156,
    createdAt: '2026-03-18T09:15:00Z',
    tags: ['艾尔登法环', '成就', '攻略'],
    isHot: true
  },
  {
    id: 'post-002',
    title: '独立游戏《星露谷物语2》抢先体验版发布',
    slug: 'stardew-valley-2-early-access',
    excerpt: '备受期待的农场模拟游戏《星露谷物语2》的抢先体验版已在Steam平台上线。',
    author: '游戏玩家1',
    views: 32000,
    likes: 2400,
    comments: 98,
    createdAt: '2026-03-20T16:45:00Z',
    tags: ['星露谷物语', '独立游戏', '抢先体验'],
    isHot: true
  },
  {
    id: 'post-003',
    title: '《赛博朋克2077 2.0》新DLC剧情讨论',
    slug: 'cyberpunk-2077-phantom-liberty-discussion',
    excerpt: '新DLC「往日之影」带来了全新的故事线和角色，大家来聊聊对剧情的看法。',
    author: '赛博爱好者',
    views: 28000,
    likes: 1900,
    comments: 87,
    createdAt: '2026-03-22T10:30:00Z',
    tags: ['赛博朋克2077', 'DLC', '剧情讨论'],
    isHot: false
  },
  {
    id: 'post-004',
    title: 'PS5 Pro即将发布？传闻汇总',
    slug: 'ps5-pro-rumors-speculation',
    excerpt: '关于PS5 Pro的各种传闻和泄露信息汇总，以及对其性能和价格的预测分析。',
    author: '硬件达人',
    views: 38000,
    likes: 2100,
    comments: 124,
    createdAt: '2026-03-19T14:20:00Z',
    tags: ['PS5', '硬件', '传闻'],
    isHot: true
  },
  {
    id: 'post-005',
    title: '求推荐适合情侣一起玩的合作游戏',
    slug: 'coop-games-for-couples',
    excerpt: '想和女朋友一起玩游戏，求大家推荐一些适合情侣的合作游戏。',
    author: '寻找乐趣',
    views: 22000,
    likes: 1500,
    comments: 76,
    createdAt: '2026-03-21T11:45:00Z',
    tags: ['合作游戏', '情侣游戏', '推荐'],
    isHot: false
  },
  {
    id: 'post-006',
    title: '《最终幻想XVI》全召唤兽收集攻略',
    slug: 'final-fantasy-xvi-eikon-collection-guide',
    excerpt: '详细攻略《最终幻想XVI》中所有召唤兽的获取方法和位置。',
    author: '攻略大师',
    views: 31000,
    likes: 1800,
    comments: 92,
    createdAt: '2026-03-17T16:10:00Z',
    tags: ['最终幻想', '攻略', '收集'],
    isHot: false
  }
];

export default function SimpleCommunityPage() {
  return (
    <MainLayout>
      <SEO 
        title="游戏社区 - GameHub"
        description="游戏爱好者交流社区，分享攻略、讨论剧情、推荐游戏"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">6,842</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">社区成员</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockPosts.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">今日帖子</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">热门讨论</div>
          </div>
        </div>

        {/* 热门帖子标题 */}
        <div className="mb-6 flex items-center">
          <Fire className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">热门帖子</h2>
        </div>

        {/* 帖子列表 */}
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start">
                {/* 左侧：帖子内容 */}
                <div className="flex-1">
                  {/* 标题和标签 */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        <a 
                          href={`/community/post/ultra-simple/${post.slug}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {post.title}
                        </a>
                      </h3>
                      
                      {/* 标签 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {post.isHot && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                            <Fire className="w-3 h-3 mr-1" />
                            热门
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 摘要 */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.excerpt}
                  </p>

                  {/* 元信息 */}
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
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

        {/* 空状态提示 */}
        {mockPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              暂无社区帖子
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              当前没有可显示的社区帖子，快来发表第一个帖子吧！
            </p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              发表新帖子
            </button>
          </div>
        )}

        {/* 社区指南 */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-4">
            📚 社区指南
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">发帖规则</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 尊重他人，文明交流</li>
                <li>• 禁止发布广告和垃圾信息</li>
                <li>• 遵守法律法规和社区规范</li>
                <li>• 原创内容请注明出处</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">热门话题</h4>
              <div className="flex flex-wrap gap-2">
                {['游戏攻略', '硬件讨论', '剧情分析', '游戏推荐', 'MOD分享', '联机组队'].map((topic) => (
                  <span key={topic} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 分页 */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
              上一页
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
              1
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              2
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              10
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              下一页
            </button>
          </nav>
        </div>
      </div>
    </MainLayout>
  );
}