# GitHub Secrets設定ガイド

このガイドでは、運転代行レインボープロジェクトおよび新規HP制作プロジェクト用のGitHub Secrets設定方法を説明します。

## 🔧 設定場所

```
https://github.com/your-username/your-repository/settings/secrets/actions
```

または：

1. GitHubリポジトリページ → **Settings**
2. 左サイドバー → **Secrets and variables** → **Actions**
3. **New repository secret** をクリック

## 🔑 必須設定項目

### **1. VPS接続情報**

#### **VPS_IP**
```
Name: VPS_IP
Value: 162.43.27.191
```
- VPSのIPアドレス
- 運転代行レインボーの場合は `162.43.27.191`

#### **VPS_USERNAME**
```
Name: VPS_USERNAME
Value: addflow
```
- SSH接続用のユーザー名
- 運転代行レインボーの場合は `addflow`

#### **SSH_PRIVATE_KEY**
```
Name: SSH_PRIVATE_KEY
Value: -----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAA...
（秘密鍵の全内容）
-----END OPENSSH PRIVATE KEY-----
```

**取得方法：**
```bash
# 秘密鍵の内容を表示
cat ~/.ssh/github-deploy-addflow

# 出力をそのままコピーしてGitHub Secretsに貼り付け
```

#### **SSH_PORT**
```
Name: SSH_PORT
Value: 22
```
- SSHポート番号（通常は22）

## 🌍 環境固有設定

### **2. デプロイ設定**

#### **DEPLOY_PATH**
```
Name: DEPLOY_PATH
Value: /var/www/sites/development
```

**環境別の例：**
- 開発環境: `/var/www/sites/development`
- ステージング: `/var/www/sites/staging`
- 本番環境: `/var/www/html`

#### **APP_PORT**
```
Name: APP_PORT
Value: 3001
```

**環境別の例：**
- 開発環境: `3001`
- ステージング: `3002`
- 本番環境: `3000`

#### **DOMAIN**
```
Name: DOMAIN
Value: dev.rainbow-transport.com
```

**環境別の例：**
- 開発環境: `dev.rainbow-transport.com`
- ステージング: `staging.rainbow-transport.com`
- 本番環境: `rainbow-transport.com`

#### **NODE_ENV**
```
Name: NODE_ENV
Value: development
```

**環境別の例：**
- 開発環境: `development`
- ステージング: `staging`
- 本番環境: `production`

### **3. アプリケーション設定**

#### **APP_NAME**
```
Name: APP_NAME
Value: rainbow-transport
```
- アプリケーション名（PM2等で使用）

#### **PM2_APP_NAME**
```
Name: PM2_APP_NAME
Value: rainbow-dev
```

**環境別の例：**
- 開発環境: `rainbow-dev`
- ステージング: `rainbow-staging`
- 本番環境: `rainbow-production`

#### **HEALTH_CHECK_PATH**
```
Name: HEALTH_CHECK_PATH
Value: /health
```
- ヘルスチェック用のパス

## 📧 メール設定（オプション）

### **4. SMTP設定**

#### **SMTP_HOST**
```
Name: SMTP_HOST
Value: smtp.gmail.com
```

#### **SMTP_USER**
```
Name: SMTP_USER
Value: noreply@rainbow-transport.com
```

#### **SMTP_PASS**
```
Name: SMTP_PASS
Value: your_app_password_here
```

#### **FROM_EMAIL**
```
Name: FROM_EMAIL
Value: noreply@rainbow-transport.com
```

#### **TO_EMAIL**
```
Name: TO_EMAIL
Value: contact@rainbow-transport.com
```

## 🔐 セキュリティ設定（オプション）

### **5. 認証・暗号化**

#### **JWT_SECRET**
```
Name: JWT_SECRET
Value: rainbow_super_secret_jwt_key_2025_highly_secure
```

#### **SESSION_SECRET**
```
Name: SESSION_SECRET
Value: rainbow_session_secret_2025_very_secure
```

## 🔗 CMS連携設定（オプション）

### **6. WordPress連携**

#### **CMS_API_URL**
```
Name: CMS_API_URL
Value: https://cms.rainbow-transport.com/graphql
```

#### **CMS_AUTH_TOKEN**
```
Name: CMS_AUTH_TOKEN
Value: your_wordpress_auth_token_here
```

## 📊 アナリティクス設定（オプション）

### **7. トラッキング**

#### **GOOGLE_ANALYTICS_ID**
```
Name: GOOGLE_ANALYTICS_ID
Value: GA-XXXXXXXXX-X
```

## 🌟 新規プロジェクト用テンプレート

新規HP制作プロジェクトでは、以下の設定をプロジェクトに合わせて変更：

```bash
# プロジェクト固有設定
APP_NAME: your-company-name
DOMAIN: your-domain.com
DEPLOY_PATH: /var/www/sites/your-project

# メール設定
FROM_EMAIL: noreply@your-domain.com
TO_EMAIL: contact@your-domain.com
SMTP_USER: noreply@your-domain.com

# CMS設定
CMS_API_URL: https://cms.your-domain.com/graphql
```

## ✅ 設定完了後の確認

### **1. 設定確認方法**

GitHub Secretsページで以下が設定されていることを確認：

- ✅ VPS_IP
- ✅ VPS_USERNAME
- ✅ SSH_PRIVATE_KEY
- ✅ DEPLOY_PATH
- ✅ APP_PORT
- ✅ DOMAIN
- ✅ NODE_ENV

### **2. デプロイテスト**

```bash
# テスト用の変更をプッシュ
echo "# GitHub Secrets設定テスト" >> README.md
git add README.md
git commit -m "GitHub Secrets設定完了テスト"
git push origin main
```

### **3. GitHub Actionsログ確認**

デプロイ実行時に以下のログが表示されることを確認：

```
=== Deployment Configuration ===
Deploy Path: /var/www/sites/development
App Port: 3001
Domain: dev.rainbow-transport.com
Environment: development
==============================
```

## 🚨 セキュリティ注意事項

### **重要な点**

1. **秘密鍵は絶対に他人と共有しない**
2. **GitHub Secretsは暗号化されているが、定期的にローテーション**
3. **不要になったキーは即座に削除**
4. **最小権限の原則を適用**

### **緊急時の対応**

秘密鍵が漏洩した場合：

```bash
# 1. VPS上で該当キーを無効化
ssh addflow@162.43.27.191
nano ~/.ssh/authorized_keys
# 該当キーの行を削除

# 2. 新しいキーペア生成
ssh-keygen -t ed25519 -C "new-github-actions-key" -f ~/.ssh/new-deploy-key

# 3. GitHub Secretsを更新
```

## 📞 サポート

設定で問題が発生した場合は、以下を確認：

1. GitHub Secretsの名前が正確か
2. 秘密鍵の形式が正しいか（BEGIN/END含む）
3. VPS側でSSHキーが正しく設定されているか
4. ファイアウォール設定に問題がないか

---

**HP制作テンプレート v1.0.0**
このガイドに従って設定すれば、安全で効率的な自動デプロイ環境が構築できます。