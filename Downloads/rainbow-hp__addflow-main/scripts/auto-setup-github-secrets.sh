#!/bin/bash

# GitHub Secrets自動設定スクリプト
# プロジェクト名とドメインから自動でSecrets生成・設定

set -e

# 色付きの出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"; }
success() { echo -e "${GREEN}[$(date +'%H:%M:%S')] ✓ $1${NC}"; }
warning() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠ $1${NC}"; }
error() { echo -e "${RED}[$(date +'%H:%M:%S')] ✗ $1${NC}"; }

# 設定値の読み込み
load_project_config() {
    # package.jsonからプロジェクト名を取得
    if [ -f "package.json" ]; then
        PROJECT_NAME=$(grep '"name"' package.json | sed 's/.*"name": "\([^"]*\)".*/\1/')
        log "プロジェクト名を自動検出: $PROJECT_NAME"
    else
        error "package.jsonが見つかりません"
        exit 1
    fi
    
    # ディレクトリ名からもプロジェクト名を推測
    DIRECTORY_NAME=$(basename "$(pwd)")
    
    # プロジェクト名の正規化（ハイフン区切りに統一）
    NORMALIZED_NAME=$(echo "$PROJECT_NAME" | sed 's/[._]/-/g' | tr '[:upper:]' '[:lower:]')
    
    log "正規化されたプロジェクト名: $NORMALIZED_NAME"
}

# 環境設定の取得
get_environment_config() {
    echo ""
    log "=== 環境設定 ==="
    
    # 環境の選択
    echo "デプロイ環境を選択してください:"
    echo "1) development (開発環境)"
    echo "2) staging (ステージング環境)" 
    echo "3) production (本番環境)"
    echo -n "選択 [1-3]: "
    read -r ENV_CHOICE
    
    case $ENV_CHOICE in
        1)
            ENVIRONMENT="development"
            APP_PORT="3001"
            DEPLOY_PATH="/var/www/sites/development"
            DOMAIN_PREFIX="dev"
            ;;
        2)
            ENVIRONMENT="staging"
            APP_PORT="3002"
            DEPLOY_PATH="/var/www/sites/staging"
            DOMAIN_PREFIX="staging"
            ;;
        3)
            ENVIRONMENT="production"
            APP_PORT="3000"
            DEPLOY_PATH="/var/www/html"
            DOMAIN_PREFIX=""
            ;;
        *)
            warning "無効な選択です。developmentを使用します。"
            ENVIRONMENT="development"
            APP_PORT="3001"
            DEPLOY_PATH="/var/www/sites/development"
            DOMAIN_PREFIX="dev"
            ;;
    esac
    
    # ドメイン名の入力
    echo ""
    echo -n "ベースドメイン名を入力してください (例: rainbow-transport.com): "
    read -r BASE_DOMAIN
    
    if [ -z "$BASE_DOMAIN" ]; then
        BASE_DOMAIN="${NORMALIZED_NAME}.com"
        warning "デフォルトドメインを使用: $BASE_DOMAIN"
    fi
    
    # 完全なドメイン名の構築
    if [ -n "$DOMAIN_PREFIX" ]; then
        FULL_DOMAIN="${DOMAIN_PREFIX}.${BASE_DOMAIN}"
    else
        FULL_DOMAIN="$BASE_DOMAIN"
    fi
    
    log "設定されたドメイン: $FULL_DOMAIN"
}

# VPS設定の取得
get_vps_config() {
    echo ""
    log "=== VPS設定 ==="
    
    # デフォルト値の提示
    DEFAULT_VPS_IP="162.43.27.191"
    DEFAULT_VPS_USER="addflow"
    
    echo -n "VPS IPアドレス [$DEFAULT_VPS_IP]: "
    read -r VPS_IP
    VPS_IP=${VPS_IP:-$DEFAULT_VPS_IP}
    
    echo -n "VPS ユーザー名 [$DEFAULT_VPS_USER]: "
    read -r VPS_USERNAME
    VPS_USERNAME=${VPS_USERNAME:-$DEFAULT_VPS_USER}
    
    echo -n "SSH ポート [22]: "
    read -r SSH_PORT
    SSH_PORT=${SSH_PORT:-22}
    
    # SSH秘密鍵ファイルの確認
    SSH_KEY_FILE="$HOME/.ssh/github-deploy-addflow"
    if [ ! -f "$SSH_KEY_FILE" ]; then
        error "SSH秘密鍵ファイルが見つかりません: $SSH_KEY_FILE"
        echo "以下のコマンドで作成してください:"
        echo "ssh-keygen -t ed25519 -C 'github-actions-deploy' -f ~/.ssh/github-deploy-addflow"
        exit 1
    fi
    
    success "SSH秘密鍵ファイル確認完了: $SSH_KEY_FILE"
}

# セキュリティ秘密鍵の生成
generate_security_secrets() {
    log "セキュリティ用秘密鍵を生成中..."
    
    # 32文字のランダム文字列生成
    JWT_RANDOM=$(openssl rand -hex 16)
    SESSION_RANDOM=$(openssl rand -hex 16)
    
    JWT_SECRET="${NORMALIZED_NAME}_jwt_${JWT_RANDOM}_$(date +%Y)"
    SESSION_SECRET="${NORMALIZED_NAME}_session_${SESSION_RANDOM}_$(date +%Y)"
    
    success "セキュリティ秘密鍵生成完了"
}

