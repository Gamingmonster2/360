/**
 * Universal Calculator Engine v3.0
 * Pure Vanilla JS - No External Dependencies
 * Supports 10 Languages & RTL natively
 */

// --- 1. Translation JSON Structure (Simulated external JSON file) ---
const translations = {
    en: { dir: "ltr", name: "English", clear: "AC", del: "DEL", title: "Welcome", desc: "Experience the Minimalist Universal Calculator." },
    ar: { dir: "rtl", name: "العربية", clear: "مسح", del: "حذف", title: "مرحباً بك", desc: "استمتع بتجربة الآلة الحاسبة العالمية." },
    zh: { dir: "ltr", name: "中文", clear: "清空", del: "删除", title: "欢迎", desc: "体验极简通用计算器。" },
    fr: { dir: "ltr", name: "Français", clear: "AC", del: "SUP", title: "Bienvenue", desc: "Découvrez la calculatrice universelle minimaliste." },
    es: { dir: "ltr", name: "Español", clear: "AC", del: "BOR", title: "Bienvenido", desc: "Experimenta la calculadora universal minimalista." },
    de: { dir: "ltr", name: "Deutsch", clear: "AC", del: "DEL", title: "Willkommen", desc: "Erleben Sie den minimalistischen Universalrechner." },
    ru: { dir: "ltr", name: "Русский", clear: "СБР", del: "УДЛ", title: "Добро пожаловать", desc: "Испытайте минималистичный универсальный калькулятор." },
    ja: { dir: "ltr", name: "日本語", clear: "AC", del: "削除", title: "ようこそ", desc: "ミニマルな汎用電卓をご体験ください。" },
    hi: { dir: "ltr", name: "हिन्दी", clear: "साफ", del: "हटा", title: "स्वागत है", desc: "मिनिमलिस्ट यूनिवर्सल कैलकुलेटर का अनुभव करें।" },
    ar_ly: { dir: "rtl", name: "العربية الليبية", clear: "صفر", del: "مسح", title: "أهلاً ومرحبا", desc: "جرب الآلة الحاسبة البسيطة والسريعة متعددة اللغات ياه." }
};

// --- 2. State Management ---
const state = {
    lang: 'en',
    isDegMode: true,
    expression: '',
    history: ''
};

// --- 3. DOM Elements ---
const appContainer = document.getElementById('appContainer');
const langSelect = document.getElementById('langSelect');
const degRadToggle = document.getElementById('degRadToggle');
const themeToggle = document.getElementById('themeToggle');
const keypadGrid = document.getElementById('keypadGrid');
const currentInput = document.getElementById('currentInput');
const historyDisplay = document.getElementById('historyDisplay');
const welcomeModal = document.getElementById('welcomeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// --- 4. Layout Definitions ---
// Keys structured logically for clean rendering
const keysLayout = [
    { val: 'sin', type: 'func' }, { val: 'cos', type: 'func' }, { val: 'tan', type: 'func' }, { val: '√', type: 'func' },
    { val: 'log', type: 'func' }, { val: 'ln', type: 'func' }, { val: 'π', type: 'const' }, { val: 'e', type: 'const' },
    { val: 'AC', type: 'action' }, { val: 'DEL', type: 'action' }, { val: '(', type: 'op' }, { val: ')', type: 'op' },
    { val: '7', type: 'num' }, { val: '8', type: 'num' }, { val: '9', type: 'num' }, { val: '÷', type: 'op' },
    { val: '4', type: 'num' }, { val: '5', type: 'num' }, { val: '6', type: 'num' }, { val: '×', type: 'op' },
    { val: '1', type: 'num' }, { val: '2', type: 'num' }, { val: '3', type: 'num' }, { val: '-', type: 'op' },
    { val: '0', type: 'num' }, { val: '.', type: 'num' }, { val: '=', type: 'op' }, { val: '+', type: 'op' }
];

// --- 5. Initialization ---
function init() {
    populateLanguages();
    renderKeypad();
    bindEvents();
    applyLanguage(state.lang);
    
    // Detect user language
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
        setTimeout(() => applyLanguage(browserLang), 500);
    }
}

function populateLanguages() {
    Object.keys(translations).forEach(code => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = translations[code].name;
        langSelect.appendChild(opt);
    });
}

