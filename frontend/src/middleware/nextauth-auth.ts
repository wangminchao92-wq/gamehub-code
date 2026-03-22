import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 用户角色类型（与NextAuth类型保持一致）
export type UserRole = 'USER' | 'EDITOR' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

// 权限配置接口
export interface PermissionConfig {
  // 允许的角色列表
  allowedRoles: UserRole[];
  // 是否要求邮箱验证
  requireEmailVerified?: boolean;
  // 是否要求活跃状态
  requireActiveStatus?: boolean;
  // 自定义权限检查函数
  customCheck?: (user: any, req: NextApiRequest) => boolean | Promise<boolean>;
  // 是否要求登录（默认true）
  requireAuth?: boolean;
}

// 默认权限配置
const defaultConfig: PermissionConfig = {
  allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
  requireEmailVerified: true,
  requireActiveStatus: true,
  requireAuth: true,
};

// 权限检查结果
export interface AuthResult {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
  statusCode?: number;
}

// 从NextAuth会话获取用户信息
async function getUserFromSession(): Promise<any | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return null;
    }

    // 从数据库获取完整的用户信息
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        role: true as any,
        status: true,
        emailVerified: true,
        level: true,
        experience: true,
        points: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        settings: {
          select: {
            theme: true,
            language: true,
            notifications: true,
            privacy: true,
          },
        },
        profile: {
          select: {
            bio: true,
            location: true,
            website: true,
            socialLinks: true,
          },
        },
      },
    });

    return { ...user, session };
  } catch (error) {
    console.error('从会话获取用户信息失败:', error);
    return null;
  }
}

// 权限检查函数（NextAuth集成版）
export async function checkNextAuthPermissions(
  req: NextApiRequest,
  config: PermissionConfig = defaultConfig
): Promise<AuthResult> {
  try {
    // 1. 获取用户信息（从NextAuth会话）
    const userData = await getUserFromSession();
    
    if (!userData && config.requireAuth) {
      return {
        success: false,
        error: '未认证，请先登录',
        statusCode: 401,
      };
    }

    // 如果不需要认证且用户不存在，返回成功但无用户
    if (!userData && !config.requireAuth) {
      return {
        success: true,
      };
    }

    const { session, ...user } = userData;

    // 2. 检查用户状态
    if (config.requireActiveStatus && user.status !== 'ACTIVE') {
      return {
        success: false,
        error: `账号状态异常: ${user.status}`,
        statusCode: 403,
      };
    }

    // 3. 检查邮箱验证
    if (config.requireEmailVerified && !user.emailVerified) {
      return {
        success: false,
        error: '邮箱未验证，请先验证邮箱',
        statusCode: 403,
      };
    }

    // 4. 检查角色权限
    const hasRolePermission = config.allowedRoles.includes(user.role);
    if (!hasRolePermission) {
      return {
        success: false,
        error: `权限不足，需要角色: ${config.allowedRoles.join(', ')}`,
        statusCode: 403,
      };
    }

    // 5. 自定义权限检查（如果有）
    if (config.customCheck) {
      const customResult = await config.customCheck(user, req);
      if (!customResult) {
        return {
          success: false,
          error: '自定义权限检查失败',
          statusCode: 403,
        };
      }
    }

    // 6. 权限检查通过
    return {
      success: true,
      user,
      session,
    };

  } catch (error) {
    console.error('权限检查异常:', error);
    return {
      success: false,
      error: '权限检查系统错误',
      statusCode: 500,
    };
  }
}

// NextAuth权限中间件工厂函数
export function withNextAuth(config: PermissionConfig = defaultConfig) {
  return (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      // 检查权限
      const authResult = await checkNextAuthPermissions(req, config);
      
      if (!authResult.success) {
        return res.status(authResult.statusCode || 403).json({
          success: false,
          error: authResult.error,
          timestamp: new Date().toISOString(),
          requireLogin: authResult.statusCode === 401,
        });
      }

      // 权限通过，将用户信息添加到请求对象
      if (authResult.user) {
        (req as any).user = authResult.user;
      }
      if (authResult.session) {
        (req as any).session = authResult.session;
      }
      
      // 继续执行原始处理器
      return handler(req, res);
    };
  };
}

// 特定角色的快捷中间件
export const withSuperAdmin = withNextAuth({
  allowedRoles: ['SUPER_ADMIN'],
  requireEmailVerified: true,
  requireActiveStatus: true,
  requireAuth: true,
});

export const withAdmin = withNextAuth({
  allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
  requireEmailVerified: true,
  requireActiveStatus: true,
  requireAuth: true,
});

export const withModerator = withNextAuth({
  allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  requireEmailVerified: true,
  requireActiveStatus: true,
  requireAuth: true,
});

export const withEditor = withNextAuth({
  allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'],
  requireEmailVerified: true,
  requireActiveStatus: true,
  requireAuth: true,
});