# メール設定の生成
generate_email_config() {
    log "メール設定を生成中..."
    
    FROM_EMAIL="noreply@${BASE_DOMAIN}"
    TO_EMAIL="contact@${BASE_DOMAIN}"
    REPLY_TO_EMAIL="contact@${BASE_DOMAIN}"
    
    # SMTP設定のテンプレート
    echo ""
    echo "SMTP設定を選択してください:"
    echo "1) Gmail (smtp.gmail.com)"
    echo "2) SendGrid (smtp.sendgrid.net)"
    echo "3) Amazon SES (email-smtp.us-east-1.amazonaws.com)"
    echo "4) カスタム"
    echo -n "選択 [1-4]: "
    read -r SMTP_CHOICE
    
    case $SMTP_CHOICE in
        1)
            SMTP_HOST="smtp.gmail.com"
            SMTP_PORT="587"
            SMTP_USER="$FROM_EMAIL"
            warning "Gmail App Passwordの設定が必要です"
            ;;
        2)
            SMTP_HOST="smtp.sendgrid.net"
            SMTP_PORT="587"
            SMTP_USER="apikey"
            warning "SendGrid API Keyの設定が必要です"
            ;;
        3)
            SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
            SMTP_PORT="587"
            SMTP_USER="your-ses-username"
            warning "AWS SES認証情報の設定が必要です"
            ;;
        4)
            echo -n "SMTP ホスト: "
            read -r SMTP_HOST
            echo -n "SMTP ポート [587]: "
            read -r SMTP_PORT
            SMTP_PORT=${SMTP_PORT:-587}
            echo -n "SMTP ユーザー: "
            read -r SMTP_USER
            ;;
        *)
            warning "無効な選択です。Gmailを使用します。"
            SMTP_HOST="smtp.gmail.com"
            SMTP_PORT="587"
            SMTP_USER="$FROM_EMAIL"
            ;;
    esac
    
    success "メール設定生成完了"
}

# CMS設定の生成
generate_cms_config() {
    log "CMS設定を生成中..."
    
    CMS_SUBDOMAIN="cms"
    CMS_API_URL="https://${CMS_SUBDOMAIN}.${BASE_DOMAIN}/graphql"
    
    echo ""
    echo -n "WordPress CMS を使用しますか? [y/N]: "
    read -r USE_CMS
    
    if [[ $USE_CMS =~ ^[Yy]$ ]]; then
        echo -n "CMS サブドメイン [$CMS_SUBDOMAIN]: "
        read -r CMS_INPUT
        CMS_SUBDOMAIN=${CMS_INPUT:-$CMS_SUBDOMAIN}
        CMS_API_URL="https://${CMS_SUBDOMAIN}.${BASE_DOMAIN}/graphql"
        
        success "CMS設定: $CMS_API_URL"
    else
        log "CMS設定をスキップ"
    fi
}

# 設定内容の確認表示
show_configuration() {
    echo ""
    log "=== 設定内容確認 ==="
    echo ""
    
    echo "📋 基本設定:"
    echo "  プロジェクト名: $NORMALIZED_NAME"
    echo "  環境: $ENVIRONMENT"
    echo "  ドメイン: $FULL_DOMAIN"
    echo ""
    
    echo "🖥️  VPS設定:"
    echo "  IP: $VPS_IP"
    echo "  ユーザー: $VPS_USERNAME"
    echo "  ポート: $SSH_PORT"
    echo "  デプロイパス: $DEPLOY_PATH"
    echo "  アプリポート: $APP_PORT"
    echo ""
    
    echo "📧 メール設定:"
    echo "  SMTP: $SMTP_HOST:$SMTP_PORT"
    echo "  送信元: $FROM_EMAIL"
    echo "  宛先: $TO_EMAIL"
    echo ""
    
    echo "🔐 セキュリティ設定:"
    echo "  JWT Secret: ${JWT_SECRET:0:20}..."
    echo "  Session Secret: ${SESSION_SECRET:0:20}..."
    echo ""
    
    if [[ $USE_CMS =~ ^[Yy]$ ]]; then
        echo "🌐 CMS設定:"
        echo "  API URL: $CMS_API_URL"
        echo ""
    fi
}

