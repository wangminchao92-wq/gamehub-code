import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { Github, Chrome, CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

export default function SocialLoginTestPage() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  // 检查环境变量配置
  const checkEnvConfig = () => {
    const results: Record<string, any> = {};
    
    // GitHub配置检查
    const githubId = process.env.NEXT_PUBLIC_GITHUB_ID || process.env.GITHUB_ID;
    const githubSecret = process.env.GITHUB_SECRET;
    results.github = {
      idConfigured: !!githubId,
      idValue: githubId ? (githubId.includes('your-') ? '占位符' : '已配置') : '未配置',
      secretConfigured: !!githubSecret,
      secretValue: githubSecret ? (githubSecret.includes('your-') ? '占位符' : '已配置') : '未配置',
      callbackUrl: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/github` : '未配置',
    };

    // Google配置检查
    const googleId = process.env.NEXT_PUBLIC_GOOGLE_ID || process.env.GOOGLE_ID;
    const googleSecret = process.env.GOOGLE_SECRET;
    results.google = {
      idConfigured: !!googleId,
      idValue: googleId ? (googleId.includes('your-') ? '占位符' : '已配置') : '未配置',
      secretConfigured: !!googleSecret,
      secretValue: googleSecret ? (googleSecret.includes('your-') ? '占位符' : '已配置') : '未配置',
      callbackUrl: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` : '未配置',
    };

    // NextAuth配置检查
    results.nextauth = {
      url: process.env.NEXTAUTH_URL || '未配置',
      secret: process.env.NEXTAUTH_SECRET ? '已配置' : '未配置',
      environment: process.env.NODE_ENV || 'development',
    };

    // 数据库配置检查
    results.database = {
      url: process.env.DATABASE_URL ? '已配置' : '未配置',
      type: process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 
            process.env.DATABASE_URL?.includes('mysql') ? 'MySQL' :
            process.env.DATABASE_URL?.includes('file:') ? 'SQLite' : '未知',
    };

    return results;
  };

  // 测试社交登录按钮
  const testSocialLogin = async (provider: 'github' | 'google') => {
    setLoading(prev => ({ ...prev, [provider]: true }));
    setError('');

    try {
      // 尝试使用signIn函数
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/test-social-login',
      });

      if (result?.error) {
        // 检查错误类型
        if (result.error.includes('clientId') || result.error.includes('clientSecret')) {
          setTestResults(prev => ({
            ...prev,
            [provider]: {
              success: false,
              error: 'OAuth凭证未配置或无效',
              details: '请检查环境变量配置',
              result,
            },
          }));
        } else if (result.error.includes('callback')) {
          setTestResults(prev => ({
            ...prev,
            [provider]: {
              success: false,
              error: '回调URL配置错误',
              details: '请检查NEXTAUTH_URL环境变量',
              result,
            },
          }));
        } else {
          setTestResults(prev => ({
            ...prev,
            [provider]: {
              success: false,
              error: result.error,
              details: '未知错误',
              result,
            },
          }));
        }
      } else if (result?.url) {
        // 有URL表示配置正确，但需要用户授权
        setTestResults(prev => ({
          ...prev,
          [provider]: {
            success: true,
            message: '配置正确，需要用户授权',
            url: result.url,
            result,
          },
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [provider]: {
            success: false,
            error: '未知响应',
            details: 'signIn函数返回了意外的结果',
            result,
          },
        }));
      }
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: false,
          error: err.message,
          details: '请求过程中发生异常',
        },
      }));
      setError(`测试失败: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // 运行所有测试
  const runAllTests = () => {
    const envResults = checkEnvConfig();
    setTestResults(envResults);
  };

  // 获取配置说明链接
  const getConfigDocs = (provider: 'github' | 'google') => {
    const docs = {
      github: 'https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app',
      google: 'https://developers.google.com/identity/protocols/oauth2',
    };
    return docs[provider];
  };

  // 初始化测试结果
  React.useEffect(() => {
    runAllTests();
  }, []);

  // 结构化数据
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "社交登录测试 - GameHub",
      "description": "GameHub社交登录功能测试页面，检查GitHub和Google OAuth配置",
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
            "name": "测试",
            "item": "https://gamehub.com/test-social-login"
          }
        ]
      }
    }
  ];

  return (
    <MainLayout>
      <SEO
        title="社交登录测试 - GameHub"
        description="GameHub社交登录功能测试页面，检查GitHub和Google OAuth配置"
        keywords="社交登录测试,OAuth测试,GitHub登录,Google登录,NextAuth测试"
        canonical="https://gamehub.com/test-social-login"
        ogImage="https://gamehub.com/og-test.jpg"
        ogType="website"
        structuredData={structuredData}
        noindex={true}
        nofollow={true}
        author="GameHub"
        section="Testing"
        tags={["test", "social login", "oauth", "authentication"]}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🔐 社交登录测试
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              测试GameHub的GitHub和Google OAuth登录功能
            </p>
          </div>

          {/* 当前会话状态 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              当前会话状态
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">登录状态</div>
                <div className="flex items-center">
                  {status === 'authenticated' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="font-medium text-green-600 dark:text-green-400">已登录</span>
                    </>
                  ) : status === 'unauthenticated' ? (
                    <>
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="font-medium text-red-600 dark:text-red-400">未登录</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                      <span className="font-medium text-blue-600 dark:text-blue-400">检查中...</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">用户信息</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {session?.user ? (
                    <div>
                      <div>{session.user.displayName || session.user.username}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</div>
                    </div>
                  ) : (
                    '未登录用户'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 环境配置检查 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                环境配置检查
              </h2>
              <button
                onClick={runAllTests}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新检查
              </button>
            </div>

            {testResults.nextauth && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  NextAuth.js配置
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">NEXTAUTH_URL</div>
                    <div className="flex items-center">
                      {testResults.nextauth.url !== '未配置' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {testResults.nextauth.url}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="font-medium text-red-600 dark:text-red-400">未配置</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">NEXTAUTH_SECRET</div>
                    <div className="flex items-center">
                      {testResults.nextauth.secret === '已配置' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-medium text-green-600 dark:text-green-400">已配置</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="font-medium text-red-600 dark:text-red-400">未配置</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">环境</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {testResults.nextauth.environment}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GitHub配置 */}
            {testResults.github && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub OAuth配置
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client ID</div>
                    <div className="flex items-center">
                      {testResults.github.idConfigured ? (
                        testResults.github.idValue === '占位符' ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="font-medium text-yellow-600 dark:text-yellow-400">
                              需要配置实际值
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-medium text-green-600 dark:text-green-400">已配置</span>
                          </>
                        )
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="font-medium text-red-600 dark:text-red-400">未配置</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client Secret</div>
                    <div className="flex items-center">
                      {testResults.github.secretConfigured ? (
                        testResults.github.secretValue === '占位符' ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="font-medium text-yellow-600 dark:text-yellow-400">
                              需要配置实际值
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-medium text-green-600 dark:text-green-400">已配置</span>
                          </>
                        )
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="font-medium text-red-600 dark:text-red-400">未配置</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href={getConfigDocs('github')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    查看GitHub OAuth应用配置文档
                  </a>
                </div>
              </div>
            )}

            {/* Google配置 */}
            {testResults.google && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Chrome className="w-5 h-5 mr-2" />
                  Google OAuth配置
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client ID</div>
                    <div className="flex items-center">
                      {testResults.google.idConfigured ? (
                        testResults.google.idValue === '占位符' ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="font-medium text-yellow-600 dark:text-yellow-400">
                              需要配置实际值
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-medium text-green-600 dark:text-green-400">已配置</span>
                          </>
                        )
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="font-medium text-red-600 dark:text-red-400">未配置</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="text-sm text-gray-500