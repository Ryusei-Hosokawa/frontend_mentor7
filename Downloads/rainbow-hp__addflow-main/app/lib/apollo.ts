import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQLエンドポイント（環境変数で設定）
// 開発環境でGraphQLサーバーが利用できない場合は無効化
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || undefined,
});

// 認証コンテキスト（必要に応じて設定）
const authLink = setContext((_, { headers }) => {
  // ローカルストレージから認証トークンを取得
  // 本番環境では適切な認証方式を実装
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  };
});

// Apollo Client インスタンス
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          pages: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// SSR対応のクライアント作成関数
export function createApolloClient() {
  return new ApolloClient({
    link: httpLink, // SSRでは認証リンクは使用しない
    cache: new InMemoryCache(),
    ssrMode: typeof window === 'undefined',
  });
}