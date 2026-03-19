#!/bin/bash

echo "🔍 GitHub上传问题诊断"
echo "====================="

echo ""
echo "📋 系统信息:"
echo "时间: $(date)"
echo "目录: $(pwd)"
echo "用户: $(whoami)"

echo ""
echo "🔧 Git配置检查:"
echo "1. Git版本: $(git --version)"
echo "2. 用户配置:"
git config --get user.name || echo "未设置用户名"
git config --get user.email || echo "未设置邮箱"
echo "3. 远程仓库:"
git remote -v
echo "4. 当前分支: $(git branch --show-current)"
echo "5. 最后提交: $(git log --oneline -1)"

echo ""
echo "🌐 网络连接测试:"
echo "1. 测试GitHub HTTPS访问:"
curl -s -o /dev/null -w "HTTP状态: %{http_code}\n" https://github.com
echo "2. 测试API访问:"
curl -s https://api.github.com/zen 2>/dev/null && echo "✅ GitHub API可访问" || echo "❌ GitHub API不可访问"

echo ""
echo "📁 本地代码检查:"
echo "1. frontend目录:"
if [ -d "frontend" ]; then
    echo "   ✅ 存在"
    echo "   文件数: $(find frontend -type f | wc -l)"
    echo "   大小: $(du -sh frontend | cut -f1)"
else
    echo "   ❌ 不存在"
fi

echo "2. 核心文件检查:"
check_file() {
    if [ -f "$1" ]; then
        echo "   ✅ $1"
    else
        echo "   ❌ $1 (缺失)"
    fi
}

check_file "frontend/package.json"
check_file "frontend/next.config.js"
check_file "frontend/src/pages/index.tsx"
check_file "frontend/public/robots.txt"
check_file "frontend/public/sitemap.xml"
check_file "frontend/public/llms.txt"

echo ""
echo "🔐 认证问题诊断:"
echo "1. 检查Git凭据存储:"
git config --get credential.helper || echo "未配置凭据助手"
echo "2. 检查SSH配置:"
if [ -f ~/.ssh/config ]; then
    echo "   SSH配置文件存在"
else
    echo "   无SSH配置文件"
fi

echo ""
echo "🚀 测试推送（不实际推送）:"
echo "执行: git push --dry-run origin main"
git push --dry-run origin main 2>&1 | head -10

echo ""
echo "💡 常见问题解决方案:"
echo ""
echo "1. ❌ 问题: 'fatal: could not read Username'"
echo "   原因: Git需要认证但未配置"
echo "   解决:"
echo "   git config --global credential.helper store"
echo "   然后重新尝试推送"
echo ""
echo "2. ❌ 问题: 'Permission denied (publickey)'"
echo "   原因: SSH密钥问题"
echo "   解决:"
echo "   git remote set-url origin https://github.com/wangminchao92-wq/gamehub-code.git"
echo "   切换到HTTPS方式"
echo ""
echo "3. ❌ 问题: 'remote: Invalid username or password'"
echo "   原因: 密码错误或使用账户密码而非令牌"
echo "   解决:"
echo "   使用GitHub个人访问令牌作为密码"
echo "   获取令牌: https://github.com/settings/tokens"
echo ""
echo "4. ❌ 问题: 长时间无响应"
echo "   原因: 网络问题或代理设置"
echo "   解决:"
echo "   检查网络连接"
echo "   设置Git代理: git config --global http.proxy http://proxy:port"
echo ""
echo "5. ❌ 问题: 'remote: Repository not found'"
echo "   原因: 仓库不存在或无权访问"
echo "   解决:"
echo "   确认仓库URL正确"
echo "   确认有仓库访问权限"
echo ""
echo "🎯 推荐解决方案:"
echo ""
echo "方案A: 使用GitHub网页上传（最简单）"
echo "   1. 访问 https://github.com/wangminchao92-wq/gamehub-code"
echo "   2. 点击 'Add file' → 'Upload files'"
echo "   3. 拖拽 frontend/ 文件夹"
echo "   4. 提交更改"
echo ""
echo "方案B: 配置Git令牌认证"
echo "   1. 获取GitHub令牌: https://github.com/settings/tokens"
echo "   2. 配置远程仓库:"
echo "      git remote set-url origin https://wangminchao92-wq:令牌@github.com/wangminchao92-wq/gamehub-code.git"
echo "   3. 推送: git push origin main"
echo ""
echo "方案C: 使用GitHub Desktop"
echo "   1. 下载: https://desktop.github.com"
echo "   2. 添加本地仓库"
echo "   3. 点击推送按钮"
echo ""
echo "📞 请告诉我您遇到的具体错误信息，以便提供针对性解决方案。"