import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { UserPlus, Mail, Lock, User, Check, Github, Chrome, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[],
  });

  // 密码强度检查
  const checkPasswordStrength = (password: string) => {
    const feedback = [];
    let score = 0;

    // 长度检查
    if (password.length >= 8) score += 1;
    else feedback.push('至少8个字符');

    // 大小写检查
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    else feedback.push('包含大小写字母');

    // 数字检查
    if (/\d/.test(password)) score += 1;
    else feedback.push('包含数字');

    // 特殊字符检查
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('包含特殊字符');

    return { score, feedback };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };

    setFormData(newFormData);

    // 实时检查密码强度
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    setError('');

    if (!formData.email || !formData.username || !formData.password) {
      setError('请填写所有必填字段');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      setError('用户名只能包含字母、数字和下划线，长度3-20位');
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

    if (passwordStrength.score < 2) {
      setError('密码强度不足，请参考密码强度提示');
      return false;
    }

    if (!formData.agreeTerms) {
      setError('请阅读并同意服务条款和隐私政策');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 使用NextAuth.js的credentials注册
      // 注意：NextAuth.js默认不提供注册API，需要自定义
      // 这里先调用自定义注册API，然后自动登录
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          displayName: formData.displayName || formData.username,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error || '注册失败');
      }

      // 注册成功后自动登录
      const loginResult = await signIn('credentials', {
        identifier: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: '/welcome',
      });

      if (loginResult?.error) {
        throw new Error(loginResult.error);
      }

      if (loginResult?.ok) {
        setSuccess('注册成功！正在跳转到欢迎页面...');
        setTimeout(() => {
          router.push(loginResult.url || '/welcome');
        }, 1500);
      }

    } catch (err) {
      setError(`注册失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: 'github' | 'google') => {
    setLoading(true);
    setError('');

    try {
      await signIn(provider, {
        callbackUrl: '/welcome',
        redirect: true,
      });
    } catch (err) {
      setError(`${provider === 'github' ? 'GitHub' : 'Google'}注册失败`);
      setLoading(false);
    }
  };

  // 密码强度颜色
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return 'text-gray-400';
    if (passwordStrength.score === 1) return 'text-red-500';
    if (passwordStrength.score === 2) return 'text-yellow-500';
    if (passwordStrength.score === 3) return 'text-blue-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score === 0) return '未输入';
    if (passwordStrength.score === 1) return '弱';
    if (passwordStrength.score === 2) return '中';
    if (passwordStrength.score === 3) return '强';
    return '非常强';
  };

  // 结构化数据
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "注册 - GameHub",
      "description": "注册GameHub账户，加入游戏社区，获取个性化游戏资讯和互动体验",
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
            "name": "注册",
            "item": "https://gamehub.com/register"
          }
        ]
      }
    }
  ];

  return (
    <MainLayout>
      <SEO
        title="注册 - GameHub"
        description="注册GameHub账户，加入游戏社区，获取个性化游戏资讯和互动体验。支持邮箱注册和社交账号登录。"
        keywords="注册,创建账户,GameHub账户,游戏社区注册,社交注册"
        canonical="https://gamehub.com/register"
        ogImage="https://gamehub.com/og-register.jpg"
        ogType="website"
        structuredData={structuredData}
        noindex={true} // 注册页面通常noindex
        nofollow={true}
        author="GameHub"
        section="Authentication"
        tags={["register", "sign up", "create account", "user registration"]}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* 注册卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* 标题 */}
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                创建账户
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                加入GameHub游戏社区
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

            {/* 成功提示 */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-green-700 dark:text-green-300 text-sm">{success}</span>
                </div>
              </div>
            )}

            {/* 社交注册 */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSocialRegister('github')}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub注册
                </button>
                <button
                  onClick={() => handleSocialRegister('google')}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Google注册
                </button>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    或使用邮箱注册
                  </span>
                </div>
              </div>
            </div>

            {/* 注册表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  邮箱地址 *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入邮箱地址"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  用户名 *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3-20位字母、数字、下划线"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  用户名将用于个人主页链接和社区显示
                </p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  显示名称（可选）
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="社区中显示的名称"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  密码 *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="至少8位字符"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* 密码强度指示器 */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">密码强度:</span>
                      <span className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor().replace('text-', 'bg-')}`}
                        style={{ width: `${passwordStrength.score * 25}%` }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="w-3 h-3 mr-1" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  确认密码 *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="再次输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  我同意{' '}
                  <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    服务条款
                  </Link>
                  {' '}和{' '}
                  <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    隐私政策
                  </Link>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      注册中...
                    </span>
                  ) : (
                    '创建账户'
                  )}
                </button>
              </div>
            </form>

            {/* 登录链接 */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                已有账户？{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  立即登录
                </Link>
              </p>
            </div>

            {/* 安全提示 */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="mb-1">🔒 您的账户安全是我们的首要任务</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>所有密码都经过bcrypt加密存储</li>
                  <li>支持双重认证（即将推出）</li>
                  <li>定期安全审计和监控</li>
                  <li>符合GDPR和CCPA数据保护标准</li>
                </ul>
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