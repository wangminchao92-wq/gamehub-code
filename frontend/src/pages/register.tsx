import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { UserPlus, Mail, Lock, User, Check, Github, Chrome } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.password) {
      setError('请填写所有必填字段');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }

    if (formData.password.length < 8) {
      setError('密码至少需要8个字符');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }

    if (!formData.agreeTerms) {
      setError('请同意服务条款和隐私政策');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('注册成功！正在跳转到登录页面...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || '注册失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('注册错误:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: 'github' | 'google') => {
    // 这里会跳转到社交注册的OAuth页面
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <MainLayout>
      {/* SEO优化 */}
      <SEO
        title="注册 GameHub | 加入全球游戏社区"
        description="注册GameHub账户，访问最新的游戏新闻、评测、攻略、视频和社区讨论。加入数百万游戏玩家社区。"
        keywords="gamehub注册, 游戏社区注册, 创建游戏账号, 社交注册"
        canonical="https://gamehub.com/register"
      />
      
      {/* 传统title标签作为SEO检查备用 */}
      <title>注册 GameHub | 加入全球游戏社区</title>
      <meta name="description" content="注册GameHub账户，访问最新的游戏新闻、评测、攻略、视频和社区讨论。加入数百万游戏玩家社区。" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-primary-900 flex items-center justify-center py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">注册 GameHub</h1>
            <h2 className="text-2xl font-semibold text-gray-300">加入GameHub</h2>
            <p className="text-gray-400 mt-2">创建你的游戏社区账户</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            {/* 成功提示 */}
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 邮箱输入 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱地址 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-required="true"
                  />
                </div>
              </div>

              {/* 用户名输入 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  用户名 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="选择用户名"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-required="true"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">用户名将用于社区显示和个人资料</p>
              </div>

              {/* 密码输入 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  密码 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-required="true"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">密码至少需要8个字符</p>
              </div>

              {/* 确认密码 */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  确认密码 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-required="true"
                  />
                </div>
              </div>

              {/* 条款同意 */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded bg-gray-800 mt-1"
                  required
                />
                <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-300">
                  我同意GameHub的{' '}
                  <Link href="/terms" title="查看服务条款" aria-label="查看服务条款">
                    服务条款
                  </Link>{' '}
                  和{' '}
                  <Link href="/privacy" title="查看隐私政策" aria-label="查看隐私政策">
                    隐私政策
                  </Link>
                  <span className="text-red-400 ml-1">*</span>
                </label>
              </div>

              {/* 注册按钮 */}
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
                    注册中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    注册账户
                  </span>
                )}
              </button>

              {/* 社交注册分隔线 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800/50 text-gray-400">或使用社交账号注册</span>
                </div>
              </div>

              {/* 社交注册按钮 */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialRegister('github')}
                  className="flex items-center justify-center py-3 px-4 bg-gray-800/70 border border-gray-700 rounded-lg text-white hover:bg-gray-700/70 transition-colors"
                  aria-label="使用GitHub注册"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialRegister('google')}
                  className="flex items-center justify-center py-3 px-4 bg-gray-800/70 border border-gray-700 rounded-lg text-white hover:bg-gray-700/70 transition-colors"
                  aria-label="使用Google注册"
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Google
                </button>
              </div>

              {/* 登录链接 */}
              <div className="text-center">
                <p className="text-gray-400">
                  已有账户？{' '}
                  <Link
                    href="/login" title="登录GameHub账户" aria-label="登录GameHub账户">
                    立即登录
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* 注册优势 */}
          <div className="mt-8 bg-gray-800/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">注册GameHub的优势</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">访问最新的游戏新闻和评测</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">参与社区讨论和活动</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">保存游戏收藏和愿望单</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">获取个性化游戏推荐</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">参加独家活动和比赛</span>
              </li>
            </ul>
          </div>

          {/* 条款说明 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              注册即表示您同意我们的{' '}
              <Link href="/terms" title="查看服务条款" aria-label="查看服务条款">
                服务条款
              </Link>{' '}
              和{' '}
              <Link href="/privacy" title="查看隐私政策" aria-label="查看隐私政策">
                隐私政策
              </Link>
              。我们承诺保护您的个人信息安全。
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}