export const withUser = withNextAuth({
  allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'USER'],
  requireEmailVerified: false, // 用户可能还未验证邮箱
  requireActiveStatus: true,
  requireAuth: true,
});

export const withOptionalAuth = withNextAuth({
  allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'USER'],
  requireEmailVerified: false,
  requireActiveStatus: false,
  requireAuth: false, // 不要求认证
});

// 工具函数：检查用户是否有特定权限（NextAuth集成版）
export function hasNextAuthPermission(user: any, requiredRole: UserRole): boolean {
  if (!user || !user.role) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'USER': 1,
    'EDITOR': 2,
    'MODERATOR': 3,
    'ADMIN': 4,
    'SUPER_ADMIN': 5,
  };
  
  const userLevel = roleHierarchy[user.role as UserRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
}

// 工具函数：获取用户可访问的功能列表（NextAuth集成版）
export function getNextAuthUserPermissions(user: any): string[] {
  if (!user || !user.role) return [];
  
  const basePermissions = ['view_profile', 'edit_profile', 'view_content'];
  const rolePermissions: Record<UserRole, string[]> = {
    'USER': [...basePermissions, 'create_comment', 'like_content', 'follow_users'],
    'EDITOR': [...basePermissions, 'create_content', 'edit_own_content', 'publish_content', 'create_comment', 'like_content', 'follow_users'],
    'MODERATOR': [...basePermissions, 'create_content', 'edit_any_content', 'publish_content', 'moderate_comments', 'manage_tags', 'create_comment', 'like_content', 'follow_users'],
    'ADMIN': [...basePermissions, 'create_content', 'edit_any_content', 'publish_content', 'moderate_comments', 'manage_tags', 'manage_users', 'system_settings', 'view_analytics', 'create_comment', 'like_content', 'follow_users'],
    'SUPER_ADMIN': [...basePermissions, 'create_content', 'edit_any_content', 'publish_content', 'moderate_comments', 'manage_tags', 'manage_users', 'system_settings', 'view_analytics', 'manage_admins', 'system_maintenance', 'api_access', 'create_comment', 'like_content', 'follow_users'],
  };
  
  return rolePermissions[user.role as UserRole] || basePermissions;
}

// 检查API密钥权限（用于服务间通信）
export async function checkApiKey(req: NextApiRequest): Promise<AuthResult> {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'API密钥缺失',
      statusCode: 401,
    };
  }
  
  try {
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });
    
    if (!apiKeyRecord) {
      return {
        success: false,
        error: '无效的API密钥',
        statusCode: 401,
      };
    }
    
    if (!apiKeyRecord.active) {
      return {
        success: false,
        error: 'API密钥已禁用',
        statusCode: 403,
      };
    }
    
    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      return {
        success: false,
        error: 'API密钥已过期',
        statusCode: 403,
      };
    }
    
    // 更新最后使用时间
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });
    
    return {
      success: true,
      user: apiKeyRecord.user,
    };
    
  } catch (error) {
    console.error('API密钥检查失败:', error);
    return {
      success: false,
      error: 'API密钥验证系统错误',
      statusCode: 500,
    };
  }
}

// API密钥中间件
export function withApiKey() {
  return (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const authResult = await checkApiKey(req);
      
      if (!authResult.success) {
        return res.status(authResult.statusCode || 403).json({
          success: false,
          error: authResult.error,
          timestamp: new Date().toISOString(),
        });
      }
      
      (req as any).user = authResult.user;
      return handler(req, res);
    };
  };
}

// 组合中间件：同时支持会话认证和API密钥
export function withAuthOrApiKey(config: PermissionConfig = defaultConfig) {
  return (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      // 先检查API密钥
      const apiKeyResult = await checkApiKey(req);
      
      if (apiKeyResult.success) {
        // API密钥认证成功，检查权限
        const user = apiKeyResult.user;
        const hasRolePermission = config.allowedRoles.includes(user.role);
        
        if (!hasRolePermission) {
          return res.status(403).json({
            success: false,
            error: `权限不足，需要角色: ${config.allowedRoles.join(', ')}`,
            timestamp: new Date().toISOString(),
          });
        }
        
        (req as any).user = user;
        (req as any).authMethod = 'api_key';
        return handler(req, res);
      }
      
      // API密钥失败，尝试会话认证
      const sessionResult = await checkNextAuthPermissions(req, config);
      
      if (!sessionResult.success) {
        return res.status(sessionResult.statusCode || 403).json({
          success: false,
          error: sessionResult.error,
          timestamp: new Date().toISOString(),
          requireLogin: sessionResult.statusCode === 401,
        });
      }
      
      if (sessionResult.user) {
        (req as any).user = sessionResult.user;
      }
      if (sessionResult.session) {
        (req as any).session = sessionResult.session;
      }
      (req as any).authMethod = 'session';
      
      return handler(req, res);
    };
  };
}

// 导出中间件
export default withNextAuth;