import SEO from '@/components/SEO';
import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import SimpleLayout from '@/components/SimpleLayout';

interface PostDetailPageProps {
  post: any;
  author: any;
  comments: any[];
}

export default function UltraSimplePostDetailPage({ post, author, comments }: PostDetailPageProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // 这里应该调用API提交评论
    console.log('提交评论:', newComment, '回复给:', replyTo);
    setNewComment('');
    setReplyTo(null);
  };

  // 帖子页面结构化数据
  const structuredData = post ? [
    {
      "@context": "https://schema.org",
      "@type": "DiscussionForumPosting",
      "headline": post.title,
      "description": post.content?.substring(0, 200) || `讨论: ${post.title}`,
      "author": author ? {
        "@type": "Person",
        "name": author.displayName || author.username,
        "url": `https://gamehub.com/user/${author.username}`
      } : {
        "@type": "Person",
        "name": "GameHub用户"
      },
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt || post.createdAt,
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": comments.length
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://gamehub.com/community/post/${post.id}`
      }
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
          "name": "社区",
          "item": "https://gamehub.com/community"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `https://gamehub.com/community/post/${post.id}`
        }
      ]
    }
  ] : [];

  return (
    <SimpleLayout>
      <SEO
        title={`${post?.title || '帖子详情'} - GameHub社区`}
        description={post?.content?.substring(0, 160) || `讨论: ${post?.title || '这个帖子'}`}
        keywords={`社区讨论,游戏话题,${post?.tags?.join(', ') || '游戏社区'}`}
        canonical={`https://gamehub.com/community/post/${post?.id}`}
        ogImage={author?.avatar || "https://gamehub.com/default-community-image.jpg"}
        ogType="article"
        structuredData={structuredData}
        author={author?.displayName || author?.username || 'GameHub用户'}
        publishedTime={post?.createdAt}
        modifiedTime={post?.updatedAt || post?.createdAt}
        section="Community Discussion"
        tags={post?.tags || ['社区', '讨论', '游戏']}
      />
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="max-w-4xl mx-auto mb-6">
          <a 
            href="/community" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <span className="mr-2">⬅️</span>
            返回社区
          </a>
        </div>
        
        {/* 帖子内容 */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* 作者信息 */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
              {author.avatar ? (
                <img src={author.avatar} alt={author.displayName || author.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                  {author.displayName?.charAt(0) || author.username?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-bold text-lg">{author.displayName || author.username}</h3>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  等级 {author.level}
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                {formatDate(post.createdAt)}
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <span>⋯</span>
            </button>
          </div>
          
          {/* 帖子标题和内容 */}
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          
          <div className="prose prose-lg max-w-none mb-8">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
          
          {/* 帖子统计和操作 */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">👁️</span>
                <span>{post.views}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">💬</span>
                <span>{comments.length}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">❤️</span>
                <span>{post.likes}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-blue-600">
                <span className="mr-1">👍</span>
                <span>点赞</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-yellow-600">
                <span className="mr-1">🔖</span>
                <span>收藏</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-green-600">
                <span className="mr-1">📤</span>
                <span>分享</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-red-600">
                <span className="mr-1">🚩</span>
                <span>举报</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* 评论区域 */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6">评论 ({comments.length})</h2>
          
          {/* 发表评论 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form onSubmit={handleSubmitComment}>
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">👤</span>
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="写下你的评论..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                  />
                  {replyTo && (
                    <div className="mt-2 text-sm text-gray-500">
                      回复给：{comments.find(c => c.id === replyTo)?.author?.displayName || '用户'}
                      <button 
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newComment.trim()}
                >
                  <span className="mr-2">📨</span>
                  发表评论
                </button>
              </div>
            </form>
          </div>
          
          {/* 评论列表 */}
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg">还没有评论，快来发表第一条评论吧！</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-sm p-6">
                  {/* 评论作者信息 */}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      {comment.author?.avatar ? (
                        <img src={comment.author.avatar} alt={comment.author.displayName || comment.author.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {comment.author?.displayName?.charAt(0) || comment.author?.username?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="font-medium">{comment.author?.displayName || comment.author?.username}</div>
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          等级 {comment.author?.level || 1}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setReplyTo(comment.id)}
                      >
                        <span>💬</span>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <span>⋯</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* 评论内容 */}
                  <p className="text-gray-800 mb-4">{comment.content}</p>
                  
                  {/* 评论操作 */}
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <button className="flex items-center hover:text-blue-600">
                      <span className="mr-1">👍</span>
                      <span>{comment.likes}</span>
                    </button>
                    <button 
                      className="flex items-center hover:text-green-600"
                      onClick={() => setReplyTo(comment.id)}
                    >
                      <span className="mr-1">💬</span>
                      <span>回复</span>
                    </button>
                  </div>
                  
                  {/* 回复列表 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-6 ml-10 space-y-4">
                      {comment.replies.map((reply: any) => (
                        <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
                              {reply.author?.avatar ? (
                                <img src={reply.author.avatar} alt={reply.author.displayName || reply.author.username} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                  {reply.author?.displayName?.charAt(0) || reply.author?.username?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{reply.author?.displayName || reply.author?.username}</div>
                              <div className="text-gray-500 text-xs">
                                {formatDate(reply.createdAt)}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  
  try {
    // 获取帖子详情
    const post = await prisma.forumPost.findUnique({
      where: { id },
    });
    
    if (!post) {
      return {
        notFound: true,
      };
    }
    
    // 获取作者信息
    const author = await prisma.user.findUnique({
      where: { id: post.authorId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        level: true,
        experience: true,
      },
    });
    
    // 获取帖子评论
    const comments = await prisma.comment.findMany({
      where: {
        forumPostId: post.id,
        status: 'APPROVED',
        parentId: null, // 只获取顶级评论
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    // 获取评论作者信息和回复
    const commentsWithDetails = await Promise.all(
      comments.map(async (comment) => {
        const commentAuthor = await prisma.user.findUnique({
          where: { id: comment.authorId },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
          },
        });
        
        // 获取回复
        const replies = await prisma.comment.findMany({
          where: {
            parentId: comment.id,
            status: 'APPROVED',
          },
          orderBy: {
            createdAt: 'asc',
          },
        });
        
        // 获取回复作者信息
        const repliesWithAuthors = await Promise.all(
          replies.map(async (reply) => {
            const replyAuthor = await prisma.user.findUnique({
              where: { id: reply.authorId },
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                level: true,
              },
            });
            return {
              ...reply,
              author: replyAuthor,
            };
          })
        );
        
        return {
          ...comment,
          author: commentAuthor,
          replies: repliesWithAuthors,
        };
      })
    );
    
    // 序列化数据
    return {
      props: {
        post: {
          ...post,
          createdAt: post.createdAt ? post.createdAt.toISOString() : null,
          updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
          lastReplyAt: post.lastReplyAt ? post.lastReplyAt.toISOString() : null,
        },
        author: author ? {
          ...author,
          // lastLoginAt: author.lastLoginAt ? author.lastLoginAt.toISOString() : null,
          // createdAt: author.createdAt ? author.createdAt.toISOString() : null,
          // updatedAt: author.updatedAt ? author.updatedAt.toISOString() : null,
        } : null,
        comments: commentsWithDetails.map(comment => ({
          ...comment,
          createdAt: comment.createdAt ? comment.createdAt.toISOString() : null,
          updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : null,
          replies: comment.replies.map(reply => ({
            ...reply,
            createdAt: reply.createdAt ? reply.createdAt.toISOString() : null,
            updatedAt: reply.updatedAt ? reply.updatedAt.toISOString() : null,
          })),
        })),
      },
    };
    
  } catch (error) {
    console.error('获取帖子详情错误:', error);
    return {
      notFound: true,
    };
  }
};