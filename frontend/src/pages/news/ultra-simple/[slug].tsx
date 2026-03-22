import SEO from '@/components/SEO';
import React from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import SimpleLayout from '@/components/SimpleLayout';
import OptimizedImage from '@/components/OptimizedImage';
import LazyLoadWrapper from '@/components/LazyLoadWrapper';

interface ArticleDetailPageProps {
  article: any | null;
  author: any | null;
  comments: any[];
}

export default function UltraSimpleArticleDetailPage({ article, author, comments }: ArticleDetailPageProps) {
  if (!article) {
    return (
      <SimpleLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">文章未找到</h1>
          <p className="text-gray-600 mb-8">抱歉，您请求的文章不存在或已被删除。</p>
          <a href="/news" className="btn-touch touch-target btn btn-primary">返回新闻列表</a>
        </div>
      </SimpleLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 文章页面结构化数据
  const structuredData = article ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt || `阅读${article.title}的完整内容`,
      "image": article.coverImage || "https://gamehub.com/default-article-image.jpg",
      "author": author ? {
        "@type": "Person",
        "name": author.displayName || author.username,
        "url": `https://gamehub.com/user/${author.username}`
      } : {
        "@type": "Person",
        "name": "GameHub"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GameHub",
        "logo": {
          "@type": "ImageObject",
          "url": "https://gamehub.com/logo.png"
        }
      },
      "datePublished": article.createdAt,
      "dateModified": article.updatedAt || article.createdAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://gamehub.com/news/${article.slug}`
      },
      "articleSection": article.type === 'REVIEW' ? '游戏评测' : 
                        article.type === 'NEWS' ? '游戏新闻' : 
                        article.type === 'GUIDE' ? '游戏指南' : '游戏文章'
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首页",
          "item": "https://gamehub.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "新闻",
          "item": "https://gamehub.com/news"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `https://gamehub.com/news/${article.slug}`
        }
      ]
    }
  ] : [];

  return (
    <SimpleLayout>
      <SEO
        title={`${article?.title || '文章详情'} - GameHub`}
        description={article?.excerpt || `阅读${article?.title || '这篇文章'}的完整内容`}
        keywords={article?.tags?.join(', ') || '游戏,新闻,评测,指南'}
        canonical={`https://gamehub.com/news/${article?.slug}`}
        ogImage={article?.coverImage || "https://gamehub.com/default-article-image.jpg"}
        ogType="article"
        structuredData={structuredData}
        author={author?.displayName || author?.username || 'GameHub'}
        publishedTime={article?.createdAt}
        modifiedTime={article?.updatedAt || article?.createdAt}
        section={article?.type === 'REVIEW' ? '游戏评测' : 
                article?.type === 'NEWS' ? '游戏新闻' : 
                article?.type === 'GUIDE' ? '游戏指南' : '游戏文章'}
        tags={article?.tags || ['游戏']}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 文章头部 */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              {article.type === 'REVIEW' ? '评测' : 
               article.type === 'NEWS' ? '新闻' : 
               article.type === 'GUIDE' ? '指南' : '文章'}
            </span>
            
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              {author && (
                <div className="flex items-center mr-6">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                    {author.avatar ? (
                      <OptimizedImage 
                        src={author.avatar} 
                        alt={author.displayName || author.username}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {author.displayName?.charAt(0) || author.username?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <span>{author.displayName || author.username}</span>
                </div>
              )}
              <div className="mr-6">
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <div className="mr-6">
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
              <LazyLoadWrapper 
                placeholder={
                  <div className="mb-8 w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                }
              >
                <div className="mb-8">
                  <OptimizedImage 
                    src={article.coverImage} 
                    alt={article.title}
                    width={1200}
                    height={675}
                    className="w-full h-auto rounded-lg shadow-lg"
                    priority={true}
                  />
                </div>
              </LazyLoadWrapper>
            )}
          </div>
          
          {/* 文章内容 */}
          <div className="mb-12">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
            </div>
            
            {/* 操作栏 */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t">
              <div className="flex space-x-4">
                <button className="btn-touch touch-target flex items-center text-gray-600 hover:text-red-500">
                  <span className="mr-2">❤️</span>
                  <span>{article.likes}</span>
                </button>
                <button className="btn-touch touch-target flex items-center text-gray-600 hover:text-blue-500">
                  <span className="mr-2">💬</span>
                  <span>{comments.length}</span>
                </button>
              </div>
              <button className="btn-touch touch-target flex items-center text-gray-600 hover:text-green-500">
                <span className="mr-2">📤</span>
                <span>分享</span>
              </button>
            </div>
          </div>
          
          {/* 作者信息 */}
          {author && (
            <div className="mb-12">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
                    {author.avatar ? (
                      <OptimizedImage 
                        src={author.avatar} 
                        alt={author.displayName || author.username}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                        {author.displayName?.charAt(0) || author.username?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
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
          <div className="mb-12">
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
                      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                        {comment.author?.avatar ? (
                          <OptimizedImage 
                            src={comment.author.avatar} 
                            alt={comment.author.displayName || comment.author.username}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {comment.author?.displayName?.charAt(0) || comment.author?.username?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{comment.author?.displayName || comment.author?.username}</div>
                        <div className="text-gray-500 text-sm">
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SimpleLayout>
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
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
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
      },
    };
    
  } catch (error) {
    console.error('获取文章详情错误:', error);
    return {
      notFound: true,
    };
  }
};