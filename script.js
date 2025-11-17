// Game State
let round1Score = 0;
let round1Timer = 12;
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
    round1Timer = 12;
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
    const maxParents = 15;
    
    spawnInterval = setInterval(() => {
        if (spawnCount < maxParents && round1Timer > 0) {
            spawnParent();
            spawnCount++;
        }
        
        if (spawnCount >= maxParents) {
            clearInterval(spawnInterval);
        }
    }, 800); // Spawn every 0.8 seconds
}

function spawnParent() {
    const gameArea = document.getElementById('game-area-1');
    const parent = document.createElement('div');
    parent.className = 'parent-avatar';
    parent.textContent = parentEmojis[Math.floor(Math.random() * parentEmojis.length)];
    
    // Random vertical position
    const topPosition = Math.random() * (gameArea.clientHeight - 60);
    parent.style.top = topPosition + 'px';
    
    // Random speed (3-5 seconds to cross)
    const duration = 3 + Math.random() * 2;
    parent.style.animationDuration = duration + 's';
    
    gameArea.appendChild(parent);
    
    // Click handler
    parent.addEventListener('click', () => {
        if (!parent.classList.contains('clicked')) {
            parent.classList.add('clicked');
            round1Score++;
            document.getElementById('round1-score').textContent = round1Score;
            
            setTimeout(() => {
                parent.remove();
            }, 400);
        }
    });
    
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
            if (collectedCount < 15) {
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
        }, 400); // Collect every 0.4 seconds
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
