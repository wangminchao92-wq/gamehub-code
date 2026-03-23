# GameHub Vercel 部署指南

## 🚀 快速开始

### 方法1: Vercel CLI (推荐)
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 进入项目目录
cd /Users/mac/.openclaw/workspace/gamehub-project/frontend

# 部署到Vercel
vercel --prod
```

### 方法2: Vercel Web界面
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入GitHub仓库或直接拖拽项目文件夹
4. 配置部署设置
5. 点击 "Deploy"

### 方法3: GitHub集成
1. 将项目推送到GitHub仓库
2. 在Vercel中连接GitHub账户
3. 选择仓库并配置自动部署

## ⚙️ Vercel环境配置

### 必需环境变量
在Vercel项目设置 → Environment Variables 中配置：

```env
# 数据库配置 (Vercel PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-xxxxxx.vercel-storage.com:5432/verceldb"

# 认证配置
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# 网站配置
NEXT_PUBLIC_SITE_URL="https://your-gamehub.vercel.app"
NEXT_PUBLIC_SITE_NAME="GameHub"
NEXT_PUBLIC_SITE_DESCRIPTION="Your Ultimate Gaming Destination"

# 功能开关 (测试环境可关闭部分功能)
NEXT_PUBLIC_ENABLE_REGISTRATION="true"
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN="false"  # 测试环境可关闭
NEXT_PUBLIC_ENABLE_COMMENTS="true"
NEXT_PUBLIC_ENABLE_FORUM="true"
NEXT_PUBLIC_ENABLE_STORE="false"  # 测试环境可关闭
```

### 可选环境变量 (测试环境可留空)
```env
# 社交登录 (测试环境可不配置)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# 邮件服务 (测试环境可不配置)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# 文件存储 (测试环境可使用本地存储)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# 支付配置 (测试环境不需要)
ALIPAY_APP_ID=""
WECHAT_APP_ID=""
```

## 🗄️ 数据库配置

### 选项1: Vercel PostgreSQL (推荐)
1. 在Vercel项目设置中启用 "Vercel Postgres"
2. 获取连接字符串
3. 更新 `DATABASE_URL` 环境变量
4. 运行数据库迁移:
```bash
npx prisma migrate deploy
```

### 选项2: 外部数据库
- **Supabase**: 免费PostgreSQL数据库
- **Neon**: Serverless PostgreSQL
- **Railway**: 简单的数据库托管

### 选项3: SQLite (仅开发)
⚠️ **注意**: Vercel不支持SQLite持久化存储，仅用于开发测试

## 🔧 构建配置

### Vercel项目设置
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 构建优化
```javascript
// next.config.js 中的Vercel优化配置
const nextConfig = {
  // Vercel自动处理以下配置:
  // - 图片优化 (通过Vercel Image Optimization)
  // - 边缘函数 (Edge Functions)
  // - 静态文件服务
  
  // 禁用本地图片优化 (使用Vercel的)
  images: {
    unoptimized: process.env.NODE_ENV === 'production' ? false : true,
  },
  
  // 启用SWC压缩
  swcMinify: true,
};
```

## 📁 项目结构调整

### 需要创建的文件
1. **`vercel.json`** - Vercel项目配置
2. **`.vercelignore`** - 忽略不需要部署的文件
3. **`vercel-build.sh`** - 自定义构建脚本

### vercel.json 配置示例
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["sin1"],  // 新加坡区域，适合亚洲用户
  "env": {
    "NODE_ENV": "production"
  },
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### .vercelignore 文件
```
# 开发文件
node_modules/
.next/
*.log
*.tmp

# 测试文件
test/
__tests__/
*.test.js
*.spec.js

# 配置文件
.env
.env.local
.env.development
.env.production.local

# 文档文件
*.md
docs/

# 构建产物
dist/
build/
out/

# 数据库文件
*.db
prisma/dev.db

# 临时文件
.DS_Store
Thumbs.db
```

## 🧪 测试环境部署策略

### 分支部署
- **main分支** → 生产环境 (https://gamehub.vercel.app)
- **develop分支** → 预览环境 (https://gamehub-git-develop.vercel.app)
- **feature/*分支** → 功能预览环境

### 环境变量管理
1. **Production环境变量**: 主分支使用
2. **Preview环境变量**: 所有预览分支使用
3. **Development环境变量**: 本地开发使用

## 🚨 常见问题解决

### 问题1: 构建失败
```bash
# 清理缓存重新构建
vercel --force

# 本地测试构建
npm run build
```

### 问题2: 数据库连接失败
1. 检查 `DATABASE_URL` 格式
2. 确保数据库允许Vercel IP访问
3. 运行迁移: `npx prisma migrate deploy`

### 问题3: 环境变量未生效
1. 在Vercel控制台重新保存环境变量
2. 重启部署
3. 检查变量名大小写

### 问题4: 静态资源404
1. 检查 `public/` 目录结构
2. 验证 `next.config.js` 中的静态资源配置
3. 检查构建日志中的警告

## 📊 监控和优化

### Vercel内置监控
1. **性能分析**: Vercel Analytics
2. **错误追踪**: Vercel Logs
3. **实时指标**: Real-time Metrics
4. **Web Vitals**: Core Web Vitals报告

### 性能优化建议
1. **启用Edge Functions**: 提高API响应速度
2. **使用Image Optimization**: 自动图片优化
3. **配置CDN缓存**: 静态资源缓存策略
4. **启用ISR**: 增量静态再生

## 🔄 部署流程

### 步骤1: 准备阶段
```bash
# 1. 检查项目状态
npm run build
npm start

# 2. 创建生产环境配置
cp .env.example .env.production

# 3. 更新数据库配置
# 修改DATABASE_URL为生产数据库
```

### 步骤2: 部署阶段
```bash
# 1. 部署到预览环境
vercel

# 2. 测试预览环境
# 访问提供的预览URL

# 3. 部署到生产环境
vercel --prod
```

### 步骤3: 验证阶段
1. 访问生产环境URL
2. 测试核心功能
3. 检查控制台错误
4. 验证性能指标

## 🎯 成功标准

### 部署成功标志
- ✅ 构建成功 (无错误)
- ✅ 网站可访问 (200 OK)
- ✅ 数据库连接正常
- ✅ 核心功能工作
- ✅ 性能指标达标

### 测试检查清单
- [ ] 首页加载正常
- [ ] 导航菜单工作
- [ ] 用户认证流程
- [ ] 内容页面显示
- [ ] API端点响应
- [ ] 移动端适配
- [ ] 性能测试通过

## 📞 支持资源

### Vercel文档
- Next.js部署: https://vercel.com/docs/frameworks/nextjs
- 环境变量: https://vercel.com/docs/projects/environment-variables
- 数据库: https://vercel.com/docs/storage/vercel-postgres

### 问题排查
1. 查看部署日志: `vercel logs`
2. 检查构建输出: Vercel控制台
3. 本地重现问题: `npm run build`

---

**部署准备完成时间**: 2026-03-23 21:12  
**建议**: 先从预览环境开始测试，验证所有功能后再部署到生产环境 🚀