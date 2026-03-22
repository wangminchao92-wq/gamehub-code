import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '@/components/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="关于GameHub - 专业的游戏社区平台"
        description="GameHub是一个现代化的游戏社区平台，为游戏爱好者提供内容分享、社区互动、成就系统等丰富功能。"
        keywords="游戏社区,游戏平台,游戏资讯,游戏攻略,游戏社交"
        ogImage="/og-about.jpg"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* 导航栏 */}
        <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
                GameHub
              </Link>
              <div className="flex space-x-6">
                <Link href="/" className="hover:text-blue-300 transition-colors">首页</Link>
                <Link href="/news" className="hover:text-blue-300 transition-colors">新闻</Link>
                <Link href="/community" className="hover:text-blue-300 transition-colors">社区</Link>
                <Link href="/guides" className="hover:text-blue-300 transition-colors">指南</Link>
                <Link href="/about" className="text-blue-300 font-medium">关于</Link>
                <Link href="/contact" className="hover:text-blue-300 transition-colors">联系</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* 标题部分 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                关于GameHub
              </h1>
              <p className="text-xl text-gray-300">
                打造最专业的游戏社区平台
              </p>
            </div>

            {/* 使命愿景 */}
            <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">我们的使命</h2>
              <p className="text-gray-300 mb-4">
                为全球游戏爱好者提供一个集内容分享、社区互动、成就激励于一体的现代化平台。
                我们相信游戏不仅仅是娱乐，更是连接人与人之间的桥梁。
              </p>
              <p className="text-gray-300">
                通过GameHub，我们希望帮助玩家发现更多优质游戏内容，建立有意义的社交关系，
                并在游戏旅程中获得持续的成就感和成长。
              </p>
            </div>

            {/* 核心价值 */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="text-blue-400 text-3xl mb-4">🎮</div>
                <h3 className="text-xl font-bold mb-2">游戏内容聚合</h3>
                <p className="text-gray-300">
                  汇集最新的游戏资讯、深度评测、实用攻略，为玩家提供一站式内容服务。
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="text-purple-400 text-3xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-2">社区互动</h3>
                <p className="text-gray-300">
                  建立活跃的游戏社区，支持帖子发布、评论互动、用户关注等社交功能。
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="text-green-400 text-3xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2">成就激励</h3>
                <p className="text-gray-300">
                  完善的成就系统和徽章体系，激励玩家参与社区活动，记录游戏旅程。
                </p>
              </div>
            </div>

            {/* 技术特色 */}
            <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-blue-300">技术特色</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-200">现代化技术栈</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Next.js 14 - 高性能React框架</li>
                    <li>• TypeScript - 类型安全的开发体验</li>
                    <li>• Tailwind CSS - 现代化的CSS框架</li>
                    <li>• Prisma - 类型安全的数据库ORM</li>
                    <li>• NextAuth.js - 完整的认证解决方案</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-200">优秀用户体验</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 响应式设计 - 完美适配所有设备</li>
                    <li>• 性能优化 - 快速的页面加载速度</li>
                    <li>• SEO友好 - 符合Google SEO规范</li>
                    <li>• 无障碍访问 - 支持屏幕阅读器等辅助技术</li>
                    <li>• 实时功能 - 通知、关注等实时交互</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 开发团队 */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-blue-300">开发团队</h2>
              <p className="text-gray-300 mb-6">
                GameHub由一支热爱游戏和技术的团队开发。我们致力于通过技术创新，
                为游戏社区带来更好的产品体验。
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4 flex-1 min-w-[200px]">
                  <div className="font-bold text-lg mb-2 text-blue-300">云霞飞002</div>
                  <div className="text-gray-400 text-sm">全栈开发者</div>
                  <div className="text-gray-300 text-sm mt-2">负责项目架构、核心功能开发和部署</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 flex-1 min-w-[200px]">
                  <div className="font-bold text-lg mb-2 text-purple-300">王先生</div>
                  <div className="text-gray-400 text-sm">项目负责人</div>
                  <div className="text-gray-300 text-sm mt-2">负责项目规划、需求分析和产品设计</div>
                </div>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="mt-12 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-400">7+</div>
                  <div className="text-gray-400 mt-2">核心功能模块</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-400">50+</div>
                  <div className="text-gray-400 mt-2">页面组件</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-400">200K+</div>
                  <div className="text-gray-400 mt-2">代码行数</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-yellow-400">100%</div>
                  <div className="text-gray-400 mt-2">开源代码</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 页脚 */}
        <footer className="bg-gray-900 border-t border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="text-2xl font-bold text-blue-400">GameHub</div>
                <div className="text-gray-400 mt-2">专业的游戏社区平台</div>
              </div>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">首页</Link>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">新闻</Link>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors">社区</Link>
                <Link href="/about" className="text-blue-300">关于</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">联系</Link>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>© 2026 GameHub. 保留所有权利。</p>
              <p className="mt-2">由云霞飞002开发，王先生指导。</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}