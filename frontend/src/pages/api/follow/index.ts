import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/middleware/nextauth-auth';

// 获取用户关注关系
async function getUserFollowRelations(userId: string, options: {
  mode: 'FOLLOWERS' | 'FOLLOWING' | 'MUTUAL' | 'SUGGESTIONS';
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const {
    mode = 'FOLLOWERS',
    limit = 50,
    offset = 0,
    search = '',
  } = options;

  try {
    let where: any = {};
    let include: any = {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          bio: true,
          location: true,
          website: true,
          role: true,
          level: true,
          experience: true,
          points: true,
          lastActiveAt: true,
          createdAt: true,
          _count: {
            select: {
              articles: true,
              forumPosts: true,
              comments: true,
              followers: true,
              following: true,
            },
          },
        },
      },
    };

    switch (mode) {
      case 'FOLLOWERS':
        where = {
          followingId: userId,
        };
        include = {
          ...include,
          follower: include.user,
        };
        break;

      case 'FOLLOWING':
        where = {
          followerId: userId,
        };
        include = {
          ...include,
          following: include.user,
        };
        break;

      case 'MUTUAL':
        // 获取互相关注的用户
        const followers = await prisma.follow.findMany({
          where: { followingId: userId },
          select: { followerId: true },
        });

        const following = await prisma.follow.findMany({
          where: { followerId: userId },
          select: { followingId: true },
        });

        const followerIds = followers.map(f => f.followerId);
        const followingIds = following.map(f => f.followingId);
        const mutualIds = followerIds.filter(id => followingIds.includes(id));

        where = {
          id: { in: mutualIds },
        };
        break;

      case 'SUGGESTIONS':
        // 获取推荐用户（非关注、有共同关注、活跃用户）
        const userFollowings = await prisma.follow.findMany({
          where: { followerId: userId },
          select: { followingId: true },
        });

        const followingIdsSet = new Set(userFollowings.map(f => f.followingId));

        // 获取用户关注的人关注的人
        const suggestions = await prisma.$queryRaw`
          SELECT DISTINCT u.*
          FROM "User" u
          INNER JOIN "Follow" f1 ON f1."followingId" = u.id
          INNER JOIN "Follow" f2 ON f2."followerId" = f1."followerId"
          WHERE f2."followingId" = ${userId}
            AND u.id != ${userId}
            AND u.id NOT IN (${followingIdsSet.size > 0 ? Array.from(followingIdsSet).join(',') : 'NULL'})
          ORDER BY u."lastActiveAt" DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;

        return {
          users: suggestions,
          pagination: {
            total: suggestions.length,
            limit,
            offset,
            hasMore: false,
          },
        };
    }

    // 搜索过滤
    if (search) {
      where.OR = [
        { user: { username: { contains: search, mode: 'insensitive' } } },
        { user: { displayName: { contains: search, mode: 'insensitive' } } },
        { user: { bio: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // 获取关注关系
    const relations = await prisma.follow.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // 获取总数
    const totalCount = await prisma.follow.count({ where });

    // 转换数据格式
    const users = relations.map(relation => {
      const user = mode === 'FOLLOWERS' ? relation.follower : relation.following;
      const stats = user._count;

      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        website: user.website,
        role: user.role,
        level: user.level,
        experience: user.experience,
        points: user.points,
        followersCount: stats.followers,
        followingCount: stats.following,
        postsCount: stats.articles + stats.forumPosts,
        commentsCount: stats.comments,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt,
        isFollowing: mode === 'FOLLOWERS' ? true : false,
        isFollowedBy: mode === 'FOLLOWING' ? true : false,
        followedAt: relation.createdAt,
      };
    });

    return {
      users,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + users.length < totalCount,
      },
    };
  } catch (error) {
    console.error('获取关注关系失败:', error);
    throw error;
  }
}

// 关注用户
async function followUser(followerId: string, followingId: string) {
  try {
    // 检查是否已关注
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existing) {
      throw new Error('已关注此用户');
    }

    // 检查是否关注自己
    if (followerId === followingId) {
      throw new Error('不能关注自己');
    }

    // 创建关注关系
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
        createdAt: new Date(),
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: followingId,
        type: 'FOLLOW',
        title: '新粉丝',
        content: `用户${follow.follower.displayName || follow.follower.username}开始关注您`,
        senderId: followerId,
        targetType: 'USER',
        targetId: followerId,
        targetTitle: follow.follower.displayName || follow.follower.username,
        targetUrl: `/user/${follow.follower.username}`,
        priority: 'LOW',
        actions: [
          { id: 'view', label: '查看用户', type: 'VIEW', url: `/user/${follow.follower.username}` },
          { id: 'follow_back', label: '回关', type: 'FOLLOW_BACK' },
        ],
        read: false,
        createdAt: new Date(),
      },
    });

    return follow;
  } catch (error) {
    console.error('关注用户失败:', error);
    throw error;
  }
}

// 取消关注
async function unfollowUser(followerId: string, followingId: string) {
  try {
    const follow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return follow;
  } catch (error) {
    console.error('取消关注失败:', error);
    throw error;
  }
}

// 获取用户统计
async function getUserFollowStats(userId: string) {
  try {
    const followersCount = await prisma.follow.count({
      where: { followingId: userId },
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: userId },
    });

    // 获取互相关注数量
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      select: { followerId: true },
    });

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followerIds = followers.map(f => f.followerId);
    const followingIds = following.map(f => f.followingId);
    const mutualCount = followerIds.filter(id => followingIds.includes(id)).length;

    return {
      followers: followersCount,
      following: followingCount,
      mutual: mutualCount,
    };
  } catch (error) {
    console.error('获取用户统计失败:', error);
    throw error;
  }
}

// 检查关注状态
async function checkFollowStatus(followerId: string, followingId: string) {
  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return {
      isFollowing: !!follow,
      followedAt: follow?.createdAt,
    };
  } catch (error) {
    console.error('检查关注状态失败:', error);
    throw error;
  }
}

// API处理器
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: '未认证' });
  }

  const userId = session.user.id;
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // 获取关注关系
        const {
          mode = 'FOLLOWERS',
          limit = '50',
          offset = '0',
          search = '',
          targetUserId,
        } = req.query;

        if (targetUserId) {
          // 检查特定用户的关注状态
          const status = await checkFollowStatus(userId, targetUserId as string);
          return res.status(200).json(status);
        }

        // 获取用户统计
        if (mode === 'STATS') {
          const stats = await getUserFollowStats(userId);
          return res.status(200).json(stats);
        }

        const result = await getUserFollowRelations(userId, {
          mode: mode as 'FOLLOWERS' | 'FOLLOWING' | 'MUTUAL' | 'SUGGESTIONS',
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          search: search as string,
        });

        return res.status(200).json(result);

      case 'POST':
        // 关注/取消关注
        const { action, targetUserId: targetUserIdBody } = req.body;

        if (!targetUserIdBody) {
          return res.status(400).json({ error: '需要targetUserId' });
        }

        if (action === 'follow') {
          const follow = await followUser(userId, targetUserIdBody);
          return res.status(200).json({ follow });
        }

        if (action === 'unfollow') {
          const unfollow = await unfollowUser(userId, targetUserIdBody);
          return res.status(200).json({ unfollow });
        }

        return res.status(400).json({ error: '无效的action' });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `方法 ${method} 不允许` });
    }
  } catch (error: any) {
    console.error('API错误:', error);
    return res.status(500).json({ 
      error: error.message || '服务器错误',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

export default withAuth(handler, {
  allowedRoles: ['USER', 'EDITOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'],
  requireAuth: true,
});