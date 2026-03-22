import React from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import SEO from '@/components/SEO';

interface TestPageProps {
  users: any[];
  articles: any[];
  posts: any[];
  comments: any[];
  error?: string;
}

export default function TestDBPage({ users, articles, posts, comments, error }: TestPageProps) {
  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>❌ 数据库测试失败</h1>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="数据库测试页面 - GameHub"
        description="GameHub数据库连接测试页面"
        keywords="数据库测试,连接测试,开发工具"
        canonical="https://gamehub.com/test-db"
        noindex={true}
        nofollow={true}
        robots="noindex, nofollow"
        author="GameHub"
        section="Testing"
        tags={["test", "database", "development", "debugging"]}
      />
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>✅ 数据库测试成功</h1>
      
      <h2>用户 ({users.length})</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email} (等级: {user.level})
          </li>
        ))}
      </ul>
      
      <h2>文章 ({articles.length})</h2>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            {article.title} - {article.type} (浏览: {article.views})
          </li>
        ))}
      </ul>
      
      <h2>帖子 ({posts.length})</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.title} (回复: {post.replies})
          </li>
        ))}
      </ul>
      
      <h2>评论 ({comments.length})</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            {comment.content.substring(0, 50)}...
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // 测试所有表的查询
    const users = await prisma.user.findMany({ take: 5 });
    const articles = await prisma.article.findMany({ take: 5 });
    const posts = await prisma.forumPost.findMany({ take: 5 });
    const comments = await prisma.comment.findMany({ take: 5 });
    
    // 序列化数据
    return {
      props: {
        users: users.map(user => ({
          ...user,
          lastLoginAt: user.lastLoginAt?.toISOString() || null,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        })),
        articles: articles.map(article => ({
          ...article,
          publishedAt: article.publishedAt?.toISOString() || null,
          createdAt: article.createdAt.toISOString(),
          updatedAt: article.updatedAt.toISOString(),
        })),
        posts: posts.map(post => ({
          ...post,
          lastReplyAt: post.lastReplyAt?.toISOString() || null,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        })),
        comments: comments.map(comment => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
        })),
      },
    };
  } catch (error: any) {
    console.error('数据库测试错误:', error);
    return {
      props: {
        users: [],
        articles: [],
        posts: [],
        comments: [],
        error: error.message,
      },
    };
  }
};