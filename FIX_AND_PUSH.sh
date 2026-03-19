#!/bin/bash

echo "🔧 GitHub上传问题修复脚本"
echo "========================="

echo ""
echo "📋 已发现的问题:"
echo "1. ✅ Git用户信息已配置"
echo "2. ✅ Git凭据助手已配置"
echo "3. ✅ 网络连接正常"
echo "4. ✅ 远程仓库配置正确"

echo ""
echo "🚀 现在尝试推送..."

echo ""
echo "📝 认证说明:"
echo "当提示输入用户名时，请输入: wangminchao92-wq"
echo "当提示输入密码时，请输入: GitHub个人访问令牌"
echo ""
echo "💡 如何获取令牌:"
echo "1. 访问 https://github.com/settings/tokens"
echo "2. 点击 'Generate new token'"
echo "3. 选择 'repo' 权限"
echo "4. 复制生成的令牌"
echo ""
echo "⚠️  注意: 使用令牌，而不是GitHub账户密码！"

echo ""
read -p "按Enter开始推送，或按Ctrl+C取消..."

echo ""
echo "执行: git push origin main"
echo "=========================="

# 执行推送
git push origin main

# 检查结果
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
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "🔧 备选方案:"
    echo ""
    echo "方案A: 使用GitHub网页上传"
    echo "   1. 访问 https://github.com/wangminchao92-wq/gamehub-code"
    echo "   2. 点击 'Add file' → 'Upload files'"
    echo "   3. 拖拽 frontend/ 文件夹"
    echo "   4. 提交更改"
    echo ""
    echo "方案B: 使用令牌直接配置"
    echo "   如果已有令牌，运行:"
    echo "   git remote set-url origin https://wangminchao92-wq:令牌@github.com/wangminchao92-wq/gamehub-code.git"
    echo "   然后重新推送"
    echo ""
    echo "方案C: 使用GitHub Desktop"
    echo "   下载: https://desktop.github.com"
fi

echo ""
echo "📞 请提供具体的错误信息以便进一步协助。"