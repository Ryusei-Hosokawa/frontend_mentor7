import type { Meta, StoryObj } from '@storybook/react';
import OptimizedImage from './OptimizedImage';

const meta: Meta<typeof OptimizedImage> = {
  title: 'Components/OptimizedImage',
  component: OptimizedImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '自動的にWebP形式に対応し、ブラウザの対応状況に応じて最適な画像を配信するコンポーネント。Tailwind CSSによる完全なスタイル制御をサポート。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '画像のソースパス（public フォルダからの相対パス）',
    },
    alt: {
      control: 'text',
      description: '画像の代替テキスト（アクセシビリティ必須）',
    },
    className: {
      control: 'text',
      description: 'CSSクラス名（Tailwind CSS でサイズ・スタイル制御）',
    },
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
      description: '遅延読み込み設定',
    },
    priority: {
      control: 'boolean',
      description: '画像の優先度（重要な画像の場合 true）',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: '/images/test-image.jpg',
    alt: 'テスト画像',
    className: 'w-64 h-64 object-cover rounded-lg',
  },
};

export const WithCLSPrevention: Story = {
  args: {
    src: '/images/test-image.jpg',
    alt: 'CLS対策画像',
    className: 'w-full h-full object-cover',
  },
  decorators: [
    (Story) => (
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden max-w-md">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'アスペクト比コンテナを使用したCLS（Cumulative Layout Shift）対策の例',
      },
    },
  },
};

export const ResponsiveImage: Story = {
  args: {
    src: '/images/test-image.png',
    alt: 'レスポンシブ画像',
    className: 'w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-lg shadow-md',
  },
  parameters: {
    docs: {
      description: {
        story: 'レスポンシブデザインでの使用例（Tailwind CSSのブレークポイント使用）',
      },
    },
  },
};

export const PriorityLoading: Story = {
  args: {
    src: '/images/test-image.jpg',
    alt: '優先読み込み画像',
    className: 'w-full h-64 object-cover rounded-lg',
    priority: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Above the fold の重要な画像での使用例（即座に読み込み）',
      },
    },
  },
};

export const LazyLoading: Story = {
  args: {
    src: '/images/test-image.png',
    alt: '遅延読み込み画像',
    className: 'w-full h-48 object-cover rounded-lg',
    loading: 'lazy',
  },
  parameters: {
    docs: {
      description: {
        story: 'ページ下部の画像での使用例（遅延読み込み）',
      },
    },
  },
};

export const SquareGrid: Story = {
  args: {
    src: '/images/test-image.jpg',
    alt: 'グリッド画像',
    className: 'w-full h-full object-cover',
  },
  decorators: [
    (Story) => (
      <div className="grid grid-cols-3 gap-4 max-w-md">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Story />
          </div>
        ))}
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'グリッドレイアウトでの使用例（正方形アスペクト比）',
      },
    },
  },
};