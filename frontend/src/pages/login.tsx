import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { LogIn, Mail, Lock, User, Github, Chrome } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await fetch('/api/auth/simple-login-fixed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // 登录成功，跳转到首页
        router.push('/');
      } else {
        setError(data.error || '登录失败');
        console.error('登录API错误:', data);
      }
    } catch (err) {
      setError(`网络错误: ${err.message}`);
      console.error('登录错误:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'github' | 'google') => {
    // 这里会跳转到社交登录的OAuth页面
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <MainLayout>
      {/* SEO优化 */}
      <SEO
        title="登录 GameHub | 加入全球游戏社区"
        description="登录你的GameHub账户，访问最新的游戏新闻、评测、攻略、视频和社区讨论。"
        keywords="gamehub登录, 游戏社区登录, 游戏账号登录, 社交登录"
        canonical="https://gamehub.com/login"
      />
      
      {/* 传统title标签作为SEO检查备用 */}
      <title>登录 GameHub | 加入全球游戏社区</title>
      <meta name="description" content="登录你的GameHub账户，访问最新的游戏新闻、评测、攻略、视频和社区讨论。" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-primary-900 flex items-center justify-center py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">登录 GameHub</h1>
            <h2 className="text-2xl font-semibold text-gray-300">欢迎回来</h2>
            <p className="text-gray-400 mt-2">登录你的GameHub账户</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 邮箱/用户名输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱或用户名
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="identifier"
                    placeholder="your@email.com 或 username"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 记住我和忘记密码 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                    记住我
                  </label>
                </div>
                <Link
                  href="/forgot-password" title="重置账户密码" aria-label="重置账户密码">
                  忘记密码？
                </Link>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    登录中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    登录
                  </span>
                )}
              </button>

              {/* 社交登录分隔线 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800/50 text-gray-400">或使用社交账号登录</span>
                </div>
              </div>

              {/* 社交登录按钮 */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="flex items-center justify-center py-3 px-4 bg-gray-800/70 border border-gray-700 rounded-lg text-white hover:bg-gray-700/70 transition-colors"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center py-3 px-4 bg-gray-800/70 border border-gray-700 rounded-lg text-white hover:bg-gray-700/70 transition-colors"
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Google
                </button>
              </div>

              {/* 注册链接 */}
              <div className="text-center">
                <p className="text-gray-400">
                  还没有账户？{' '}
                  <Link
                    href="/register" title="注册GameHub账户" aria-label="注册GameHub账户">
                    立即注册
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* 条款说明 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              登录即表示您同意我们的{' '}
              <Link href="/terms" className="text-gray-400 hover:text-gray-300">
                服务条款
              </Link>{' '}
              和{' '}
              <Link href="/privacy" className="text-gray-400 hover:text-gray-300">
                隐私政策
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}