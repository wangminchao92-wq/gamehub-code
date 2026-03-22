import React, { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { CheckCircle, GamepadIcon, Users, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 欢迎步骤
  const welcomeSteps = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: '账户创建成功',
      description: '您的GameHub账户已成功创建并激活',
      completed: true,
    },
    {
      icon: <GamepadIcon className="w-6 h-6" />,
      title: '探索游戏内容',
      description: '浏览最新的游戏新闻、评测和指南',
      action: '浏览内容',
      link: '/news',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '加入社区讨论',
      description: '与其他玩家交流心得，分享游戏体验',
      action: '进入社区',
      link: '/community',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: '完善个人资料',
      description: '设置头像、个人简介，获得更多关注',
      action: '编辑资料',
      link: session?.user ? `/user/${session.user.username}` : '/user/profile',
    },
  ];

  // 新手任务
  const beginnerTasks = [
    { id: 1, title: '阅读一篇游戏新闻', points: 10, completed: false },
    { id: 2, title: '在社区发布第一个帖子', points: 20, completed: false },
    { id: 3, title: '评论一篇文章', points: 15, completed: false },
    { id: 4, title: '完善个人资料', points: 25, completed: false },
    { id: 5, title: '关注3个感兴趣的用户', points: 30, completed: false },
  ];

  // 结构化数据
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "欢迎来到GameHub",
      "description": "欢迎新用户加入GameHub游戏社区，开始您的游戏之旅",
      "breadcrumb": {
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
            "name": "欢迎",
            "item": "https://gamehub.com/welcome"
          }
        ]
      }
    }
  ];

  if (status === 'loading') {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO
        title="欢迎来到GameHub！"
        description="欢迎新用户加入GameHub游戏社区，开始您的游戏之旅。探索游戏内容，加入社区讨论，完善个人资料。"
        keywords="欢迎,新用户,GameHub欢迎,游戏社区欢迎,新手引导"
        canonical="https://gamehub.com/welcome"
        ogImage="https://gamehub.com/og-welcome.jpg"
        ogType="website"
        structuredData={structuredData}
        noindex={true}
        nofollow={true}
        author="GameHub"
        section="Welcome"
        tags={["welcome", "new user", "onboarding", "game community"]}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        {/* 欢迎横幅 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
                <Sparkles className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                欢迎{session?.user?.displayName ? `，${session.user.displayName}` : ''}！
              </h1>
              <p className="text-xl opacity-90 mb-8">
                恭喜您成功加入GameHub游戏社区
              </p>
              <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-2">
                <span className="font-medium">初始积分:</span>
                <span className="ml-2 text-2xl font-bold">100</span>
                <Star className="w-5 h-5 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="container mx-auto px-4 py-12 -mt-8">
          <div className="max-w-6xl mx-auto">
            {/* 欢迎步骤 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                开始您的GameHub之旅
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {welcomeSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`relative p-6 rounded-xl border-2 ${
                      step.completed 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                      step.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
                    }`}>
                      <div className={step.completed ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {step.description}
                    </p>
                    
                    {step.action && step.link && (
                      <Link
                        href={step.link}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        {step.action}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                    
                    {step.completed && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左侧：新手任务 */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      🎯 新手任务
                    </h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      完成所有任务可获得 <span className="font-bold text-yellow-600">100积分</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {beginnerTasks.map((task) => (
                      <div 
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            task.completed 
                              ? 'bg-green-100 dark:bg-green-900' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            {task.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              奖励: <span className="font-bold text-yellow-600">{task.points}积分</span>
                            </div>
                          </div>
                        </div>
                        
                        {!task.completed && (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            去完成
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">任务进度</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          0/5 完成
                        </div>
                      </div>
                      <div className="w-32 h-32 relative">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* 背景圆 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                          />
                          {/* 进度圆 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="283"
                            strokeDashoffset="283"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">0%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：快速链接和提示 */}
              <div className="space-y-8">
                {/* 快速链接 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    🚀 快速开始
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/news"
                      className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                    >
                      <GamepadIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        浏览游戏新闻
                      </span>
                    </Link>
                    <Link
                      href="/community"
                      className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
                    >
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        加入社区讨论
                      </span>
                    </Link>
                    <Link
                      href={session?.user ? `/user/${session.user.username}` : '/user/profile'}
                      className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
                    >
                      <Star className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                        完善个人资料
                      </span>
                    </Link>
                  </div>
                </div>

                {/* 社区提示 */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">
                    💡 社区小贴士
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                      <span>积极参与讨论可以获得更多积分</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                      <span>积分可以兑换社区特权</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                      <span>关注感兴趣的用户获取个性化内容</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                      <span>定期参与活动可以获得稀有成就</span>
                    </li>
                  </ul>
                </div>

                {/* 下一步行动 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    📝 下一步
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    您已经成功加入GameHub！建议您先完善个人资料，然后开始探索社区内容。
                  </p>
                  <Link
                    href="/"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                  >
                    开始探索GameHub
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}