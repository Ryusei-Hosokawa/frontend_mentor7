<?php
session_start();

// モジュールのベースパスを設定（親ディレクトリ）
define('MAIL_SYSTEM_DIR', dirname(__DIR__));

// 設定ファイル読み込み
require_once MAIL_SYSTEM_DIR . '/CONFIG.php';
require_once MAIL_SYSTEM_DIR . '/lib/email_helper.php';

// デバッグ用：POSTデータの確認
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($debug_mode) {
        error_log("confirm.php: POSTリクエストを受信しました");
        error_log("confirm.php: POSTデータ=" . print_r($_POST, true));
    }
} else {
    if ($debug_mode) {
        error_log("confirm.php: POSTリクエストではありません。リクエストメソッド=" . $_SERVER['REQUEST_METHOD']);
    }
}

// レート制限のチェック
$current_time = time();
if (!isset($_SESSION['request_count'])) {
    $_SESSION['request_count'] = 0;
    $_SESSION['first_request_time'] = $current_time;
}

// 1時間経過したらカウントをリセット
if ($current_time - $_SESSION['first_request_time'] > 3600) {
    $_SESSION['request_count'] = 0;
    $_SESSION['first_request_time'] = $current_time;
}

// レート制限チェック
if ($_SESSION['request_count'] >= $rate_limit_max) {
    if ($debug_mode) {
        error_log("レート制限に引っかかりました: " . $_SESSION['request_count'] . "回");
    }
    exit("送信回数の制限を超えました。しばらく経ってから再度お試しください。");
}

// カウントを増やす
$_SESSION['request_count']++;

// スパムチェック（ハニーポット）
if (!empty($_POST['honeypot'])) {
    if ($debug_mode) {
        error_log("ハニーポットに引っかかりました: " . $_POST['honeypot']);
    }
    exit("スパムの可能性があります。");
}

// 送信された時間から最小時間以内は人間ではないと判断
if (isset($_POST['timestamp'])) {
    $timestamp = (int)$_POST['timestamp'];
    if (time() - $timestamp < $min_submit_time) {
        if ($debug_mode) {
            error_log("送信時間チェック失敗: " . (time() - $timestamp) . "秒");
        }
        exit("送信が早すぎます。もう少しゆっくり入力してください。");
    }
}

$flag = 0;
// 受け取り
$name = isset($_POST['name']) ? htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8') : '';
$tel = isset($_POST['tel']) ? htmlspecialchars($_POST['tel'], ENT_QUOTES, 'UTF-8') : '';
$comment = isset($_POST['comment']) ? htmlspecialchars($_POST['comment'], ENT_QUOTES, 'UTF-8') : '';
$privacy = isset($_POST['privacy']) ? htmlspecialchars($_POST['privacy'], ENT_QUOTES, 'UTF-8') : '';

// 入力データの追加バリデーション
if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    if ($debug_mode) {
        error_log("バリデーション失敗: name=" . $name . ", email=" . $email);
    }
    exit("必須項目が未入力か、メールアドレスの形式が正しくありません。");
}

if ($debug_mode) {
    error_log("confirm.php: バリデーション成功 - 確認画面を表示します");
}

// CSRFトークンを生成
$csrf_token = generateCsrfToken();

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

    <section class="contact" id="contactConfirm">
        <div class="inner">
            <h2 class="section__ttl"><span class="font-en">CONTACT</span>お問い合わせ</h2>
            <p class="form__txt ps-r">ご記入内容をご確認の上、<br class="spbr">送信ボタンを押してください。</p>
            <form method="post" action="thanks.php" name="form" id="contactForm">
                <table class="tbl-form tbl-r02">
                    <tr>
                        <th>お名前</th>
                        <td><?php echo $name; ?><input type="hidden" name="name" value="<?php echo $name; ?>"></td>
                    </tr>

                    <tr>
                        <th>メールアドレス</th>
                        <td>
                            <?php echo $email; ?><input type="hidden" name="email" value="<?php echo $email; ?>">
                        </td>
                    </tr>

                    <tr>
                        <th>電話番号</th>
                        <td>
                            <?php echo $tel; ?><input type="hidden" name="tel" value="<?php echo $tel; ?>">
                        </td>
                    </tr>
                    <tr>
                        <th class="any">備考</th>
                        <td class="any">
                            <?php echo nl2br($comment); ?><input type="hidden" name="comment" value="<?php echo $comment; ?>">
                        </td>
                    </tr>
                    <tr>
                        <th class="privacy">個人情報保護方針</th>
                        <td>
                            <?php echo $privacy; ?><input type="hidden" name="privacy" value="<?php echo $privacy; ?>">
                        </td>
                    </tr>
                </table>

                <div class="form_submit_btn flex jc-center">
                    <button class="input-button reset__btn" type="button" onclick="history.back()">戻る</button>
                    <input class="input-button submit__btn" type="submit" value="送信する">
                    <input type="hidden" name="action" value="confirm">
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token, ENT_QUOTES, 'UTF-8'); ?>">
                </div>
            </form>
        </div>
    </section>

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
</body>

</html>
