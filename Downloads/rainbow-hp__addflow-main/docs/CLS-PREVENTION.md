# CLS対策ガイド

## CLSとは

CLS（Cumulative Layout Shift）は、ページの読み込み中に発生する予期しないレイアウトシフトを測定するCore Web Vitalsの指標です。画像の読み込みによるレイアウトシフトは、ユーザー体験を著しく損なう主要な原因の一つです。

## OptimizedImageコンポーネントでのCLS対策

このプロジェクトのOptimizedImageコンポーネントは、画像最適化に特化した設計になっており、CLS対策はTailwind CSSを使用して実装します。

### 基本的な考え方

1. **コンポーネントの責任分離**
   - OptimizedImage: 画像最適化とWebP配信
   - Tailwind CSS: サイズ・スタイル制御とCLS対策

2. **アスペクト比の事前確保**
   - 画像読み込み前にコンテナの寸法を確定
   - `aspect-*` クラスの活用

## 実装パターン

### 1. アスペクト比固定パターン

#### 16:9 アスペクト比（動画的な画像）
```tsx
<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/hero.jpg"
    alt="ヒーロー画像"
    className="w-full h-full object-cover"
  />
</div>
```

#### 1:1 アスペクト比（正方形）
```tsx
<div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/profile.jpg"
    alt="プロフィール画像"
    className="w-full h-full object-cover"
  />
</div>
```

#### 4:3 アスペクト比（従来的な画像）
```tsx
<div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/gallery.jpg"
    alt="ギャラリー画像"
    className="w-full h-full object-cover"
  />
</div>
```

### 2. レスポンシブ画像パターン

#### 固定幅でのレスポンシブ
```tsx
<OptimizedImage
  src="/images/thumbnail.jpg"
  alt="サムネイル"
  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-lg"
/>
```

#### 親要素に合わせたレスポンシブ
```tsx
<div className="w-full max-w-md mx-auto">
  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
    <OptimizedImage
      src="/images/responsive.jpg"
      alt="レスポンシブ画像"
      className="w-full h-full object-cover"
    />
  </div>
</div>
```

### 3. グリッドレイアウトパターン

#### カードグリッドでのCLS対策
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {images.map((image, index) => (
    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video bg-gray-100">
        <OptimizedImage
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{image.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{image.description}</p>
      </div>
    </div>
  ))}
</div>
```

#### マソニー風レイアウト
```tsx
<div className="columns-1 md:columns-2 lg:columns-3 gap-4">
  {images.map((image, index) => (
    <div key={index} className="break-inside-avoid mb-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="aspect-[3/4] bg-gray-100">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-600">{image.caption}</p>
        </div>
      </div>
    </div>
  ))}
</div>
```

## Tailwind CSSでの具体的な実装

### よく使用されるアスペクト比クラス
```css
aspect-square    /* 1:1 - 正方形 */
aspect-video     /* 16:9 - 動画サイズ */
aspect-[4/3]     /* 4:3 - 従来的な画像 */
aspect-[3/2]     /* 3:2 - 写真的な比率 */
aspect-[2/1]     /* 2:1 - ワイドバナー */
aspect-[9/16]    /* 9:16 - 縦型（スマートフォン） */
```

### オブジェクトフィットクラス
```css
object-cover     /* 画像を切り抜いて全体を覆う */
object-contain   /* 画像を全体表示（余白あり） */
object-fill      /* 画像を引き伸ばして全体を覆う */
object-none      /* 画像を元サイズで表示 */
object-scale-down /* containとnoneの小さい方を適用 */
```

### 背景色によるローディング状態の改善
```tsx
<!-- ライトモード用 -->
<div className="aspect-video bg-gray-100">
  <OptimizedImage
    src="/images/content.jpg"
    alt="コンテンツ画像"
    className="w-full h-full object-cover"
  />
</div>

<!-- ダークモード対応 -->
<div className="aspect-video bg-gray-100 dark:bg-gray-700">
  <OptimizedImage
    src="/images/content.jpg"
    alt="コンテンツ画像"
    className="w-full h-full object-cover"
  />
</div>

<!-- スケルトンローディング風 -->
<div className="aspect-video bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse">
  <OptimizedImage
    src="/images/content.jpg"
    alt="コンテンツ画像"
    className="w-full h-full object-cover"
  />
</div>
```

## パフォーマンス測定方法

### 1. Chrome DevToolsでのCLS測定
1. DevToolsを開く（F12）
2. **Performance**タブを選択
3. **Record**ボタンを押してページを読み込む
4. **Web Vitals**セクションでCLSスコアを確認

### 2. Lighthouse での測定
```bash
# Lighthouse CLIを使用
npx lighthouse http://localhost:5173 --only-categories=performance
```

### 3. Web Vitals ライブラリでの測定
```bash
bun add web-vitals
```

```tsx
// app/root.tsx に追加
import { getCLS } from 'web-vitals';

export default function App() {
  useEffect(() => {
    getCLS((metric) => {
      console.log('CLS score:', metric.value);
      // 分析ツールに送信
    });
  }, []);

  return (
    // ...
  );
}
```

## ベストプラクティス

### 1. 画像サイズの事前指定
```tsx
// ❌ 悪い例：サイズ未指定
<OptimizedImage
  src="/images/hero.jpg"
  alt="ヒーロー画像"
  className="rounded-lg"
/>

// ✅ 良い例：アスペクト比コンテナ
<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/hero.jpg"
    alt="ヒーロー画像"
    className="w-full h-full object-cover"
  />
</div>
```

### 2. 適切な背景色の設定
```tsx
// ✅ 画像の主要色に近い背景色を設定
<div className="aspect-video bg-blue-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/sky.jpg"
    alt="青空の画像"
    className="w-full h-full object-cover"
  />
</div>
```

### 3. スケルトンローディングの実装
```tsx
// ✅ スケルトンローディング付き
<div className="aspect-video bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/content.jpg"
    alt="コンテンツ画像"
    className="w-full h-full object-cover"
  />
</div>
```

### 4. 重要な画像の優先読み込み
```tsx
// ✅ Above the fold の画像は priority を設定
<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/hero.jpg"
    alt="ヒーロー画像"
    className="w-full h-full object-cover"
    priority={true}
  />
</div>
```

### 5. レスポンシブデザインでのCLS対策
```tsx
// ✅ 画面サイズに応じたアスペクト比
<div className="aspect-square md:aspect-video bg-gray-100 rounded-lg overflow-hidden">
  <OptimizedImage
    src="/images/flexible.jpg"
    alt="柔軟な画像"
    className="w-full h-full object-cover"
  />
</div>
```

## まとめ

1. **OptimizedImageコンポーネント**は画像最適化に特化
2. **CLS対策はTailwind CSS**の`aspect-*`クラスで実装
3. **事前のサイズ確保**が最も重要
4. **適切な背景色**でローディング体験を向上
5. **パフォーマンス測定**で効果を定期的に確認

このガイドに従うことで、画像によるCLS問題を効果的に解決し、優れたユーザー体験を提供できます。