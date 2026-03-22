import { NextApiRequest, NextApiResponse } from 'next';
import { withSuperAdmin, withAdmin, withModerator, withEditor } from '@/middleware/nextauth-auth'; // 更新为NextAuth中间件

// 测试处理器
async function testHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;
  
  return res.status(200).json({
    success: true,
    message: '权限测试通过',
    data: {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: ['view_test', 'access_admin_test'],
      },
      testInfo: {
        endpoint: '/api/admin/test-permissions',
        method: req.method,
        timestamp: new Date().toISOString(),
        middleware: '权限中间件集成测试',
      },
    },
  });
}

// 使用不同权限级别的中间件包装
export const superAdminTest = withSuperAdmin(testHandler);
export const adminTest = withAdmin(testHandler);
export const moderatorTest = withModerator(testHandler);
export const editorTest = withEditor(testHandler);

// 主处理器，根据查询参数选择不同的权限级别
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { level = 'admin' } = req.query;
  
  switch (level) {
    case 'superadmin':
      return superAdminTest(req, res);
    case 'admin':
      return adminTest(req, res);
    case 'moderator':
      return moderatorTest(req, res);
    case 'editor':
      return editorTest(req, res);
    default:
      return res.status(400).json({
        success: false,
        error: '无效的权限级别',
        allowedLevels: ['superadmin', 'admin', 'moderator', 'editor'],
      });
  }
}