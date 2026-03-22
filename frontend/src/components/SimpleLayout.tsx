import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Home, Gamepad2, Newspaper, Users, ShoppingBag, Star, User, LogIn, Menu, X } from 'lucide-react';

interface SimpleLayoutProps {
  children: ReactNode;
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-2xl font-bold text-blue-600">
                <Gamepad2 className="w-8 h-8 mr-2" />
                GameHub
              </Link>
            </div>
            
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="菜单"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* 桌面主导航 */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="flex items-center text-gray-700 hover:text-blue-600 touch-target">
                <Home className="w-4 h-4 mr-1" />
                首页
              </Link>
              <Link href="/news" className="flex items-center text-gray-700 hover:text-blue-600 touch-target">
                <Newspaper className="w-4 h-4 mr-1" />
                新闻
              </Link>
              <Link href="/community" className="flex items-center text-gray-700 hover:text-blue-600 touch-target">
                <Users className="w-4 h-4 mr-1" />
                社区
              </Link>
              <Link href="/store" className="flex items-center text-gray-700 hover:text-blue-600 touch-target">
                <ShoppingBag className="w-4 h-4 mr-1" />
                商店
              </Link>
              <Link href="/reviews" className="flex items-center text-gray-700 hover:text-blue-600 touch-target">
                <Star className="w-4 h-4 mr-1" />
                评测
              </Link>
            </div>
            
            {/* 用户操作 */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="btn btn-outline touch-target">
                <LogIn className="w-4 h-4 mr-2" />
                登录
              </Link>
              <Link href="/register" className="btn btn-primary touch-target">
                注册
              </Link>
            </div>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                <Link 
                  href="/" 
                  className="block py-3 text-lg text-gray-700 hover:text-blue-600 touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="inline-block w-5 h-5 mr-2" />
                  首页
                </Link>
                <Link 
                  href="/news" 
                  className="block py-3 text-lg text-gray-700 hover:text-blue-600 touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Newspaper className="inline-block w-5 h-5 mr-2" />
                  新闻
                </Link>
                <Link 
                  href="/community" 
                  className="block py-3 text-lg text-gray-700 hover:text-blue-600 touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="inline-block w-5 h-5 mr-2" />
                  社区
                </Link>
                <Link 
                  href="/store" 
                  className="block py-3 text-lg text-gray-700 hover:text-blue-600 touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBag className="inline-block w-5 h-5 mr-2" />
                  商店
                </Link>
                <Link 
                  href="/reviews" 
                  className="block py-3 text-lg text-gray-700 hover:text-blue-600 touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Star className="inline-block w-5 h-5 mr-2" />
                  评测
                </Link>
                <div className="pt-4 border-t">
                  <Link 
                    href="/login" 
                    className="block py-3 text-lg text-gray-700 hover:text-blue-600 touch-target"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="inline-block w-5 h-5 mr-2" />
                    登录
                  </Link>
                  <Link 
                    href="/register" 
                    className="block py-3 text-lg text-blue-600 hover:text-blue-800 touch-target"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    注册
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GameHub</h3>
              <p className="text-gray-400">你的终极游戏目的地</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">探索</h4>
              <ul className="space-y-2">
                <li><Link href="/news" className="text-gray-400 hover:text-white">新闻</Link></li>
                <li><Link href="/community" className="text-gray-400 hover:text-white">社区</Link></li>
                <li><Link href="/store" className="text-gray-400 hover:text-white">商店</Link></li>
                <li><Link href="/reviews" className="text-gray-400 hover:text-white">评测</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">支持</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white">帮助中心</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">联系我们</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">隐私政策</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">服务条款</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">关注我们</h4>
              <p className="text-gray-400 mb-4">关注我们的社交媒体获取最新动态</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Discord</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 GameHub. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}