# GitHub Secretsの設定
set_github_secrets() {
    log "GitHub Secretsを設定中..."
    
    # 基本設定
    log "基本設定を適用中..."
    gh secret set VPS_IP --body "$VPS_IP"
    gh secret set VPS_USERNAME --body "$VPS_USERNAME"
    gh secret set SSH_PORT --body "$SSH_PORT"
    gh secret set SSH_PRIVATE_KEY < "$SSH_KEY_FILE"
    
    # デプロイ設定
    log "デプロイ設定を適用中..."
    gh secret set DEPLOY_PATH --body "$DEPLOY_PATH"
    gh secret set APP_PORT --body "$APP_PORT"
    gh secret set DOMAIN --body "$FULL_DOMAIN"
    gh secret set NODE_ENV --body "$ENVIRONMENT"
    
    # アプリケーション設定
    log "アプリケーション設定を適用中..."
    gh secret set APP_NAME --body "$NORMALIZED_NAME"
    gh secret set PM2_APP_NAME --body "${NORMALIZED_NAME}-${ENVIRONMENT}"
    gh secret set HEALTH_CHECK_PATH --body "/health"
    
    # メール設定
    log "メール設定を適用中..."
    gh secret set SMTP_HOST --body "$SMTP_HOST"
    gh secret set SMTP_PORT --body "$SMTP_PORT"
    gh secret set SMTP_USER --body "$SMTP_USER"
    gh secret set FROM_EMAIL --body "$FROM_EMAIL"
    gh secret set TO_EMAIL --body "$TO_EMAIL"
    gh secret set REPLY_TO_EMAIL --body "$REPLY_TO_EMAIL"
    
    # セキュリティ設定
    log "セキュリティ設定を適用中..."
    gh secret set JWT_SECRET --body "$JWT_SECRET"
    gh secret set SESSION_SECRET --body "$SESSION_SECRET"
    
    # CMS設定（必要な場合）
    if [[ $USE_CMS =~ ^[Yy]$ ]]; then
        log "CMS設定を適用中..."
        gh secret set CMS_API_URL --body "$CMS_API_URL"
    fi
    
    success "GitHub Secrets設定完了！"
}

# 手動設定が必要な項目の表示
show_manual_setup_required() {
    echo ""
    warning "=== 手動設定が必要な項目 ==="
    echo ""
    
    echo "📧 SMTPパスワード:"
    echo "  gh secret set SMTP_PASS --body \"your_actual_smtp_password\""
    echo ""
    
    if [[ $USE_CMS =~ ^[Yy]$ ]]; then
        echo "🌐 WordPress認証トークン:"
        echo "  gh secret set CMS_AUTH_TOKEN --body \"your_wordpress_auth_token\""
        echo ""
    fi
    
    echo "🛡️  reCAPTCHA（スパム対策）:"
    echo "  gh secret set RECAPTCHA_SITE_KEY --body \"6Lc...\""
    echo "  gh secret set RECAPTCHA_SECRET_KEY --body \"6Lc...\""
    echo ""
    
    echo "📊 Google Analytics（オプション）:"
    echo "  gh secret set GOOGLE_ANALYTICS_ID --body \"GA-XXXXXXXXX-X\""
    echo ""
}

# 設定ファイルの生成
generate_config_file() {
    log "設定ファイルを生成中..."
    
    cat > .env.local << EOF
# 自動生成された環境変数設定
# $(date)

# プロジェクト情報
PROJECT_NAME="$NORMALIZED_NAME"
ENVIRONMENT="$ENVIRONMENT"

# ドメイン設定
DOMAIN="$FULL_DOMAIN"
BASE_DOMAIN="$BASE_DOMAIN"

# VPS設定
VPS_IP="$VPS_IP"
VPS_USERNAME="$VPS_USERNAME"
DEPLOY_PATH="$DEPLOY_PATH"
APP_PORT="$APP_PORT"

# メール設定
FROM_EMAIL="$FROM_EMAIL"
TO_EMAIL="$TO_EMAIL"
SMTP_HOST="$SMTP_HOST"
SMTP_PORT="$SMTP_PORT"
SMTP_USER="$SMTP_USER"

# セキュリティ
JWT_SECRET="$JWT_SECRET"
SESSION_SECRET="$SESSION_SECRET"

# CMS設定
$(if [[ $USE_CMS =~ ^[Yy]$ ]]; then echo "CMS_API_URL=\"$CMS_API_URL\""; fi)
EOF

    success "設定ファイル生成完了: .env.local"
}

# メイン処理
main() {
    echo ""
    log "=== GitHub Secrets自動設定スクリプト ==="
    log "HP制作テンプレート用環境変数の自動生成・設定"
    echo ""
    
    # GitHub CLIの確認
    if ! command -v gh > /dev/null 2>&1; then
        error "GitHub CLIがインストールされていません"
        echo "インストール: brew install gh"
        exit 1
    fi
    
    # 認証確認
    if ! gh auth status > /dev/null 2>&1; then
        error "GitHub CLIにログインしていません"
        echo "認証: gh auth login"
        exit 1
    fi
    
    load_project_config
    get_environment_config
    get_vps_config
    generate_security_secrets
    generate_email_config
    generate_cms_config
    
    show_configuration
    
    echo ""
    echo -n "この設定でGitHub Secretsを設定しますか? [y/N]: "
    read -r CONFIRM
    
    if [[ $CONFIRM =~ ^[Yy]$ ]]; then
        set_github_secrets
        generate_config_file
        show_manual_setup_required
        
        echo ""
        success "=== セットアップ完了 ==="
        log "自動デプロイをテストしてください:"
        echo "  git add . && git commit -m \"GitHub Secrets設定完了\" && git push origin main"
    else
        log "設定をキャンセルしました"
    fi
}

# スクリプト実行
main "$@"