#!/bin/bash

# ============================================
# GameHub 部署脚本
# ============================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "命令 $1 未找到，请先安装"
        exit 1
    fi
}

# 显示帮助
show_help() {
    echo "GameHub 部署脚本"
    echo ""
    echo "用法: ./deploy.sh [环境] [操作]"
    echo ""
    echo "环境:"
    echo "  dev     开发环境"
    echo "  staging 预发布环境"
    echo "  prod    生产环境"
    echo ""
    echo "操作:"
    echo "  setup   环境设置"
    echo "  build   构建应用"
    echo "  deploy  部署应用"
    echo "  all     执行所有步骤"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh dev setup    # 设置开发环境"
    echo "  ./deploy.sh prod all     # 部署到生产环境"
}

# 环境设置
setup_environment() {
    local env=$1
    
    log_info "设置 $env 环境..."
    
    case $env in
        dev)
            cp .env.development .env.local
            log_success "开发环境配置已复制到 .env.local"
            ;;
        staging)
            cp .env.staging .env.local
            log_success "预发布环境配置已复制到 .env.local"
            ;;
        prod)
            cp .env.production .env.local
            log_success "生产环境配置已复制到 .env.local"
            ;;
        *)
            log_error "未知环境: $env"
            exit 1
            ;;
    esac
    
    # 检查必要的环境变量
    if [ ! -f ".env.local" ]; then
        log_error ".env.local 文件不存在"
        exit 1
    fi
    
    log_success "环境设置完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装依赖..."
    
    # 检查 package.json
    if [ ! -f "package.json" ]; then
        log_error "package.json 文件不存在"
        exit 1
    fi
    
    # 安装依赖
    npm ci --only=production
    
    if [ $? -eq 0 ]; then
        log_success "依赖安装完成"
    else
        log_error "依赖安装失败"
        exit 1
    fi
}

# 数据库迁移
run_migrations() {
    log_info "运行数据库迁移..."
    
    # 生成 Prisma 客户端
    npx prisma generate
    
    # 运行迁移
    npx prisma db push --accept-data-loss
    
    if [ $? -eq 0 ]; then
        log_success "数据库迁移完成"
    else
        log_error "数据库迁移失败"
        exit 1
    fi
}

# 构建应用
build_application() {
    log_info "构建应用..."
    
    # 清理之前的构建
    rm -rf .next
    
    # 构建应用
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "应用构建完成"
        
        # 显示构建统计
        if [ -f ".next/build-stats.json" ]; then
            log_info "构建统计:"
            echo "  - 页面数量: $(find .next/server/pages -name '*.js' | wc -l)"
            echo "  - 静态文件大小: $(du -sh .next/static | cut -f1)"
            echo "  - 总构建大小: $(du -sh .next | cut -f1)"
        fi
    else
        log_error "应用构建失败"
        exit 1
    fi
}

# 运行测试
run_tests() {
    log_info "运行测试..."
    
    # 运行单元测试
    npm test -- --passWithNoTests
    
    if [ $? -eq 0 ]; then
        log_success "测试通过"
    else
        log_warning "测试失败或未找到测试"
    fi
}

# 安全检查
run_security_check() {
    log_info "运行安全检查..."
    
    # 检查依赖漏洞
    if command -v npm-audit &> /dev/null; then
        npm audit --audit-level=high
        if [ $? -ne 0 ]; then
            log_warning "发现高风险依赖漏洞"
        fi
    fi
    
    # 检查敏感信息
    if grep -r "password\|secret\|key" .env.local 2>/dev/null | grep -v "^#" | grep -v "your-" > /dev/null; then
        log_warning "发现可能的敏感信息泄露"
    fi
    
    log_success "安全检查完成"
}

# 部署应用
deploy_application() {
    local env=$1
    
    log_info "部署应用到 $env 环境..."
    
    case $env in
        dev)
            # 开发环境部署
            log_info "启动开发服务器..."
            npm run dev &
            DEPLOY_PID=$!
            log_success "开发服务器已启动 (PID: $DEPLOY_PID)"
            log_info "应用地址: http://localhost:3000"
            ;;
        staging|prod)
            # 生产环境部署
            log_info "启动生产服务器..."
            
            # 使用 PM2 管理进程
            if command -v pm2 &> /dev/null; then
                pm2 delete gamehub-$env 2>/dev/null || true
                pm2 start npm --name "gamehub-$env" -- start
                pm2 save
                pm2 startup
                
                log_success "应用已通过 PM2 启动"
                log_info "运行状态: pm2 status"
                log_info "查看日志: pm2 logs gamehub-$env"
            else
                # 直接启动
                nohup npm start > app.log 2>&1 &
                DEPLOY_PID=$!
                log_success "应用已启动 (PID: $DEPLOY_PID)"
                log_info "查看日志: tail -f app.log"
            fi
            ;;
    esac
    
    log_success "部署完成"
}

# 健康检查
health_check() {
    local env=$1
    local url=""
    
    case $env in
        dev)
            url="http://localhost:3000/health"
            ;;
        staging)
            url="https://staging.gamehub.example.com/health"
            ;;
        prod)
            url="https://gamehub.example.com/health"
            ;;
    esac
    
    if [ -n "$url" ]; then
        log_info "执行健康检查..."
        
        # 等待应用启动
        sleep 5
        
        # 检查健康端点
        for i in {1..10}; do
            if curl -s -f "$url" > /dev/null; then
                log_success "健康检查通过"
                return 0
            fi
            log_info "等待应用启动... ($i/10)"
            sleep 2
        done
        
        log_error "健康检查失败"
        return 1
    fi
}

# 主函数
main() {
    # 检查参数
    if [ $# -lt 2 ]; then
        show_help
        exit 1
    fi
    
    local env=$1
    local action=$2
    
    # 检查必要命令
    check_command npm
    check_command node
    
    log_info "开始部署 GameHub ($env 环境)"
    echo "============================================"
    
    case $action in
        setup)
            setup_environment $env
            ;;
        build)
            install_dependencies
            run_migrations
            build_application
            run_tests
            run_security_check
            ;;
        deploy)
            deploy_application $env
            health_check $env
            ;;
        all)
            setup_environment $env
            install_dependencies
            run_migrations
            build_application
            run_tests
            run_security_check
            deploy_application $env
            health_check $env
            ;;
        *)
            log_error "未知操作: $action"
            show_help
            exit 1
            ;;
    esac
    
    echo "============================================"
    log_success "部署流程完成"
    
    # 显示后续步骤
    echo ""
    log_info "后续步骤:"
    case $env in
        dev)
            echo "  1. 访问 http://localhost:3000"
            echo "  2. 查看日志: tail -f /tmp/gamehub-dev.log"
            echo "  3. 停止服务器: pkill -f 'next dev'"
            ;;
        staging|prod)
            echo "  1. 验证部署状态"
            echo "  2. 配置监控告警"
            echo "  3. 设置备份策略"
            echo "  4. 配置CDN和SSL"
            ;;
    esac
}

# 执行主函数
main "$@"