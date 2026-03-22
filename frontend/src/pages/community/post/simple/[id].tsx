import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import SEO from '@/components/SEO';
import Layout from '@/components/SimpleLayout';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  User, Calendar, Eye, Heart, MessageSquare, 
  Share2, ArrowLeft, MoreVertical, Send,
  ThumbsUp, Flag, Bookmark
} from 'lucide-react';

interface PostDetailPageProps {
  post: any;
  author: any;
  comments: any[];
}

export default function SimplePostDetailPage({ post, author, comments }: PostDetailPageProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // 这里应该调用API提交评论
    console.log('提交评论:', newComment, '回复给:', replyTo);
    setNewComment('');
    setReplyTo(null);
  };

  return (
    <Layout>
      <SEO 
        title={post.title}
        description={post.content.substring(0, 150)}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="max-w-4xl mx-auto mb-6">
          <a 
            href="/community" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回社区
          </a>
        </div>
        
        {/* 帖子内容 */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* 作者信息 */}
          <div className="flex items-center mb-6">
            <img 
              src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`}
              alt={author.displayName || author.username}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-bold text-lg">{author.displayName || author.username}</h3>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  等级 {author.level}
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                {format(new Date(post.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
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
                <Eye className="w-4 h-4 mr-2" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>{comments.length}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                <span>{post.likes}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-blue-600">
                <ThumbsUp className="w-5 h-5 mr-1" />
                <span>点赞</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-yellow-600">
                <Bookmark className="w-5 h-5 mr-1" />
                <span>收藏</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-green-600">
                <Share2 className="w-5 h-5 mr-1" />
                <span>分享</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-red-600">
                <Flag className="w-5 h-5 mr-1" />
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
                    <User className="w-5 h-5 text-gray-500" />
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
                  <Send className="w-4 h-4 mr-2" />
                  发表评论
                </button>
              </div>
            </form>
          </div>
          
          {/* 评论列表 */}
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">还没有评论，快来发表第一条评论吧！</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-sm p-6">
                  {/* 评论作者信息 */}
                  <div className="flex items-center mb-4">
                    <img 
                      src={comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username}`}
                      alt={comment.author?.displayName || comment.author?.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="font-medium">{comment.author?.displayName || comment.author?.username}</div>
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          等级 {comment.author?.level || 1}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {format(new Date(comment.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setReplyTo(comment.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* 评论内容 */}
                  <p className="text-gray-800 mb-4">{comment.content}</p>
                  
                  {/* 评论操作 */}
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <button className="flex items-center hover:text-blue-600">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span>{comment.likes}</span>
                    </button>
                    <button 
                      className="flex items-center hover:text-green-600"
                      onClick={() => setReplyTo(comment.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>回复</span>
                    </button>
                  </div>
                  
                  {/* 回复列表 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-6 ml-10 space-y-4">
                      {comment.replies.map((reply: any) => (
                        <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <img 
                              src={reply.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author?.username}`}
                              alt={reply.author?.displayName || reply.author?.username}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{reply.author?.displayName || reply.author?.username}</div>
                              <div className="text-gray-500 text-xs">
                                {format(new Date(reply.createdAt), 'MM/dd HH:mm', { locale: zhCN })}
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
    </Layout>
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