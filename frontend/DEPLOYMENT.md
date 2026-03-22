# GameHub 部署指南

## 目录
1. [环境要求](#环境要求)
2. [快速开始](#快速开始)
3. [手动部署](#手动部署)
4. [Docker 部署](#docker-部署)
5. [生产环境配置](#生产环境配置)
6. [监控和日志](#监控和日志)
7. [维护和备份](#维护和备份)
8. [故障排除](#故障排除)

## 环境要求

### 最低要求
- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本
- **数据库**: PostgreSQL 15 或 SQLite (开发环境)
- **内存**: 2GB RAM
- **存储**: 10GB 可用空间

### 推荐配置
- **CPU**: 2核或更多
- **内存**: 4GB RAM 或更多
- **存储**: SSD, 50GB 可用空间
- **操作系统**: Ubuntu 22.04 LTS 或 CentOS 8

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-org/gamehub.git
cd gamehub/frontend
```

### 2. 安装依赖
```bash
npm ci
```

### 3. 配置环境
```bash
# 复制环境配置文件
cp .env.development .env.local

# 编辑环境变量
nano .env.local
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

## 手动部署

### 1. 构建应用
```bash
# 安装生产依赖
npm ci --only=production

# 生成 Prisma 客户端
npx prisma generate

# 构建应用
npm run build
```

### 2. 启动生产服务器
```bash
# 使用 PM2 (推荐)
npm install -g pm2
pm2 start npm --name "gamehub" -- start

# 或直接启动
npm start
```

### 3. 配置反向代理 (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Docker 部署

### 1. 使用 Docker Compose
```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 2. 单独构建 Docker 镜像
```bash
# 构建镜像
docker build -t gamehub:latest .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-secret" \
  gamehub:latest
```

### 3. Docker 服务说明
- **app-dev**: 开发环境应用 (端口 3000)
- **app-prod**: 生产环境应用 (端口 3001)
- **postgres**: PostgreSQL 数据库 (端口 5432)
- **redis**: Redis 缓存 (端口 6379)
- **nginx**: 反向代理 (端口 80/443)
- **prometheus**: 监控系统 (端口 9090)
- **grafana**: 监控仪表板 (端口 3002)

## 生产环境配置

### 1. 环境变量
创建 `.env.production` 文件并配置以下变量：

```bash
# 基础配置
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# 数据库
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# 认证
NEXTAUTH_SECRET=your-strong-secret-key
NEXTAUTH_URL=https://your-domain.com

# OAuth (可选)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. SSL 证书
```bash
# 使用 Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 或手动配置
# 将证书文件放在 ./ssl/ 目录下
```

### 3. 防火墙配置
```bash
# 开放必要端口
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 监控和日志

### 1. 应用监控
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002 (admin/admin)
- **健康检查**: https://your-domain.com/health

### 2. 日志管理
```bash
# 查看应用日志
pm2 logs gamehub

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 查看 Docker 日志
docker-compose logs -f
```

### 3. 关键指标监控
- **应用性能**: 响应时间、错误率、请求量
- **数据库**: 连接数、查询性能、磁盘使用
- **服务器**: CPU、内存、磁盘、网络
- **业务指标**: 用户数、活跃度、转化率

## 维护和备份

### 1. 数据库备份
```bash
# 备份 PostgreSQL
pg_dump -U username dbname > backup_$(date +%Y%m%d).sql

# 恢复备份
psql -U username dbname < backup_file.sql

# 自动备份脚本
# 参见 scripts/backup-db.sh
```

### 2. 文件备份
```bash
# 备份上传的文件
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz ./public/uploads/

# 备份配置文件
cp .env.production .env.production.backup
```

### 3. 更新部署
```bash
# 拉取最新代码
git pull origin main

# 重新构建
npm ci
npm run build

# 重启应用
pm2 restart gamehub

# 或使用部署脚本
./deploy.sh prod all
```

## 故障排除

### 常见问题

#### 1. 应用无法启动
```bash
# 检查端口占用
netstat -tulpn | grep :3000

# 检查环境变量
echo $NODE_ENV

# 查看错误日志
pm2 logs gamehub --lines 100
```

#### 2. 数据库连接失败
```bash
# 测试数据库连接
psql -h host -U user -d dbname

# 检查 Prisma 配置
npx prisma db push --dry-run
```

#### 3. 内存不足
```bash
# 查看内存使用
free -h
top

# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
```

#### 4. SSL 证书问题
```bash
# 检查证书有效期
sudo certbot certificates

# 续期证书
sudo certbot renew
```

### 调试模式
```bash
# 启用详细日志
export DEBUG=*

# 或使用 PM2
pm2 logs gamehub --lines 200
```

## 支持

### 获取帮助
- **文档**: https://docs.gamehub.example.com
- **GitHub Issues**: https://github.com/your-org/gamehub/issues
- **社区**: https://community.gamehub.example.com

### 紧急联系方式
- **技术支持**: support@gamehub.example.com
- **安全报告**: security@gamehub.example.com

---

**最后更新**: 2026年3月22日  
**版本**: 1.0.0  
**维护者**: GameHub 团队