# Vercel 环境变量配置模板

将以下变量添加到 Vercel 项目设置 → Environment Variables 中：

## 🔐 必需环境变量

### 数据库配置
```
DATABASE_URL=postgresql://username:password@ep-xxxxxx.vercel-storage.com:5432/verceldb
```
*说明：使用Vercel Postgres或外部PostgreSQL数据库*

### 认证配置
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://your-gamehub.vercel.app
```

### 网站基础配置
```
NEXT_PUBLIC_SITE_URL=https://your-gamehub.vercel.app
NEXT_PUBLIC_SITE_NAME=GameHub
NEXT_PUBLIC_SITE_DESCRIPTION=Your Ultimate Gaming Destination
```

### 功能开关 (测试环境)
```
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=false
NEXT_PUBLIC_ENABLE_COMMENTS=true
NEXT_PUBLIC_ENABLE_FORUM=true
NEXT_PUBLIC_ENABLE_STORE=false
NEXT_PUBLIC_ENABLE_PAYMENT=false
```

## 📁 可选环境变量 (测试环境可留空)

### 社交登录 (测试时可禁用)
```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 邮件服务 (测试时可禁用)
```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=GameHub <noreply@gamehub.com>
```

### 文件存储 (测试时可使用本地存储)
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 监控和分析
```
SENTRY_DSN=
GOOGLE_ANALYTICS_ID=
```

## 🛠️ 环境变量分组建议

### Production环境 (主分支)
- 所有必需变量 + 真实服务配置
- 启用所有功能
- 配置监控和分析

### Preview环境 (所有预览分支)
- 必需变量 + 测试数据库
- 禁用支付和敏感功能
- 使用测试API密钥

### Development环境 (本地开发)
- 使用SQLite数据库
- 启用所有功能进行测试
- 使用模拟服务

## 🔧 变量生成工具

### 生成JWT密钥
```bash
# 生成强密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 生成NEXTAUTH密钥
```bash
openssl rand -base64 32
```

## 📋 部署检查清单

### 部署前检查
- [ ] DATABASE_URL 已配置且可访问
- [ ] JWT_SECRET 已设置且足够复杂
- [ ] NEXTAUTH_URL 与部署域名匹配
- [ ] 所有NEXT_PUBLIC_变量已设置

### 部署后验证
- [ ] 网站可访问 (200 OK)
- [ ] 数据库连接正常
- [ ] 用户注册/登录功能
- [ ] 核心页面加载正常
- [ ] 控制台无关键错误

## 🚨 安全注意事项

1. **不要提交敏感信息到Git**
   - 所有密钥通过环境变量管理
   - 使用 `.env.example` 作为模板
   - 确保 `.env*` 在 `.gitignore` 中

2. **定期轮换密钥**
   - JWT密钥每3-6个月更换
   - 数据库密码定期更新
   - 撤销不再使用的API密钥

3. **环境隔离**
   - 开发、测试、生产环境使用不同数据库
   - 不同环境使用不同API密钥
   - 生产环境禁用调试功能

## 💡 最佳实践

### 变量命名
- 使用大写字母和下划线
- 描述性名称，如 `DATABASE_URL` 而不是 `DB`
- 前缀区分：`NEXT_PUBLIC_` 表示客户端可用

### 值管理
- 敏感信息使用Vercel Secrets
- 非敏感配置可使用硬编码默认值
- 提供合理的默认值

### 文档维护
- 更新 `.env.example` 反映最新变量
- 在README中说明环境变量要求
- 记录每个变量的用途和示例值

---

**配置模板版本**: 1.0  
**最后更新**: 2026-03-23  
**适用环境**: Vercel部署测试环境 🚀