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
  /**
   * 開発環境でも処理を実行するかどうか
   */
  enableInDev?: boolean;
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
  enableInDev: false,
};

export function imageOptimizerStable(userOptions: ImageOptimizerOptions = {}): Plugin {
  const options = { ...defaultOptions, ...userOptions };
  
  return {
    name: 'image-optimizer-stable',
    
    async buildStart() {
      // 開発環境での制御
      const isDev = process.env.NODE_ENV !== 'production';
      
      if (isDev && !options.enableInDev) {
        console.log('🖼️  開発環境では画像最適化をスキップします');
        return;
      }
      
      console.log('🖼️  画像最適化を開始...');
      
      try {
        await optimizeImages(options);
      } catch (error) {
        console.error('❌ 画像最適化中にエラーが発生:', error);
        // 開発環境ではエラーを無視してサーバーを継続
        if (isDev) {
          console.log('⚠️  開発環境のため処理を継続します');
          return;
        }
        // 本番ビルドではエラーを投げる
        throw error;
      }
    },

    // HMR時には処理をスキップ
    handleHotUpdate(ctx) {
      const { file } = ctx;
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        console.log('🖼️  HMR: 画像更新を検知しましたが、最適化はスキップします');
      }
      return;
    }
  };
}

async function optimizeImages(options: Required<ImageOptimizerOptions>) {
  // Sharp初期化の安全性チェック
  try {
    await sharp({ create: { width: 1, height: 1, channels: 3, background: { r: 0, g: 0, b: 0 } } })
      .png()
      .toBuffer();
  } catch (error) {
    console.error('❌ Sharp初期化に失敗:', error);
    throw new Error('Sharp初期化に失敗しました。依存関係を再インストールしてください。');
  }

  // 対象画像ファイルを検索
  const imagePattern = path.join(options.inputDir, '**/*.{jpg,jpeg,png}');
  const imageFiles = await glob(imagePattern);
  
  if (imageFiles.length === 0) {
    console.log('ℹ️  最適化対象の画像が見つかりませんでした');
    return;
  }
  
  console.log(`📸 ${imageFiles.length}個の画像を処理中...`);
  
  // 画像を順次処理（並列処理によるメモリ不足を避ける）
  for (let i = 0; i < imageFiles.length; i++) {
    const imagePath = imageFiles[i];
    try {
      await processImageSafely(imagePath, options);
      
      // メモリ解放のため少し待機
      if (i % 5 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`❌ 画像処理エラー: ${imagePath}`, error);
      // 個別の画像でエラーが発生してもビルドを続行
    }
  }
  
  console.log('✅ 画像最適化が完了しました');
}

async function processImageSafely(imagePath: string, options: Required<ImageOptimizerOptions>) {
  const ext = path.extname(imagePath).toLowerCase();
  const baseName = path.basename(imagePath, ext);
  const dirName = path.dirname(imagePath);
  
  let sharpInstance: sharp.Sharp | null = null;
  
  try {
    // ファイルの存在確認
    await fs.access(imagePath);
    
    // 元画像の情報を取得
    sharpInstance = sharp(imagePath);
    const metadata = await sharpInstance.metadata();
    
    // ファイルサイズチェック（50MB以上は処理しない）
    const stats = await fs.stat(imagePath);
    if (stats.size > 50 * 1024 * 1024) {
      console.log(`⚠️  ファイルサイズが大きいためスキップ: ${path.relative(options.inputDir, imagePath)}`);
      return;
    }
    
    console.log(`  処理中: ${path.relative(options.inputDir, imagePath)}`);
    
    // 元画像の圧縮
    if (options.compressOriginal) {
      await compressOriginalImage(sharpInstance, imagePath, ext, options);
    }
    
    // WebP生成
    if (options.generateWebP) {
      const webpPath = path.join(dirName, `${baseName}.webp`);
      await sharpInstance
        .clone()
        .webp({ 
          quality: options.quality.webp,
          effort: 4 // バランスの取れた圧縮レベル
        })
        .toFile(webpPath);
    }
    
  } catch (error) {
    throw new Error(`画像処理に失敗: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    // リソースの明示的な解放
    if (sharpInstance) {
      try {
        sharpInstance.destroy();
      } catch (e) {
        // destroy中のエラーは無視
      }
    }
  }
}

async function compressOriginalImage(
  image: sharp.Sharp, 
  imagePath: string, 
  ext: string, 
  options: Required<ImageOptimizerOptions>
) {
  const tempPath = imagePath + '.tmp';
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
      compressionLevel: 6, // より軽い圧縮レベル
      adaptiveFiltering: true,
    });
  }
  
  // 一時ファイルに出力してから元ファイルに上書き
  await compressedImage.toFile(tempPath);
  await fs.rename(tempPath, imagePath);
}