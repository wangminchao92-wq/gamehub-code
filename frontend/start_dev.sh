#!/bin/bash

# GameHub开发服务器启动脚本
# 确保环境变量正确加载

echo "🚀 启动GameHub开发服务器..."

# 检查环境变量
if [ ! -f .env ]; then
    echo "❌ 错误: .env文件不存在"
    exit 1
fi

# 加载环境变量
export $(grep -v '^#' .env | xargs)

# 检查数据库文件
if [ ! -f "prisma/dev.db" ]; then
    echo "⚠️  警告: 数据库文件不存在，创建空文件..."
    mkdir -p prisma
    touch prisma/dev.db
fi

# 检查Prisma客户端
echo "🔧 检查Prisma客户端..."
if npx prisma --version > /dev/null 2>&1; then
    echo "✅ Prisma已安装"
else
    echo "❌ Prisma未安装，正在安装..."
    npm install @prisma/client
fi

# 生成Prisma客户端
echo "🔄 生成Prisma客户端..."
npx prisma generate

# 启动开发服务器
echo "🌐 启动开发服务器..."
npm run dev