// --- Game State Constants and Variables ---
let xp = 0;
let autoClickers = 0;
const AUTOCLICKER_COST = 200;

// DOM Elements
const cookieArea = document.getElementById('cookie-area');
const mainCookie = document.getElementById('main-cookie');
const xpDisplay = document.getElementById('xp-display');
const cookieTypeDisplay = document.getElementById('cookie-type');
const buyAutoClickerBtn = document.getElementById('buy-autoclicker');
const autoClickerCountDisplay = document.getElementById('autoclicker-count');
const resetBtn = document.getElementById('reset-btn');

// --- Helper Functions ---

// 1. Update Cookie Type & Character based on Milestones
function updateCookieEvolution() {
    let currentType = "Plain Cookie";
    let cookieEmoji = "🍪";

    if (xp >= 1000) {
        currentType = "⭐⭐ Golden Rainbow Star Cookie ⭐⭐";
        cookieEmoji = "⭐";
    } else if (xp >= 500) {
        currentType = "🍵 Matcha Green Tea Cookie 🍵";
        cookieEmoji = "💚";
    } else if (xp >= 250) {
        currentType = "🍓 Strawberry Frosting Cookie 🍓";
        cookieEmoji = "🧁";
    } else if (xp >= 100) {
        currentType = "🍫 Chocolate Chip Cookie 🍫";
        cookieEmoji = "🍪";
    }

    cookieTypeDisplay.textContent = `Current: ${currentType}`;
    mainCookie.textContent = cookieEmoji;
}

// 2. Refresh the DOM interface elements and buy button status
function updateUI() {
    xpDisplay.textContent = `XP: ${xp}`;
    autoClickerCountDisplay.textContent = `Auto-Clickers Owned: ${autoClickers}`;
    
    // Enable or disable buy button depending on budget
    if (xp >= AUTOCLICKER_COST) {
        buyAutoClickerBtn.disabled = false;
    } else {
        buyAutoClickerBtn.disabled = true;
    }

    updateCookieEvolution();
}

// 3. Floating +1 Text FX Calculation
function spawnFloatingText(event) {
    const floatText = document.createElement('div');
    floatText.className = 'floating-plus';
    floatText.textContent = '+1';

    // Figure out local mouse coordinates within the bounding click element box
    const rect = cookieArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    floatText.style.left = `${x}px`;
    floatText.style.top = `${y}px`;

    cookieArea.appendChild(floatText);

    // Clean up DOM tree node after animation finishes tracking out
    setTimeout(() => {
        floatText.remove();
    }, 800);
}

// 4. Save and Load Systems via Storage API
function saveProgress() {
    const saveObj = {
        xp: xp,
        autoClickers: autoClickers
    };
    localStorage.setItem("cookieClickerSave", JSON.stringify(saveObj));
}

function loadProgress() {
    const savedData = localStorage.getItem("cookieClickerSave");
    if (savedData) {
        const parsed = JSON.parse(savedData);
        xp = parsed.xp || 0;
        autoClickers = parsed.autoClickers || 0;
    }
    updateUI();
}

// --- Interaction Event Listeners ---

// Core Click Handler
mainCookie.addEventListener('click', (event) => {
    xp += 1;
    spawnFloatingText(event);
    updateUI();
    saveProgress();
});

// Shop Button Handler
buyAutoClickerBtn.addEventListener('click', () => {
    if (xp >= AUTOCLICKER_COST) {
        xp -= AUTOCLICKER_COST;
        autoClickers += 1;
        updateUI();
        saveProgress();
    }
});

// Reset Handler
resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to completely clear your save?")) {
        localStorage.removeItem("cookieClickerSave");
        xp = 0;
        autoClickers = 0;
        updateUI();
    }
});

// --- Game Clock Loops (Auto-Click Engine Execution) ---
setInterval(() => {
    if (autoClickers > 0) {
        xp += autoClickers; // Adds 1 XP per second per device purchased
        updateUI();
        saveProgress();
    }
}, 1000);

// Initialize application state on window load
loadProgress();