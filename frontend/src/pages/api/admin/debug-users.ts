import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// 调试用户API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('🔍 调试用户API...');
    
    // 1. 检查数据库连接
    const dbCheck = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('✅ 数据库连接正常:', dbCheck);
    
    // 2. 检查用户表结构
    const tableInfo = await prisma.$queryRaw`PRAGMA table_info(User)`;
    console.log('📊 用户表结构:', tableInfo);
    
    // 3. 简单查询用户
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });
    
    console.log('👥 用户数据:', users);
    
    // 4. 用户数量
    const userCount = await prisma.user.count();
    
    // 处理BigInt序列化问题
    const safeTableInfo = Array.isArray(tableInfo) 
      ? tableInfo.map((row: any) => ({
          cid: Number(row.cid),
          name: row.name,
          type: row.type,
          notnull: Number(row.notnull),
          dflt_value: row.dflt_value,
          pk: Number(row.pk),
        }))
      : tableInfo;
    
    return res.status(200).json({
      success: true,
      data: {
        database: 'connected',
        tableInfo: safeTableInfo,
        users,
        userCount: Number(userCount),
        timestamp: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('❌ 调试错误:', error);
    
    const err = error as Error;
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
  }
}