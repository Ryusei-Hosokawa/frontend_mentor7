import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import OptimizedImage from "../components/OptimizedImage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
      
      {/* 画像最適化デモセクション */}
      <section className="max-w-4xl mx-auto mt-16 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          🖼️ 画像最適化デモ
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              JPEG画像（自動WebP生成）
            </h3>
            <OptimizedImage
              src="/images/test-image.jpg"
              alt="テスト用JPEG画像"
              className="w-48 h-48 object-cover rounded-lg shadow-md mx-auto"
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              WebP対応ブラウザでは自動的にWebP形式で配信されます
            </p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1 block">
              className="w-48 h-48 object-cover rounded-lg"
            </code>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              PNG画像（自動WebP生成）
            </h3>
            <OptimizedImage
              src="/images/test-image.png"
              alt="テスト用PNG画像"
              className="w-48 h-48 object-cover rounded-lg shadow-md mx-auto"
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              非対応ブラウザでは元のPNG形式で配信されます
            </p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1 block">
              className="w-48 h-48 object-cover rounded-lg"
            </code>
          </div>
        </div>
        
        {/* CLS対策とレスポンシブデザインのデモ */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            🎯 CLS対策 & レスポンシブデザイン
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                アスペクト比固定（16:9）
              </h4>
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <OptimizedImage
                  src="/images/test-image.jpg"
                  alt="アスペクト比固定画像"
                  className="w-full h-full object-cover"
                />
              </div>
              <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-2 block">
                {'<div className="aspect-video">\n  <OptimizedImage className="w-full h-full object-cover" />\n</div>'}
              </code>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                レスポンシブサイズ
              </h4>
              <OptimizedImage
                src="/images/test-image.png"
                alt="レスポンシブ画像"
                className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-lg shadow-md mx-auto"
              />
              <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-2 block">
                className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56"
              </code>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            📈 最適化効果
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• WebP形式で20-50%のファイルサイズ削減</li>
            <li>• 自動画像圧縮で品質を保ちながら容量最適化</li>
            <li>• ブラウザ対応状況に応じた自動切り替え</li>
            <li>• 遅延読み込み（lazy loading）対応</li>
            <li>• Tailwind CSSによる完全なスタイル制御</li>
          </ul>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
            🎨 設計思想
          </h4>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>• <strong>単一責任の原則</strong>: 画像最適化のみに集中</li>
            <li>• <strong>Tailwind統合</strong>: スタイリングはCSSに完全委譲</li>
            <li>• <strong>シンプルAPI</strong>: 複雑な設定不要</li>
            <li>• <strong>CLS対策</strong>: アスペクト比コンテナで解決</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
