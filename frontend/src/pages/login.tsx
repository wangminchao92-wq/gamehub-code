import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { LogIn, Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-primary-900 flex items-center justify-center py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">欢迎回来</h1>
            <p className="text-gray-400 mt-2">登录你的GameHub账户</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <form className="space-y-6">
              {/* 邮箱输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
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
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 记住我 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">记住我</span>
                </label>
                <a href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                  忘记密码？
                </a>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <LogIn className="h-5 w-5 mr-2" />
                登录
              </button>
            </form>

            {/* 分隔线 */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 text-gray-400">或</span>
              </div>
            </div>

            {/* 社交登录 */}
            <div className="space-y-3">
              <button className="w-full py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors flex items-center justify-center">
                <div className="w-5 h-5 mr-2">G</div>
                使用 Google 登录
              </button>
              <button className="w-full py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors flex items-center justify-center">
                <div className="w-5 h-5 mr-2">f</div>
                使用 Facebook 登录
              </button>
            </div>

            {/* 注册链接 */}
            <div className="text-center mt-8">
              <p className="text-gray-400">
                还没有账户？{' '}
                <a href="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                  立即注册
                </a>
              </p>
            </div>
          </div>

          {/* 安全提示 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              登录即表示你同意我们的{' '}
              <a href="/terms" className="text-gray-400 hover:text-gray-300">服务条款</a>
              {' '}和{' '}
              <a href="/privacy" className="text-gray-400 hover:text-gray-300">隐私政策</a>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}