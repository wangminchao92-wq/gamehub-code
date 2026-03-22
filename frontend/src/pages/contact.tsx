import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '@/components/SEO';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    // 模拟表单提交
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitResult({
        success: true,
        message: '感谢您的联系！我们会尽快回复您。'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <>
      <SEO
        title="联系我们 - GameHub游戏社区"
        description="有任何问题或建议？欢迎通过以下方式联系我们。我们致力于为游戏爱好者提供最好的社区体验。"
        keywords="联系GameHub,技术支持,反馈建议,合作咨询,游戏社区联系"
        ogImage="/og-contact.jpg"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* 导航栏 */}
        <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
                GameHub
              </Link>
              <div className="flex space-x-6">
                <Link href="/" className="hover:text-blue-300 transition-colors">首页</Link>
                <Link href="/news" className="hover:text-blue-300 transition-colors">新闻</Link>
                <Link href="/community" className="hover:text-blue-300 transition-colors">社区</Link>
                <Link href="/guides" className="hover:text-blue-300 transition-colors">指南</Link>
                <Link href="/about" className="hover:text-blue-300 transition-colors">关于</Link>
                <Link href="/contact" className="text-blue-300 font-medium">联系</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* 标题部分 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                联系我们
              </h1>
              <p className="text-xl text-gray-300">
                有任何问题或建议？我们随时为您服务
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 联系表单 */}
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-blue-300">发送消息</h2>
                
                {submitResult && (
                  <div className={`mb-6 p-4 rounded-lg ${submitResult.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                    <div className="flex items-center">
                      <div className={`mr-3 ${submitResult.success ? 'text-green-400' : 'text-red-400'}`}>
                        {submitResult.success ? '✅' : '❌'}
                      </div>
                      <div>{submitResult.message}</div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="请输入您的姓名"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="请输入您的邮箱地址"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      主题 *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">请选择主题</option>
                      <option value="technical">技术支持</option>
                      <option value="feedback">功能建议</option>
                      <option value="bug">问题报告</option>
                      <option value="partnership">合作咨询</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      消息内容 *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="请详细描述您的问题或建议..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${isSubmitting ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        发送中...
                      </div>
                    ) : (
                      '发送消息'
                    )}
                  </button>
                </form>
              </div>

              {/* 联系信息 */}
              <div className="space-y-8">
                {/* 联系卡片 */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 text-blue-300">联系信息</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-blue-900/30 p-3 rounded-lg mr-4">
                        <div className="text-blue-400 text-xl">📧</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">邮箱联系</h3>
                        <p className="text-gray-300">support@gamehub.com</p>
                        <p className="text-gray-400 text-sm mt-1">技术支持与一般咨询</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-purple-900/30 p-3 rounded-lg mr-4">
                        <div className="text-purple-400 text-xl">💬</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">社区支持</h3>
                        <p className="text-gray-300">访问社区论坛</p>
                        <p className="text-gray-400 text-sm mt-1">与其他用户交流，获取社区帮助</p>
                        <Link href="/community" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                          前往社区 →
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-900/30 p-3 rounded-lg mr-4">
                        <div className="text-green-400 text-xl">📋</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">问题反馈</h3>
                        <p className="text-gray-300">GitHub Issues</p>
                        <p className="text-gray-400 text-sm mt-1">报告Bug或提交功能请求</p>
                        <a 
                          href="https://github.com/wangminchao92-wq/gamehub-code/issues" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                        >
                          查看Issues →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 常见问题 */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 text-blue-300">常见问题</h2>
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-700 pb-4">
                      <h3 className="font-bold text-lg mb-2 text-gray-200">如何注册账号？</h3>
                      <p className="text-gray-300">
                        点击右上角的"注册"按钮，填写邮箱和密码即可完成注册。支持GitHub和Google快速登录。
                      </p>
                    </div>

                    <div className="border-b border-gray-700 pb-4">
                      <h3 className="font-bold text-lg mb-2 text-gray-200">如何发布内容？</h3>
                      <p className="text-gray-300">
                        登录后，在社区页面点击"发布新帖"按钮，使用富文本编辑器创建内容。
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-200">如何解锁成就？</h3>
                      <p className="text-gray-300">
                        参与社区活动、发布内容、与其他用户互动等行为会自动解锁相应成就。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 响应时间 */}
                <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-800">
                  <div className="flex items-center">
                    <div className="text-blue-400 text-2xl mr-4">⏱️</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">响应时间承诺</h3>
                      <p className="text-gray-300">
                        我们承诺在24小时内回复所有咨询邮件，社区问题将在48小时内得到解答。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 地图/位置信息 */}
            <div className="mt-12 bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-blue-300">我们的位置</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <div className="text-yellow-400 text-2xl mb-3">📍</div>
                  <h3 className="font-bold text-lg mb-2">开发团队</h3>
                  <p className="text-gray-300">中国 · 上海</p>
                  <p className="text-gray-400 text-sm mt-2">远程协作开发团队</p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <div className="text-green-400 text-2xl mb-3">🌐</div>
                  <h3 className="font-bold text-lg mb-2">服务范围</h3>
                  <p className="text-gray-300">全球用户</p>
                  <p className="text-gray-400 text-sm mt-2">支持多语言和多时区</p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <div className="text-purple-400 text-2xl mb-3">🕒</div>
                  <h3 className="font-bold text-lg mb-2">服务时间</h3>
                  <p className="text-gray-300">7×24小时</p>
                  <p className="text-gray-400 text-sm mt-2">自动化服务与人工支持结合</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 页脚 */}
        <footer className="bg-gray-900 border-t border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="text-2xl font-bold text-blue-400">GameHub</div>
                <div className="text-gray-400 mt-2">专业的游戏社区平台</div>
              </div>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">首页</Link>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">新闻</Link>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors">社区</Link>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">关于</Link>
                <Link href="/contact" className="text-blue-300">联系</Link>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>© 2026 GameHub. 保留所有权利。</p>
              <p className="mt-2">由云霞飞002开发，王先生指导。</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}