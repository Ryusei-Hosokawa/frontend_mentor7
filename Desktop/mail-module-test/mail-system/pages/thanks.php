<?php
// モジュールのベースパスを設定（親ディレクトリ）
define('MAIL_SYSTEM_DIR', dirname(__DIR__));

// 設定ファイルとヘルパー読み込み
require_once MAIL_SYSTEM_DIR . '/CONFIG.php';
require_once MAIL_SYSTEM_DIR . '/lib/email_helper.php';

// トップページURLを絶対パスで生成（相対パスの問題を回避）
$top_page_url = getTopPageUrl();

// エラーレポートの設定
if ($debug_mode) {
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    ini_set("log_errors", 1);
    ini_set("error_log", MAIL_SYSTEM_DIR . "/error.log");
}

// セッションを開始
session_start();

// CSRFトークンの検証
$csrf_token = isset($_POST['csrf_token']) ? $_POST['csrf_token'] : '';
if (!validateCsrfToken($csrf_token)) {
    if ($debug_mode) {
        error_log("CSRF検証失敗: トークンが一致しません");
    }
    exit("不正なリクエストです。もう一度お試しください。");
}

// POSTデータの受け取り
$name = isset($_POST['name']) ? htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8') : '';
$tel = isset($_POST['tel']) ? htmlspecialchars($_POST['tel'], ENT_QUOTES, 'UTF-8') : '';
$comment = isset($_POST['comment']) ? htmlspecialchars($_POST['comment'], ENT_QUOTES, 'UTF-8') : '';
$privacy = isset($_POST['privacy']) ? htmlspecialchars($_POST['privacy'], ENT_QUOTES, 'UTF-8') : '';

// 基本的なバリデーション
if (empty($name) || empty($email)) {
    exit("必須項目が未入力です。");
}

// フォームデータを配列にまとめる
$formData = [
    'name' => $name,
    'email' => $email,
    'tel' => $tel,
    'comment' => $comment,
    'privacy' => $privacy
];

// メールヘッダー生成
$header = generateEmailHeader($company_name);

// 管理者宛メール設定
$subject_admin = $mail_subject_admin;
$body_admin = generateAdminEmailBody($formData, $company_name);

// 顧客宛メール設定
$subject_customer = $mail_subject_customer;
$body_customer = generateCustomerEmailBody($formData, $company_name, $company_address, $company_tel);

// メール送信結果
$mail_sent = false;
$admin_mail_success_count = 0;
$customer_mail_success = false;

// 管理者宛メール送信（複数アドレス対応）
if ($debug_mode) {
    error_log("=== 管理者宛メール送信開始 ===");
    error_log("送信先管理者数: " . count($admin_emails));
}

foreach ($admin_emails as $admin_email) {
    if ($debug_mode) {
        logEmailDetails($admin_email, $subject_admin, $body_admin, $header);
    }

    $mail_result = mail($admin_email, $subject_admin, $body_admin, $header);

    if ($mail_result) {
        $admin_mail_success_count++;
        if ($debug_mode) {
            error_log("管理者宛メール送信成功: " . $admin_email);
        }
    } else {
        if ($debug_mode) {
            error_log("管理者宛メール送信失敗: " . $admin_email);
        }
    }
}

// 1通でも成功したらメール送信成功とみなす
if ($admin_mail_success_count > 0) {
    $mail_sent = true;

    // 顧客宛自動返信メール送信
    if ($debug_mode) {
        error_log("=== 顧客宛メール送信開始 ===");
        logEmailDetails($email, $subject_customer, $body_customer, $header);
    }

    $customer_mail_result = mail($email, $subject_customer, $body_customer, $header);

    if ($customer_mail_result) {
        $customer_mail_success = true;
        if ($debug_mode) {
            error_log("顧客宛メール送信成功: " . $email);
        }
    } else {
        if ($debug_mode) {
            error_log("顧客宛メール送信失敗: " . $email);
        }
    }
} else {
    if ($debug_mode) {
        error_log("管理者宛メール送信失敗（全アドレス）");
        $last_error = error_get_last();
        if ($last_error) {
            error_log("最後のエラー: " . print_r($last_error, true));
        }
    }
}

if ($debug_mode) {
    error_log("=== メール送信デバッグ終了 ===");
    error_log("管理者宛送信成功数: {$admin_mail_success_count} / " . count($admin_emails));
    error_log("顧客宛送信: " . ($customer_mail_success ? "成功" : "失敗"));
}

// index.htmlからメタ情報を取得
$meta = extractMetaFromIndexHtml();
?>
<!DOCTYPE html>
<html lang="ja">

