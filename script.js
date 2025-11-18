// Game State
let round1Score = 0;
let round1Timer = 8;
let round2Score = 0;
let timerInterval;
let spawnInterval;

// Parent names and emojis
const parentEmojis = ['👨', '👩', '👴', '👵', '🧑', '👨‍🦱', '👩‍🦰', '👨‍🦳', '👩‍🦳'];
const parentNames = [
    'Mr. Khumalo', 'Ms. Setalala', 'Mr. Chueu', 'Ms. Motaung', 'Mr. Kondile',
    'Ms. Mokhomo', 'Mr. Metsing', 'Ms. Vumani', 'Mr. Jafta', 'Ms. Ngwenya',
    'Mr. Ibu', 'Ms. Khotso', 'Mr. Disema', 'Ms. Rao', 'Mr. Desai'
];

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Start Game
document.getElementById('start-btn').addEventListener('click', () => {
    showScreen('round1-screen');
    startRound1();
});

// Round 1: Manual Collection
function startRound1() {
    round1Score = 0;
    round1Timer = 8;
    document.getElementById('round1-score').textContent = round1Score;
    document.getElementById('round1-timer').textContent = round1Timer;
    
    const gameArea = document.getElementById('game-area-1');
    gameArea.innerHTML = '';
    
    // Start timer
    timerInterval = setInterval(() => {
        round1Timer--;
        document.getElementById('round1-timer').textContent = round1Timer;
        
        if (round1Timer <= 0) {
            endRound1();
        }
    }, 1000);
    
    // Spawn parents
    let spawnCount = 0;
    const maxParents = 20;
    
    spawnInterval = setInterval(() => {
        if (spawnCount < maxParents && round1Timer > 0) {
            spawnParent();
            spawnCount++;
        }
        
        if (spawnCount >= maxParents) {
            clearInterval(spawnInterval);
        }
    }, 300); // Spawn every 0.3 seconds (even faster!)
}

function spawnParent() {
    const gameArea = document.getElementById('game-area-1');
    const parent = document.createElement('div');
    parent.className = 'parent-avatar';
    parent.textContent = parentEmojis[Math.floor(Math.random() * parentEmojis.length)];
    
    // Random size - more parents are smaller and harder to click
    const isSmall = Math.random() < 0.6; // 60% chance of small parent
    const isTiny = Math.random() < 0.2; // 20% chance of tiny parent
    if (isTiny) {
        parent.classList.add('tiny-parent');
    } else if (isSmall) {
        parent.classList.add('small-parent');
    }
    
    // Random vertical position
    const topPosition = Math.random() * (gameArea.clientHeight - 60);
    parent.style.top = topPosition + 'px';
    parent.style.left = '-80px'; // Start off-screen
    
    // Super fast speed (0.8-2 seconds to cross) - much more challenging
    const isMobile = window.innerWidth <= 768;
    const baseDuration = isMobile ? 1.2 : 0.8;
    const duration = baseDuration + Math.random() * 1.2;
    
    // Random movement pattern - more erratic options
    const patterns = ['slide-across', 'zigzag', 'parentBounce', 'fastZigzag', 'erraticBounce'];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Some parents are extra speedy
    const isSpeedDemon = Math.random() < 0.3; // 30% chance
    if (isSpeedDemon) {
        parent.classList.add('speed-demon');
    }
    
    gameArea.appendChild(parent);
    
    // Force a reflow to ensure initial transform is applied
    parent.offsetHeight;
    
    // Set animation immediately
    parent.style.animation = `${pattern} ${duration}s linear, walk 1s ease-in-out infinite`;
    
    // Force hardware acceleration on mobile
    if (isMobile) {
        parent.style.willChange = 'transform';
    }
    
    // Ensure animation starts properly
    setTimeout(() => {
        if (parent.parentNode) {
            // Verify animation is applied
            const computedStyle = window.getComputedStyle(parent);
            if (computedStyle.animationName === 'none') {
                parent.style.animation = `${pattern} ${duration}s linear, walk 1s ease-in-out infinite`;
            }
        }
    }, 50);
    
    // Touch and click handlers for better mobile experience
    const handleCollect = (e) => {
        e.preventDefault(); // Prevent any default behavior
        if (!parent.classList.contains('clicked')) {
            parent.classList.add('clicked');
            round1Score++;
            document.getElementById('round1-score').textContent = round1Score;
            
            // Add haptic feedback for mobile devices
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            setTimeout(() => {
                parent.remove();
            }, 400);
        }
    };
    
    // Add both touch and click events for better mobile support
    parent.addEventListener('click', handleCollect);
    parent.addEventListener('touchstart', handleCollect, { passive: false });
    
    // Auto remove when animation ends
    setTimeout(() => {
        if (!parent.classList.contains('clicked')) {
            parent.remove();
        }
    }, duration * 1000);
}

