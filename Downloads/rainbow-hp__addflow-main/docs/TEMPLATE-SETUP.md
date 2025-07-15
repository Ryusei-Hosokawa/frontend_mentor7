# HP制作テンプレート セットアップガイド

## 概要

このテンプレートは、React Router v7 + Bun + TypeScriptを使用した中小企業向けホームページの制作テンプレートです。環境変数化されており、新規プロジェクトで簡単に再利用できます。

## 🚀 新規プロジェクト作成手順

### 1. テンプレートのコピー

```bash
# GitHubリポジトリをフォーク または テンプレートとして使用
git clone https://github.com/Ryusei-Hosokawa/rainbow-hp__addflow.git new-project-name
cd new-project-name

# リモートリポジトリを新しいプロジェクト用に変更
git remote set-url origin https://github.com/your-username/new-project-name.git
```

### 2. プロジェクト固有の設定

#### package.jsonの更新
```bash
# プロジェクト名を変更
sed -i 's/"rainbow.com"/"your-project-name"/g' package.json
```

#### CLAUDE.mdの更新
```bash
# プロジェクト概要を新しいプロジェクトの内容に変更
# app/routes/ 配下のページ内容を更新
# public/images/ の画像を差し替え
```

### 3. GitHub Secrets設定

新しいリポジトリで以下のSecretsを設定：

#### 必須設定
```
VPS_IP: your-vps-ip-address
VPS_USERNAME: your-vps-username
SSH_PRIVATE_KEY: your-ssh-private-key
```

#### 環境カスタマイズ（オプション）
```bash
# 開発環境用
DEPLOY_PATH: /var/www/sites/your-project-dev
APP_PORT: 3001
DOMAIN: dev.your-domain.com
NODE_ENV: development

# 本番環境用
DEPLOY_PATH: /var/www/html
APP_PORT: 3000
DOMAIN: your-domain.com
NODE_ENV: production
```

### 4. VPS環境準備

```bash
# VPSにSSH接続
ssh your-username@your-vps-ip

# 必要なソフトウェアのインストール
curl -fsSL https://bun.sh/install | bash
sudo apt update && sudo apt install git nginx docker.io docker-compose -y

# デプロイディレクトリの作成
sudo mkdir -p /var/www/html
sudo chown $(whoami):$(whoami) /var/www/html

# Nginx設定
sudo tee /etc/nginx/sites-available/your-project > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/your-project /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 🎯 プロジェクトタイプ別設定例

### 企業サイト
```json
{
  "deploy_path": "/var/www/html",
  "features": ["contact_form", "cms_integration", "seo_optimization"],
  "cms_required": true
}
```

### ECサイト
```json
{
  "deploy_path": "/var/www/sites/ecommerce",
  "features": ["payment_gateway", "inventory_management", "user_authentication"],
  "security_enhanced": true
}
```

### ポートフォリオ
```json
{
  "deploy_path": "/var/www/sites/portfolio",
  "features": ["gallery", "blog", "contact_form"],
  "cms_required": false
}
```

## 📋 環境変数一覧

### デプロイ設定
| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `DEPLOY_PATH` | `/var/www/html` | デプロイ先パス |
| `APP_PORT` | `3000` | アプリケーションポート |
| `APP_NAME` | `app` | アプリケーション名 |
| `DOMAIN` | `localhost` | ドメイン名 |
| `NODE_ENV` | `production` | Node.js環境 |
| `PM2_APP_NAME` | `rainbow-app` | PM2アプリ名 |
| `HEALTH_CHECK_PATH` | `/health` | ヘルスチェックパス |

### CMS連携
| 変数名 | 説明 |
|--------|------|
| `CMS_API_URL` | WordPressのGraphQL API URL |
| `CMS_AUTH_TOKEN` | CMS認証トークン |

### メール設定
| 変数名 | 説明 |
|--------|------|
| `SMTP_HOST` | SMTPサーバーホスト |
| `SMTP_USER` | SMTPユーザー名 |
| `SMTP_PASS` | SMTPパスワード |
| `FROM_EMAIL` | 送信元メールアドレス |
| `TO_EMAIL` | 宛先メールアドレス |

## 🔧 カスタマイズポイント

### 1. デザインのカスタマイズ
```bash
# Tailwind設定の変更
tailwind.config.js

# コンポーネントスタイルの調整
app/components/

# Storybookでのデザイン確認
bun run storybook
```

### 2. ページ構成の変更
```bash
# 新しいページ追加
app/routes/new-page.tsx

# ナビゲーション更新
app/components/Header.tsx

# フッター情報更新
app/components/Footer.tsx
```

### 3. お問い合わせフォームのカスタマイズ
```bash
# フォーム項目の変更
app/components/ContactForm.tsx

# バリデーションルールの調整
# Zodスキーマの更新
```

## 🚀 デプロイフロー

### 自動デプロイ（推奨）
```bash
# mainブランチにプッシュで自動デプロイ
git add .
git commit -m "新機能追加"
git push origin main
```

### 手動デプロイ
```bash
# VPS上で実行
cd /var/www/html
git pull origin main
bun install --frozen-lockfile
bun run build

# またはデプロイスクリプト使用
./deploy.sh
```

### 環境別デプロイ
```bash
# 開発環境
DEPLOY_PATH=/var/www/sites/development ./deploy.sh dev

# ステージング環境  
DEPLOY_PATH=/var/www/sites/staging ./deploy.sh

# 本番環境
./deploy.sh
```

## 🔒 セキュリティチェックリスト

- [ ] SSH鍵は専用キーを使用
- [ ] GitHub Secretsに機密情報を格納
- [ ] VPSのファイアウォール設定
- [ ] SSL証明書の設定（本番環境）
- [ ] 定期的なセキュリティアップデート
- [ ] バックアップの設定

## 🐛 トラブルシューティング

### デプロイエラー
```bash
# GitHub Actionsログの確認
# VPS上でのマニュアル実行
cd /path/to/deploy
./deploy.sh config  # 設定確認
./deploy.sh logs    # ログ確認
```

### 権限エラー
```bash
# デプロイディレクトリの権限確認
sudo chown -R $(whoami):$(whoami) /var/www/html
chmod 755 /var/www/html
```

### ポート競合
```bash
# 使用中ポートの確認
sudo netstat -tlnp | grep :3000
sudo kill -9 <PID>
```

## 📚 参考リンク

- [React Router v7 ドキュメント](https://reactrouter.com/)
- [Bun ドキュメント](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Storybook](https://storybook.js.org/)
- [GitHub Actions](https://docs.github.com/actions)

## 💬 サポート

プロジェクトテンプレートに関する質問や問題は、GitHubのIssuesで報告してください。

---

**HP制作テンプレート v1.0.0**
このテンプレートを使用して、効率的で高品質なホームページ制作を実現しましょう。