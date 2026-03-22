import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { LogIn, Mail, Lock, User, Github, Chrome, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState({
    github: false,
    google: false,
  });

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        identifier: formData.identifier,
        password: formData.password,
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(result.url || '/');
      }
    } catch (err) {
      setError(`登录错误: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    setError('');

    try {
      await signIn(provider, {
        callbackUrl: '/',
        redirect: true,
      });
    } catch (err) {
      setError(`${provider === 'github' ? 'GitHub' : 'Google'}登录失败`);
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // 结构化数据
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "登录 - GameHub",
      "description": "登录GameHub账户，访问游戏新闻、社区和个性化内容",
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
            "name": "登录",
            "item": "https://gamehub.com/login"
          }
        ]
      }
    }
  ];

  return (
    <MainLayout>
      <SEO
        title="登录 - GameHub"
        description="登录GameHub账户，访问游戏新闻、社区和个性化内容。支持邮箱登录、GitHub和Google登录。"
        keywords="登录,用户认证,GameHub账户,游戏社区登录,社交登录"
        canonical="https://gamehub.com/login"
        ogImage="https://gamehub.com/og-login.jpg"
        ogType="website"
        structuredData={structuredData}
        noindex={true} // 登录页面通常noindex
        nofollow={true}
        author="GameHub"
        section="Authentication"
        tags={["login", "authentication", "user account", "sign in"]}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* 登录卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* 标题 */}
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                欢迎回来
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                登录您的GameHub账户
              </p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* 社交登录 */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSocialLogin('github')}
                  disabled={socialLoading.github || loading}
                  className="flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  {socialLoading.github ? '连接中...' : 'GitHub'}
                </button>
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={socialLoading.google || loading}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  {socialLoading.google ? '连接中...' : 'Google'}
                </button>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    或使用邮箱登录
                  </span>
                </div>
              </div>
            </div>

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  用户名或邮箱
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入用户名或邮箱"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入密码"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    记住我
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    忘记密码？
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登录中...
                    </span>
                  ) : (
                    '登录'
                  )}
                </button>
              </div>
            </form>

            {/* 注册链接 */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                还没有账户？{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  立即注册
                </Link>
              </p>
            </div>

            {/* 安全提示 */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <p>登录即表示您同意我们的</p>
                <p>
                  <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">服务条款</Link>
                  {' '}和{' '}
                  <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">隐私政策</Link>
                </p>
              </div>
            </div>
          </div>

          {/* 返回首页链接 */}
          <div className="text-center">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}