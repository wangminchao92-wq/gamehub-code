import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { Github, Chrome, CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

export default function SocialLoginTestPage() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState({ github: false, google: false });

  // 检查配置
  const checkConfig = () => {
    const results: any = {};
    
    // GitHub
    const githubId = process.env.GITHUB_ID;
    const githubSecret = process.env.GITHUB_SECRET;
    results.github = {
      id: githubId ? (githubId.includes('your-') ? 'placeholder' : 'configured') : 'not-configured',
      secret: githubSecret ? (githubSecret.includes('your-') ? 'placeholder' : 'configured') : 'not-configured',
    };

    // Google
    const googleId = process.env.GOOGLE_ID;
    const googleSecret = process.env.GOOGLE_SECRET;
    results.google = {
      id: googleId ? (googleId.includes('your-') ? 'placeholder' : 'configured') : 'not-configured',
      secret: googleSecret ? (googleSecret.includes('your-') ? 'placeholder' : 'configured') : 'not-configured',
    };

    // NextAuth
    results.nextauth = {
      url: process.env.NEXTAUTH_URL || 'not-configured',
      secret: process.env.NEXTAUTH_SECRET ? 'configured' : 'not-configured',
    };

    return results;
  };

  // 测试登录
  const testLogin = async (provider: 'github' | 'google') => {
    setLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      const result = await signIn(provider, { redirect: false });
      
      setTestResults((prev: any) => ({
        ...prev,
        [provider]: {
          success: !result?.error,
          error: result?.error,
          url: result?.url,
          message: result?.error ? '配置错误' : '配置正确，需要用户授权',
        }
      }));
    } catch (error: any) {
      setTestResults((prev: any) => ({
        ...prev,
        [provider]: {
          success: false,
          error: error.message,
          message: '测试失败',
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  useEffect(() => {
    setTestResults(checkConfig());
  }, []);

  return (
    <MainLayout>
      <SEO
        title="社交登录测试 - GameHub"
        description="测试GitHub和Google OAuth登录配置"
        noindex={true}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">🔐 社交登录测试</h1>
          
          {/* 配置状态 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">配置状态</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* GitHub */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center mb-2">
                  <Github className="w-5 h-5 mr-2" />
                  <h3 className="font-semibold">GitHub</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Client ID:</span>
                    <span className={`text-sm font-medium ${
                      testResults.github?.id === 'configured' ? 'text-green-600' :
                      testResults.github?.id === 'placeholder' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {testResults.github?.id === 'configured' ? '✅ 已配置' :
                       testResults.github?.id === 'placeholder' ? '⚠️ 占位符' : '❌ 未配置'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Client Secret:</span>
                    <span className={`text-sm font-medium ${
                      testResults.github?.secret === 'configured' ? 'text-green-600' :
                      testResults.github?.secret === 'placeholder' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {testResults.github?.secret === 'configured' ? '✅ 已配置' :
                       testResults.github?.secret === 'placeholder' ? '⚠️ 占位符' : '❌ 未配置'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Google */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center mb-2">
                  <Chrome className="w-5 h-5 mr-2" />
                  <h3 className="font-semibold">Google</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Client ID:</span>
                    <span className={`text-sm font-medium ${
                      testResults.google?.id === 'configured' ? 'text-green-600' :
                      testResults.google?.id === 'placeholder' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {testResults.google?.id === 'configured' ? '✅ 已配置' :
                       testResults.google?.id === 'placeholder' ? '⚠️ 占位符' : '❌ 未配置'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Client Secret:</span>
                    <span className={`text-sm font-medium ${
                      testResults.google?.secret === 'configured' ? 'text-green-600' :
                      testResults.google?.secret === 'placeholder' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {testResults.google?.secret === 'configured' ? '✅ 已配置' :
                       testResults.google?.secret === 'placeholder' ? '⚠️ 占位符' : '❌ 未配置'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* NextAuth配置 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-2">NextAuth.js配置</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-32">NEXTAUTH_URL:</span>
                  <span className={`text-sm font-medium ${
                    testResults.nextauth?.url !== 'not-configured' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {testResults.nextauth?.url !== 'not-configured' ? `✅ ${testResults.nextauth?.url}` : '❌ 未配置'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-32">NEXTAUTH_SECRET:</span>
                  <span className={`text-sm font-medium ${
                    testResults.nextauth?.secret === 'configured' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {testResults.nextauth?.secret === 'configured' ? '✅ 已配置' : '❌ 未配置'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 测试按钮 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">功能测试</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub测试 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Github className="w-6 h-6 mr-2" />
                    <h3 className="font-semibold">GitHub登录测试</h3>
                  </div>
                  {testResults.githubTest && (
                    testResults.githubTest.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  )}
                </div>
                
                <button
                  onClick={() => testLogin('github')}
                  disabled={loading.github}
                  className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading.github ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      测试中...
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4 mr-2" />
                      测试GitHub登录
                    </>
                  )}
                </button>
                
                {testResults.githubTest && (
                  <div className={`mt-3 p-3 rounded text-sm ${
                    testResults.githubTest.success 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}>
                    {testResults.githubTest.message}
                    {testResults.githubTest.error && (
                      <div className="mt-1 text-xs opacity-75">{testResults.githubTest.error}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Google测试 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Chrome className="w-6 h-6 mr-2" />
                    <h3 className="font-semibold">Google登录测试</h3>
                  </div>
                  {testResults.googleTest && (
                    testResults.googleTest.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  )}
                </div>
                
                <button
                  onClick={() => testLogin('google')}
                  disabled={loading.google}
                  className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading.google ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      测试中...
                    </>
                  ) : (
                    <>
                      <Chrome className="w-4 h-4 mr-2" />
                      测试Google登录
                    </>
                  )}
                </button>
                
                {testResults.googleTest && (
                  <div className={`mt-3 p-3 rounded text-sm ${
                    testResults.googleTest.success 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}>
                    {testResults.googleTest.message}
                    {testResults.googleTest.error && (
                      <div className="mt-1 text-xs opacity-75">{testResults.googleTest.error}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 配置指南 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">配置指南</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub OAuth应用配置
                </h3>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
                  <li>访问 <a href="https://github.com/settings/developers" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub Developer Settings</a></li>
                  <li>点击"New OAuth App"创建新应用</li>
                  <li>填写应用信息，回调URL设置为: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{process.env.NEXTAUTH_URL}/api/auth/callback/github</code></li>
                  <li>复制Client ID和Client Secret到环境变量</li>
                </ol>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Chrome className="w-4 h-4 mr-2" />
                  Google OAuth应用配置
                </h3>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
                  <li>访问 <a href="https://console.cloud.google.com/apis/credentials" className="text-blue-600 dark:text-blue-400 hover:underline">Google Cloud Console</a></li>
                  <li>创建OAuth 2.0客户端ID</li>
                  <li>添加授权域名和回调URL: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{process.env.NEXTAUTH_URL}/api/auth/callback/google</code></li>
                  <li>复制Client ID和Client Secret到环境变量</li>
                </ol>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">重要提示</span>
                </div>
                <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                  生产环境必须使用实际的OAuth应用凭证。开发环境可以使用测试凭证，但需要正确配置回调URL。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}