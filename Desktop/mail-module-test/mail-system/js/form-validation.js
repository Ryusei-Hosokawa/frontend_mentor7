// DOMContentLoadedチェック付き即座実行
(function() {
    function initValidation() {
        // フォーム要素の取得
        const form = document.getElementById('contactForm');
        const submitBtn = document.querySelector('.form_submit_btn input[type="submit"]');

    if (!form || !submitBtn) {
        console.error('フォームまたは送信ボタンが見つかりません');
        return;
    }

    // 各フィールドの初回フォーカス状態を追跡
    const fieldTouchedState = {
        name: false,
        email: false,
        tel: false,
        comment: false,
        privacy: false
    };

    /**
     * フィールドが必須かどうかを判定（required属性の有無で判断）
     * @param {string} fieldId - フィールドID
     * @returns {boolean} - 必須ならtrue
     */
    function isFieldRequired(fieldId) {
        if (fieldId === 'privacy') {
            const privacyCheckbox = document.querySelector('input[name="privacy"]');
            return privacyCheckbox ? privacyCheckbox.hasAttribute('required') : false;
        }

        const field = document.getElementById(fieldId);
        return field ? field.hasAttribute('required') : false;
    }

    // エラーメッセージ表示用の要素を作成
    function createErrorElement(fieldId) {
        const errorId = fieldId + '_error';
        let errorElement = document.getElementById(errorId);
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'field-error';

            if (fieldId === 'privacy') {
                // 個人情報保護方針の場合は.check_box要素の後に配置
                const checkBox = document.querySelector('.check_box');
                if (checkBox && checkBox.parentNode) {
                    checkBox.parentNode.insertBefore(errorElement, checkBox.nextSibling);
                }
            } else {
                const field = document.getElementById(fieldId);
                if (field) {
                    // .flx_box03要素を探す
                    const flxBox = field.closest('.flx_box03');
                    if (flxBox && flxBox.parentNode) {
                        // .flx_box03の後に隣接して配置
                        flxBox.parentNode.insertBefore(errorElement, flxBox.nextSibling);
                    }
                }
            }
        }
        return errorElement;
    }

    // エラーメッセージを表示
    function showError(fieldId, message, isGuidance = false) {
        const errorElement = createErrorElement(fieldId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // ガイダンス表示の場合は色を変える
        if (isGuidance) {
            errorElement.style.color = '#6c757d'; // グレー色
        } else {
            errorElement.style.color = '#dc3545'; // 赤色
        }

        // フィールドにエラークラスを追加（ガイダンスの場合は追加しない）
        const field = document.getElementById(fieldId);
        if (field && !isGuidance) {
            field.classList.add('error');
        }
    }

    // エラーメッセージを非表示
    function hideError(fieldId) {
        const errorElement = document.getElementById(fieldId + '_error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        // フィールドからエラークラスを削除
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('error');
        }
    }

    // 名前のバリデーション
    function validateName(value, isRequired) {
        if (!value || value.trim() === '') {
            if (isRequired) {
                return { valid: false, message: '名前を入力してください' };
            } else {
                // 必須でない場合は空欄OK
                return { valid: true, message: '' };
            }
        }

        const trimmedValue = value.trim();

        // 最低二文字以上
        if (trimmedValue.length < 2) {
            return { valid: false, message: '2文字以上入力してください' };
        }

        // 許可文字の正規表現（漢字、ひらがな、カタカナ、アルファベット、スペースのみ）
        const allowedChars = /^[一-龯ひ-ゖヱヲ-ヺァ-ヴa-zA-Z\s]+$/;
        if (!allowedChars.test(trimmedValue)) {
            return { valid: false, message: '使用できない文字があります' };
        }

        // 漢字、ひらがな、カタカナの文字数をカウント
        const kanjiCount = (trimmedValue.match(/[一-龯]/g) || []).length;
        const hiraganaCount = (trimmedValue.match(/[ひ-ゖヱヲ-ヺ]/g) || []).length;
        const katakanaCount = (trimmedValue.match(/[ァ-ヴ]/g) || []).length;

        const japaneseTotal = kanjiCount + hiraganaCount + katakanaCount;

        // 漢字、ひらがな、カタカナが一文字も含まれていない場合は偽
        if (japaneseTotal === 0) {
            return { valid: false, message: '日本語を含めてください' };
        }

        return { valid: true, message: '' };
    }

    // メールアドレスのバリデーション
    function validateEmail(value, isRequired) {
        if (!value || value.trim() === '') {
            if (isRequired) {
                return { valid: false, message: 'メールアドレスを入力してください' };
            } else {
                // 必須でない場合は空欄OK
                return { valid: true, message: '' };
            }
        }

        const trimmedValue = value.trim();

        // 基本的なメール形式チェック
        const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!basicEmailRegex.test(trimmedValue)) {
            return { valid: false, message: 'メール形式が正しくありません' };
        }

        // ドメイン部分の検証
        const parts = trimmedValue.split('@');
        if (parts.length !== 2) {
            return { valid: false, message: 'メール形式が正しくありません' };
        }

        const domain = parts[1].toLowerCase();

        // 許可するドメインパターンのリスト
        const allowedDomainPatterns = [
            // 日本のドメイン
            /\.ne\.jp$/,
            /\.co\.jp$/,
            /\.or\.jp$/,
            /\.ac\.jp$/,
            /\.go\.jp$/,
            /\.jp$/,

            // 主要な無料メール
            /^gmail\.com$/,
            /^yahoo\.co\.jp$/,
            /^(hotmail|outlook|live)\.com$/,
            /^icloud\.com$/,

            // キャリアメール
            /^docomo\.ne\.jp$/,
            /^ezweb\.ne\.jp$/,
            /^softbank\.ne\.jp$/,

            // ビジネス系
            /\.com$/,
            /\.net$/,
            /\.org$/,
            /\.info$/
        ];

        // ドメインが許可パターンに一致するかチェック
        const isDomainValid = allowedDomainPatterns.some(pattern => pattern.test(domain));

        if (!isDomainValid) {
            return { valid: false, message: '形式が正しくありません' };
        }

        return { valid: true, message: '' };
    }

    // 電話番号のバリデーション
    function validatePhone(value, isRequired, showEmptyFieldGuidance = false) {
        if (!value || value.trim() === '') {
            if (isRequired) {
                if (showEmptyFieldGuidance) {
                    return { valid: false, message: '半角数字9-13桁で入力してください', isGuidance: false };
                }
                return { valid: false, message: '電話番号を入力してください' };
            } else {
                // 必須でない場合は空欄OK
                return { valid: true, message: '' };
            }
        }

        const trimmedValue = value.trim();

        // パターン1: 半角数字のみ（9-13文字）
        const numbersOnlyPattern = /^[0-9]{9,13}$/;

        // パターン2: 半角数字+ハイフン2つ以内（数字部分は9-13文字）
        const withHyphenPattern = /^[0-9]+-?[0-9]+-?[0-9]+$/;

        // パターン3: 半角数字+スペース2つ以内（数字部分は9-13文字）
        const withSpacePattern = /^[0-9]+\s?[0-9]+\s?[0-9]+$/;

        if (numbersOnlyPattern.test(trimmedValue)) {
            return { valid: true, message: '' };
        }

        if (withHyphenPattern.test(trimmedValue)) {
            const numbers = trimmedValue.replace(/-/g, '');
            const hyphenCount = (trimmedValue.match(/-/g) || []).length;
            if (numbers.length >= 9 && numbers.length <= 13 && hyphenCount <= 2) {
                return { valid: true, message: '' };
            }
        }

        if (withSpacePattern.test(trimmedValue)) {
            const numbers = trimmedValue.replace(/\s/g, '');
            const spaceCount = (trimmedValue.match(/\s/g) || []).length;
            if (numbers.length >= 9 && numbers.length <= 13 && spaceCount <= 2) {
                return { valid: true, message: '' };
            }
        }

        return { valid: false, message: '正しい電話番号を入力してください' };
    }

    // 備考欄のバリデーション（任意項目）
    function validateComment(value, showEmptyFieldGuidance = false) {
        if (!value || value.trim() === '') {
            // 任意項目なので空欄はOK
            return { valid: true, message: '' };
        }

        const trimmedValue = value.trim();

        // スペースを除去した文字列を作成
        const valueWithoutSpaces = trimmedValue.replace(/\s/g, '');

        // スペースを含まない状態で1000文字以下
        if (valueWithoutSpaces.length > 1000) {
            return { valid: false, message: '1000文字以内で入力してください' };
        }

        return { valid: true, message: '' };
    }

    // 個人情報保護方針のバリデーション
    function validatePrivacy() {
        const privacy = document.querySelector('input[name="privacy"]:checked');
        if (!privacy) {
            return { valid: false, message: '個人情報保護方針への同意が必要です' };
        }
        return { valid: true, message: '' };
    }

    // 個別フィールドのバリデーション実行
    function validateField(fieldId, showErrors = true) {
        const field = document.getElementById(fieldId);
        if (!field && fieldId !== 'privacy') return true;

        const value = field ? field.value : '';
        const isRequired = isFieldRequired(fieldId);
        let result = { valid: true, message: '' };

        switch (fieldId) {
            case 'name':
                result = validateName(value, isRequired);
                break;
            case 'email':
                result = validateEmail(value, isRequired);
                break;
            case 'tel':
                result = validatePhone(value, isRequired, showErrors && fieldTouchedState[fieldId]);
                break;
            case 'comment':
                result = validateComment(value, showErrors && fieldTouchedState[fieldId]);
                break;
            case 'privacy':
                result = validatePrivacy();
                break;
        }

        // エラー表示の制御
        if (showErrors && fieldTouchedState[fieldId]) {
            if (result.valid && !result.message) {
                hideError(fieldId);
            } else if (result.message) {
                showError(fieldId, result.message, result.isGuidance || false);
            }
        } else if (result.valid && !result.message) {
            hideError(fieldId);
        }

        return result.valid;
    }

    // 個別フィールドの詳細チェック（サブミット判定用）
    function isFieldValidForSubmission(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field && fieldId !== 'privacy') return true;

        const isRequired = isFieldRequired(fieldId);

        switch (fieldId) {
            case 'name':
                const nameResult = validateName(field.value, isRequired);
                return nameResult.valid;

            case 'email':
                const emailResult = validateEmail(field.value, isRequired);
                return emailResult.valid;

            case 'tel':
                const telResult = validatePhone(field.value, isRequired, false);
                return telResult.valid;

            case 'comment':
                const commentResult = validateComment(field.value, false);
                return commentResult.valid;

            case 'privacy':
                // 個人情報保護方針：required属性がある場合のみ必須
                if (isRequired) {
                    const privacyResult = validatePrivacy();
                    return privacyResult.valid;
                } else {
                    return true;
                }

            default:
                return true;
        }
    }

    // 全体のバリデーション関数
    function validateForm(showErrors = false) {
        let isValid = true;

        // 個別フィールドの検証
        const fieldsToValidate = ['name', 'email', 'tel', 'comment'];
        fieldsToValidate.forEach(fieldId => {
            if (!validateField(fieldId, showErrors)) {
                isValid = false;
            }
        });

        // 必須項目（名前、メール、電話）の状態を確認
        const nameValid = isFieldValidForSubmission('name');
        const emailValid = isFieldValidForSubmission('email');
        const telValid = isFieldValidForSubmission('tel');
        const privacyValid = isFieldValidForSubmission('privacy');

        // 任意項目の状態を確認（入力があれば条件を満たす必要がある）
        const commentValid = isFieldValidForSubmission('comment');

        // 個人情報保護方針のチェック（required属性がある場合のみ）
        const privacyRequired = isFieldRequired('privacy');
        if (privacyRequired) {
            if (!privacyValid) {
                isValid = false;
                // 他の全ての必須項目がtrueでチェックボックスのみfalseの場合、または送信時にはエラー表示
                const otherRequiredFieldsValid = nameValid && emailValid && telValid && commentValid;
                if (otherRequiredFieldsValid || showErrors) {
                    fieldTouchedState.privacy = true;
                    validateField('privacy', true);

                    // 他の必須項目が全てtrueでチェックボックスのみfalseの場合の特別処理
                    if (otherRequiredFieldsValid && !privacyValid) {
                        showError('privacy', '個人情報保護方針への同意が必要です', false);
                    }
                }
            } else {
                // チェックボックスが有効な場合はエラーを非表示
                hideError('privacy');
            }
        }

        // 送信ボタンの状態を更新（全フィールドが条件を満たす必要がある）
        const canSubmit = nameValid && emailValid && telValid && privacyValid && commentValid;

        if (canSubmit) {
            submitBtn.classList.add('active');
        } else {
            submitBtn.classList.remove('active');
        }

        return isValid;
    }

    // 各フィールドにイベントリスナーを設定
    const fieldsToWatch = ['name', 'email', 'tel', 'comment'];
    fieldsToWatch.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // 初回フォーカス時の処理
            field.addEventListener('focus', function() {
                fieldTouchedState[fieldId] = true;
            });

            // 入力中の処理（エラー表示はしない、サブミットボタンの状態は更新）
            field.addEventListener('input', function() {
                validateField(fieldId, false);
                validateForm(false);
            });

            // フォーカスを外した時の処理（エラー表示あり）
            field.addEventListener('blur', function() {
                if (fieldTouchedState[fieldId]) {
                    validateField(fieldId, true);
                    validateForm(false);
                }
            });
        }
    });

    // 個人情報保護方針のチェックボックス
    const privacyCheckbox = document.querySelector('input[name="privacy"]');
    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', function() {
            fieldTouchedState.privacy = true;

            // required属性がある場合のみエラーチェック
            const privacyRequired = isFieldRequired('privacy');
            if (privacyRequired) {
                // 他の必須項目の状態をチェック
                const nameValid = isFieldValidForSubmission('name');
                const emailValid = isFieldValidForSubmission('email');
                const telValid = isFieldValidForSubmission('tel');
                const commentValid = isFieldValidForSubmission('comment');
                const otherRequiredFieldsValid = nameValid && emailValid && telValid && commentValid;

                // チェックボックスの状態をチェック
                const privacyValid = validatePrivacy().valid;

                if (!privacyValid && otherRequiredFieldsValid) {
                    // 他の必須項目が全てtrueでチェックボックスのみfalseの場合
                    showError('privacy', '個人情報保護方針への同意が必要です', false);
                } else if (privacyValid) {
                    // チェックボックスが有効な場合はエラーを非表示
                    hideError('privacy');
                }

                validateField('privacy', true);
            }

            validateForm(false);
        });
    }

    // 初回ページ読み込み時のバリデーション（エラー表示なし）
    validateForm(false);

    // フォーム送信前の最終チェック
    form.addEventListener('submit', function(e) {
        // 送信時は全フィールドを触ったことにしてエラー表示を有効化
        Object.keys(fieldTouchedState).forEach(fieldId => {
            fieldTouchedState[fieldId] = true;
        });

        if (!validateForm(true)) {
            e.preventDefault();
            alert('入力内容に不備があります。エラーメッセージをご確認ください。');
            return false;
        }

        return true;
    });
    }

    // DOMの準備状態をチェックして初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initValidation);
    } else {
        // DOMが既に読み込まれている場合は即座に実行
        initValidation();
    }
})();
