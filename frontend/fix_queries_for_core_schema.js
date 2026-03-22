#!/usr/bin/env node

/**
 * 修复动态页面查询，适配核心schema
 * 核心schema没有关联关系，需要单独查询
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复动态页面查询（适配核心schema）...\n');

// 1. 修复文章详情页
console.log('1. 修复文章详情页查询...');
const articlePagePath = path.join(__dirname, 'src/pages/news/[slug].tsx');
let articleContent = fs.readFileSync(articlePagePath, 'utf8');

// 替换整个getServerSideProps
const articleSSRRegex = /export const getServerSideProps: GetServerSideProps = async \(context\) => \{[\s\S]*?\}\s*\}/;
const newArticleSSR = `export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  
  try {
    // 获取文章详情（核心schema无关联，需要单独查询）
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
    const author = article ? await prisma.user.findUnique({
      where: { id: article.authorId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        level: true,
      },
    }) : null;
    
    // 获取文章评论
    const comments = article ? await prisma.comment.findMany({
      where: {
        articleId: article.id,
        status: 'APPROVED',
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    }) : [];
    
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
    const relatedArticles = article ? await prisma.article.findMany({
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
    }) : [];
    
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
          lastLoginAt: author.lastLoginAt ? author.lastLoginAt.toISOString() : null,
          createdAt: author.createdAt ? author.createdAt.toISOString() : null,
          updatedAt: author.updatedAt ? author.updatedAt.toISOString() : null,
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
};`;

articleContent = articleContent.replace(articleSSRRegex, newArticleSSR);

// 更新组件props接口
articleContent = articleContent.replace(
  /interface ArticleDetailPageProps \{[\s\S]*?\}/,
  `interface ArticleDetailPageProps {
  article: any | null;
  author: any | null;
  comments: any[];
  relatedArticles: any[];
}`
);

// 更新组件中使用article.author的地方
articleContent = articleContent.replace(/article\.author/g, 'author');
articleContent = articleContent.replace(/article\.comments/g, 'comments');

fs.writeFileSync(articlePagePath, articleContent);
console.log('   ✅ 文章详情页查询修复完成');

// 2. 修复用户个人中心页
console.log('2. 修复用户个人中心页查询...');
const userPagePath = path.join(__dirname, 'src/pages/user/[username].tsx');
let userContent = fs.readFileSync(userPagePath, 'utf8');

// 替换整个getServerSideProps
const userSSRRegex = /export const getServerSideProps: GetServerSideProps = async \(context\) => \{[\s\S]*?\}\s*\}/;
const newUserSSR = `export const getServerSideProps: GetServerSideProps = async (context) => {
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
      take: 5,
      orderBy: {
        publishedAt: 'desc',
      },
    });
    
    // 获取用户帖子
    const forumPosts = await prisma.forumPost.findMany({
      where: {
        authorId: user.id,
      },
      take: 5,
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
};`;

userContent = userContent.replace(userSSRRegex, newUserSSR);

// 更新组件props接口
userContent = userContent.replace(
  /interface UserProfilePageProps \{[\s\S]*?\}/,
  `interface UserProfilePageProps {
  user: any;
  articles: any[];
  forumPosts: any[];
  recentActivity: any[];
}`
);

// 更新组件中使用user.articles等的地方
userContent = userContent.replace(/user\.articles/g, 'articles');
userContent = userContent.replace(/user\.forumPosts/g, 'forumPosts');

fs.writeFileSync(userPagePath, userContent);
console.log('   ✅ 用户个人中心页查询修复完成');

// 3. 修复帖子详情页
console.log('3. 修复帖子详情页查询...');
const postPagePath = path.join(__dirname, 'src/pages/community/post/[id].tsx');
let postContent = fs.readFileSync(postPagePath, 'utf8');

// 替换整个getServerSideProps
const postSSRRegex = /export const getServerSideProps: GetServerSideProps = async \(context\) => \{[\s\S]*?\}\s*\}/;
const newPostSSR = `export const getServerSideProps: GetServerSideProps = async (context) => {
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
          lastLoginAt: author.lastLoginAt ? author.lastLoginAt.toISOString() : null,
          createdAt: author.createdAt ? author.createdAt.toISOString() : null,
          updatedAt: author.updatedAt ? author.updatedAt.toISOString() : null,
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
};`;

postContent = postContent.replace(postSSRRegex, newPostSSR);

// 更新组件props接口
postContent = postContent.replace(
  /interface PostDetailPageProps \{[\s\S]*?\}/,
  `interface PostDetailPageProps {
  post: any;
  author: any;
  comments: any[];
}`
);

// 更新组件中使用post.author的地方
postContent = postContent.replace(/post\.author/g, 'author');
postContent = postContent.replace(/post\.comments/g, 'comments');

fs.writeFileSync(postPagePath, postContent);
console.log('   ✅ 帖子详情页查询修复完成');

console.log('\n🎉 所有动态页面查询修复完成！');
console.log('\n🔍 修复内容:');
console.log('1. 适配核心schema（无关联关系）');
console.log('2. 使用单独查询获取关联数据');
console.log('3. 添加序列化处理');
console.log('4. 更新组件props接口');

console.log('\n🚀 下一步: 重启服务器测试修复效果');