function endRound1() {
    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    
    // Remove remaining parents
    document.getElementById('game-area-1').innerHTML = '';
    
    // Show result
    document.getElementById('result1-score').textContent = round1Score;
    showScreen('result1-screen');
}

// Continue to Round 2
document.getElementById('continue-btn').addEventListener('click', () => {
    showScreen('round2-screen');
    startRound2();
});

// Round 2: With knit (Automated)
function startRound2() {
    round2Score = 0;
    document.getElementById('round2-score').textContent = round2Score;
    
    const paymentList = document.getElementById('payment-list');
    paymentList.innerHTML = '';
    
    // Show logo animation first
    setTimeout(() => {
        // Start collecting fees automatically
        let collectedCount = 0;
        const collectInterval = setInterval(() => {
            if (collectedCount < 20) {
                addPaymentItem(collectedCount);
                collectedCount++;
                round2Score++;
                document.getElementById('round2-score').textContent = round2Score;
            } else {
                clearInterval(collectInterval);
                // Show end screen after a brief pause
                setTimeout(() => {
                    showEndScreen();
                }, 1000);
            }
        }, 300); // Collect every 0.3 seconds (faster to match difficulty)
    }, 1500); // Wait for logo animation
}

function addPaymentItem(index) {
    const paymentList = document.getElementById('payment-list');
    const item = document.createElement('div');
    item.className = 'payment-item';
    
    const emoji = parentEmojis[index % parentEmojis.length];
    const name = parentNames[index];
    const amount = (5000 + Math.floor(Math.random() * 5000)).toLocaleString('en-ZA');
    
    item.innerHTML = `
        <div class="payment-info">
            <div class="parent-icon">${emoji}</div>
            <div class="payment-details">
                <div class="parent-name">${name}</div>
                <div class="fee-amount">R${amount}</div>
            </div>
        </div>
        <div class="status-icon">✅</div>
    `;
    
    paymentList.appendChild(item);
    
    // Trigger animation
    setTimeout(() => {
        item.classList.add('collected');
    }, 50);
}

// End Screen
function showEndScreen() {
    document.getElementById('final-manual').textContent = round1Score;
    showScreen('end-screen');
}

// Replay
document.getElementById('replay-btn').addEventListener('click', () => {
    showScreen('start-screen');
});

// Handle page visibility to pause game if user switches tabs
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause timers if needed
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        if (spawnInterval) {
            clearInterval(spawnInterval);
        }
    }
});

// Mobile-specific optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Optimize for mobile performance
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile
        document.body.classList.add('mobile-optimized');
        
        // Adjust game difficulty slightly for mobile
        const originalSpawnParent = window.spawnParent;
        if (originalSpawnParent) {
            // Slightly larger touch targets on mobile
            const gameArea = document.getElementById('game-area-1');
            if (gameArea) {
                gameArea.style.padding = '10px';
            }
        }
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Force a repaint to handle orientation change properly
            const gameArea = document.getElementById('game-area-1');
            if (gameArea && gameArea.innerHTML) {
                // Recalculate positions if game is active
                const parents = gameArea.querySelectorAll('.parent-avatar');
                parents.forEach(parent => {
                    const currentTop = parseFloat(parent.style.top);
                    const maxTop = gameArea.clientHeight - 80;
                    if (currentTop > maxTop) {
                        parent.style.top = maxTop + 'px';
                    }
                });
            }
        }, 100);
    });
});

// Add mobile-specific CSS class for conditional styling
if (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.documentElement.classList.add('is-mobile');
}
