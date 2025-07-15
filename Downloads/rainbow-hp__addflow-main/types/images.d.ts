/**
 * 画像ファイルの型定義
 * ViteやWebpackで画像をimportする際の型安全性を提供
 */

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.tiff' {
  const src: string;
  export default src;
}

/**
 * 画像最適化設定の型定義
 */
export interface ImageOptimizationConfig {
  /** JPEG画像の品質 (0-100) */
  jpegQuality: number;
  /** PNG画像の品質 (0-100) */
  pngQuality: number;
  /** WebP画像の品質 (0-100) */
  webpQuality: number;
  /** WebP形式を生成するかどうか */
  generateWebP: boolean;
  /** 元画像を圧縮するかどうか */
  compressOriginal: boolean;
}

/**
 * 最適化された画像の情報
 */
export interface OptimizedImageInfo {
  /** 元画像のパス */
  originalPath: string;
  /** WebP画像のパス */
  webpPath?: string;
  /** 元画像のサイズ（バイト） */
  originalSize: number;
  /** WebP画像のサイズ（バイト） */
  webpSize?: number;
  /** 圧縮率（パーセント） */
  compressionRatio?: number;
}

/**
 * ブラウザのWebP対応状況
 */
export interface WebPSupport {
  /** WebPをサポートしているかどうか */
  isSupported: boolean;
  /** 検出方法 */
  detectionMethod: 'canvas' | 'feature-detection' | 'user-agent';
}