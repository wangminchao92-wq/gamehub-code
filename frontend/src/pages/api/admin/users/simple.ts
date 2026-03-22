import { NextApiRequest, NextApiResponse } from 'next';
import { withAdmin } from '@/middleware/nextauth-auth'; // 更新为NextAuth中间件
import { prisma } from '@/lib/prisma';

// 简化的用户管理API（解决Prisma _count问题）
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  try {
    switch (method) {
      case 'GET':
        // 获取用户列表（简化版）
        const { page = '1', limit = '20', search = '' } = req.query;
        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 20;
        const skip = (pageNum - 1) * limitNum;
        
        // 构建查询条件
        const where: any = {};
        if (search) {
          where.OR = [
            { username: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } },
            { displayName: { contains: search as string, mode: 'insensitive' } },
          ];
        }
        
        // 查询用户
        const [users, total] = await Promise.all([
          prisma.user.findMany({
            where,
            select: {
              id: true,
              username: true,
              email: true,
              displayName: true,
              avatar: true,
              bio: true,
              role: true,
              level: true,
              experience: true,
              points: true,
              status: true,
              emailVerified: true,
              lastLoginAt: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
          }),
          prisma.user.count({ where }),
        ]);
        
        const totalPages = Math.ceil(total / limitNum);
        
        return res.status(200).json({
          success: true,
          data: {
            users,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total: Number(total),
              totalPages,
              hasNextPage: pageNum < totalPages,
              hasPrevPage: pageNum > 1,
            },
          },
        });
        
      case 'POST':
        // 创建用户（简化版）
        const { username, email, password, displayName, role = 'USER' } = req.body;
        
        if (!username || !email || !password) {
          return res.status(400).json({
            success: false,
            error: '用户名、邮箱和密码是必填项',
          });
        }
        
        // 检查用户名是否已存在
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { username },
              { email },
            ],
          },
        });
        
        if (existingUser) {
          return res.status(409).json({
            success: false,
            error: existingUser.username === username ? '用户名已存在' : '邮箱已存在',
          });
        }
        
        // 创建用户
        const newUser = await prisma.user.create({
          data: {
            username,
            email,
            passwordHash: password, // 测试环境：明文密码
            displayName: displayName || username,
            role,
            level: 1,
            experience: 0,
            points: 0,
            status: 'ACTIVE',
            emailVerified: false,
          },
          select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            avatar: true,
            bio: true,
            role: true,
            level: true,
            experience: true,
            points: true,
            status: true,
            emailVerified: true,
            createdAt: true,
          },
        });
        
        return res.status(201).json({
          success: true,
          message: '用户创建成功',
          data: { user: newUser },
        });
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          error: `方法 ${method} 不允许`,
        });
    }
    
  } catch (error) {
    console.error('用户API错误:', error);
    
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: error instanceof Error ? error.message : '未知错误',
    });
  }
}

// 使用管理员权限中间件
export default withAdmin(handler);