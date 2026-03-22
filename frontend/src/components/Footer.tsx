import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* 隐藏的h1标题用于SEO完整性 */}
      <h1 className="sr-only">GameHub - 专业的游戏资讯平台</h1>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <section className="md:col-span-1" aria-labelledby="footer-about">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded" aria-hidden="true"></div>
              <span className="text-xl font-bold">GameHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              专业的游戏资讯平台，提供最新游戏新闻、评测、攻略和社区讨论。
            </p>
          </section>

          {/* Quick Links */}
          <nav aria-labelledby="footer-quick-links">
            <h3 id="footer-quick-links" className="text-lg font-bold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li><Link href="/news" className="text-gray-400 hover:text-white">新闻</Link></li>
              <li><Link href="/reviews" className="text-gray-400 hover:text-white">评测</Link></li>
              <li><Link href="/guides" className="text-gray-400 hover:text-white">攻略</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-white">游戏库</Link></li>
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-labelledby="footer-categories">
            <h3 id="footer-categories" className="text-lg font-bold mb-4">游戏分类</h3>
            <ul className="space-y-2">
              <li><Link href="/category/action" className="text-gray-400 hover:text-white">动作游戏</Link></li>
              <li><Link href="/category/rpg" className="text-gray-400 hover:text-white">角色扮演</Link></li>
              <li><Link href="/category/strategy" className="text-gray-400 hover:text-white">策略游戏</Link></li>
              <li><Link href="/category/sports" className="text-gray-400 hover:text-white">体育游戏</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <address aria-labelledby="footer-contact">
            <h3 id="footer-contact" className="text-lg font-bold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@gamehub.com</li>
              <li className="text-gray-400">+86 400-123-4567</li>
              <li className="text-gray-400">周一至周五 9:00-18:00</li>
            </ul>
          </address>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© 2024 GameHub. 保留所有权利。</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-white">隐私政策</Link>
            <span className="mx-2">•</span>
            <Link href="/terms" className="hover:text-white">服务条款</Link>
            <span className="mx-2">•</span>
            <Link href="/sitemap" className="hover:text-white">网站地图</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}