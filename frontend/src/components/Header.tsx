'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Globe, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  Menu, 
  X,
  Gamepad2,
  Trophy,
  Video,
  MessageSquare,
  Store
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const navigation = [
  { name: '新闻', href: '/news', icon: null },
  { name: '评测', href: '/reviews', icon: Trophy },
  { name: '攻略', href: '/guides', icon: null },
  { name: '视频', href: '/videos', icon: Video },
  { name: '社区', href: '/community', icon: MessageSquare },
  { name: '商店', href: '/store', icon: Store },
];

const platforms = [
  { name: 'PC', href: '/platform/pc' },
  { name: 'PlayStation', href: '/platform/playstation' },
  { name: 'Xbox', href: '/platform/xbox' },
  { name: 'Nintendo', href: '/platform/nintendo' },
  { name: '移动端', href: '/platform/mobile' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
      {/* 顶部通知栏 */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-sm text-white">
              <span className="animate-pulse mr-2">🎮</span>
              <span>新用户注册即送游戏礼包！</span>
              <Link href="/promotion" className="ml-2 font-bold underline hover:no-underline">
                立即领取 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 主导航 */}
      <nav className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  GameHub
                </span>
                <div className="text-xs text-gray-400">游戏资讯平台</div>
              </div>
            </Link>

            {/* 桌面端导航 */}
            <div className="hidden lg:ml-10 lg:flex lg:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300 group"
                  >
                    {Icon && <Icon className="h-4 w-4 mr-2" />}
                    {item.name}
                    <span className="ml-2 h-0.5 w-0 bg-primary-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 右侧功能区域 */}
          <div className="flex items-center space-x-4">
            {/* 搜索按钮 */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              aria-label="搜索"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* 语言切换 */}
            <button className="hidden md:flex items-center space-x-1 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <Globe className="h-5 w-5" />
              <span className="text-sm">中文</span>
            </button>

            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              aria-label="切换主题"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* 通知 */}
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </button>

            {/* 用户 */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <User className="h-5 w-5" />
            </button>

            {/* 登录/注册按钮 */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                注册
              </Link>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* 平台导航 */}
        <div className="hidden lg:flex items-center justify-center space-x-6 py-3 border-t border-gray-800">
          {platforms.map((platform) => (
            <Link
              key={platform.name}
              href={platform.href}
              className="text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 px-3 py-1 rounded-full transition-all duration-300"
            >
              {platform.name}
            </Link>
          ))}
        </div>

        {/* 搜索框 */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索游戏、新闻、攻略..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">⌘K</kbd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-xl">
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {Icon && <Icon className="h-5 w-5 mr-3" />}
                      {item.name}
                    </Link>
                  );
                })}
                
                {/* 移动端平台导航 */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="grid grid-cols-3 gap-2">
                    {platforms.map((platform) => (
                      <Link
                        key={platform.name}
                        href={platform.href}
                        className="text-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {platform.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 移动端用户操作 */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex space-x-3">
                    <Link
                      href="/login"
                      className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      登录
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 text-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      注册
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}