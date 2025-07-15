# HP制作テンプレート（React Router v7 + Bun + TypeScript）

> **🚀 新規プロジェクト作成が5分で完了！環境変数化で再利用が簡単なHP制作テンプレート**

[![Template](https://img.shields.io/badge/Template-Ready-brightgreen?style=for-the-badge)](./docs/TEMPLATE-SETUP.md)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

中小企業向けの高性能なホームページを構築するためのモダンなWebアプリケーションテンプレートです。React Router v7のframework modeを活用し、SSR（サーバーサイドレンダリング）による高速な初期表示とSEO最適化を実現しています。

## 🚀 主要機能

### コア機能
- **🔥 React Router v7 (Framework Mode)** - SSR対応の次世代フルスタックフレームワーク
- **⚡ Bun 1.2.18+** - 高速パッケージ管理・実行環境
- **🔒 TypeScript 5.8+** - 型安全性によるバグ防止
- **🎨 Tailwind CSS 4.1+** - ユーティリティファーストCSS
- **🖼️ 自動画像最適化** - WebP生成・圧縮・CLS対策
- **📱 レスポンシブデザイン** - モバイルファースト

### 開発・運用
- **📚 Storybook 9.x** - UIコンポーネント開発環境
- **🧪 A11y対応** - アクセシビリティ重視
- **🐳 Docker統合** - 開発・本番環境統一
- **🚀 CI/CD対応** - GitHub Actions自動デプロイ
- **📊 監視・ログ管理** - パフォーマンス監視

### CMS・データ管理
- **📝 WordPress連携** - ヘッドレスCMS（GraphQL）
- **📧 お問い合わせ機能** - TypeScript型安全フォーム
- **🔐 セキュリティ強化** - CSRF対策・入力検証

## 📁 プロジェクト構造

```
├── app/                          # React Router v7 アプリ
│   ├── components/              # UIコンポーネント
│   │   ├── OptimizedImage.tsx   # 画像最適化コンポーネント
│   │   ├── ContactForm.tsx      # お問い合わせフォーム
│   │   └── *.stories.tsx        # Storybookストーリー
│   ├── routes/                  # ページルート
│   │   ├── home.tsx            # トップページ
│   │   ├── about.tsx           # 会社概要
│   │   ├── services.tsx        # サービス一覧
│   │   └── contact.tsx         # お問い合わせ
│   ├── lib/                     # ライブラリ設定
│   │   └── apollo.ts           # GraphQL Apollo Client
│   ├── queries/                 # GraphQLクエリ
│   │   └── posts.ts            # WordPress用クエリ
│   └── types/                   # TypeScript型定義
│       ├── cms.ts              # CMS関連型
│       └── images.d.ts         # 画像型定義
├── docs/                        # ドキュメント
│   └── CLS-PREVENTION.md       # CLS対策ガイド
├── plugins/                     # Viteプラグイン
│   └── image-optimizer.ts      # 画像最適化プラグイン
├── .storybook/                  # Storybook設定
├── .claude/                     # Claude Code設定
├── .github/workflows/           # CI/CD設定
├── nginx/                       # Nginx設定
├── docker-compose.yml           # Docker構成
└── README.md                   # このファイル
```

## 🛠 技術スタック

### フロントエンド
| 技術 | バージョン | 説明 |
|------|------------|------|
| React Router v7 | 7.6.3+ | フルスタックReactフレームワーク |
| React | 19.1.0+ | UIライブラリ |
| TypeScript | 5.8+ | 型安全プログラミング言語 |
| Tailwind CSS | 4.1+ | ユーティリティファーストCSS |
| Vite | 6.3+ | 高速ビルドツール |

### バックエンド・CMS
| 技術 | バージョン | 説明 |
|------|------------|------|
| Bun | 1.2.18+ | JavaScript実行環境 |
| WordPress | 最新版 | ヘッドレスCMS |
| GraphQL | 16.11+ | データクエリ言語 |
| Apollo Client | 3.13+ | GraphQLクライアント |
| MySQL | 8.0 | データベース |
| Redis | 7.0 | キャッシュ・セッション管理 |

### 開発・デプロイ
| 技術 | バージョン | 説明 |
|------|------------|------|
| Storybook | 9.0+ | UIコンポーネント開発 |
| Docker | 最新版 | コンテナ技術 |
| GitHub Actions | - | CI/CDパイプライン |
| Nginx | Alpine | リバースプロキシ |

## 🚀 テンプレートとしての使用方法

### 🆕 新規プロジェクト作成（推奨）

```bash
# 自動セットアップスクリプトを使用
./scripts/setup-new-project.sh my-company-site corporate

# プロジェクトタイプ選択可能:
# - corporate (企業サイト)
# - ecommerce (ECサイト) 
# - portfolio (ポートフォリオ)
# - landing (ランディングページ)
```

### 📋 必要なGitHub Secrets設定

新規プロジェクトで以下を設定：

```bash
# 必須設定
VPS_IP: your-vps-ip-address
VPS_USERNAME: your-vps-username  
SSH_PRIVATE_KEY: your-ssh-private-key

# カスタマイズ（オプション）
DEPLOY_PATH: /var/www/sites/your-project
APP_PORT: 3001
DOMAIN: your-domain.com
```

詳細は **[📖 テンプレートセットアップガイド](./docs/TEMPLATE-SETUP.md)** を参照

---

## 🛠 開発環境セットアップ

### 1. 依存関係のインストール

```bash
# 依存関係をインストール
bun install

# 開発サーバー起動
bun run dev
```

開発サーバーが `http://localhost:5173` で起動します。

### 2. Storybookでコンポーネント開発

```bash
# Storybook起動
bun run storybook
```

Storybookが `http://localhost:6006` で起動し、UIコンポーネントを個別に開発・テストできます。

### 3. Docker環境での開発

```bash
# 全サービス起動（WordPress + MySQL + Redis含む）
bun run docker:up

# 開発用サービスのみ起動
bun run docker:dev

# ログ確認
bun run docker:logs

# 停止
bun run docker:down
```

Docker環境では以下のサービスが利用可能です：
- React Router v7アプリ: http://localhost:3000
- WordPress管理画面: http://localhost:8080/wp-admin
- GraphQLエンドポイント: http://localhost:8080/graphql

## 📝 主要コンポーネント

### OptimizedImage - 画像最適化コンポーネント

自動WebP生成とCLS対策を備えた画像コンポーネント：

```tsx
import OptimizedImage from '../components/OptimizedImage';

// 基本使用例
<OptimizedImage
  src="/images/hero.jpg"
  alt="ヒーロー画像"
  className="w-full h-64 object-cover rounded-lg"
/>

// CLS対策付き
<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/hero.jpg"
    alt="ヒーロー画像"
    className="w-full h-full object-cover"
    priority={true}
  />
</div>
```

**特徴：**
- 自動WebP生成（20-50%のファイルサイズ削減）
- ブラウザ対応状況に応じた自動切り替え
- 遅延読み込み（lazy loading）対応
- CLS（Cumulative Layout Shift）対策
- Tailwind CSSによる完全なスタイル制御

### ContactForm - お問い合わせフォーム

TypeScript型安全なお問い合わせフォーム：

```tsx
import ContactForm from '../components/ContactForm';

// React Router v7のactionと連携
<ContactForm className="max-w-2xl mx-auto" />
```

**特徴：**
- React Hook Form + Zodバリデーション
- TypeScript型安全性
- 自動返信・管理者通知メール
- CSRF対策・スパム防止
- アクセシビリティ対応

## 📊 パフォーマンス最適化

### Core Web Vitals目標値

| 指標 | 目標値 | 説明 |
|------|--------|------|
| **LCP** | < 2.5秒 | 最大コンテンツ描画時間 |
| **FID** | < 100ms | 初回入力遅延 |
| **CLS** | < 0.1 | 累積レイアウトシフト |
| **TTI** | < 3.5秒 | 操作可能時間 |

### 最適化機能

1. **画像最適化**
   - 自動WebP生成
   - Sharp圧縮処理
   - CLS対策（アスペクト比固定）
   - 遅延読み込み

2. **SSR最適化**
   - React Router v7 loaders/actions
   - ストリーミングSSR
   - Code splitting
   - プリロード最適化

3. **キャッシュ戦略**
   - Redis キャッシュ
   - Nginx静的ファイルキャッシュ
   - Apollo Clientキャッシュ

## 🐳 Docker環境

### サービス構成

```yaml
services:
  web:         # React Router v7 + Bun アプリ
  wordpress:   # WordPress CMS
  mysql:       # データベース
  redis:       # キャッシュ・セッション
  nginx:       # リバースプロキシ
```

### 開発環境起動

```bash
# 全サービス起動
docker-compose up -d

# 開発用プロファイル
docker-compose --profile dev up -d

# 監視サービス含む
docker-compose --profile monitoring up -d
```

### 本番デプロイ

```bash
# 本番ビルド
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📈 WordPress統合

### GraphQL設定

**必須プラグイン：**
- WP GraphQL v2.3.3+
- Advanced Custom Fields (ACF)
- WP GraphQL for ACF

### データ取得例

```tsx
// React Router v7 loader
export async function loader() {
  const { data } = await client.query({
    query: GET_POSTS,
    variables: { first: 10 }
  });
  return json(data);
}

// コンポーネント内
export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();
  
  return (
    <div>
      {posts.nodes.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <OptimizedImage
            src={post.featuredImage?.node.sourceUrl}
            alt={post.featuredImage?.node.altText}
            className="w-full h-48 object-cover"
          />
        </article>
      ))}
    </div>
  );
}
```

## 🚀 デプロイメント

### Xserver VPS対応

**GitHub Actions自動デプロイ：**

1. **必要なシークレット設定：**
   ```
   VPS_IP          # VPSのIPアドレス
   VPS_USERNAME    # SSHユーザー名
   SSH_PRIVATE_KEY # SSH秘密鍵
   SSH_PORT        # SSHポート（デフォルト: 22）
   ```

2. **デプロイフロー：**
   ```bash
   git push origin main  # 自動デプロイ開始
   ```

**SFTP設定（VSCode）：**
```json
{
  "host": "your-xserver-vps-ip",
  "username": "your-username",
  "privateKeyPath": "~/.ssh/xserver_vps_key",
  "remotePath": "/var/www/html"
}
```

### SSL証明書（Let's Encrypt）

```bash
# Certbot設置
sudo snap install --classic certbot

