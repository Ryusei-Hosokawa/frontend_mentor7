#!/bin/bash

# 新規HP制作プロジェクト用セットアップスクリプト
# React Router v7 + Bun + TypeScript テンプレート

set -e

# 色付きの出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 使用方法
usage() {
    echo "新規HP制作プロジェクト セットアップスクリプト"
    echo ""
    echo "使用方法: $0 [プロジェクト名] [プロジェクトタイプ]"
    echo ""
    echo "プロジェクトタイプ:"
    echo "  corporate  - 企業サイト（デフォルト）"
    echo "  ecommerce  - ECサイト"
    echo "  portfolio  - ポートフォリオサイト"
    echo "  landing    - ランディングページ"
    echo ""
    echo "例:"
    echo "  $0 my-company-site corporate"
    echo "  $0 my-portfolio portfolio"
    echo ""
}

# プロジェクト名の取得
get_project_name() {
    if [ -z "$1" ]; then
        echo -n "プロジェクト名を入力してください: "
        read -r PROJECT_NAME
    else
        PROJECT_NAME="$1"
    fi
    
    if [ -z "$PROJECT_NAME" ]; then
        error "プロジェクト名が必要です"
        usage
        exit 1
    fi
    
    # プロジェクト名の検証
    if [[ ! "$PROJECT_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        error "プロジェクト名は英数字、ハイフン、アンダースコアのみ使用可能です"
        exit 1
    fi
}

# プロジェクトタイプの取得
get_project_type() {
    PROJECT_TYPE="${2:-corporate}"
    
    case "$PROJECT_TYPE" in
        "corporate"|"ecommerce"|"portfolio"|"landing")
            log "プロジェクトタイプ: $PROJECT_TYPE"
            ;;
        *)
            error "無効なプロジェクトタイプ: $PROJECT_TYPE"
            usage
            exit 1
            ;;
    esac
}

# プロジェクトディレクトリの作成
create_project_directory() {
    log "プロジェクトディレクトリを作成中: $PROJECT_NAME"
    
    if [ -d "$PROJECT_NAME" ]; then
        error "ディレクトリ '$PROJECT_NAME' は既に存在します"
        exit 1
    fi
    
    mkdir "$PROJECT_NAME"
    cd "$PROJECT_NAME"
    
    success "プロジェクトディレクトリ作成完了"
}

# テンプレートファイルのコピー
copy_template_files() {
    log "テンプレートファイルをコピー中..."
    
    # 現在のスクリプトの場所からテンプレートのルートディレクトリを特定
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    TEMPLATE_DIR="$(dirname "$SCRIPT_DIR")"
    
    # 除外するファイル・ディレクトリ
    EXCLUDE_PATTERNS=(
        "--exclude=node_modules"
        "--exclude=build"
        "--exclude=.git"
        "--exclude=*.log"
        "--exclude=.env"
        "--exclude=backups"
        "--exclude=logs"
    )
    
    # rsyncでファイルをコピー
    rsync -av "${EXCLUDE_PATTERNS[@]}" "$TEMPLATE_DIR/" ./
    
    success "テンプレートファイルのコピー完了"
}

# package.jsonの更新
update_package_json() {
    log "package.jsonを更新中..."
    
    if [ -f "package.json" ]; then
        # プロジェクト名を更新
        sed -i.bak "s/\"rainbow.com\"/\"$PROJECT_NAME\"/g" package.json
        rm package.json.bak
        
        success "package.json更新完了"
    else
        warning "package.jsonが見つかりません"
    fi
}

