import { Plugin } from 'vite';
import sharp from 'sharp';
import { glob } from 'glob';
import { promises as fs } from 'fs';
import path from 'path';

interface ImageOptimizerOptions {
  /**
   * 画像品質設定
   */
  quality?: {
    jpeg?: number;
    png?: number;
    webp?: number;
  };
  /**
   * 処理対象のディレクトリ
   */
  inputDir?: string;
  /**
   * 出力ディレクトリ
   */
  outputDir?: string;
  /**
   * WebPを生成するかどうか
   */
  generateWebP?: boolean;
  /**
   * 元画像を圧縮するかどうか
   */
  compressOriginal?: boolean;
}

const defaultOptions: Required<ImageOptimizerOptions> = {
  quality: {
    jpeg: 85,
    png: 90,
    webp: 85,
  },
  inputDir: 'public',
  outputDir: 'public',
  generateWebP: true,
  compressOriginal: true,
};

export function imageOptimizer(userOptions: ImageOptimizerOptions = {}): Plugin {
  const options = { ...defaultOptions, ...userOptions };
  
  return {
    name: 'image-optimizer',
    async buildStart() {
      // 開発環境では画像最適化をスキップ
      if (process.env.NODE_ENV !== 'production') {
        console.log('🖼️  開発環境では画像最適化をスキップします');
        return;
      }
      
      console.log('🖼️  画像最適化を開始...');
      
      try {
        // 対象画像ファイルを検索
        const imagePattern = path.join(options.inputDir, '**/*.{jpg,jpeg,png}');
        const imageFiles = await glob(imagePattern);
        
        if (imageFiles.length === 0) {
          console.log('ℹ️  最適化対象の画像が見つかりませんでした');
          return;
        }
        
        console.log(`📸 ${imageFiles.length}個の画像を処理中...`);
        
        // 画像処理を並列実行せずに順次実行
        for (const imagePath of imageFiles) {
          try {
            await processImage(imagePath, options);
          } catch (error) {
            console.error(`❌ 画像処理エラー: ${imagePath}`, error);
            // 個別の画像でエラーが発生してもビルドを続行
          }
        }
        
        console.log('✅ 画像最適化が完了しました');
      } catch (error) {
        console.error('❌ 画像最適化中にエラーが発生:', error);
        // エラーが発生してもビルドを停止しない
      }
    },
  };
}

async function processImage(imagePath: string, options: Required<ImageOptimizerOptions>) {
  const ext = path.extname(imagePath).toLowerCase();
  const baseName = path.basename(imagePath, ext);
  const dirName = path.dirname(imagePath);
  
  try {
    // 元画像の情報を取得
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    console.log(`  処理中: ${path.relative(options.inputDir, imagePath)}`);
    
    // 元画像の圧縮
    if (options.compressOriginal) {
      let compressedImage = image.clone();
      
      if (ext === '.jpg' || ext === '.jpeg') {
        compressedImage = compressedImage.jpeg({
          quality: options.quality.jpeg,
          progressive: true,
          mozjpeg: true,
        });
      } else if (ext === '.png') {
        compressedImage = compressedImage.png({
          quality: options.quality.png,
          compressionLevel: 9,
        });
      }
      
      await compressedImage.toFile(imagePath);
    }
    
    // WebP生成
    if (options.generateWebP) {
      const webpPath = path.join(dirName, `${baseName}.webp`);
      
      await image
        .clone()
        .webp({
          quality: options.quality.webp,
          effort: 6,
        })
        .toFile(webpPath);
      
      // ファイルサイズ比較
      const originalStats = await fs.stat(imagePath);
      const webpStats = await fs.stat(webpPath);
      const savings = Math.round(((originalStats.size - webpStats.size) / originalStats.size) * 100);
      
      console.log(`    WebP生成: ${Math.round(savings)}% 削減 (${formatBytes(originalStats.size)} → ${formatBytes(webpStats.size)})`);
    }
    
  } catch (error) {
    console.error(`    エラー: ${imagePath}`, error);
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}