import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/middleware/nextauth-auth';

// 成就类型定义
const ACHIEVEMENTS = [
  {
    id: 'welcome',
    name: '初来乍到',
    description: '注册GameHub账户',
    icon: '🎉',
    category: 'SPECIAL',
    rarity: 'COMMON',
    points: 10,
    requirements: [{ type: 'REGISTRATION', value: 1, description: '完成注册' }],
    isSecret: false,
    isHidden: false,
    order: 1,
  },
  {
    id: 'first_post',
    name: '内容创作者',
    description: '发布第一篇文章',
    icon: '📝',
    category: 'CONTENT',
    rarity: 'COMMON',
    points: 20,
    requirements: [{ type: 'POST_COUNT', value: 1, description: '发布1篇文章' }],
    isSecret: false,
    isHidden: false,
    order: 2,
  },
  {
    id: 'first_comment',
    name: '评论新人',
    description: '发布第一条评论',
    icon: '💬',
    category: 'COMMUNITY',
    rarity: 'COMMON',
    points: 15,
    requirements: [{ type: 'COMMENT_COUNT', value: 1, description: '发布1条评论' }],
    isSecret: false,
    isHidden: false,
    order: 3,
  },
  {
    id: 'social_butterfly',
    name: '社交达人',
    description: '获得10个粉丝',
    icon: '👥',
    category: 'SOCIAL',
    rarity: 'UNCOMMON',
    points: 50,
    requirements: [{ type: 'FOLLOWER_COUNT', value: 10, description: '获得10个粉丝' }],
    isSecret: false,
    isHidden: false,
    order: 4,
  },
  {
    id: 'community_leader',
    name: '社区领袖',
    description: '发布100个帖子并获得500个赞',
    icon: '👑',
    category: 'COMMUNITY',
    rarity: 'RARE',
    points: 100,
    requirements: [
      { type: 'POST_COUNT', value: 100, description: '发布100个帖子' },
      { type: 'LIKE_COUNT', value: 500, description: '获得500个赞' },
    ],
    isSecret: false,
    isHidden: false,
    order: 5,
  },
  {
    id: 'game_master',
    name: '游戏大师',
    description: '达到等级20',
    icon: '🎮',
    category: 'GAMING',
    rarity: 'EPIC',
    points: 200,
    requirements: [{ type: 'LEVEL', value: 20, description: '达到等级20' }],
    isSecret: false,
    isHidden: false,
    order: 6,
  },
  {
    id: 'legendary_contributor',
    name: '传奇贡献者',
    description: '连续活跃365天',
    icon: '🌟',
    category: 'SPECIAL',
    rarity: 'LEGENDARY',
    points: 500,
    requirements: [{ type: 'DAYS_ACTIVE', value: 365, description: '连续活跃365天' }],
    isSecret: false,
    isHidden: false,
    order: 7,
  },
  {
    id: 'comment_expert',
    name: '评论专家',
    description: '发布1000条评论',
    icon: '💬',
    category: 'COMMUNITY',
    rarity: 'UNCOMMON',
    points: 80,
    requirements: [{ type: 'COMMENT_COUNT', value: 1000, description: '发布1000条评论' }],
    isSecret: false,
    isHidden: false,
    order: 8,
  },
  {
    id: 'trend_setter',
    name: '潮流引领者',
    description: '创建的热门帖子获得10000次浏览',
    icon: '🔥',
    category: 'CONTENT',
    rarity: 'RARE',
    points: 150,
    requirements: [{ type: 'VIEW_COUNT', value: 10000, description: '帖子获得10000次浏览' }],
    isSecret: false,
    isHidden: false,
    order: 9,
  },
  {
    id: 'early_adopter',
    name: '早期采用者',
    description: '在GameHub上线首月注册',
    icon: '🚀',
    category: 'SPECIAL',
    rarity: 'EPIC',
    points: 250,
    requirements: [{ type: 'EARLY_REGISTRATION', value: 1, description: '首月注册用户' }],
    isSecret: false,
    isHidden: false,
    order: 10,
  },
  {
    id: 'secret_achiever',
    name: '秘密成就',
    description: '发现隐藏的成就',
    icon: '🔍',
    category: 'SPECIAL',
    rarity: 'RARE',
    points: 75,
    requirements: [{ type: 'SECRET', value: 1, description: '发现隐藏成就' }],
    isSecret: true,
    isHidden: true,
    order: 11,
  },
  {
    id: 'like_master',
    name: '点赞达人',
    description: '获得1000个赞',
    icon: '❤️',
    category: 'SOCIAL',
    rarity: 'UNCOMMON',
    points: 60,
    requirements: [{ type: 'LIKE_COUNT', value: 1000, description: '获得1000个赞' }],
    isSecret: false,
    isHidden: false,
    order: 12,
  },
  {
    id: 'level_10',
    name: '进阶玩家',
    description: '达到等级10',
    icon: '⭐',
    category: 'GAMING',
    rarity: 'COMMON',
    points: 30,
    requirements: [{ type: 'LEVEL', value: 10, description: '达到等级10' }],
    isSecret: false,
    isHidden: false,
    order: 13,
  },
  {
    id: 'level_30',
    name: '高级玩家',
    description: '达到等级30',
    icon: '⭐⭐',
    category: 'GAMING',
    rarity: 'RARE',
    points: 120,
    requirements: [{ type: 'LEVEL', value: 30, description: '达到等级30' }],
    isSecret: false,
    isHidden: false,
    order: 14,
  },
  {
    id: 'level_50',
    name: '顶级玩家',
    description: '达到等级50',
    icon: '⭐⭐⭐',
    category: 'GAMING',
    rarity: 'EPIC',
    points: 300,
    requirements: [{ type: 'LEVEL', value: 50, description: '达到等级50' }],
    isSecret: false,
    isHidden: false,
    order: 15,
  },
];