# 証明書取得
sudo certbot --nginx -d your-domain.com
```

## 🧪 テスト・品質管理

### テスト実行

```bash
# 型チェック
bun run typecheck

# ビルドテスト
bun run build

# Storybookビルド
bun run build-storybook
```

### コード品質

- **TypeScript**: 厳密な型チェック
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット
- **Storybook A11y**: アクセシビリティテスト

## 🔧 カスタマイズ

### 環境変数設定

`.env`ファイルを作成：

```bash
# WordPress GraphQL
REACT_APP_GRAPHQL_URL=http://localhost:8080/graphql

# データベース
MYSQL_PASSWORD=your_secure_password
MYSQL_ROOT_PASSWORD=your_root_password

# メール設定
SMTP_HOST=smtp.example.com
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_smtp_password
```

### テーマカスタマイズ

`tailwind.config.js`でブランドカラー設定：

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

## 📚 ドキュメント

- [📖 CLS Prevention Guide](./docs/CLS-PREVENTION.md) - CLS対策完全ガイド
- [📖 CLAUDE.md](./CLAUDE.md) - 開発ガイドライン・アーキテクチャ
- [📖 React Router v7 Docs](https://reactrouter.com/) - 公式ドキュメント
- [📖 Storybook Docs](https://storybook.js.org/) - コンポーネント開発

## 🆘 トラブルシューティング

### よくある問題

**1. Bunパッケージ管理エラー**
```bash
# キャッシュクリア
bun install --force

