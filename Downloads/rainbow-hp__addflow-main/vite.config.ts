import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { imageOptimizerStable } from "./plugins/image-optimizer-stable";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    // 安定版画像最適化プラグイン（開発環境では自動的にスキップ）
    imageOptimizerStable({
      quality: {
        jpeg: 85,
        png: 90,
        webp: 85,
      },
      inputDir: 'public',
      outputDir: 'public',
      generateWebP: true,
      compressOriginal: true,
      enableInDev: false, // 開発環境では無効化
    }),
  ],
});