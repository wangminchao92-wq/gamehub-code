import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Eye, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  ThumbsUp,
  ArrowLeft,
  Tag,
  Clock
} from 'lucide-react';

// 模拟新闻详情数据
const newsDetail = {
  id: 1,
  title: '赛博朋克2077：往日之影DLC获得年度最佳扩展包奖',
  content: `
    <p>在刚刚结束的2026年度游戏大奖颁奖典礼上，CD Projekt Red的《赛博朋克2077：往日之影》DLC荣获年度最佳扩展包奖，这是对该DLC卓越品质的肯定。</p>
    
    <h2>DLC内容深度解析</h2>
    <p>《往日之影》DLC为《赛博朋克2077》带来了全新的故事线、角色和游戏机制。玩家将深入夜之城的政治阴谋中，体验更加成熟的叙事风格和更加丰富的角色塑造。</p>
    
    <p>DLC的主要亮点包括：</p>
    <ul>
      <li>全新的狗镇区域，面积达到原游戏区域的30%</li>
      <li>超过20小时的主线剧情内容</li>
      <li>全新的技能树和装备系统</li>
      <li>改进的战斗AI和敌人行为</li>
      <li>增强的画面效果和性能优化</li>
    </ul>
    
    <h2>玩家和媒体评价</h2>
    <p>自发布以来，《往日之影》DLC获得了玩家和媒体的一致好评。在Metacritic上，该DLC获得了92分的高分，用户评分也达到了8.9分。</p>
    
    <p>知名游戏媒体IGN给出了9.5分的评价，称其为"CD Projekt Red的救赎之作，重新定义了扩展包的可能性"。</p>
    
    <h2>技术改进和优化</h2>
    <p>除了丰富的内容，DLC还带来了显著的技术改进：</p>
    <ul>
      <li>光线追踪性能提升40%</li>
      <li>加载时间缩短60%</li>
      <li>内存使用优化，减少崩溃问题</li>
      <li>更好的手柄支持和辅助功能</li>
    </ul>
    
    <p>CD Projekt Red表示，他们将继续支持《赛博朋克2077》，未来还将推出更多免费更新和付费内容。</p>
  `,
  category: '新闻',
  date: '2026-03-19',
  author: 'GameHub编辑',
  authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
  views: '12.4K',
  comments: 342,
  likes: '2.1K',
  readingTime: '8分钟',
  image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  tags: ['赛博朋克2077', 'CD Projekt Red', 'DLC', '年度游戏', '角色扮演'],
};

// 相关新闻
const relatedNews = [
  {
    id: 2,
    title: '艾尔登法环：黄金树之影DLC正式发售日期公布',
    category: '新闻',
    date: '2026-03-18',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w-400&q=80',
  },
  {
    id: 3,
    title: '2026年最值得期待的10款游戏DLC',
    category: '盘点',
    date: '2026-03-17',
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    title: '游戏DLC商业模式的发展与变革',
    category: '分析',
    date: '2026-03-16',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
  },
];

// 评论数据
const comments = [
  {
    id: 1,
    user: '游戏爱好者',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    content: '这个DLC确实很棒，剧情和游戏性都有很大提升！',
    time: '2小时前',
    likes: 42,
    replies: 3,
  },
  {
    id: 2,
    user: '夜之城居民',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80',
    content: 'CDPR这次真的用心了，希望继续保持这个水准。',
    time: '3小时前',
    likes: 28,
    replies: 1,
  },
  {
    id: 3,
    user: 'RPG玩家',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80',
    content: '20小时的主线内容太良心了，比很多独立游戏都丰富。',
    time: '5小时前',
    likes: 56,
    replies: 0,
  },
];

export default function NewsDetailPage() {
  return (
    <MainLayout>
      {/* 返回按钮 */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/news" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          返回新闻列表
        </Link>
      </div>

      {/* 文章头部 */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 分类和元信息 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 text-sm font-bold bg-primary-500 text-white rounded-full">
                {newsDetail.category}
              </span>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {newsDetail.readingTime}
              </div>
            </div>
            <div className="text-sm text-gray-400">{newsDetail.date}</div>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {newsDetail.title}
          </h1>

          {/* 作者和统计信息 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img
                src={newsDetail.authorAvatar}
                alt={newsDetail.author}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-medium text-white">{newsDetail.author}</div>
                <div className="text-sm text-gray-400">GameHub资深编辑</div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {newsDetail.views}
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {newsDetail.comments}
              </div>
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {newsDetail.likes}
              </div>
            </div>
          </div>

          {/* 特色图片 */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
            <div 
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${newsDetail.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </div>

          {/* 文章内容 */}
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: newsDetail.content }} />
          </div>

          {/* 标签 */}
          <div className="flex items-center mb-12">
            <Tag className="h-5 w-5 text-gray-400 mr-2" />
            <div className="flex flex-wrap gap-2">
              {newsDetail.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-800/50 text-gray-300 rounded-full hover:bg-primary-500/20 hover:text-primary-300 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 互动按钮 */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-800 mb-12">
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
                <ThumbsUp className="h-5 w-5 mr-2" />
                点赞 ({newsDetail.likes})
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
                <Bookmark className="h-5 w-5 mr-2" />
                收藏
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
                <Share2 className="h-5 w-5 mr-2" />
                分享
              </button>
            </div>
            <div className="text-sm text-gray-400">
              最后更新: {newsDetail.date}
            </div>
          </div>

          {/* 相关新闻 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">相关新闻</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((news) => (
                <Link key={news.id} href={`/news/${news.id}`}>
                  <div className="group cursor-pointer">
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:border-primary-500/30 transition-colors overflow-hidden">
                      <div className="relative h-40 overflow-hidden">
                        <div 
                          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${news.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs font-bold bg-primary-500 text-white rounded">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
                          {news.title}
                        </h3>
                        <div className="text-xs text-gray-400">{news.date}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 评论区域 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">评论 ({newsDetail.comments})</h2>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                发表评论
              </button>
            </div>

            {/* 评论输入框 */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 mb-8">
              <textarea
                placeholder="写下你的评论..."
                className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-4">
                <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  提交评论
                </button>
              </div>
            </div>

            {/* 评论列表 */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                  <div className="flex items-start mb-4">
                    <img
                      src={comment.avatar}
                      alt={comment.user}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-white">{comment.user}</div>
                          <div className="text-sm text-gray-400">{comment.time}</div>
                        </div>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <ThumbsUp className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-gray-300 mb-3">{comment.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <button className="hover:text-white transition-colors">
                          回复 ({comment.replies})
                        </button>
                        <button className="hover:text-white transition-colors">
                          点赞 ({comment.likes})
                        </button>
                        <button className="hover:text-white transition-colors">
                          分享
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 查看更多评论 */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors">
                加载更多评论
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}