// 获取用户成就
async function getUserAchievements(userId: string) {
  try {
    // 获取用户已解锁的成就
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    // 获取用户统计数据
    const userStats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        level: true,
        experience: true,
        points: true,
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
    });

    // 计算每个成就的进度
    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      const unlocked = !!userAchievement;
      
      // 计算进度
      let progress = 0;
      let currentProgress = 0;
      let totalRequired = 1;

      if (!unlocked) {
        // 根据成就类型计算进度
        achievement.requirements.forEach(req => {
          switch (req.type) {
            case 'LEVEL':
              currentProgress = userStats?.level || 0;
              totalRequired = req.value;
              break;
            case 'POST_COUNT':
              currentProgress = (userStats?._count?.articles || 0) + (userStats?._count?.forumPosts || 0);
              totalRequired = req.value;
              break;
            case 'COMMENT_COUNT':
              currentProgress = userStats?._count?.comments || 0;
              totalRequired = req.value;
              break;
            case 'FOLLOWER_COUNT':
              currentProgress = userStats?._count?.followers || 0;
              totalRequired = req.value;
              break;
            case 'LIKE_COUNT':
              // 这里需要从其他表获取点赞数
              currentProgress = 0;
              totalRequired = req.value;
              break;
            case 'VIEW_COUNT':
              // 这里需要从其他表获取浏览数
              currentProgress = 0;
              totalRequired = req.value;
              break;
            default:
              currentProgress = 0;
              totalRequired = 1;
          }
        });

        progress = totalRequired > 0 ? Math.min(Math.round((currentProgress / totalRequired) * 100), 100) : 0;
      } else {
        progress = 100;
        currentProgress = totalRequired = 1;
      }

      return {
        ...achievement,
        unlocked,
        unlockedAt: userAchievement?.unlockedAt,
        progress,
        currentProgress,
        totalRequired,
      };
    });

    return achievementsWithProgress;
  } catch (error) {
    console.error('获取用户成就失败:', error);
    throw error;
  }
}

// 解锁成就
async function unlockAchievement(userId: string, achievementId: string) {
  try {
    // 检查成就是否存在
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
      throw new Error('成就不存在');
    }

    // 检查是否已解锁
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });

    if (existing) {
      throw new Error('成就已解锁');
    }

    // 解锁成就
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
        unlockedAt: new Date(),
      },
    });

    // 更新用户积分
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: achievement.points,
        },
      },
    });

    return userAchievement;
  } catch (error) {
    console.error('解锁成就失败:', error);
    throw error;
  }
}

// 检查并解锁符合条件的成就
async function checkAndUnlockAchievements(userId: string) {
  try {
    const userStats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        level: true,
        _count: {
          select: {
            articles: true,
            forumPosts: true,
            comments: true,
            followers: true,
          },
        },
      },
    });

    if (!userStats) return [];

    const unlockedAchievements = [];

    // 检查每个成就
    for (const achievement of ACHIEVEMENTS) {
      // 跳过已解锁的成就
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });

      if (existing) continue;

      // 检查成就条件
      let conditionsMet = true;
      
      for (const req of achievement.requirements) {
        let currentValue = 0;
        
        switch (req.type) {
          case 'LEVEL':
            currentValue = userStats.level;
            break;
          case 'POST_COUNT':
            currentValue = userStats._count.articles + userStats._count.forumPosts;
            break;
          case 'COMMENT_COUNT':
            currentValue = userStats._count.comments;
            break;
          case 'FOLLOWER_COUNT':
            currentValue = userStats._count.followers;
            break;
          case 'REGISTRATION':
            currentValue = 1; // 用户已注册
            break;
          default:
            currentValue = 0;
        }

        if (currentValue < req.value) {
          conditionsMet = false;
          break;
        }
      }

      // 如果条件满足，解锁成就
      if (conditionsMet) {
        try {
          const unlocked = await unlockAchievement(userId, achievement.id);
          unlockedAchievements.push(unlocked);
        } catch (error) {
          console.error(`解锁成就 ${achievement.id} 失败:`, error);
        }
      }
    }

    return unlockedAchievements;
  } catch (error) {
    console.error('检查成就失败:', error);
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
        // 获取用户成就
        const { check = 'false' } = req.query;
        
        if (check === 'true') {
          // 检查并解锁新成就
          const unlocked = await checkAndUnlockAchievements(userId);
          if (unlocked.length > 0) {
            console.log(`为用户 ${userId} 解锁了 ${unlocked.length} 个新成就`);
          }
        }

        const achievements = await getUserAchievements(userId);
        return res.status(200).json({ achievements });

      case 'POST':
        // 解锁特定成就（用于测试或特殊解锁）
        const { achievementId } = req.body;
        
        if (!achievementId) {
          return res.status(400).json({ error: '需要achievementId' });
        }

        const unlocked = await unlockAchievement(userId, achievementId);
        return res.status(200).json({ unlocked });

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