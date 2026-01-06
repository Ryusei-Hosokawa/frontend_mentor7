/**
 * メールモジュール自動初期化スクリプト
 *
 * このファイルを読み込むだけで、メールモジュールに必要な
 * 全てのCSS/JSファイルを自動的に読み込みます。
 *
 * 使用方法：
 * <script src="mail-system/js/init.js"></script>
 * をHTMLに追加するだけ
 */

(function() {
    'use strict';

    // 現在のスクリプトのパスを取得（mail-system/js/までのパス）
    const currentScript = document.currentScript;
    if (!currentScript) {
        return;
    }

    const scriptPath = currentScript.src;
    const baseUrl = scriptPath.substring(0, scriptPath.lastIndexOf('/js/'));

    /**
     * CSSファイルを動的に読み込む
     * @param {string} href - CSSファイルのパス
     */
    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.media = 'all';
        document.head.appendChild(link);
    }

    /**
     * JavaScriptファイルを動的に読み込む
     * @param {string} src - JSファイルのパス
     * @param {Function} callback - 読み込み完了時のコールバック
     */
    function loadJS(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // 順序を保証

        if (callback) {
            script.onload = callback;
        }

        document.body.appendChild(script);
    }

    /**
     * メールモジュールの初期化
     */
    function initMailModule() {
        // Step 1: CSSファイルを読み込む
        loadCSS(baseUrl + '/css/form-validation.css');
        loadCSS(baseUrl + '/css/form.css');

        // Step 2: DOMContentLoadedを待ってからJSファイルを読み込む
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                loadValidationJS();
            });
        } else {
            loadValidationJS();
        }
    }

    /**
     * フォームのaction属性を自動的に書き換える
     */
    function updateFormActions() {
        // すべてのフォーム要素を取得
        const forms = document.querySelectorAll('form');

        forms.forEach(function(form) {
            const action = form.getAttribute('action');
            if (!action) return;

            let updated = false;
            let newAction = action;

            // confirm.phpへのパスを書き換え
            if (action.match(/^\.?\/?(confirm\.php)$/)) {
                newAction = baseUrl + '/pages/confirm.php';
                updated = true;
            }
            // thanks.phpへのパスを書き換え
            else if (action.match(/^\.?\/?(thanks\.php)$/)) {
                newAction = baseUrl + '/pages/thanks.php';
                updated = true;
            }
            // 既にmail-system/pages/が含まれている場合はスキップ
            else if (action.includes('mail-system/pages/')) {
                return;
            }

            if (updated) {
                form.setAttribute('action', newAction);
            }
        });
    }

    /**
     * バリデーションJSファイルを読み込む
     */
    function loadValidationJS() {
        // フォームのaction属性を自動更新
        updateFormActions();

        // form-validation.jsを読み込む
        loadJS(baseUrl + '/js/form-validation.js');
    }

    // 初期化を実行
    initMailModule();

    // グローバルにアクセス可能な設定オブジェクトを作成（オプション）
    window.MailModule = window.MailModule || {
        version: '1.0.0',
        baseUrl: baseUrl,
        initialized: true
    };
})();
