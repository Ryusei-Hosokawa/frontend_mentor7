import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTestImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 200x200のテスト画像を作成
  const testImage = sharp({
    create: {
      width: 200,
      height: 200,
      channels: 3,
      background: { r: 100, g: 150, b: 200 }
    }
  });

  try {
    // JPEG画像を作成
    await testImage
      .jpeg({ quality: 100 })
      .toFile(path.join(imagesDir, 'test-image.jpg'));
    
    // PNG画像を作成
    await testImage
      .png()
      .toFile(path.join(imagesDir, 'test-image.png'));
    
    console.log('✅ テスト画像を作成しました:');
    console.log('  - public/images/test-image.jpg');
    console.log('  - public/images/test-image.png');
    
  } catch (error) {
    console.error('❌ テスト画像の作成に失敗:', error);
  }
}

createTestImages();