// アニメーションさせたい要素をすべて取得
const targets = document.querySelectorAll('.trigger');

/**
 * コールバック関数：監視対象が条件を満たしたときに実行される
 * @param {IntersectionObserverEntry[]} entries - 監視対象の要素情報
 * @param {IntersectionObserver} observer - 監視者自身
 */
const callback = (entries, observer) => {
    // entriesは監視対象の配列
    entries.forEach(entry => {
        // isIntersectingプロパティで、画面内に入ったかどうかを判定
        if (entry.isIntersecting) {
            // 画面内に入ったら .active クラスを付与
            entry.target.classList.add('active');
        } else {
            // 画面外に出たら .active クラスを削除
            entry.target.classList.remove('active');
        }
    });
};

// オプション：どのくらい要素が見えたらコールバックを実行するか
const options = {
    root: null,
    // 'top right bottom left' の順で指定
    // 消失タイミング: 画面の上端から300px手前で反応
    // 出現タイミング: 画面の下端から100px手前で反応
    rootMargin: '-140px 0px -140px 0px',
    threshold: 0
};

// 監視者（Observer）を作成
const observer = new IntersectionObserver(callback, options);

// 各ターゲット要素の監視を開始
targets.forEach(target => {
    observer.observe(target);
});