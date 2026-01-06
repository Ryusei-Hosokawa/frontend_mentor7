<?php
/**
 * メール送信ヘルパー機能
 *
 * メール送信に関する処理を集約して管理
 * SPF認証やメールヘッダー生成などの機能を提供
 */

/**
 * 動的なSPFメール送信者アドレスを生成
 *
 * @return string SPF認証対応の送信者メールアドレス
 */
function getSpfEmail() {
    global $default_domain;

    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';

    // HTTP_HOSTの検証（セキュリティ対策）
    // 英数字、ハイフン、ドット、コロン（ポート番号用）のみ許可
    if (!empty($host) && preg_match('/^[a-zA-Z0-9.\-:]+$/', $host)) {
        // ポート番号を除去
        $domain = preg_replace('/:\d+$/', '', $host);

        // localhost環境の場合はデフォルトドメインを使用
        if (strpos($domain, 'localhost') !== false ||
            strpos($domain, '127.0.0.1') !== false) {
            $domain = $default_domain;
        }
    } else {
        // 不正な文字が含まれる場合はデフォルトドメインを使用
        $domain = $default_domain;
    }

    return 'noreply@' . $domain;
}

/**
 * トップページの絶対URLを生成
 *
 * SPF認証で使用しているドメイン情報を流用して、
 * トップページへの絶対パスを自動生成します。
 * サブディレクトリ環境にも対応しています。
 *
 * @return string トップページの絶対URL（例: https://example.com/index.html または https://example.com/subdirectory/index.html）
 */
function getTopPageUrl() {
    global $default_domain;

    // プロトコル判定（HTTPS or HTTP）
    $protocol = 'https://';
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'off') {
        $protocol = 'http://';
    } elseif (isset($_SERVER['REQUEST_SCHEME'])) {
        $protocol = $_SERVER['REQUEST_SCHEME'] . '://';
    } elseif (!isset($_SERVER['HTTPS']) || empty($_SERVER['HTTPS'])) {
        $protocol = 'http://';
    }

    // ドメイン取得
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';

    // HTTP_HOSTの検証（セキュリティ対策）
    if (!empty($host) && preg_match('/^[a-zA-Z0-9.\-:]+$/', $host)) {
        // ポート番号を除去（既にHTTP_HOSTに含まれている場合はそのまま使用）
        $domain = $host;

        // localhost環境の場合はデフォルトドメインを使用
        if (strpos($domain, 'localhost') !== false ||
            strpos($domain, '127.0.0.1') !== false) {
            $domain = 'localhost:8080'; // ローカル開発環境用
        }
    } else {
        // 不正な文字が含まれる場合はデフォルトドメインを使用
        $domain = $default_domain;
    }

    // 現在のスクリプトのパスを取得してプロジェクトルートを計算
    // 例: /domain/mail-module-test/mail-system/pages/thanks.php
    //  → /domain/mail-module-test
    $scriptPath = isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '';

    // mail-system/pages/xxxx.php の部分を削除してプロジェクトルートを取得
    // 正規表現で /mail-system/pages/.*\.php を削除
    $projectRoot = preg_replace('#/mail-system/pages/[^/]+\.php$#', '', $scriptPath);

    // プロジェクトルートが空の場合（削除できなかった場合）は / をデフォルトとする
    if (empty($projectRoot)) {
        $projectRoot = '';
    }

    // 絶対URLを生成
    return $protocol . $domain . $projectRoot . '/index.html';
}

/**
 * メールヘッダーを生成
 *
 * Gmail迷惑メール判定を避けるため、以下のヘッダーを含めます：
 * - From: 送信者情報
 * - Return-Path: バウンスメール処理
 * - X-Mailer: メーラー識別
 * - Message-ID: メール識別
 *
 * @param string $senderName 送信者名（会社名など）
 * @return string メールヘッダー文字列
 */
function generateEmailHeader($senderName) {
    $fromEmail = getSpfEmail();

    // Fromヘッダー
    $header = "From: " . mb_encode_mimeheader($senderName) . " <" . $fromEmail . ">\r\n";

    // Return-Pathヘッダー（バウンスメール処理）
    $header .= "Return-Path: " . $fromEmail . "\r\n";

    // X-Mailerヘッダー（メーラー識別）
    $header .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Message-IDヘッダー（メール識別 - Gmail迷惑メール対策）
    $messageDomain = strpos($fromEmail, '@') !== false ? substr($fromEmail, strpos($fromEmail, '@') + 1) : 'localhost';
    $header .= "Message-ID: <" . time() . "." . md5(uniqid()) . "@" . $messageDomain . ">\r\n";

    // Content-Type
    $header .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // MIME-Version
    $header .= "MIME-Version: 1.0\r\n";

    return $header;
}

/**
 * index.htmlからメタ情報とアセット情報を抽出
 *
 * @return array メタ情報とアセット情報の連想配列
 */
