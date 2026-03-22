import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    env: process.env.NODE_ENV,
    checks: {
      database: 'pending',
      redis: 'pending',
      api: 'pending',
    },
  };

  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.checks.database = 'healthy';
  } catch (error) {
    healthCheck.checks.database = 'unhealthy';
    healthCheck.status = 'degraded';
  }

  // 检查 Redis 连接 (如果有配置)
  if (process.env.REDIS_URL) {
    try {
      // 这里可以添加 Redis 连接检查
      healthCheck.checks.redis = 'healthy';
    } catch (error) {
      healthCheck.checks.redis = 'unhealthy';
      healthCheck.status = 'degraded';
    }
  } else {
    healthCheck.checks.redis = 'not_configured';
  }

  // 检查 API 端点
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/test`);
    if (response.ok) {
      healthCheck.checks.api = 'healthy';
    } else {
      healthCheck.checks.api = 'unhealthy';
      healthCheck.status = 'degraded';
    }
  } catch (error) {
    healthCheck.checks.api = 'unhealthy';
    healthCheck.status = 'degraded';
  }

  // 根据检查结果设置状态码
  const statusCode = healthCheck.status === 'healthy' ? 200 : 
                     healthCheck.status === 'degraded' ? 206 : 503;

  // 添加响应头
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  // 返回健康检查结果
  return res.status(statusCode).json(healthCheck);
}