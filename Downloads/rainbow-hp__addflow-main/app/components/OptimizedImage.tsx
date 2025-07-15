import React from 'react';

interface OptimizedImageProps {
  /**
   * 画像のソースパス（public フォルダからの相対パス）
   * 例: "/images/hero.jpg"
   */
  src: string;
  
  /**
   * 画像の代替テキスト（アクセシビリティ必須）
   */
  alt: string;
  
  /**
   * CSSクラス名（Tailwind CSS でサイズ・スタイル制御）
   * 例: "w-full h-64 object-cover rounded-lg"
   */
  className?: string;
  
  /**
   * 遅延読み込み設定
   * @default "lazy"
   */
  loading?: 'lazy' | 'eager';
  
  /**
   * 画像の優先度（重要な画像の場合 true）
   * @default false
   */
  priority?: boolean;
  
  /**
   * 追加のimg要素属性
   */
  imgProps?: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'loading'>;
}

/**
 * 自動的にWebP形式に対応し、ブラウザの対応状況に応じて最適な画像を配信するコンポーネント
 * 
 * 【設計思想】
 * - 画像最適化とWebP配信のみに責任を集中
 * - スタイリングはTailwind CSSに完全委譲
 * - シンプルで直感的なAPI
 * 
 * 使用例:
 * ```tsx
 * <OptimizedImage 
 *   src="/images/hero.jpg" 
 *   alt="ヒーロー画像" 
 *   className="w-full h-64 object-cover rounded-lg md:h-96"
 * />
 * ```
 * 
 * CLS対策が必要な場合:
 * ```tsx
 * <div className="aspect-video">
 *   <OptimizedImage 
 *     src="/images/hero.jpg" 
 *     alt="ヒーロー画像"
 *     className="w-full h-full object-cover"
 *   />
 * </div>
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  className,
  loading = 'lazy',
  priority = false,
  imgProps,
}: OptimizedImageProps) {
  // WebPパスを生成（元の拡張子をwebpに変更）
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // 優先度が高い場合は即座に読み込み
  const loadingStrategy = priority ? 'eager' : loading;
  
  return (
    <picture>
      {/* WebP対応ブラウザ用 */}
      <source 
        srcSet={webpSrc} 
        type="image/webp"
      />
      
      {/* フォールバック画像（WebP非対応ブラウザ用） */}
      <img
        src={src}
        alt={alt}
        loading={loadingStrategy}
        decoding="async"
        className={className}
        {...imgProps}
      />
    </picture>
  );
}

// デフォルトエクスポート
export default OptimizedImage;