function extractMetaFromIndexHtml() {
    // index.htmlのパス（mail-system/pages/から見た相対パス）
    $index_path = dirname(dirname(__DIR__)) . '/index.html';

    // デフォルト値
    $data = [
        'title' => '',
        'description' => '',
        'keywords' => '',
        'og_title' => '',
        'og_description' => '',
        'og_url' => '',
        'og_image' => '',
        'logo_image' => '../../image/company.png',
        'logo_image_sp' => '../../image/company_sp.png',
        'mail_icon' => '../../image/mail.png',
        'mail_icon_sp' => '../../image/mail2.png',
        'tel_icon' => '../../image/tel.png',
        'tel_icon_sp' => '../../image/tel2.png',
        'fixed_banner01' => '../../image/side01.png',
        'fixed_banner02' => '../../image/side02.png',
        'footer_company_link' => '../../company.html',
        'footer_privacy_link' => '../../privacy.html'
    ];

    // ファイルが存在しない場合はデフォルト値を返す
    if (!file_exists($index_path)) {
        return $data;
    }

    // HTMLを読み込む
    $html = file_get_contents($index_path);

    // title抽出
    if (preg_match('/<title>(.*?)<\/title>/is', $html, $matches)) {
        $data['title'] = trim($matches[1]);
    }

    // meta description抽出
    if (preg_match('/<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']/is', $html, $matches)) {
        $data['description'] = trim($matches[1]);
    }

    // meta keywords抽出
    if (preg_match('/<meta\s+name=["\']keywords["\']\s+content=["\'](.*?)["\']/is', $html, $matches)) {
        $data['keywords'] = trim($matches[1]);
    }

    // og:title抽出
    if (preg_match('/<meta\s+property=["\']og:title["\']\s+content=["\'](.*?)["\']/is', $html, $matches)) {
        $data['og_title'] = trim($matches[1]);
    } else {
        $data['og_title'] = $data['title'];
    }

    // og:description抽出
    if (preg_match('/<meta\s+property=["\']og:description["\']\s+content=["\'](.*?)["\']/is', $html, $matches)) {
        $data['og_description'] = trim($matches[1]);
    } else {
        $data['og_description'] = $data['description'];
    }

    // og:url抽出
    if (preg_match('/<meta\s+property=["\']og:url["\']\s+content=["\'](.*?)["\']/is', $html, $matches)) {
        $data['og_url'] = trim($matches[1]);
    }

    // og:image抽出
    if (preg_match('/<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']/is', $html, $matches)) {
        $data['og_image'] = trim($matches[1]);
    }

    // 画像パスの抽出（ロゴ）
    if (preg_match('/<img\s+src=["\']([^"\']*company\.png)["\']/is', $html, $matches)) {
        $data['logo_image'] = '../../' . trim($matches[1]);
    }
    if (preg_match('/<source\s+srcset=["\']([^"\']*company_sp\.png)["\']/is', $html, $matches)) {
        $data['logo_image_sp'] = '../../' . trim($matches[1]);
    }

    // フッターリンクの抽出
    if (preg_match('/<a\s+href=["\']([^"\']*company\.html)["\']/is', $html, $matches)) {
        $data['footer_company_link'] = '../../' . trim($matches[1]);
    }
    if (preg_match('/<a\s+href=["\']([^"\']*privacy\.html)["\']/is', $html, $matches)) {
        $data['footer_privacy_link'] = '../../' . trim($matches[1]);
    }

    return $data;
}

/**
 * CSRFトークンを生成してセッションに保存
 *
 * @return string 生成されたトークン
 */
function generateCsrfToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * CSRFトークンを検証
 *
 * @param string $token 検証するトークン
 * @return bool トークンが有効な場合true
 */
function validateCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * メール送信のログ出力
 *
 * @param string $to 送信先
 * @param string $subject 件名
 * @param string $body 本文
 * @param string $header ヘッダー
 */
function logEmailDetails($to, $subject, $body, $header) {
    error_log("=== メール送信ログ ===");
    error_log("送信先: " . $to);
    error_log("件名: " . $subject);
    error_log("送信者: " . getSpfEmail());
    error_log("ヘッダー: " . $header);
    error_log("メール本文: " . $body);
    error_log("=====================");
}

/**
 * 管理者宛メール本文を生成
 *
 * @param array $formData フォームデータ
 * @param string $companyName 会社名
 * @return string メール本文
 */
function generateAdminEmailBody($formData, $companyName) {
    $body = "WEBフォームからお問い合わせがありました。\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "お名前: {$formData['name']}\n\n";
    $body .= "メールアドレス: {$formData['email']}\n\n";
    $body .= "電話番号: {$formData['tel']}\n\n";
    $body .= "備考: {$formData['comment']}\n\n";
    $body .= "個人情報保護方針: {$formData['privacy']}\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "送信元サイト: {$companyName}\n";

    return $body;
}

/**
 * 顧客宛自動返信メール本文を生成
 *
 * @param array $formData フォームデータ
 * @param string $companyName 会社名
 * @param string $companyAddress 会社住所
 * @param string $companyTel 会社電話番号
 * @return string メール本文
 */
function generateCustomerEmailBody($formData, $companyName, $companyAddress, $companyTel) {
    $body = "{$formData['name']} 様\n\n";
    $body .= "お問い合わせをいただき、ありがとうございます。\n\n";
    $body .= "担当者より改めてご連絡いたします。\n\n";
    $body .= "ご連絡がない場合は、メールアドレスの確認をお願いいたします。\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "【お問い合わせ内容は下記の通りです】\n\n";
    $body .= "お名前: {$formData['name']}\n\n";
    $body .= "メールアドレス: {$formData['email']}\n\n";
    $body .= "電話番号: {$formData['tel']}\n\n";
    $body .= "備考: {$formData['comment']}\n\n";
    $body .= "個人情報保護方針: {$formData['privacy']}\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "【このメールにお心当たりのない方】\n";
    $body .= "お手数おかけいたしますが、下記までご連絡くださいませ。\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "{$companyName}\n";
    $body .= "{$companyAddress}\n";
    $body .= "電話: {$companyTel}\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "このメールは自動送信されています。\n";

    return $body;
}
