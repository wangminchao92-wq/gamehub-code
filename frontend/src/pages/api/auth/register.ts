import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 密码强度检查
function checkPasswordStrength(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: '密码至少需要8个字符' };
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return { valid: false, message: '密码需要包含大小写字母' };
  }

  if (!/\d/.test(password)) {
    return { valid: false, message: '密码需要包含数字' };
  }

  return { valid: true };
}

// 用户名验证
function validateUsername(username: string): { valid: boolean; message?: string } {
  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: '用户名长度需在3-20位之间' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: '用户名只能包含字母、数字和下划线' };
  }

  return { valid: true };
}

// 邮箱验证
function validateEmail(email: string): { valid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: '请输入有效的邮箱地址' };
  }

  return { valid: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { email, username, password, displayName } = req.body;

    // 验证必填字段
    if (!email || !username || !password) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    // 验证邮箱格式
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.message });
    }

    // 验证用户名格式
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.message });
    }

    // 验证密码强度
    const passwordValidation = checkPasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // 检查邮箱是否已存在
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 检查用户名是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return res.status(400).json({ error: '该用户名已被使用' });
    }

    // 哈希密码
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 生成默认头像
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName: displayName || username,
        passwordHash,
        avatar: defaultAvatar,
        role: 'USER',
        level: 1,
        points: 100, // 注册奖励积分
        experience: 0,
        status: 'ACTIVE',
        emailVerified: false, // 需要邮箱验证
        settings: {
          create: {
            theme: 'system',
            language: 'zh-CN',
            notifications: true,
            privacy: 'PUBLIC',
          },
        },
        profile: {
          create: {
            bio: '欢迎来到GameHub！',
            location: '',
            website: '',
            socialLinks: {},
          },
        },
      },
      include: {
        settings: true,
        profile: true,
      },
    });

    // 移除敏感信息
    const { passwordHash: _, ...userWithoutPassword } = user;

    // 发送欢迎邮件（这里可以集成邮件服务）
    // await sendWelcomeEmail(email, username);

    // 记录注册事件
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'USER_REGISTERED',
        description: '用户注册成功',
        metadata: {
          registrationMethod: 'email',
          ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        },
      },
    });

    // 返回成功响应
    return res.status(201).json({
      success: true,
      message: '注册成功',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('注册错误:', error);

    // 处理Prisma错误
    if (error.code === 'P2002') {
      // 唯一约束冲突
      const target = error.meta?.target;
      if (target?.includes('email')) {
        return res.status(400).json({ error: '该邮箱已被注册' });
      }
      if (target?.includes('username')) {
        return res.status(400).json({ error: '该用户名已被使用' });
      }
    }

    return res.status(500).json({ 
      error: '注册过程中出现错误，请稍后重试',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}