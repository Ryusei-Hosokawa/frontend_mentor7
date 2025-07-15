# ===== ビルドステージ =====
FROM oven/bun:1.2.18-alpine AS builder

WORKDIR /app

# VPS環境と統一：Node.js 22.17.0互換性確保
ENV NODE_VERSION=22.17.0
ENV BUN_VERSION=1.2.18

# VPS用メモリ設定
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV BUN_INSTALL_CACHE_DIR=/tmp/bun-cache

# package.jsonとロックファイルをコピー
COPY package.json ./
COPY bun.lock ./
COPY bunfig.toml ./

# 依存関係をインストール（開発依存関係含む）
RUN bun install --frozen-lockfile

# アプリケーションの全ファイルをコピー
COPY . .

# React Router v7プロジェクトをビルド
RUN bun run build

# ===== 本番ステージ =====
FROM oven/bun:1.2.18-alpine AS runner

WORKDIR /app

# VPS環境設定
ENV NODE_ENV=production
ENV BUN_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Node.jsのインストール（React Router v7 SSR用）
RUN apk add --no-cache nodejs npm

# 非rootユーザーを作成（セキュリティ強化）
RUN addgroup -g 1001 -S nodejs
RUN adduser -S bunuser -u 1001

# 必要なファイルのみコピー（軽量化）
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bunfig.toml ./bunfig.toml

# 本番用依存関係のみインストール
RUN bun install --frozen-lockfile --production

# アプリケーションファイルの所有者を変更
RUN chown -R bunuser:nodejs /app

# 非rootユーザーに切り替え
USER bunuser

# コンテナが使用するポートを明示
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD bun --version || exit 1

# React Router v7サーバーを起動（react-router-serve使用）
CMD ["npx", "react-router-serve", "./build/server/index.js"]