import { gql } from "@apollo/client";

// 投稿一覧取得クエリ
export const GET_POSTS = gql`
    query GetPosts(
        $first: Int = 10
        $after: String
        $where: RootQueryToPostConnectionWhereArgs
    ) {
        posts(first: $first, after: $after, where: $where) {
            nodes {
                id
                title
                excerpt
                slug
                date
                modified
                status
                featuredImage {
                    node {
                        sourceUrl
                        altText
                        mediaDetails {
                            width
                            height
                        }
                    }
                }
                author {
                    node {
                        name
                        email
                    }
                }
                categories {
                    nodes {
                        id
                        name
                        slug
                    }
                }
                tags {
                    nodes {
                        id
                        name
                        slug
                    }
                }
                seo {
                    title
                    metaDesc
                    opengraphImage {
                        sourceUrl
                    }
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

// 投稿詳細取得クエリ
export const GET_POST_BY_SLUG = gql`
    query GetPostBySlug($slug: ID!) {
        postBy(slug: $slug) {
            id
            title
            content
            excerpt
            slug
            date
            modified
            status
            featuredImage {
                node {
                    sourceUrl
                    altText
                    mediaDetails {
                        width
                        height
                    }
                }
            }
            author {
                node {
                    name
                    email
                }
            }
            categories {
                nodes {
                    id
                    name
                    slug
                }
            }
            tags {
                nodes {
                    id
                    name
                    slug
                }
            }
            seo {
                title
                metaDesc
                opengraphImage {
                    sourceUrl
                }
            }
        }
    }
`;

// 固定ページ一覧取得クエリ
export const GET_PAGES = gql`
    query GetPages {
        pages {
            nodes {
                id
                title
                content
                slug
                date
                modified
                status
                featuredImage {
                    node {
                        sourceUrl
                        altText
                        mediaDetails {
                            width
                            height
                        }
                    }
                }
                seo {
                    title
                    metaDesc
                    opengraphImage {
                        sourceUrl
                    }
                }
            }
        }
    }
`;

// 固定ページ詳細取得クエリ
export const GET_PAGE_BY_SLUG = gql`
    query GetPageBySlug($slug: ID!) {
        pageBy(slug: $slug) {
            id
            title
            content
            slug
            date
            modified
            status
            featuredImage {
                node {
                    sourceUrl
                    altText
                    mediaDetails {
                        width
                        height
                    }
                }
            }
            seo {
                title
                metaDesc
                opengraphImage {
                    sourceUrl
                }
            }
            # ACFフィールド（必要に応じて追加）
            customFields {
                fieldGroupName
                # ここに具体的なACFフィールドを追加
            }
        }
    }
`;

// カテゴリー一覧取得クエリ
export const GET_CATEGORIES = gql`
    query GetCategories {
        categories {
            nodes {
                id
                name
                slug
                description
                count
            }
        }
    }
`;

// タグ一覧取得クエリ
export const GET_TAGS = gql`
    query GetTags {
        tags {
            nodes {
                id
                name
                slug
                description
                count
            }
        }
    }
`;

// お問い合わせフォーム送信ミューテーション
export const SUBMIT_CONTACT_FORM = gql`
    mutation SubmitContactForm(
        $name: String!
        $email: String!
        $subject: String!
        $message: String!
        $phone: String
        $company: String
    ) {
        submitContactForm(
            input: {
                name: $name
                email: $email
                subject: $subject
                message: $message
                phone: $phone
                company: $company
            }
        ) {
            success
            message
            errors {
                field
                message
            }
        }
    }
`;

// サイト情報取得クエリ
export const GET_SITE_INFO = gql`
    query GetSiteInfo {
        generalSettings {
            title
            description
            url
            language
            timezone
            dateFormat
            timeFormat
        }
    }
`;

// メニュー取得クエリ
export const GET_MENU = gql`
    query GetMenu($location: MenuLocationEnum!) {
        menuItems(where: { location: $location }) {
            nodes {
                id
                label
                url
                target
                cssClasses
                description
                parentId
                order
            }
        }
    }
`;
