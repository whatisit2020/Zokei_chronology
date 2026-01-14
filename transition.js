//デバッグ情報を表示
function updateDebugInfo(message) {
    const debugElement = document.getElementById('debugInfo');
    if (debugElement) {
        debugElement.textContent = `Status: ${message}`;
    }
}


/**
 * logo-part__imgを中央に移動・拡大するアニメーション
 */
function animateLogoToCenter(logoImg, callback) {
    // 元の位置とサイズを取得
    const rect = logoImg.getBoundingClientRect();
    const originalLeft = rect.left;
    const originalTop = rect.top;
    const originalWidth = rect.width;
    const originalHeight = rect.height;

    // 元の要素のスタイルを取得
    const computedStyle = window.getComputedStyle(logoImg);
    const backgroundImage = computedStyle.backgroundImage;
    const backgroundRepeat = computedStyle.backgroundRepeat;
    const backgroundPosition = computedStyle.backgroundPosition;
    const backgroundSize = computedStyle.backgroundSize;

    // 目標位置を計算（画面中央、上から50svh）
    const targetX = document.documentElement.clientWidth / 2;

    const aspectRatio = window.innerWidth / window.innerHeight;
    // targetYをif文の外側で宣言
    let targetY;

    if (aspectRatio <= 9 / 16) {
        targetY = window.innerHeight * 0.5; // 50svh
    } else if (window.innerWidth < 1280) {
        targetY = window.innerHeight * 0.5; // 50svh
    } else {
        // それ以外の場合
        targetY = window.innerHeight * 0.7; // 80svh
    }

    // 移動距離を計算
    const deltaX = targetX - (originalLeft + originalWidth / 2);
    const deltaY = targetY - (originalTop + originalHeight / 2);

    // アニメーション用のクローンを作成
    const clone = document.createElement('div');
    clone.style.position = 'fixed';
    clone.style.left = originalLeft + 'px';
    clone.style.top = originalTop + 'px';
    clone.style.width = originalWidth + 'px';
    clone.style.height = originalHeight + 'px';
    clone.style.zIndex = '9999';
    clone.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    clone.style.pointerEvents = 'none';

    // 背景画像の情報を複製
    clone.style.backgroundImage = backgroundImage;
    clone.style.backgroundRepeat = backgroundRepeat;
    clone.style.backgroundPosition = backgroundPosition;
    clone.style.backgroundSize = backgroundSize;

    // 押されたaタグの親を取得
    const clickedLink = logoImg.closest('.link');

    // 他のaタグを徐々に透明化
    document.querySelectorAll('.link').forEach(link => {
        if (link !== clickedLink) {
            link.style.transition = 'opacity 0.6s ease';
            link.style.opacity = '0';
        }
    });

    // 押されたaタグのspanを徐々に透明化
    if (clickedLink) {
        const spans = clickedLink.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transition = 'opacity 0.6s ease';
            span.style.opacity = '0';
        });

        // logo-part__imgだけを隠す（spanは既に透明化処理済み）
        logoImg.style.opacity = '0';
    }

    // クローンを追加
    document.body.appendChild(clone);

    // アニメーション開始
    setTimeout(() => {
        clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(3)`;
        clone.style.opacity = '0.9';
    }, 50);

    // アニメーション完了後にコールバック実行
    setTimeout(() => {
        if (callback) callback();
    }, 800);
}

/**
 * ナビゲーションリンクのクリックイベントを初期化
 */
function initializeNavigation() {
    updateDebugInfo('Navigation initialized');

    document.querySelectorAll('.link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // hrefを正しく取得
            const href = link.getAttribute('href') || link.dataset.href;
            if (!href) {
                console.error('Link href not found');
                return;
            }

            // logo-part__imgを取得
            const logoImg = link.querySelector('.logo-part__img');
            if (!logoImg) {
                console.error('logo-part__img not found in clicked link');
                return;
            }

            updateDebugInfo('Starting logo animation');

            // ページ遷移のコールバック
            const navigateToPage = () => {
                setTimeout(() => {
                    updateDebugInfo('Navigating to new page');
                    window.location.href = href;
                }, 100);
            };

            // ロゴアニメーション開始
            animateLogoToCenter(logoImg, navigateToPage);
        });
    });
}

// ページ読み込み完了後の処理
window.addEventListener('load', function () {
    updateDebugInfo('Page loaded');
    initializeNavigation();
});