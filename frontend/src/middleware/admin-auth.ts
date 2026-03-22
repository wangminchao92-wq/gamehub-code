import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// 用户角色类型
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
}

// 默认权限配置
const defaultConfig: PermissionConfig = {
  allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
  requireEmailVerified: true,
  requireActiveStatus: true,
};

// 权限检查结果
export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  statusCode?: number;
}

// 从请求中提取用户信息（简化版，实际应从JWT或Session获取）
async function extractUserFromRequest(req: NextApiRequest): Promise<any | null> {
  try {
    // 简化版：从cookie或header中获取用户ID
    // 实际项目中应该从JWT token或session中获取
    const userId = req.headers['x-user-id'] as string || 
                   req.cookies?.user_id as string;

    if (!userId) {
      return null;
    }

    // 查询用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      },
    });

    return user;
  } catch (error) {
    console.error('提取用户信息失败:', error);
    return null;
  }
}

// 权限检查函数
export async function checkPermissions(
  req: NextApiRequest,
  config: PermissionConfig = defaultConfig
): Promise<AuthResult> {
  try {
    // 1. 提取用户信息
    const user = await extractUserFromRequest(req);
    
    if (!user) {
      return {
        success: false,
        error: '未认证，请先登录',
        statusCode: 401,
      };
    }

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

// 权限中间件工厂函数
export function withAuth(config: PermissionConfig = defaultConfig) {
  return (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      // 检查权限
      const authResult = await checkPermissions(req, config);
      
      if (!authResult.success) {
        return res.status(authResult.statusCode || 403).json({
          success: false,
          error: authResult.error,
          timestamp: new Date().toISOString(),
        });
      }

      // 权限通过，将用户信息添加到请求对象
      (req as any).user = authResult.user;
      
      // 继续执行原始处理器
      return handler(req, res);
    };
  };
}

// 特定角色的快捷中间件
export const withSuperAdmin = withAuth({
  allowedRoles: ['SUPER_ADMIN'],
  requireEmailVerified: true,
  requireActiveStatus: true,
});

export const withAdmin = withAuth({
  allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
  requireEmailVerified: true,
  requireActiveStatus: true,
});

export const withModerator = withAuth({
  allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  requireEmailVerified: true,
  requireActiveStatus: true,
});

export const withEditor = withAuth({
  allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'],
  requireEmailVerified: true,
  requireActiveStatus: true,
});

// 工具函数：检查用户是否有特定权限
export function hasPermission(user: any, requiredRole: UserRole): boolean {
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

// 工具函数：获取用户可访问的功能列表
export function getUserPermissions(user: any): string[] {
  if (!user || !user.role) return [];
  
  const basePermissions = ['view_profile', 'edit_profile'];
  const rolePermissions: Record<UserRole, string[]> = {
    'USER': [...basePermissions],
    'EDITOR': [...basePermissions, 'create_content', 'edit_own_content'],
    'MODERATOR': [...basePermissions, 'create_content', 'edit_any_content', 'moderate_comments'],
    'ADMIN': [...basePermissions, 'create_content', 'edit_any_content', 'moderate_comments', 'manage_users', 'system_settings'],
    'SUPER_ADMIN': [...basePermissions, 'create_content', 'edit_any_content', 'moderate_comments', 'manage_users', 'system_settings', 'manage_admins', 'system_maintenance'],
  };
  
  return rolePermissions[user.role as UserRole] || basePermissions;
}

// 导出中间件
export default withAuth;