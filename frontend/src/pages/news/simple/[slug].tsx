import React from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import SEO from '@/components/SEO';
import Layout from '@/components/SimpleLayout';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Eye, Heart, Share2, User, Tag, MessageSquare } from 'lucide-react';

interface ArticleDetailPageProps {
  article: any | null;
  author: any | null;
  comments: any[];
  relatedArticles: any[];
}

export default function SimpleArticleDetailPage({ article, author, comments, relatedArticles }: ArticleDetailPageProps) {
  if (!article) {
    return (
      <Layout>
        <SEO title="文章未找到" description="请求的文章不存在或已被删除" />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">文章未找到</h1>
          <p className="text-gray-600 mb-8">抱歉，您请求的文章不存在或已被删除。</p>
          <a href="/news" className="btn btn-primary">返回新闻列表</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={article.title}
        description={article.excerpt || article.content.substring(0, 150)}
        ogImage={article.coverImage}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 文章头部 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {article.type === 'REVIEW' ? '评测' : 
               article.type === 'NEWS' ? '新闻' : 
               article.type === 'GUIDE' ? '指南' : '文章'}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            {author && (
              <div className="flex items-center mr-6">
                <User className="w-4 h-4 mr-2" />
                <span>{author.displayName || author.username}</span>
              </div>
            )}
            <div className="flex items-center mr-6">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(new Date(article.publishedAt || article.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}</span>
            </div>
            <div className="flex items-center mr-6">
              <Eye className="w-4 h-4 mr-2" />
              <span>{article.views} 浏览</span>
            </div>
            {article.rating && (
              <div className="flex items-center">
                <div className="text-yellow-500 font-bold">{article.rating.toFixed(1)}</div>
                <div className="ml-1 text-gray-500">/10</div>
              </div>
            )}
          </div>
          
          {article.coverImage && (
            <div className="mb-8">
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
        
        {/* 文章内容 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
          </div>
          
          {/* 操作栏 */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <div className="flex space-x-4">
              <button className="flex items-center text-gray-600 hover:text-red-500">
                <Heart className="w-5 h-5 mr-2" />
                <span>{article.likes}</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>{comments.length}</span>
              </button>
            </div>
            <button className="flex items-center text-gray-600 hover:text-green-500">
              <Share2 className="w-5 h-5 mr-2" />
              <span>分享</span>
            </button>
          </div>
        </div>
        
        {/* 作者信息 */}
        {author && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <img 
                  src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`}
                  alt={author.displayName || author.username}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold">{author.displayName || author.username}</h3>
                  <p className="text-gray-600">{author.bio || 'GameHub用户'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{author.level}</div>
                  <div className="text-gray-600 text-sm">等级</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{author.experience}</div>
                  <div className="text-gray-600 text-sm">经验值</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{author.points}</div>
                  <div className="text-gray-600 text-sm">积分</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 评论区域 */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6">评论 ({comments.length})</h2>
          
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              还没有评论，快来发表你的看法吧！
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <img 
                      src={comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username}`}
                      alt={comment.author?.displayName || comment.author?.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium">{comment.author?.displayName || comment.author?.username}</div>
                      <div className="text-gray-500 text-sm">
                        {format(new Date(comment.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-800">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 相关文章 */}
        {relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <a 
                  key={related.id} 
                  href={`/news/${related.slug}`}
                  className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {related.coverImage && (
                    <img 
                      src={related.coverImage} 
                      alt={related.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{related.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span>{related.author?.displayName || related.author?.username}</span>
                      <span className="mx-2">•</span>
                      <span>{format(new Date(related.publishedAt), 'MM/dd', { locale: zhCN })}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// 简单的Markdown格式化函数
function formatContent(content: string): string {
  return content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  
  try {
    // 获取文章详情
    const article = await prisma.article.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED',
      },
    });
    
    if (!article) {
      return {
        notFound: true,
      };
    }
    
    // 获取作者信息
    const author = await prisma.user.findUnique({
      where: { id: article.authorId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        level: true,
        experience: true,
        points: true,
      },
    });
    
    // 获取文章评论
    const comments = await prisma.comment.findMany({
      where: {
        articleId: article.id,
        status: 'APPROVED',
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // 获取评论作者信息
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const commentAuthor = await prisma.user.findUnique({
          where: { id: comment.authorId },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        });
        return {
          ...comment,
          author: commentAuthor,
        };
      })
    );
    
    // 获取相关文章
    const relatedArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        type: article.type,
        NOT: {
          id: article.id,
        },
      },
      take: 3,
      orderBy: {
        publishedAt: 'desc',
      },
    });
    
    // 获取相关文章作者信息
    const relatedArticlesWithAuthors = await Promise.all(
      relatedArticles.map(async (relatedArticle) => {
        const relatedAuthor = await prisma.user.findUnique({
          where: { id: relatedArticle.authorId },
          select: {
            username: true,
            displayName: true,
            avatar: true,
          },
        });
        return {
          ...relatedArticle,
          author: relatedAuthor,
        };
      })
    );
    
    // 序列化数据
    return {
      props: {
        article: article ? {
          ...article,
          publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
          createdAt: article.createdAt ? article.createdAt.toISOString() : null,
          updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null,
        } : null,
        author: author ? {
          ...author,
          // lastLoginAt: author.lastLoginAt ? author.lastLoginAt.toISOString() : null,
          // createdAt: author.createdAt ? author.createdAt.toISOString() : null,
          // updatedAt: author.updatedAt ? author.updatedAt.toISOString() : null,
        } : null,
        comments: commentsWithAuthors.map(comment => ({
          ...comment,
          createdAt: comment.createdAt ? comment.createdAt.toISOString() : null,
          updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : null,
        })),
        relatedArticles: relatedArticlesWithAuthors.map(article => ({
          ...article,
          publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
        })),
      },
    };
    
  } catch (error) {
    console.error('获取文章详情错误:', error);
    return {
      notFound: true,
    };
  }
};