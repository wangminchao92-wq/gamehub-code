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
    excerpt: '关于PS5 Pro的各种传闻和泄露信息汇总，包括可能的规格和发布时间。',
    author: '主机专家',
    views: 38000,
    likes: 2700,
    comments: 134,
    createdAt: '2026-03-21T14:20:00Z',
    tags: ['PS5', '主机', '传闻'],
    isHot: true
  },
  {
    id: 'post-005',
    title: '游戏开发学习路线图分享',
    slug: 'game-dev-learning-roadmap',
    excerpt: '分享我从零开始学习游戏开发的路线图，包括推荐的资源和学习路径。',
    author: '开发学习者',
    views: 21000,
    likes: 1500,
    comments: 65,
    createdAt: '2026-03-19T11:45:00Z',
    tags: ['游戏开发', '学习', '路线图'],
    isHot: false
  },
  {
    id: 'post-006',
    title: '《最终幻想16》通关感想',
    slug: 'final-fantasy-xvi-review',
    excerpt: '刚刚通关《最终幻想16》，分享一下我的游戏体验和感想。',
    author: '最终幻想粉丝',
    views: 29000,
    likes: 2100,
    comments: 92,
    createdAt: '2026-03-17T19:30:00Z',
    tags: ['最终幻想', 'JRPG', '通关感想'],
    isHot: false
  },
  {
    id: 'post-007',
    title: '独立游戏推荐：本月值得关注的5款游戏',
    slug: 'indie-game-recommendations',
    excerpt: '本月发现了几款非常优秀的独立游戏，推荐给大家。',
    author: '独立游戏爱好者',
    views: 18000,
    likes: 1200,
    comments: 48,
    createdAt: '2026-03-22T08:15:00Z',
    tags: ['独立游戏', '推荐', '游戏发现'],
    isHot: false
  },
  {
    id: 'post-008',
    title: '电竞比赛观赛指南：如何看懂职业比赛',
    slug: 'esports-watching-guide',
    excerpt: '给新手的电竞比赛观赛指南，帮助大家更好地理解和享受职业比赛。',
    author: '电竞选手',
    views: 25000,
    likes: 1800,
    comments: 76,
    createdAt: '2026-03-16T13:40:00Z',
    tags: ['电竞', '观赛指南', '职业比赛'],
    isHot: false
  }
];

// 结构化数据
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "GameHub社区 - 游戏玩家交流平台",
    "description": "GameHub社区是游戏玩家的交流平台，分享游戏心得、攻略、新闻和讨论。",
    "mainEntity": {
      "@type": "DiscussionForumPosting",
      "name": "GameHub社区论坛",
      "description": "游戏玩家的交流社区"
    }
  }
];

export default function CommunityPage() {
  return (
    <MainLayout>
      <SEO
        title="GameHub社区 - 游戏玩家交流平台"
        description="GameHub社区是游戏玩家的交流平台，分享游戏心得、攻略、新闻和讨论。加入我们的社区，与全球玩家交流！"
        keywords="游戏社区,游戏论坛,玩家交流,游戏讨论,游戏心得,游戏攻略"
        canonical="https://gamehub.com/community"
        ogImage="https://gamehub.com/og-community.jpg"
        ogType="website"
        structuredData={structuredData}
        author="GameHub Community"
      />

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GameHub社区
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            与全球游戏玩家交流心得、分享攻略、讨论最新游戏动态
          </p>
        </div>

        {/* 社区统计 */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {mockPosts.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">帖子总数</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {mockPosts.reduce((sum, post) => sum + post.comments, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">评论总数</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {mockPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">总浏览量</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {mockPosts.reduce((sum, post) => sum + post.likes, 0).toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">总点赞数</div>
          </div>
        </div>

        {/* 热门帖子 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Fire className="w-6 h-6 text-orange-500" />
              热门帖子
            </h2>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              发布新帖子
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPosts.filter(post => post.isHot).map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        <a href={`/community/post/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {post.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {post.excerpt}
                      </p>
                    </div>
                    {post.isHot && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                        热门
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 所有帖子 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            最新帖子
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      帖子标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      作者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      发布时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      互动数据
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mockPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <a
                            href={`/community/post/${post.slug}`}
                            className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {post.title}
                          </a>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {post.excerpt}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {post.author}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-sm">
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-sm">
                            <ThumbsUp className="w-4 h-4" />
                            {post.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-sm">
                            <MessageSquare className="w-4 h-4" />
                            {post.comments}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 社区指南 */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            社区指南
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                发帖规则
              </h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>• 尊重他人，文明交流</li>
                <li>• 禁止发布违法、违规内容</li>
                <li>• 禁止广告和垃圾信息</li>
                <li>• 保护个人隐私，不泄露他人信息</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                优质内容
              </h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>• 分享游戏心得和攻略</li>
                <li>• 讨论游戏新闻和动态</li>
                <li>• 提问和解答游戏相关问题</li>
                <li>• 分享游戏截图和视频</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}