#!/bin/bash

echo "🚀 GitHub一键上传脚本"
echo "====================="

echo ""
echo "📋 脚本功能:"
echo "1. 检查代码完整性"
echo "2. 添加所有文件到Git"
echo "3. 提交更改"
echo "4. 推送到GitHub"
echo ""

echo "🔍 检查当前状态..."
cd /Users/mac/.openclaw/workspace/game-website-complete

# 检查Git状态
echo "当前分支: $(git branch --show-current)"
echo "远程仓库: $(git remote get-url origin)"
echo "未跟踪文件: $(git status --porcelain | wc -l) 个"

echo ""
echo "📁 准备上传的文件:"

# 添加所有文件
echo "添加文件到Git..."
git add .

# 检查添加了哪些文件
echo "已添加的文件:"
git status --porcelain | head -20

echo ""
echo "💾 提交更改..."
read -p "请输入提交信息 (默认: '上传GameHub完整代码'): " commit_msg
commit_msg=${commit_msg:-"上传GameHub完整代码"}

git commit -m "$commit_msg"

if [ $? -eq 0 ]; then
    echo "✅ 提交成功!"
    echo "提交哈希: $(git log --oneline -1 | cut -d' ' -f1)"
else
    echo "❌ 提交失败，可能没有更改"
    exit 1
fi

echo ""
echo "🚀 准备推送到GitHub..."
echo "远程仓库: https://github.com/wangminchao92-wq/gamehub-code"
echo ""

echo "📝 认证说明:"
echo "Git将要求输入用户名和密码。"
echo "注意: 密码请使用GitHub个人访问令牌，而不是账户密码。"
echo ""
echo "获取令牌: https://github.com/settings/tokens"
echo "权限: 需要 'repo' 权限"
echo ""

read -p "按Enter开始推送，或按Ctrl+C取消..."

echo ""
echo "推送中..."
git push origin main

# 检查推送结果
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 推送成功!"
    echo "✅ 代码已上传到GitHub"
    echo "🌐 访问: https://github.com/wangminchao92-wq/gamehub-code"
    echo ""
    echo "📊 上传统计:"
    echo "提交: $(git log --oneline -1)"
    echo "文件数: $(find frontend -type f | wc -l) 个文件"
    echo "大小: $(du -sh frontend | cut -f1)"
    echo ""
    echo "🚀 下一步:"
    echo "1. 验证GitHub仓库内容"
    echo "2. 选择部署平台 (Vercel/Netlify)"
    echo "3. 连接GitHub仓库自动部署"
    echo "4. 获得生产环境URL"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "🔧 可能的原因:"
    echo "1. 认证失败 - 检查用户名和令牌"
    echo "2. 网络问题 - 检查网络连接"
    echo "3. 权限问题 - 检查仓库访问权限"
    echo ""
    echo "💡 解决方案:"
    echo "1. 使用GitHub网页上传: 打开仓库页面 → Add file → Upload files"
    echo "2. 使用GitHub Desktop: https://desktop.github.com"
    echo "3. 配置SSH密钥: 生成SSH密钥并添加到GitHub"
fi

echo ""
echo "📞 需要帮助? 请提供:"
echo "- 错误信息"
echo "- 使用的认证方式"
echo "- GitHub仓库URL"