# プロジェクト固有の設定ファイル生成
generate_project_config() {
    log "プロジェクト固有設定を生成中..."
    
    # .envファイルのテンプレート作成
    cat > .env.example << EOF
# VPS接続情報
VPS_IP=your-vps-ip
VPS_USERNAME=your-vps-username
SSH_PORT=22

# デプロイ設定
DEPLOY_PATH=/var/www/html
APP_PORT=3000
APP_NAME=$PROJECT_NAME
DOMAIN=your-domain.com
NODE_ENV=production
PM2_APP_NAME=$PROJECT_NAME-app

# CMS設定（必要に応じて）
CMS_API_URL=https://your-wordpress.com/graphql

# メール設定
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
FROM_EMAIL=noreply@your-domain.com
TO_EMAIL=contact@your-domain.com
EOF

    # プロジェクト情報ファイル作成
    cat > PROJECT_INFO.md << EOF
# $PROJECT_NAME

## プロジェクト情報
- **プロジェクト名**: $PROJECT_NAME
- **プロジェクトタイプ**: $PROJECT_TYPE
- **作成日**: $(date +'%Y-%m-%d')
- **テンプレートバージョン**: 1.0.0

## セットアップ済み機能
- React Router v7 (SSR対応)
- Bun (高速パッケージマネージャー)
- TypeScript (型安全性)
- Tailwind CSS (ユーティリティファーストCSS)
- Storybook (コンポーネント開発)
- GitHub Actions (自動デプロイ)

## 次のステップ
1. \`.env\`ファイルを作成し、環境変数を設定
2. GitHub リポジトリを作成
3. VPS環境を準備
4. GitHub Secrets を設定
5. デプロイテスト

詳細は \`docs/TEMPLATE-SETUP.md\` を参照してください。
EOF

    success "プロジェクト固有設定生成完了"
}

# プロジェクトタイプ別の設定
configure_project_type() {
    log "プロジェクトタイプ別設定を適用中: $PROJECT_TYPE"
    
    case "$PROJECT_TYPE" in
        "corporate")
            # 企業サイト用設定
            configure_corporate_site
            ;;
        "ecommerce")
            # ECサイト用設定
            configure_ecommerce_site
            ;;
        "portfolio")
            # ポートフォリオ用設定
            configure_portfolio_site
            ;;
        "landing")
            # ランディングページ用設定
            configure_landing_page
            ;;
    esac
    
    success "プロジェクトタイプ別設定完了"
}

# 企業サイト用設定
configure_corporate_site() {
    log "企業サイト用設定を適用中..."
    
    # 必要なページの有効化（すでに存在するため、特別な処理は不要）
    # お問い合わせフォームはデフォルトで有効
    
    # README更新
    cat >> README.md << EOF

## 企業サイト仕様
- 会社概要ページ
- サービス紹介ページ
- お問い合わせフォーム
- CMS連携対応
- SEO最適化
EOF
}

# ECサイト用設定
configure_ecommerce_site() {
    log "ECサイト用設定を適用中..."
    
    # 追加の環境変数
    cat >> .env.example << EOF

# EC機能設定
PAYMENT_GATEWAY_API_KEY=your-payment-api-key
INVENTORY_API_URL=your-inventory-api
SHIPPING_API_KEY=your-shipping-api-key
EOF

    cat >> README.md << EOF

## ECサイト仕様
- 商品カタログ
- ショッピングカート
- 決済機能
- 在庫管理
- ユーザー認証
- 注文管理
EOF
}

# ポートフォリオ用設定
configure_portfolio_site() {
    log "ポートフォリオ用設定を適用中..."
    
    # 開発環境用のポート変更
    sed -i.bak 's/"APP_PORT": "3000"/"APP_PORT": "3001"/g' .github/config/deploy-config.json 2>/dev/null || true
    
    cat >> README.md << EOF

## ポートフォリオ仕様
- 作品ギャラリー
- ブログ機能
- お問い合わせフォーム
- レスポンシブデザイン
EOF
}

# ランディングページ用設定
configure_landing_page() {
    log "ランディングページ用設定を適用中..."
    
    cat >> .env.example << EOF

# アナリティクス設定
GOOGLE_ANALYTICS_ID=your-ga-id
FACEBOOK_PIXEL_ID=your-pixel-id
CONVERSION_TRACKING_ID=your-conversion-id
EOF

    cat >> README.md << EOF

## ランディングページ仕様
- 高いコンバージョン率を目指した設計
- A/Bテスト対応
- アナリティクス統合
- コンバージョン追跡
- 高速読み込み最適化
EOF
}

# Gitリポジトリの初期化
initialize_git() {
    log "Gitリポジトリを初期化中..."
    
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit: $PROJECT_NAME ($PROJECT_TYPE)"
        
        success "Gitリポジトリ初期化完了"
        
        echo ""
        log "次のステップ:"
        log "1. GitHubでリポジトリを作成"
        log "2. git remote add origin https://github.com/your-username/$PROJECT_NAME.git"
        log "3. git push -u origin main"
    else
        warning "Gitリポジトリは既に初期化されています"
    fi
}

# 依存関係のインストール
install_dependencies() {
    log "依存関係をインストール中..."
    
    if command -v bun > /dev/null 2>&1; then
        bun install
        success "依存関係のインストール完了"
    else
        warning "Bunがインストールされていません。手動でインストールしてください:"
        echo "curl -fsSL https://bun.sh/install | bash"
    fi
}

# セットアップ完了メッセージ
show_completion_message() {
    echo ""
    success "=== プロジェクトセットアップ完了 ==="
    echo ""
    log "プロジェクト名: $PROJECT_NAME"
    log "プロジェクトタイプ: $PROJECT_TYPE"
    log "プロジェクトディレクトリ: $(pwd)"
    echo ""
    log "次のステップ:"
    log "1. cd $PROJECT_NAME"
    log "2. .envファイルを作成し、環境変数を設定"
    log "3. GitHub リポジトリを作成してプッシュ"
    log "4. VPS環境を準備"
    log "5. GitHub Secrets を設定"
    log "6. bun run dev でローカル開発開始"
    echo ""
    log "詳細なセットアップ手順: docs/TEMPLATE-SETUP.md"
    echo ""
    success "HP制作テンプレートをご利用いただき、ありがとうございます！"
}

# メイン処理
main() {
    echo ""
    log "=== HP制作プロジェクト セットアップ開始 ==="
    echo ""
    
    get_project_name "$1"
    get_project_type "$2"
    
    create_project_directory
    copy_template_files
    update_package_json
    generate_project_config
    configure_project_type
    initialize_git
    install_dependencies
    
    show_completion_message
}

# 引数処理
case "${1:-}" in
    "help"|"-h"|"--help")
        usage
        exit 0
        ;;
    *)
        main "$1" "$2"
        ;;
esac