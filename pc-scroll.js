/**
 * PC横スクロール機能
 * 横向きのPCでのみ動作し、縦向きPCやスマホでは無効
 * スクロール位置に応じて要素のtransformを制御する方式
 */

let horizontalScrollEnabled = false;
let scrollInitialized = false;

/**
 * デバイスが横向きPCかどうかを判定
 */
function isHorizontalPC() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // PC判定: 幅1280px以上（CSSの条件に合わせる）
    // 横向き判定: 幅 > 高さ
    const isPC = width >= 1280 && width > height;
    console.log(`[PC-SCROLL] Device check: width=${width}, height=${height}, isHorizontalPC=${isPC}`);
    return isPC;
}

/**
 * activeクラスがあるかチェック
 */
function hasActiveClass() {
    const zokeiLogo = document.querySelector('.zokei-logo');
    const hasActive = zokeiLogo ? zokeiLogo.classList.contains('active') : false;
    console.log(`[PC-SCROLL] hasActiveClass: ${hasActive}`);
    return hasActive;
}

/**
 * body要素の高さを十分に確保してスクロール可能にする
 */
function ensureScrollableHeight() {
    const windowHeight = window.innerHeight;
    // 横スクロール用に十分な高さを設定（画面の5倍程度）
    document.body.style.minHeight = `${windowHeight * 5}px`;
    console.log(`[PC-SCROLL] スクロール可能な高さを設定: ${windowHeight * 5}px`);
}

/**
 * スクロール位置に基づいて要素を移動
 */
function updateElementPositions() {
    console.log('[PC-SCROLL] updateElementPositions 実行');

    const isPC = isHorizontalPC();
    const hasActive = hasActiveClass();

    // 条件チェック：横向きPCかつactiveクラスがあり、横スクロールが有効な場合のみ実行
    if (!isPC || !hasActive || !horizontalScrollEnabled) {
        console.log('[PC-SCROLL] 条件未満足 - アニメーション停止', { isPC, hasActive, horizontalScrollEnabled });
        return;
    }

    console.log('[PC-SCROLL] 条件満足 - スクロールアニメーション実行');

    // 要素を取得
    const linkElements = document.querySelectorAll('.zokei-logo a');
    if (linkElements.length === 0) {
        console.log('[PC-SCROLL] リンク要素が見つかりません');
        return;
    }

    // スクロール位置を取得（0-1の範囲に正規化）
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollTop / Math.max(documentHeight, 1), 1);

    console.log('[PC-SCROLL] スクロール情報:', {
        scrollTop,
        documentHeight,
        windowHeight: window.innerHeight,
        scrollProgress
    });

    // CSSのactive状態の初期位置を基準にスクロール連動で移動
    const baseTranslateValues = [10, 30, 54, 80, 104, 134, 160]; // svw単位

    // 各要素に移動を適用
    linkElements.forEach((link, index) => {
        const baseTranslate = baseTranslateValues[index] || 0;

        // スクロール進行度に応じて右から左へ移動
        // スクロール0%: CSSのactive位置(右端)
        // スクロール100%: 画面左端を超えて消える
        const maxScroll = 140; // 最大移動量（svw）
        const scrollOffset = scrollProgress * maxScroll;
        const finalTranslate = baseTranslate - scrollOffset;

        link.style.transform = `translateX(${finalTranslate}svw)`;
        link.style.transition = 'none'; // スクロール中はtransitionを無効化

        console.log(`[PC-SCROLL] 要素 ${index}: translateX(${finalTranslate}svw) (base: ${baseTranslate}, offset: ${scrollOffset})`);
    });
}

/**
 * 横スクロールの初期化
 */
