import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/middleware/nextauth-auth';

// 通知类型定义
const NOTIFICATION_TYPES = {
  LIKE: '点赞通知',
  COMMENT: '评论通知',
  FOLLOW: '关注通知',
  MENTION: '@提及通知',
  SYSTEM: '系统通知',
  ACHIEVEMENT: '成就通知',
  MESSAGE: '私信通知',
} as const;

// 获取用户通知
async function getUserNotifications(userId: string, options: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: string;
}) {
  const {
    limit = 50,
    offset = 0,
    unreadOnly = false,
    type = 'ALL',
  } = options;

  try {
    const where: any = {
      userId,
    };

    if (unreadOnly) {
      where.read = false;
    }

    if (type !== 'ALL') {
      where.type = type;
    }

    // 获取通知
    const notifications = await prisma.notification.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // 获取未读数量
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    // 获取总数
    const totalCount = await prisma.notification.count({
      where: {
        userId,
      },
    });

    return {
      notifications,
      pagination: {
        total: totalCount,
        unread: unreadCount,
        limit,
        offset,
        hasMore: offset + notifications.length < totalCount,
      },
    };
  } catch (error) {
    console.error('获取通知失败:', error);
    throw error;
  }
}

// 创建通知
async function createNotification(data: {
  userId: string;
  type: keyof typeof NOTIFICATION_TYPES;
  title: string;
  content: string;
  senderId?: string;
  targetType?: string;
  targetId?: string;
  targetTitle?: string;
  targetUrl?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  actions?: any[];
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        content: data.content,
        senderId: data.senderId,
        targetType: data.targetType,
        targetId: data.targetId,
        targetTitle: data.targetTitle,
        targetUrl: data.targetUrl,
        priority: data.priority || 'MEDIUM',
        actions: data.actions || [],
        read: false,
        createdAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return notification;
  } catch (error) {
    console.error('创建通知失败:', error);
    throw error;
  }
}

// 批量创建通知
async function createBatchNotifications(notificationsData: any[]) {
  try {
    const notifications = await prisma.notification.createMany({
      data: notificationsData.map(data => ({
        userId: data.userId,
        type: data.type,
        title: data.title,
        content: data.content,
        senderId: data.senderId,
        targetType: data.targetType,
        targetId: data.targetId,
        targetTitle: data.targetTitle,
        targetUrl: data.targetUrl,
        priority: data.priority || 'MEDIUM',
        actions: data.actions || [],
        read: false,
        createdAt: new Date(),
      })),
    });

    return notifications;
  } catch (error) {
    console.error('批量创建通知失败:', error);
    throw error;
  }
}

// 标记通知为已读
async function markNotificationsAsRead(userId: string, notificationIds: string[]) {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error('标记通知为已读失败:', error);
    throw error;
  }
}

// 标记所有通知为已读
async function markAllNotificationsAsRead(userId: string) {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error('标记所有通知为已读失败:', error);
    throw error;
  }
}

// 删除通知
async function deleteNotifications(userId: string, notificationIds: string[]) {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
    });

    return result;
  } catch (error) {
    console.error('删除通知失败:', error);
    throw error;
  }
}

// 删除所有通知
async function deleteAllNotifications(userId: string) {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        userId,
      },
    });

    return result;
  } catch (error) {
    console.error('删除所有通知失败:', error);
    throw error;
  }
}

// 获取通知设置
async function getNotificationSettings(userId: string) {
  try {
    const settings = await prisma.userNotificationSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      // 创建默认设置
      return await prisma.userNotificationSettings.create({
        data: {
          userId,
          emailNotifications: true,
          pushNotifications: true,
          soundEnabled: true,
          desktopNotifications: true,
          likeNotifications: true,
          commentNotifications: true,
          followNotifications: true,
          mentionNotifications: true,
          systemNotifications: true,
          achievementNotifications: true,
          messageNotifications: true,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error('获取通知设置失败:', error);
    throw error;
  }
}

// 更新通知设置
async function updateNotificationSettings(userId: string, updates: any) {
  try {
    const settings = await prisma.userNotificationSettings.upsert({
      where: { userId },
      update: updates,
      create: {
        userId,
        emailNotifications: updates.emailNotifications ?? true,
        pushNotifications: updates.pushNotifications ?? true,
        soundEnabled: updates.soundEnabled ?? true,
        desktopNotifications: updates.desktopNotifications ?? true,
        likeNotifications: updates.likeNotifications ?? true,
        commentNotifications: updates.commentNotifications ?? true,
        followNotifications: updates.followNotifications ?? true,
        mentionNotifications: updates.mentionNotifications ?? true,
        systemNotifications: updates.systemNotifications ?? true,
        achievementNotifications: updates.achievementNotifications ?? true,
        messageNotifications: updates.messageNotifications ?? true,
      },
    });

    return settings;
  } catch (error) {
    console.error('更新通知设置失败:', error);
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
        // 获取通知
        const {
          limit = '50',
          offset = '0',
          unreadOnly = 'false',
          type = 'ALL',
        } = req.query;

        const result = await getUserNotifications(userId, {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          unreadOnly: unreadOnly === 'true',
          type: type as string,
        });

        return res.status(200).json(result);

      case 'POST':
        // 创建通知（管理员或系统用）
        const { action } = req.body;

        if (action === 'create') {
          // 检查权限（只有管理员或系统可以创建通知）
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
          });

          if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
            return res.status(403).json({ error: '权限不足' });
          }

          const notification = await createNotification(req.body);
          return res.status(201).json({ notification });
        }

        if (action === 'mark-read') {
          const { notificationIds } = req.body;
          
          if (!notificationIds || !Array.isArray(notificationIds)) {
            return res.status(400).json({ error: '需要notificationIds数组' });
          }

          const result = await markNotificationsAsRead(userId, notificationIds);
          return res.status(200).json({ result });
        }

        if (action === 'mark-all-read') {
          const result = await markAllNotificationsAsRead(userId);
          return res.status(200).json({ result });
        }

        if (action === 'delete') {
          const { notificationIds } = req.body;
          
          if (!notificationIds || !Array.isArray(notificationIds)) {
            return res.status(400).json({ error: '需要notificationIds数组' });
          }

          const result = await deleteNotifications(userId, notificationIds);
          return res.status(200).json({ result });
        }

        if (action === 'delete-all') {
          const result = await deleteAllNotifications(userId);
          return res.status(200).json({ result });
        }

        if (action === 'get-settings') {
          const settings = await getNotificationSettings(userId);
          return res.status(200).json({ settings });
        }

        if (action === 'update-settings') {
          const { updates } = req.body;
          
          if (!updates || typeof updates !== 'object') {
            return res.status(400).json({ error: '需要updates对象' });
          }

          const settings = await updateNotificationSettings(userId, updates);
          return res.status(200).json({ settings });
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