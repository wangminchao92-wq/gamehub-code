import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import SEO from '@/components/SEO';
import Layout from '@/components/SimpleLayout';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  User, Calendar, Eye, Heart, MessageSquare, 
  Gamepad2, Trophy, Star, Settings, Edit,
  BookOpen, FileText, Users, Heart as HeartIcon
} from 'lucide-react';

interface UserProfilePageProps {
  user: any;
  articles: any[];
  forumPosts: any[];
  recentActivity: any[];
}

export default function SimpleUserProfilePage({ user, articles, forumPosts, recentActivity }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'posts' | 'activity'>('articles');

  return (
    <Layout>
      <SEO 
        title={`${user.displayName || user.username} - GameHub用户`}
        description={user.bio || `GameHub用户 ${user.displayName || user.username} 的个人主页`}
        ogImage={user.avatar}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 用户头部信息 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg h-32"></div>
          
          <div className="bg-white rounded-b-lg p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center -mt-16">
              <div className="mb-4 md:mb-0 md:mr-6">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.displayName || user.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{user.displayName || user.username}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <button className="btn btn-primary">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      私信
                    </button>
                    <button className="btn btn-outline">
                      <Users className="w-4 h-4 mr-2" />
                      关注
                    </button>
                    <button className="btn btn-ghost">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{user.bio || '这个用户还没有个人简介'}</p>
                
                {/* 用户统计 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user._count?.articles || 0}</div>
                    <div className="text-gray-600 text-sm">文章</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user._count?.forumPosts || 0}</div>
                    <div className="text-gray-600 text-sm">帖子</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user._count?.comments || 0}</div>
                    <div className="text-gray-600 text-sm">评论</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.level}</div>
                    <div className="text-gray-600 text-sm">等级</div>
                  </div>
                </div>
                
                {/* 等级进度 */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>等级 {user.level}</span>
                    <span>{user.experience} / {user.level * 1000} 经验</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(user.experience / (user.level * 1000)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 标签页导航 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="border-b">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'articles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('articles')}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                文章 ({articles.length})
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('posts')}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                帖子 ({forumPosts.length})
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('activity')}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                动态 ({recentActivity.length})
              </button>
            </nav>
          </div>
        </div>
        
        {/* 标签页内容 */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'articles' && (
            <div>
              {articles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">还没有发表过文章</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <a 
                      key={article.id} 
                      href={`/news/${article.slug}`}
                      className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {article.coverImage && (
                        <img 
                          src={article.coverImage} 
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-gray-500 text-sm">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            <span>{article.views}</span>
                            <HeartIcon className="w-3 h-3 ml-3 mr-1" />
                            <span>{article.likes}</span>
                          </div>
                          <span>{format(new Date(article.publishedAt), 'MM/dd', { locale: zhCN })}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'posts' && (
            <div>
              {forumPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">还没有发表过帖子</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {forumPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between text-gray-500 text-sm">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{post.views}</span>
                          <MessageSquare className="w-3 h-3 ml-3 mr-1" />
                          <span>{post.replies}</span>
                          <HeartIcon className="w-3 h-3 ml-3 mr-1" />
                          <span>{post.likes}</span>
                        </div>
                        <span>{format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div>
              {recentActivity.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">还没有任何动态</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-medium">{user.displayName || user.username}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">
                              {format(new Date(activity.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{activity.content}</p>
                          {activity.article && (
                            <a 
                              href={`/news/${activity.article.slug}`}
                              className="inline-block text-blue-600 hover:text-blue-800 text-sm"
                            >
                              查看文章：{activity.article.title}
                            </a>
                          )}
                          {activity.forumPost && (
                            <a 
                              href={`/community/post/${activity.forumPost.id}`}
                              className="inline-block text-blue-600 hover:text-blue-800 text-sm"
                            >
                              查看帖子：{activity.forumPost.title}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params as { username: string };
  
  try {
    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { username },
    });
    
    if (!user) {
      return {
        notFound: true,
      };
    }
    
    // 获取用户文章
    const articles = await prisma.article.findMany({
      where: {
        authorId: user.id,
        status: 'PUBLISHED',
      },
      take: 6,
      orderBy: {
        publishedAt: 'desc',
      },
    });
    
    // 获取用户帖子
    const forumPosts = await prisma.forumPost.findMany({
      where: {
        authorId: user.id,
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // 获取用户评论
    const comments = await prisma.comment.findMany({
      where: {
        authorId: user.id,
        status: 'APPROVED',
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // 获取评论相关的文章和帖子信息
    const recentActivity = await Promise.all(
      comments.map(async (comment) => {
        let article = null;
        let forumPost = null;
        
        if (comment.articleId) {
          article = await prisma.article.findUnique({
            where: { id: comment.articleId },
            select: {
              id: true,
              title: true,
              slug: true,
            },
          });
        }
        
        if (comment.forumPostId) {
          forumPost = await prisma.forumPost.findUnique({
            where: { id: comment.forumPostId },
            select: {
              id: true,
              title: true,
            },
          });
        }
        
        return {
          ...comment,
          article,
          forumPost,
        };
      })
    );
    
    // 统计数量
    const articleCount = await prisma.article.count({
      where: { authorId: user.id },
    });
    
    const forumPostCount = await prisma.forumPost.count({
      where: { authorId: user.id },
    });
    
    const commentCount = await prisma.comment.count({
      where: { authorId: user.id },
    });
    
    // 序列化数据
    return {
      props: {
        user: {
          ...user,
          lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
          createdAt: user.createdAt ? user.createdAt.toISOString() : null,
          updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
          _count: {
            articles: articleCount,
            forumPosts: forumPostCount,
            comments: commentCount,
          },
        },
        articles: articles.map(article => ({
          ...article,
          publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
        })),
        forumPosts: forumPosts.map(post => ({
          ...post,
          createdAt: post.createdAt ? post.createdAt.toISOString() : null,
          updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
        })),
        recentActivity: recentActivity.map(activity => ({
          ...activity,
          createdAt: activity.createdAt ? activity.createdAt.toISOString() : null,
          updatedAt: activity.updatedAt ? activity.updatedAt.toISOString() : null,
        })),
      },
    };
    
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return {
      notFound: true,
    };
  }
};