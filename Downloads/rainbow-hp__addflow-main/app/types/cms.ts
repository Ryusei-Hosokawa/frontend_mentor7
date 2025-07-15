// WordPress GraphQL型定義

export interface WordPressPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'private';
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails: {
        width: number;
        height: number;
      };
    };
  };
  author: {
    node: {
      name: string;
      email: string;
    };
  };
  categories: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  tags: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  seo?: {
    title: string;
    metaDesc: string;
    opengraphImage?: {
      sourceUrl: string;
    };
  };
}

export interface WordPressPage {
  id: string;
  title: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'private';
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails: {
        width: number;
        height: number;
      };
    };
  };
  seo?: {
    title: string;
    metaDesc: string;
    opengraphImage?: {
      sourceUrl: string;
    };
  };
  // ACF（Advanced Custom Fields）のカスタムフィールド
  customFields?: {
    [key: string]: any;
  };
}

export interface WordPressCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressTag {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressUser {
  id: string;
  name: string;
  email: string;
  slug: string;
  description: string;
  avatar?: {
    url: string;
  };
}

// お問い合わせフォーム関連
export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// SEO関連
export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

// ページメタデータ
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
}

// GraphQLクエリレスポンス型
export interface PostsQueryResponse {
  posts: {
    nodes: WordPressPost[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface PagesQueryResponse {
  pages: {
    nodes: WordPressPage[];
  };
}

export interface PostBySlugQueryResponse {
  postBy: WordPressPost | null;
}

export interface PageBySlugQueryResponse {
  pageBy: WordPressPage | null;
}

// クエリ変数型
export interface PostsQueryVariables {
  first?: number;
  after?: string;
  where?: {
    categoryName?: string;
    tagSlugIn?: string[];
    search?: string;
    status?: 'publish' | 'draft' | 'private';
  };
}

export interface PostBySlugQueryVariables {
  slug: string;
}

export interface PageBySlugQueryVariables {
  slug: string;
}