<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="<?php echo htmlspecialchars($meta['description'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="keywords" content="<?php echo htmlspecialchars($meta['keywords'], ENT_QUOTES, 'UTF-8'); ?>">
    <title><?php echo htmlspecialchars($meta['title'], ENT_QUOTES, 'UTF-8'); ?></title>
    <meta property="og:title" content="<?php echo htmlspecialchars($meta['og_title'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($meta['og_description'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($meta['og_url'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($meta['og_image'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:type" content="website">

    <link rel="stylesheet" type="text/css" href="../../css/cmn.css" media="all">
    <link rel="stylesheet" type="text/css" href="../../css/mystyle.css" media="all">
    <link rel="stylesheet" type="text/css" href="../../css/cta_anime.css" media="all">

    <link rel="stylesheet" type="text/css" href="../css/form.css" media="all">
    <link rel="stylesheet" type="text/css" href="../css/confirm.css" media="all">
    <link rel="stylesheet" type="text/css" href="../css/thanks.css" media="all">
</head>

<body class="ps-r top">
    <header class="hd-01">
        <div class="inner">
            <h1>
                <a href="../../index.html">
                    <picture>
                        <source srcset="<?php echo htmlspecialchars($meta['logo_image_sp'], ENT_QUOTES, 'UTF-8'); ?>" media="(max-width: 780px)">
                        <img src="<?php echo htmlspecialchars($meta['logo_image'], ENT_QUOTES, 'UTF-8'); ?>" alt="会社">
                    </picture>
                </a>
            </h1>
            <nav>
                <ul>
                    <li class="mail-content">
                        <a href="../../index.html#from">
                            <picture>
                                <source srcset="<?php echo htmlspecialchars($meta['mail_icon_sp'], ENT_QUOTES, 'UTF-8'); ?>" media="(max-width: 780px)">
                                <img src="<?php echo htmlspecialchars($meta['mail_icon'], ENT_QUOTES, 'UTF-8'); ?>" alt="メールのお問い合わせ">
                            </picture>
                        </a>
                    </li>
                    <li>
                        <a href="tel:<?php echo htmlspecialchars($company_tel, ENT_QUOTES, 'UTF-8'); ?>">
                            <picture>
                                <source srcset="<?php echo htmlspecialchars($meta['tel_icon_sp'], ENT_QUOTES, 'UTF-8'); ?>" media="(max-width: 780px)">
                                <img src="<?php echo htmlspecialchars($meta['tel_icon'], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($company_tel, ENT_QUOTES, 'UTF-8'); ?>">
                            </picture>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="fixed_banner01">
            <img src="<?php echo htmlspecialchars($meta['fixed_banner01'], ENT_QUOTES, 'UTF-8'); ?>" alt="">
        </div>
        <div class="fixed_banner02">
            <img src="<?php echo htmlspecialchars($meta['fixed_banner02'], ENT_QUOTES, 'UTF-8'); ?>" alt="">
        </div>
    </header>

    <article>
        <main class="page__main">
            <section class="contact" id="contactThanks">
                <div class="inner">
                    <h2 class="section__ttl"><span class="font-en">CONTACT</span>お問い合わせ</h2>
                    <?php if ($mail_sent): ?>
                    <p class="form__txt ps-r">お問い合わせをいただき誠にありがとうございます。<br><br>
                        後日、担当者よりご連絡をさせていただきます。<br>
                        万が一ご連絡がない場合は、メールアドレスが間違っていないか、<br>
                        受信の設定は正しくされているかをご確認の上、再度お問い合わせください。</p>
                    <?php else: ?>
                    <p class="form__txt ps-r">お問い合わせを受け付けました。<br>
                        担当者より後日ご連絡いたします。<br>
                        お急ぎの場合は、お電話（<?php echo $company_tel; ?>）にてお問い合わせください。</p>
                    <?php endif; ?>
                    <a class="input-button" href="<?php echo $top_page_url; ?>">ホームへ戻る</a>
                </div>
            </section>
        </main>

        <footer>
            <p class="footer_link">
                <a href="<?php echo htmlspecialchars($meta['footer_company_link'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank">会社概要</a>
                <a href="<?php echo htmlspecialchars($meta['footer_privacy_link'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank">プライバシーポリシー</a>
            </p>
            <p class="copy">
                <small>Copyright © <?php echo htmlspecialchars($company_name, ENT_QUOTES, 'UTF-8'); ?> All rights reserved.</small>
            </p>
        </footer>
        <script src="../../js/jquery-3.3.1.min.js"></script>
        <script src="../../js/myscript.js"></script>
    </article>
</body>

</html>
