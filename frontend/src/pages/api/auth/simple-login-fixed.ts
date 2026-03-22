import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identifier, password } = req.body;

    // 验证输入
    if (!identifier || !password) {
      return res.status(400).json({ 
        success: false, 
        error: '请输入用户名/邮箱和密码' 
      });
    }

    // 查找用户（支持用户名或邮箱登录）
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        role: true,
        level: true,
        experience: true,
        points: true,
        status: true,
        emailVerified: true,
        // 注意：测试环境使用明文密码
        passwordHash: true,
      }
    });

    // 用户不存在
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: '用户名或密码错误' 
      });
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ 
        success: false, 
        error: '账户已被禁用，请联系管理员' 
      });
    }

    // 测试环境：简单密码验证（明文）
    // 生产环境必须使用 bcrypt.compare()
    const isPasswordValid = user.passwordHash === password;

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: '用户名或密码错误' 
      });
    }

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // 返回用户信息（排除密码）
    const { passwordHash, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      message: '登录成功',
      user: userWithoutPassword,
      token: `test-token-${user.id}`, // 测试环境简单token
    });

  } catch (error) {
    console.error('登录错误:', error);
    return res.status(500).json({ 
      success: false, 
      error: '服务器错误，请稍后重试' 
    });
  }
}