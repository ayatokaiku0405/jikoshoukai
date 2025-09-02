// ローディング画面の制御
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const progressBar = document.querySelector('.progress-bar');
    
    // プログレスバーのアニメーション
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);
    
    // 3秒後にローディング画面を非表示
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        mainContent.style.opacity = '1';
        
        // BGMを自動再生開始（ユーザーの操作後に再生されるよう設定）
        initializeBGM();
        
        // パーティクル開始
        startParticles();
        
        // スクロールアニメーションの初期化
        initScrollAnimations();
    }, 3000);
});

// BGM制御
let bgmPlaying = false;
const bgm = document.getElementById('bgm');
const bgmToggle = document.getElementById('bgm-toggle');

function initializeBGM() {
    // ユーザーの最初のクリックでBGMを開始
    document.addEventListener('click', function startBGMOnFirstClick() {
        if (!bgmPlaying) {
            playBGM();
            document.removeEventListener('click', startBGMOnFirstClick);
        }
    }, { once: true });
}

function toggleBGM() {
    if (bgmPlaying) {
        pauseBGM();
    } else {
        playBGM();
    }
}

function playBGM() {
    bgm.play().then(() => {
        bgmPlaying = true;
        bgmToggle.classList.add('playing');
        bgmToggle.classList.remove('paused');
        bgmToggle.innerHTML = '<i class="fas fa-music"></i>';
    }).catch(err => {
        console.log('BGM再生エラー:', err);
    });
}

function pauseBGM() {
    bgm.pause();
    bgmPlaying = false;
    bgmToggle.classList.remove('playing');
    bgmToggle.classList.add('paused');
    bgmToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
}

// スクロールアニメーション
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // アニメーション対象要素を監視
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// パーティクルシステム
function startParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleEmojis = ['✨', '💫', '⭐', '🌟', '💖', '💕', '🌸', '🌺', '🎮', '🎀', '☁️', '🌙'];
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
        
        // ランダムな開始位置
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200; // 左右にランダムに移動
        
        particle.style.left = startX + 'px';
        particle.style.setProperty('--random-x', (endX - startX) + 'px');
        
        // ランダムなサイズ
        const size = 12 + Math.random() * 8;
        particle.style.fontSize = size + 'px';
        
        // ランダムなアニメーション時間
        const duration = 6 + Math.random() * 4;
        particle.style.animationDuration = duration + 's';
        
        particlesContainer.appendChild(particle);
        
        // アニメーション完了後に要素を削除
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000);
    }
    
    // 定期的にパーティクルを生成
    setInterval(createParticle, 800);
}

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 動的な背景エフェクト
function addDynamicEffects() {
    // マウス追従エフェクト
    document.addEventListener('mousemove', function(e) {
        const hearts = document.querySelectorAll('.floating-heart');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        hearts.forEach((heart, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - window.innerWidth / 2) * speed / 100;
            const y = (mouseY - window.innerHeight / 2) * speed / 100;
            
            heart.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // クリック時のハートエフェクト
    document.addEventListener('click', function(e) {
        createClickHeart(e.clientX, e.clientY);
    });
}

function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '💕';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = 'clickHeartFloat 2s ease-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// CSSアニメーションを動的に追加
const style = document.createElement('style');
style.textContent = `
    @keyframes clickHeartFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 3D効果を追加するためのマウス追従
function add3DEffect() {
    const cards = document.querySelectorAll('.about-card, .streaming-card, .social-button');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);
            
            const rotateX = deltaY * -10;
            const rotateY = deltaX * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// 初期化
window.addEventListener('load', function() {
    addDynamicEffects();
    add3DEffect();
});

// スクロール時のパララックス効果
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const clouds = document.querySelectorAll('.floating-heart');
    
    clouds.forEach((cloud, index) => {
        const speed = 0.5 + (index * 0.1);
        cloud.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// レスポンシブ対応
function handleResize() {
    // ウィンドウサイズが変わった時の処理
    if (window.innerWidth < 768) {
        // モバイル用の調整
        document.querySelectorAll('.floating-heart').forEach(heart => {
            heart.style.fontSize = '18px';
        });
    } else {
        // デスクトップ用の調整
        document.querySelectorAll('.floating-heart').forEach(heart => {
            heart.style.fontSize = '24px';
        });
    }
}

window.addEventListener('resize', handleResize);
handleResize(); // 初期実行

// 天国っぽい追加エフェクト
function addHeavenlyEffects() {
    // 定期的に光る効果
    setInterval(() => {
        const randomElements = document.querySelectorAll('.about-card, .streaming-card');
        const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
        
        if (randomElement) {
            randomElement.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
            setTimeout(() => {
                randomElement.style.boxShadow = '';
            }, 1000);
        }
    }, 5000);
    
    // ランダムに天使の羽根エフェクト
    setInterval(() => {
        createFeather();
    }, 3000);
}

function createFeather() {
    const feather = document.createElement('div');
    feather.innerHTML = '🪶';
    feather.style.position = 'fixed';
    feather.style.top = '-50px';
    feather.style.left = Math.random() * window.innerWidth + 'px';
    feather.style.fontSize = '20px';
    feather.style.pointerEvents = 'none';
    feather.style.zIndex = '1';
    feather.style.animation = 'featherFall 8s linear forwards';
    
    document.body.appendChild(feather);
    
    setTimeout(() => {
        feather.remove();
    }, 8000);
}

// CSSアニメーションを追加
const featherStyle = document.createElement('style');
featherStyle.textContent = `
    @keyframes featherFall {
        0% {
            transform: translateY(-50px) translateX(0) rotate(0deg);
            opacity: 0.8;
        }
        100% {
            transform: translateY(${window.innerHeight + 50}px) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(featherStyle);

// 天国エフェクトを開始
setTimeout(addHeavenlyEffects, 5000);
