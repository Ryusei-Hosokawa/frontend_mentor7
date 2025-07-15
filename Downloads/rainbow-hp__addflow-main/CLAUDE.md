# React Router v7 + Bun + TypeScript 中小企業向けホームページテンプレート

## プロジェクト概要

このプロジェクトは、中小企業向けの高性能なホームページを構築するためのモダンなWebアプリケーションテンプレートです。React Router v7のframework modeを活用し、SSR（サーバーサイドレンダリング）による高速な初期表示とSEO最適化を実現しています。

## 技術スタック

### コア技術
- **Framework**: React Router v7 (framework mode) - SSR対応
- **Runtime**: Bun 1.2.18+ - 高速パッケージ管理・実行環境
- **Language**: TypeScript 5.8+ - 型安全性確保
- **Styling**: Tailwind CSS 4.1+ - ユーティリティファーストCSS

### 開発・デプロイ
- **Component Development**: Storybook 9.x - UIコンポーネント開発
- **Testing**: Vitest + React Testing Library
- **Image Optimization**: Sharp - 自動WebP生成・圧縮
- **Container**: Docker + Docker Compose
- **Deployment**: GitHub Actions + SFTP (Xserver VPS対応)

### CMS・データ管理
- **Headless CMS**: WordPress + WP GraphQL
- **Data Fetching**: Apollo Client + GraphQL
- **Form Handling**: React Hook Form + Zod validation
- **Email Service**: Brevo/SendLayer/SMTP.com

## プロジェクト構造

```
app/                    # React Router app directory
├── routes/            # ルート定義とページコンポーネント
│   ├── home.tsx       # トップページ
│   ├── about.tsx      # 会社概要
│   ├── services.tsx   # サービス一覧
│   └── contact.tsx    # お問い合わせ
├── components/        # 再利用可能なUIコンポーネント
│   ├── OptimizedImage.tsx  # 画像最適化コンポーネント
│   ├── Header.tsx     # ヘッダー
│   └── Footer.tsx     # フッター
├── utils/             # ユーティリティ関数
├── types/             # TypeScript型定義
└── app.css           # グローバルスタイル

public/                # 静的アセット
├── images/           # 画像ファイル（自動WebP生成対象）
└── favicon.ico       # ファビコン

plugins/               # Viteプラグイン
└── image-optimizer.ts # 画像最適化プラグイン

docs/                  # プロジェクトドキュメント
└── CLS-PREVENTION.md  # CLS対策ガイド

.storybook/            # Storybook設定
├── main.ts           # メイン設定
└── preview.ts        # プレビュー設定
```

## 開発ガイドライン

### 基本原則
1. **React Router v7のSSR機能を最大活用**
   - loaders/actionsを使用したデータフェッチ
   - SEO最適化されたmeta関数の実装
   - ストリーミングSSRによる高速表示

2. **TypeScriptの型安全性を重視**
   - 厳密な型定義の実装
   - GraphQLスキーマとの型同期
   - コンポーネントpropsの完全な型付け

3. **パフォーマンスファースト**
   - 画像最適化（WebP自動生成）
   - 遅延読み込み（lazy loading）
   - Code splitting
   - CLS（Cumulative Layout Shift）対策

4. **アクセシビリティ重視**
   - Storybook A11yアドオンでの検証
   - セマンティックHTML
   -適切なARIA属性

### コンポーネント設計
- **単一責任の原則**: 各コンポーネントは明確な責任を持つ
- **Tailwind CSS完全活用**: スタイリングはTailwindに委譲
- **Storybookでの開発**: UIコンポーネントは必ずStorybook対応

### データフェッチパターン
```typescript
// loader関数でのデータフェッチ（SSR対応）
export async function loader() {
  const data = await fetchFromCMS();
  return json(data);
}

// action関数でのフォーム処理
export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const result = await processForm(formData);
  return json(result);
}
```

### 画像最適化
```tsx
// OptimizedImageコンポーネントの使用
<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/hero.jpg"
    alt="ヒーロー画像"
    className="w-full h-full object-cover"
    priority={true}
  />
</div>
```

## セキュリティ考慮事項

### 環境変数管理
- 機密情報は`.env`ファイルで管理
- 本番環境では環境変数で設定
- Claude Codeの権限設定で`.env`ファイルへのアクセス制限

### フォームセキュリティ
- CSRFトークンの実装
- 入力値のサニタイゼーション
- レート制限の実装

### 画像セキュリティ
- アップロード画像の検証
- ファイル拡張子チェック
- 適切なファイルサイズ制限

## 開発フロー

### 1. 開発環境セットアップ
```bash
# 依存関係インストール
bun install

# 開発サーバー起動
bun run dev

# Storybook起動
bun run storybook
```

### 2. コンポーネント開発
1. Storybookでコンポーネント作成
2. TypeScript型定義
3. A11yテストクリア
4. CLS対策実装

### 3. ページ実装
1. route.ts にルート追加
2. loader/action関数実装
3. メタデータ設定
4. SEO最適化

### 4. テスト・ビルド
```bash
# 型チェック
bun run typecheck

# ビルド
bun run build

# Storybookビルド
bun run build-storybook
```

## デプロイメント

### Xserver VPS対応
1. Docker環境での本番ビルド
2. GitHub ActionsによるCI/CD
3. SFTP自動デプロイ
4. SSL証明書（Let's Encrypt）

### パフォーマンス目標
- **LCP (Largest Contentful Paint)**: 2.5秒以下
- **FID (First Input Delay)**: 100ms以下
- **CLS (Cumulative Layout Shift)**: 0.1以下
- **TTI (Time to Interactive)**: 3.5秒以下

## 中小企業向け最適化

### CMS管理画面
- WordPress管理画面での簡単コンテンツ更新
- GraphQL APIによる高速データ取得
- ACF（Advanced Custom Fields）でのカスタムフィールド

### SEO対応
- 構造化データ（JSON-LD）
- OGP・Twitter Cards設定
- サイトマップ自動生成
- 高速な初期表示

### お問い合わせ機能
- 自動返信メール
- 管理者通知
- スパム対策
- TypeScript型安全なフォームバリデーション

## トラブルシューティング

### よくある問題
1. **Bunでのpackage.json更新**: `bun install --save`で明示的保存
2. **Storybook起動エラー**: `bun run build-storybook`で事前ビルド
3. **画像最適化エラー**: Sharp依存関係の再インストール
4. **TypeScriptエラー**: `bun run typecheck`での型チェック

### パフォーマンス問題
1. **画像読み込み遅延**: WebP生成・圧縮設定見直し
2. **CLS問題**: アスペクト比コンテナの適用
3. **SSR遅延**: loader関数の最適化

## 更新・メンテナンス

### 定期更新項目
- React Router v7アップデート
- Bun最新版への更新
- Storybook最新版対応
- セキュリティパッチ適用

### 監視項目
- Core Web Vitals
- エラーレート
- レスポンス時間
- セキュリティログ