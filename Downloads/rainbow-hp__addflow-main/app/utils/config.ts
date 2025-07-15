/**
 * プロジェクト設定の自動生成ユーティリティ
 * ドメインやプロジェクト名から必要な設定値を自動生成
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// パッケージ情報の型定義
interface PackageInfo {
  name: string;
  version: string;
  description?: string;
}

// 環境設定の型定義
interface EnvironmentConfig {
  development: {
    port: number;
    domain: string;
    deployPath: string;
  };
  staging: {
    port: number;
    domain: string;
    deployPath: string;
  };
  production: {
    port: number;
    domain: string;
    deployPath: string;
  };
}

// メール設定の型定義
interface EmailConfig {
  noreply: string;
  contact: string;
  support: string;
  info: string;
  admin: string;
}

// CMS設定の型定義
interface CmsConfig {
  apiUrl: string;
  adminUrl: string;
  mediaUrl: string;
}

// アプリケーション設定の型定義
interface AppConfig {
  name: string;
  normalizedName: string;
  pm2Name: string;
  dockerName: string;
  version: string;
}

/**
 * package.jsonからプロジェクト情報を取得
 */
export function getPackageInfo(): PackageInfo {
  try {
    const packagePath = join(process.cwd(), 'package.json');
    const packageContent = readFileSync(packagePath, 'utf-8');
    return JSON.parse(packageContent);
  } catch (error) {
    console.warn('package.jsonの読み込みに失敗しました:', error);
    return {
      name: 'unknown-project',
      version: '1.0.0'
    };
  }
}

/**
 * プロジェクト名の正規化
 * - ドット、アンダースコアをハイフンに変換
 * - 小文字に統一
 */
export function normalizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[._]/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * 環境別設定を生成
 */
export function generateEnvironmentConfig(baseDomain: string): EnvironmentConfig {
  return {
    development: {
      port: 3001,
      domain: `dev.${baseDomain}`,
      deployPath: '/var/www/sites/development'
    },
    staging: {
      port: 3002,
      domain: `staging.${baseDomain}`,
      deployPath: '/var/www/sites/staging'
    },
    production: {
      port: 3000,
      domain: baseDomain,
      deployPath: '/var/www/html'
    }
  };
}

/**
 * メールアドレス設定を自動生成
 */
export function generateEmailConfig(domain: string): EmailConfig {
  return {
    noreply: `noreply@${domain}`,
    contact: `contact@${domain}`,
    support: `support@${domain}`,
    info: `info@${domain}`,
    admin: `admin@${domain}`
  };
}

/**
 * CMS関連URLを自動生成
 */
export function generateCmsConfig(domain: string): CmsConfig {
  return {
    apiUrl: `https://cms.${domain}/graphql`,
    adminUrl: `https://cms.${domain}/wp-admin`,
    mediaUrl: `https://cms.${domain}/wp-content/uploads`
  };
}

/**
 * アプリケーション設定を生成
 */
export function generateAppConfig(environment: keyof EnvironmentConfig = 'development'): AppConfig {
  const packageInfo = getPackageInfo();
  const normalizedName = normalizeProjectName(packageInfo.name);
  
  return {
    name: packageInfo.name,
    normalizedName,
    pm2Name: `${normalizedName}-${environment}`,
    dockerName: `${normalizedName}_${environment}`,
    version: packageInfo.version
  };
}

/**
 * 完全な設定オブジェクトを生成
 */
export function generateCompleteConfig(
  baseDomain: string,
  environment: keyof EnvironmentConfig = 'development'
) {
  const envConfig = generateEnvironmentConfig(baseDomain);
  const currentEnv = envConfig[environment];
  const emailConfig = generateEmailConfig(baseDomain);
  const cmsConfig = generateCmsConfig(baseDomain);
  const appConfig = generateAppConfig(environment);
  
  return {
    // アプリケーション情報
    app: appConfig,
    
    // 環境設定
    environment: {
      name: environment,
      port: currentEnv.port,
      domain: currentEnv.domain,
      deployPath: currentEnv.deployPath,
      isProduction: environment === 'production',
      isDevelopment: environment === 'development'
    },
    
    // メール設定
    email: emailConfig,
    
    // CMS設定
    cms: cmsConfig,
    
    // URL生成ヘルパー
    urls: {
      app: `https://${currentEnv.domain}`,
      api: `https://${currentEnv.domain}/api`,
      health: `https://${currentEnv.domain}/health`,
      docs: `https://${currentEnv.domain}/docs`,
      storybook: `https://${currentEnv.domain}/storybook`
    }
  };
}

/**
 * 環境変数として必要な値のみを抽出
 * セキュリティが必要な項目のみ環境変数化
 */
export function getRequiredEnvVars(config: ReturnType<typeof generateCompleteConfig>) {
  return {
    // セキュリティ上必要
    VPS_IP: 'Required: VPS IPアドレス',
    VPS_USERNAME: 'Required: VPSユーザー名',
    SSH_PRIVATE_KEY: 'Required: SSH秘密鍵',
    SMTP_PASS: 'Required: SMTPパスワード',
    
    // 設定上必要
    NODE_ENV: config.environment.name,
    DEPLOY_PATH: config.environment.deployPath,
    APP_PORT: config.environment.port.toString(),
    DOMAIN: config.environment.domain,
    
    // 生成された値（参考）
    GENERATED_APP_NAME: config.app.normalizedName,
    GENERATED_PM2_NAME: config.app.pm2Name,
    GENERATED_FROM_EMAIL: config.email.noreply,
    GENERATED_TO_EMAIL: config.email.contact,
    GENERATED_CMS_URL: config.cms.apiUrl
  };
}

/**
 * 設定の妥当性チェック
 */
export function validateConfig(config: ReturnType<typeof generateCompleteConfig>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // ドメイン検証
  if (!config.environment.domain.includes('.')) {
    errors.push('無効なドメイン形式です');
  }
  
  // ポート検証
  if (config.environment.port < 1000 || config.environment.port > 65535) {
    errors.push('ポート番号が無効です (1000-65535)');
  }
  
  // プロジェクト名検証
  if (config.app.normalizedName.length < 3) {
    warnings.push('プロジェクト名が短すぎる可能性があります');
  }
  
  // 本番環境警告
  if (config.environment.isProduction && config.environment.domain.includes('localhost')) {
    warnings.push('本番環境でlocalhostドメインが設定されています');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 使用例とテスト用のサンプル関数
 */
export function showConfigExample() {
  const config = generateCompleteConfig('rainbow-transport.com', 'development');
  const validation = validateConfig(config);
  const envVars = getRequiredEnvVars(config);
  
  console.log('=== 生成された設定 ===');
  console.log(JSON.stringify(config, null, 2));
  
  console.log('\n=== 必要な環境変数 ===');
  console.log(JSON.stringify(envVars, null, 2));
  
  console.log('\n=== 妥当性チェック ===');
  console.log('Valid:', validation.isValid);
  if (validation.errors.length > 0) {
    console.log('Errors:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.log('Warnings:', validation.warnings);
  }
  
  return { config, validation, envVars };
}