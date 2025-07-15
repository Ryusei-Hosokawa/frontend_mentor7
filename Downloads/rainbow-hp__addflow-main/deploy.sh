#!/bin/bash

# VPS用デプロイスクリプト
# Bun v1.2.18 + React Router v7 最適化
# テンプレート対応版

set -e  # エラー時に停止

# 環境変数のデフォルト値
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/html}"
APP_PORT="${APP_PORT:-3000}"
APP_NAME="${APP_NAME:-app}"
DOMAIN="${DOMAIN:-localhost}"
NODE_ENV="${NODE_ENV:-production}"
PM2_APP_NAME="${PM2_APP_NAME:-rainbow-app}"
HEALTH_CHECK_PATH="${HEALTH_CHECK_PATH:-/health}"
DOCKER_COMPOSE_PROFILE="${DOCKER_COMPOSE_PROFILE:-}"

# 設定ファイルが存在する場合は読み込み
if [ -f "./.github/config/deploy-config.json" ]; then
    log "設定ファイルを読み込み中..."
    # jqが利用可能な場合のみ
    if command -v jq > /dev/null 2>&1; then
        CONFIG_ENV="${CONFIG_ENV:-production}"
        DEPLOY_PATH=$(jq -r ".environments.${CONFIG_ENV}.path // "$DEPLOY_PATH"" ./.github/config/deploy-config.json)
        APP_PORT=$(jq -r ".environments.${CONFIG_ENV}.port // "$APP_PORT"" ./.github/config/deploy-config.json)
        DOMAIN=$(jq -r ".environments.${CONFIG_ENV}.domain // "$DOMAIN"" ./.github/config/deploy-config.json)
    fi
fi

# 色付きの出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ関数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✓ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠ $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ✗ $1${NC}"
}

# 前提条件チェック
check_prerequisites() {
    log "前提条件をチェック中..."
    
    # Docker チェック
    if ! command -v docker &> /dev/null; then
        error "Docker がインストールされていません"
        exit 1
    fi
    
    # Docker Compose チェック
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose がインストールされていません"
        exit 1
    fi
    
    # ディスク容量チェック
    available_space=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$available_space" -lt 2 ]; then
        warning "ディスク容量が少ないです (${available_space}GB)"
    fi
    
    success "前提条件チェック完了"
}

# 既存コンテナの停止
stop_existing_containers() {
    log "既存コンテナを停止中..."
    
    if [ -n "$DOCKER_COMPOSE_PROFILE" ]; then
        docker-compose --profile "$DOCKER_COMPOSE_PROFILE" down || true
    else
        docker-compose down || true
    fi
    
    success "既存コンテナの停止完了"
}

# Docker イメージのビルド
build_images() {
    log "Docker イメージをビルド中..."
    docker-compose build --no-cache
    success "Docker イメージのビルド完了"
}

# 本番環境の起動
start_production() {
    log "本番環境を起動中..."
    
    if [ -n "$DOCKER_COMPOSE_PROFILE" ]; then
        docker-compose --profile "$DOCKER_COMPOSE_PROFILE" up -d
    else
        docker-compose up -d
    fi
    
    success "本番環境の起動完了"
}

# ヘルスチェック
health_check() {
    log "ヘルスチェックを実行中..."
    
    local health_url="http://${DOMAIN}:${APP_PORT}${HEALTH_CHECK_PATH}"
    log "ヘルスチェックURL: $health_url"
    
    # 最大60秒間待機
    for i in {1..12}; do
        if curl -f "$health_url" 2>/dev/null; then
            success "ヘルスチェック成功"
            return 0
        fi
        log "ヘルスチェック待機中... ($i/12)"
        sleep 5
    done
    
    error "ヘルスチェック失敗: $health_url"
    return 1
}

# ログの確認
show_logs() {
    log "アプリケーションログを表示中..."
    docker-compose logs --tail=20
}

