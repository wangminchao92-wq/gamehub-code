# ============================================
# GameHub Docker 配置
# ============================================

# 使用 Node.js 官方镜像
FROM node:18-alpine AS base

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat
RUN apk update

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# 开发阶段
FROM base AS development
ENV NODE_ENV=development
RUN npm ci --only=development
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "dev"]

# 构建阶段
FROM base AS builder
ENV NODE_ENV=production
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production
ENV NODE_ENV=production

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 设置工作目录
WORKDIR /app

# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动命令
CMD ["node", "server.js"]