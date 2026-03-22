import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Gamepad2, Newspaper, Users, ShoppingBag, User, LogIn, LogOut } from 'lucide-react';

interface MobileNavigationProps {
  isAuthenticated?: boolean;
  userName?: string;
  userLevel?: number;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isAuthenticated = false,
  userName = '游客',
  userLevel = 1,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 防止滚动当菜单打开时
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 导航项
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: '首页', href: '/', active: true },
    { icon: <Gamepad2 className="h-5 w-5" />, label: '游戏', href: '/games' },
    { icon: <Newspaper className="h-5 w-5" />, label: '新闻', href: '/news' },
    { icon: <Users className="h-5 w-5" />, label: '社区', href: '/community' },
    { icon: <ShoppingBag className="h-5 w-5" />, label: '商店', href: '/store' },
  ];

  // 用户菜单项
  const userMenuItems = isAuthenticated
    ? [
        { icon: <User className="h-5 w-5" />, label: '个人中心', href: `/user/${userName}` },
        { icon: <LogOut className="h-5 w-5" />, label: '退出登录', href: '/logout', danger: true },
      ]
    : [
        { icon: <LogIn className="h-5 w-5" />, label: '登录', href: '/login' },
        { icon: <User className="h-5 w-5" />, label: '注册', href: '/register' },
      ];

  return (
    <>
      {/* 汉堡菜单按钮 - 只在移动端显示 */}
      <button
        className="hamburger-touch touch-target lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? '关闭菜单' : '打开菜单'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* 移动导航遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 移动导航菜单 */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-gray-900/95 backdrop-blur-xl border-l border-gray-800/50 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="移动导航菜单"
      >
        {/* 用户信息区域 */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-900">{userLevel}</span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold">{userName}</h3>
              <p className="text-gray-400 text-sm">
                {isAuthenticated ? `等级 ${userLevel}` : '游客模式'}
              </p>
            </div>
          </div>
        </div>

        {/* 导航项区域 */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
          {/* 主导航 */}
          <div className="mb-8">
            <h4 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 px-2">
              导航
            </h4>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`nav-item-touch touch-target flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    item.active
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`${item.active ? 'text-blue-300' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {item.active && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* 用户菜单 */}
          <div className="mb-8">
            <h4 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 px-2">
              账户
            </h4>
            <nav className="space-y-1">
              {userMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`nav-item-touch touch-target flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    item.danger
                      ? 'text-red-300 hover:bg-red-500/20 hover:text-red-200'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={item.danger ? 'text-red-400' : 'text-gray-400'}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 px-2">
              快速链接
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/news/latest"
                className="card-touch touch-target p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center hover:bg-gray-800/50 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-blue-400 mb-1">📰</div>
                <span className="text-sm text-gray-300">最新新闻</span>
              </a>
              <a
                href="/games/top"
                className="card-touch touch-target p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center hover:bg-gray-800/50 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-yellow-400 mb-1">🏆</div>
                <span className="text-sm text-gray-300">热门游戏</span>
              </a>
              <a
                href="/community/hot"
                className="card-touch touch-target p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center hover:bg-gray-800/50 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-green-400 mb-1">🔥</div>
                <span className="text-sm text-gray-300">热门话题</span>
              </a>
              <a
                href="/help"
                className="card-touch touch-target p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center hover:bg-gray-800/50 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-purple-400 mb-1">❓</div>
                <span className="text-sm text-gray-300">帮助中心</span>
              </a>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800/50 bg-gray-900/95">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">GameHub v1.0.0</p>
            <div className="flex justify-center space-x-4">
              <a
                href="/privacy"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                隐私政策
              </a>
              <a
                href="/terms"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                服务条款
              </a>
              <a
                href="/contact"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端底部导航栏 - 只在移动端显示 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`nav-item-touch touch-target flex flex-col items-center justify-center w-full h-full ${
                item.active
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              aria-label={item.label}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-xs font-medium">{item.label}</span>
              {item.active && (
                <div className="absolute top-0 w-12 h-1 bg-blue-400 rounded-b-full" />
              )}
            </a>
          ))}
        </div>
      </div>

      {/* 添加一些样式确保移动端体验 */}
      <style jsx global>{`
        /* 确保移动端触摸友好 */
        @media (max-width: 1024px) {
          .nav-item-touch {
            min-height: 52px;
            min-width: 52px;
          }
          
          .hamburger-touch {
            min-height: 52px;
            min-width: 52px;
          }
          
          /* 防止iOS Safari缩放 */
          input, select, textarea {
            font-size: 16px !important;
          }
          
          /* 优化滚动体验 */
          .mobile-nav-content {
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
          }
        }
        
        /* 汉堡菜单动画 */
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
        
        /* 触摸反馈 */
        .touch-feedback:active {
          transform: scale(0.95);
          opacity: 0.8;
        }
      `}</style>
    </>
  );
};

export default MobileNavigation;