# システムリソースの最適化
optimize_system() {
    log "システムリソースを最適化中..."
    
    # 不要なDockerリソースの削除
    docker system prune -f
    
    # VPS用メモリ最適化
    echo 1 > /proc/sys/vm/drop_caches || true
    
    success "システムリソースの最適化完了"
}

# バックアップ作成
create_backup() {
    log "バックアップを作成中..."
    
    backup_dir="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # 設定ファイルのバックアップ
    cp docker-compose.yml "$backup_dir/"
    cp Dockerfile "$backup_dir/"
    cp package.json "$backup_dir/"
    cp bunfig.toml "$backup_dir/"
    
    success "バックアップ作成完了: $backup_dir"
}

# 設定表示
show_config() {
    log "=== デプロイ設定 ==="
    log "デプロイパス: $DEPLOY_PATH"
    log "アプリポート: $APP_PORT"
    log "アプリ名: $APP_NAME"
    log "ドメイン: $DOMAIN"
    log "Node環境: $NODE_ENV"
    log "PM2アプリ名: $PM2_APP_NAME"
    log "ヘルスチェックパス: $HEALTH_CHECK_PATH"
    [ -n "$DOCKER_COMPOSE_PROFILE" ] && log "Dockerプロファイル: $DOCKER_COMPOSE_PROFILE"
    log "========================"
}

# メイン処理
main() {
    log "=== VPS デプロイ開始 ==="
    log "Bun v1.2.18 + React Router v7 環境"
    
    show_config
    check_prerequisites
    create_backup
    stop_existing_containers
    build_images
    start_production
    
    if health_check; then
        success "=== デプロイ成功 ==="
        log "アプリケーションURL: http://${DOMAIN}:${APP_PORT}"
        show_logs
    else
        error "=== デプロイ失敗 ==="
        show_logs
        exit 1
    fi
    
    optimize_system
    
    log "=== デプロイ完了 ==="
}

# 開発環境モード
dev_mode() {
    log "=== 開発環境モード ==="
    
    # 開発環境用の設定上書き
    export NODE_ENV="development"
    export DOCKER_COMPOSE_PROFILE="dev"
    local dev_port="${DEV_PORT:-3001}"
    
    show_config
    stop_existing_containers
    docker-compose --profile dev up -d
    success "開発環境起動完了: http://${DOMAIN}:${dev_port}"
}

# 監視モード
monitoring_mode() {
    log "=== 監視モード ==="
    docker-compose --profile monitoring up -d
    success "監視ツール起動完了: http://localhost:9100"
}

# 使用方法
usage() {
    echo "使用方法: $0 [オプション]"
    echo "オプション:"
    echo "  (なし)    本番環境デプロイ"
    echo "  dev       開発環境起動"
    echo "  monitor   監視ツール起動"
    echo "  stop      全コンテナ停止"
    echo "  logs      ログ表示"
    echo "  clean     リソース削除"
    echo "  config    設定表示"
    echo "  help      ヘルプ表示"
    echo ""
    echo "環境変数:"
    echo "  DEPLOY_PATH: デプロイパス (デフォルト: /var/www/html)"
    echo "  APP_PORT: アプリポート (デフォルト: 3000)"
    echo "  DOMAIN: ドメイン (デフォルト: localhost)"
    echo "  NODE_ENV: Node環境 (デフォルト: production)"
    echo ""
    echo "例:"
    echo "  DEPLOY_PATH=/var/www/sites/development $0"
    echo "  APP_PORT=3001 DOMAIN=dev.example.com $0 dev"
}

# 引数に応じた処理
case "${1:-}" in
    "dev")
        dev_mode
        ;;
    "monitor")
        monitoring_mode
        ;;
    "stop")
        stop_existing_containers
        ;;
    "logs")
        show_logs
        ;;
    "clean")
        stop_existing_containers
        optimize_system
        ;;
    "config")
        show_config
        ;;
    "help")
        usage
        ;;
    "")
        main
        ;;
    *)
        error "不明なオプション: $1"
        usage
        exit 1
        ;;
esac