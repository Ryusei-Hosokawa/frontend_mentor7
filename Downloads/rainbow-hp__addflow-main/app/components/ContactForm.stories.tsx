import type { Meta, StoryObj } from '@storybook/react';
import ContactForm from './ContactForm';

const meta: Meta<typeof ContactForm> = {
  title: 'Components/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'TypeScript型安全なお問い合わせフォームコンポーネント。React Hook Form + Zodバリデーション、React Router v7統合済み。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'デフォルトのお問い合わせフォーム',
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    className: 'bg-gray-50 p-6 rounded-lg shadow-md',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムスタイリングを適用したフォーム',
      },
    },
  },
};

export const Responsive: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl mx-auto px-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
    docs: {
      description: {
        story: 'レスポンシブデザインでの表示例',
      },
    },
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'モバイル表示での使用例',
      },
    },
  },
};

export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'タブレット表示での使用例',
      },
    },
  },
};