function renderKeypad() {
    keypadGrid.innerHTML = '';
    const t = translations[state.lang];
    
    keysLayout.forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'key-btn';
        btn.dataset.val = key.val;
        btn.dataset.type = key.type;
        
        // Translate Action Keys
        if (key.val === 'AC') btn.textContent = t.clear;
        else if (key.val === 'DEL') btn.textContent = t.del;
        else btn.textContent = key.val;

        // Adjust layout for '0'
        if (key.val === '0') {
            btn.classList.add('span-2', 'text-left');
        }

        keypadGrid.appendChild(btn);
    });
}

// --- 6. Event Bindings ---
function bindEvents() {
    // Keypad clicks (Event Delegation for better performance)
    keypadGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        handleInput(btn.dataset.val, btn.dataset.type);
    });

    // Language Change
    langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        applyLanguage(newLang);
        showModal(newLang);
    });

    // Deg/Rad Toggle
    degRadToggle.addEventListener('click', () => {
        state.isDegMode = !state.isDegMode;
        degRadToggle.textContent = state.isDegMode ? 'DEG' : 'RAD';
    });

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    // Modal Close
    modalCloseBtn.addEventListener('click', () => welcomeModal.classList.remove('active'));

    // Keyboard Support (Pure JS Accessibility)
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        let type = null;
        let val = key;

        if (/[0-9]/.test(key)) type = 'num';
        else if (['+', '-', '*', '/', '(', ')', '.'].includes(key)) {
            type = 'op';
            if (key === '*') val = '×';
            if (key === '/') val = '÷';
        }
        else if (key === 'Enter') { val = '='; type = 'op'; }
        else if (key === 'Backspace') { val = 'DEL'; type = 'action'; }
        else if (key === 'Escape') { val = 'AC'; type = 'action'; }

        if (type) handleInput(val, type);
    });
}

// --- 7. Language & RTL Handler ---
function applyLanguage(code) {
    state.lang = code;
    const langData = translations[code];
    document.documentElement.lang = code;
    document.documentElement.dir = langData.dir;
    langSelect.value = code;
    renderKeypad(); // Re-render to update AC/DEL text
}

function showModal(code) {
    const langData = translations[code];
    modalTitle.textContent = langData.title;
    modalDesc.textContent = langData.desc;
    welcomeModal.classList.add('active');
}

// --- 8. Calculator Logic Engine ---
function handleInput(val, type) {
    if (val === 'AC') {
        state.expression = '';
        state.history = '';
    } else if (val === 'DEL') {
        state.expression = state.expression.slice(0, -1);
    } else if (val === '=') {
        calculateResult();
        return;
    } else {
        // Prevent multiple operators in a row
        const lastChar = state.expression.slice(-1);
        const operators = ['+', '-', '×', '÷'];
        if (operators.includes(val) && operators.includes(lastChar)) {
            state.expression = state.expression.slice(0, -1) + val;
        } else {
            state.expression += val;
        }
    }
    updateDisplay();
}

function calculateResult() {
    try {
        let expr = state.expression;
        if (!expr) return;

        // 1. Replace UI symbols with JS Math operators
        expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
        
        // 2. Handle Constants
        expr = expr.replace(/π/g, 'Math.PI');
        // Note: 'e' replacement needs to avoid conflicting with function names like 'sqrt' if we had them, but here we use Math.E
        expr = expr.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'Math.E'); 
        
        // 3. Handle Functions & Degrees/Radians
        const trigFuncs = ['sin', 'cos', 'tan'];
        trigFuncs.forEach(fn => {
            const regex = new RegExp(`${fn}\\(`, 'g');
            if (state.isDegMode) {
                // Convert degrees to radians for JS Math functions
                expr = expr.replace(regex, `Math.${fn}(Math.PI/180*`);
            } else {
                expr = expr.replace(regex, `Math.${fn}(`);
            }
        });

        expr = expr.replace(/√\(/g, 'Math.sqrt(');
        expr = expr.replace(/log\(/g, 'Math.log10(');
        expr = expr.replace(/ln\(/g, 'Math.log(');

        // 4. Securely Evaluate (Using Function constructor is safer and faster than eval)
        const result = Function('"use strict"; return (' + expr + ')')();
        
        // 5. Format Result
        const finalResult = parseFloat(result.toFixed(10)).toString();
        
        state.history = state.expression + ' =';
        state.expression = finalResult;

    } catch (error) {
        state.history = state.expression;
        state.expression = 'Error';
        setTimeout(() => { 
            if(state.expression === 'Error') state.expression = ''; 
            updateDisplay(); 
        }, 1500);
    }
    updateDisplay();
}

// --- 9. UI Updater ---
function updateDisplay() {
    currentInput.textContent = state.expression || '0';
    historyDisplay.textContent = state.history;
}

// Start the application
init();