# 依存関係再インストール
rm -rf node_modules bun.lockb
bun install
```

**2. Storybook起動エラー**
```bash
# Storybookビルド
bun run build-storybook

# キャッシュクリア
rm -rf storybook-static .storybook-cache
```

**3. 画像最適化エラー**
```bash
# Sharp再インストール
bun remove sharp
bun add -d sharp
```

**4. Docker関連**
```bash
# コンテナリセット
docker-compose down -v
docker-compose up -d --build
```

### パフォーマンス問題

**CLS（Layout Shift）対策：**
- アスペクト比コンテナの使用
- 画像サイズの事前指定
- フォントの最適化

**SSR最適化：**
- loader関数の最適化
- GraphQLクエリの効率化
- キャッシュ戦略の見直し

## 📞 サポート

### コミュニティ

- **GitHub Issues**: バグ報告・機能要求
- **Discord**: リアルタイムサポート
- **Documentation**: 包括的なガイド

### 商用サポート

中小企業向けの実装サポートやカスタマイズが必要な場合は、お気軽にお問い合わせください。

## 📜 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルをご確認ください。

## 🙏 謝辞

このテンプレートは以下のオープンソースプロジェクトの恩恵を受けています：

- [React Router](https://reactrouter.com/) - モダンなReactフレームワーク
- [Bun](https://bun.sh/) - 高速JavaScript実行環境
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS
- [Storybook](https://storybook.js.org/) - UIコンポーネント開発
- [WordPress](https://wordpress.org/) - 世界最大のCMS

---

**Built with ❤️ for 中小企業 using React Router v7 + Bun + TypeScript**

[![Powered by React Router](https://img.shields.io/badge/Powered%20by-React%20Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Made with Bun](https://img.shields.io/badge/Made%20with-Bun-f9f1e1?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)