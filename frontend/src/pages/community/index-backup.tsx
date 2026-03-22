import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';

export default function UltraSimpleCommunityPage() {
  // 社区页面结构化数据
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
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎮 GameHub 社区
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            与全球游戏爱好者交流心得、分享攻略、讨论游戏
          </p>
        </div>

        {/* 社区统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">6,842</div>
            <div className="text-gray-600 dark:text-gray-400">社区成员</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-5xl font-bold text-green-600 mb-2">156</div>
            <div className="text-gray-600 dark:text-gray-400">今日帖子</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="text-5xl font-bold text-orange-600 mb-2">98.7%</div>
            <div className="text-gray-600 dark:text-gray-400">活跃度</div>
          </div>
        </div>

        {/* 热门帖子 */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            🔥 热门讨论
          </h2>
          
          <div className="space-y-6">
            {/* 帖子1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                      🔥 热门
                    </span>
                    <span className="ml-3 text-gray-500 dark:text-gray-400">攻略分享</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    《艾尔登法环》全成就达成心得分享
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    经过150小时的奋战，终于达成了《艾尔登法环》的全成就！在这里分享一些心得和技巧，包括最难成就的攻略和实用技巧。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #艾尔登法环
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #成就
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #攻略
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👤</span>
                        <span>硬核玩家</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">📅</span>
                        <span>2026-03-18</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👁️</span>
                        <span>45,000</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👍</span>
                        <span>3,200</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">💬</span>
                        <span>156</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 帖子2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                      📰 新闻
                    </span>
                    <span className="ml-3 text-gray-500 dark:text-gray-400">游戏新闻</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    独立游戏《星露谷物语2》抢先体验版发布
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    备受期待的农场模拟游戏《星露谷物语2》的抢先体验版已在Steam平台上线，售价98元。新特性包括更大的农场规模、改进的制造系统和多人合作模式。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #星露谷物语
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #独立游戏
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #抢先体验
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👤</span>
                        <span>游戏玩家1</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">📅</span>
                        <span>2026-03-20</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👁️</span>
                        <span>32,000</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👍</span>
                        <span>2,400</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">💬</span>
                        <span>98</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 帖子3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                      💬 讨论
                    </span>
                    <span className="ml-3 text-gray-500 dark:text-gray-400">剧情讨论</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    《赛博朋克2077 2.0》新DLC「往日之影」剧情讨论
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    新DLC「往日之影」带来了全新的故事线和角色，大家来聊聊对剧情的看法和解读。特别是关于主角V的命运选择和各个结局的象征意义。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #赛博朋克2077
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #DLC
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      #剧情讨论
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👤</span>
                        <span>赛博爱好者</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">📅</span>
                        <span>2026-03-22</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👁️</span>
                        <span>28,000</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👍</span>
                        <span>1,900</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">💬</span>
                        <span>87</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 社区指南 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">📚 社区指南</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">社区规则</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>尊重他人，文明交流</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>禁止发布广告和垃圾信息</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>遵守法律法规和社区规范</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>原创内容请注明出处</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">热门话题</h3>
              <div className="flex flex-wrap gap-2">
                {['游戏攻略', '硬件讨论', '剧情分析', '游戏推荐', 'MOD分享', '联机组队'].map((topic) => (
                  <span key={topic} className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            加入讨论，分享你的游戏心得！
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-lg font-medium">
              💬 发表新帖子
            </button>
            <button className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 text-lg font-medium">
              🔍 浏览更多帖子
            </button>
          </div>
        </div>

        {/* 页脚信息 */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
          <p>GameHub 社区 • 已有 6,842 名成员加入 • 今日发布 156 个帖子</p>
          <p className="mt-2 text-sm">© 2026 GameHub. 保留所有权利。</p>
        </div>
      </div>
    </div>
  );
}