function initHorizontalScroll() {
    console.log(`[PC-SCROLL] initHorizontalScroll called: isHorizontalPC=${isHorizontalPC()}, scrollInitialized=${scrollInitialized}`);

    if (!isHorizontalPC() || scrollInitialized) {
        console.log('[PC-SCROLL] Skipping scroll initialization');
        return;
    }

    console.log('[PC-SCROLL] Initializing horizontal scroll');

    // スクロール可能な高さを確保
    ensureScrollableHeight();

    // スクロールイベントリスナーを追加
    let ticking = false;
    function onScroll() {
        console.log('[PC-SCROLL] Scroll event fired', 'scrollY:', window.scrollY);
        if (!ticking) {
            requestAnimationFrame(() => {
                updateElementPositions();
                ticking = false;
            });
            ticking = true;
        }
    }

    // ホイールイベントで縦スクロールを制御（滑らかなスクロール）
    document.addEventListener('wheel', (e) => {
        if (!horizontalScrollEnabled || !isHorizontalPC()) {
            return;
        }

        e.preventDefault();

        // 縦スクロールの量を調整（滑らかにする）
        const scrollAmount = e.deltaY * 0.5; // スクロール速度を調整
        console.log(`[PC-SCROLL] Wheel scrolling by ${scrollAmount}`);

        window.scrollBy({
            top: scrollAmount,
            behavior: 'auto' // smoothだと重いのでautoに
        });
    }, { passive: false });

    // キーボードでのスクロール対応
    document.addEventListener('keydown', (e) => {
        if (!horizontalScrollEnabled || !isHorizontalPC()) {
            return;
        }

        console.log(`[PC-SCROLL] Key pressed: ${e.key}`);

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                console.log('[PC-SCROLL] Scrolling up (left)');
                window.scrollBy({ top: -100, behavior: 'smooth' });
                break;
            case 'ArrowRight':
                e.preventDefault();
                console.log('[PC-SCROLL] Scrolling down (right)');
                window.scrollBy({ top: 100, behavior: 'smooth' });
                break;
            case 'Home':
                e.preventDefault();
                console.log('[PC-SCROLL] Scrolling to start');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'End':
                e.preventDefault();
                console.log('[PC-SCROLL] Scrolling to end');
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                break;
        }
    });

    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', onScroll, { passive: true });

    // リサイズイベントリスナーを追加
    window.addEventListener('resize', () => {
        console.log('[PC-SCROLL] Window resized');
        if (isHorizontalPC()) {
            ensureScrollableHeight();
            updateElementPositions();
        }
    });

    scrollInitialized = true;
    console.log('[PC-SCROLL] Horizontal scroll initialization complete');

    // 初期位置を更新
    updateElementPositions();
}

/**
 * activeクラスが付与されたかを監視
 */
function watchForActiveClass() {
    console.log('[PC-SCROLL] Starting to watch for active class');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                console.log(`[PC-SCROLL] Class changed on ${target.tagName}.${target.classList[0]}`);

                if (target.classList.contains('active')) {
                    console.log('[PC-SCROLL] Active class detected! Starting 0.6s timer...');

                    // activeクラスが付与されてから0.6秒後に横スクロールを有効化
                    setTimeout(() => {
                        console.log('[PC-SCROLL] 0.6s timer complete - enabling horizontal scroll');
                        horizontalScrollEnabled = true;
                        initHorizontalScroll();
                    }, 1200);

                    // 一度activeを検出したら監視を停止
                    observer.disconnect();
                    console.log('[PC-SCROLL] Observer disconnected');
                }
            }
        });
    });

    // .zokei-logoと.tittle-containerの両方を監視
    const targets = document.querySelectorAll('.zokei-logo, .tittle-container');
    console.log(`[PC-SCROLL] Found ${targets.length} targets to observe`);

    targets.forEach((target, index) => {
        console.log(`[PC-SCROLL] Observing target ${index}: ${target.tagName}.${target.classList[0]}`);
        observer.observe(target, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

/**
 * 手動テスト用関数
 */
function testHorizontalScroll() {
    console.log('[PC-SCROLL] Manual test - enabling horizontal scroll');
    horizontalScrollEnabled = true;
    initHorizontalScroll();
}

// グローバルに公開してテスト可能にする
window.testHorizontalScroll = testHorizontalScroll;

/**
 * 初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[PC-SCROLL] DOM loaded - initializing');
    console.log(`[PC-SCROLL] Initial state: horizontalScrollEnabled=${horizontalScrollEnabled}, scrollInitialized=${scrollInitialized}`);

    // activeクラスの監視開始
    watchForActiveClass();

    console.log('[PC-SCROLL] Initialization complete');
});

console.log('[PC-SCROLL] Script loaded');