


// Theme Logic
const initTheme = () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}
initTheme();

window.toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

// Initialize Icons
lucide.createIcons();

// Auth Logic is handled by js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = loginForm.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : 'user@example.com';

            // Use centralized login
            if (window.auth) {
                window.auth.login(email, 'password');
            } else {
                // Fallback if auth.js failed to load
                localStorage.setItem('aura_auth_token', 'mock_token_' + Date.now());
                window.location.href = 'dashboard.html';
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Mock Signup -> Login
            if (window.auth) {
                window.auth.login('newuser@example.com', 'password');
            }
        });
    }
});

// Toast Notification System
const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = 'toast';

    // Icon based on type
    const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';

    toast.innerHTML = `
        <div class="${iconColor}"><i data-lucide="${iconName}" class="w-5 h-5"></i></div>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);
    lucide.createIcons(); // Re-init icons for the toast

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Trade Page Advanced Logic
const tradeChartCtx = document.getElementById('tradeChart');
if (tradeChartCtx) {
    // Simulated Live Data
    let tradeData = [];
    let labels = [];
    let currentPrice = 45230.50;

    // Init data
    for (let i = 0; i < 50; i++) {
        labels.push(i);
        tradeData.push(currentPrice + (Math.random() - 0.5) * 100);
    }

    const gradient = tradeChartCtx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(45, 212, 191, 0.2)');
    gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

    const chart = new Chart(tradeChartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: tradeData,
                borderColor: '#2dd4bf',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.1,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    position: 'right',
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { callback: (val) => '$' + val.toFixed(0), color: '#64748b' }
                },
                x: { display: false }
            },
            interaction: { mode: 'index', intersect: false }
        }
    });

    // Live update simulation
    setInterval(() => {
        const change = (Math.random() - 0.5) * 50;
        currentPrice += change;

        // Update Header Price
        const headerPrice = document.getElementById('headerPrice');
        if (headerPrice) {
            headerPrice.textContent = '$' + currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            headerPrice.className = change >= 0 ? 'font-mono font-medium text-green-500' : 'font-mono font-medium text-red-500';
        }

        // Update Chart
        tradeData.shift();
        tradeData.push(currentPrice);
        chart.update('none'); // efficient update
    }, 1000);

    // Order Logic
    const buyBtn = document.getElementById('tradeBuyBtn');
    const sellBtn = document.getElementById('tradeSellBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const priceInput = document.getElementById('tradeInputPrice');
    const amountInput = document.getElementById('tradeInputAmount');
    const totalDisplay = document.getElementById('tradeTotal');
    const feeDisplay = document.getElementById('tradeFee');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const priceGroup = document.getElementById('priceInputGroup');
    const limitBtn = document.getElementById('limitOrderBtn');
    const marketBtn = document.getElementById('marketOrderBtn');

    let isBuy = true;
    let isLimit = true;

    // Toggle Buy/Sell
    const updateMode = () => {
        if (isBuy) {
            buyBtn.className = 'flex-1 py-2 rounded-lg text-sm font-bold bg-green-500 text-white shadow-lg transition-all';
            sellBtn.className = 'flex-1 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
            placeOrderBtn.className = 'w-full mt-6 py-4 rounded-xl bg-green-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-95 transition-all';
            placeOrderBtn.textContent = 'Buy BTC';
        } else {
            sellBtn.className = 'flex-1 py-2 rounded-lg text-sm font-bold bg-red-500 text-white shadow-lg transition-all';
            buyBtn.className = 'flex-1 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
            placeOrderBtn.className = 'w-full mt-6 py-4 rounded-xl bg-red-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-[1.02] active:scale-95 transition-all';
            placeOrderBtn.textContent = 'Sell BTC';
        }
    };

    buyBtn.addEventListener('click', () => { isBuy = true; updateMode(); });
    sellBtn.addEventListener('click', () => { isBuy = false; updateMode(); });

    // Toggle Order Type
    limitBtn.addEventListener('click', () => {
        isLimit = true;
        priceGroup.classList.remove('opacity-50', 'pointer-events-none');
        priceInput.value = currentPrice.toFixed(2);
        limitBtn.className = 'text-primary font-medium';
        marketBtn.className = 'text-slate-500 hover:text-white transition-colors';
    });
    marketBtn.addEventListener('click', () => {
        isLimit = false;
        priceGroup.classList.add('opacity-50', 'pointer-events-none');
        priceInput.value = 'Market Price';
        marketBtn.className = 'text-primary font-medium';
        limitBtn.className = 'text-slate-500 hover:text-white transition-colors';
    });

    // Calculations
    const calculate = () => {
        const price = isLimit ? parseFloat(priceInput.value) || 0 : currentPrice;
        const amount = parseFloat(amountInput.value) || 0;
        const total = price * amount;
        const fee = total * 0.001; // 0.1%

        feeDisplay.textContent = '$' + fee.toFixed(2);
        totalDisplay.textContent = '$' + (total + fee).toFixed(2);
    };

    priceInput.addEventListener('input', calculate);
    amountInput.addEventListener('input', calculate);

    // Orders Management
    const loadOrders = () => {
        const orders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
        ordersTableBody.innerHTML = '';
        if (orders.length === 0) {
            document.getElementById('emptyOrdersState').classList.remove('hidden');
        } else {
            document.getElementById('emptyOrdersState').classList.add('hidden');
            orders.reverse().forEach((order, index) => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors';
                tr.innerHTML = `
                    <td class="py-3 pl-2 text-slate-500 font-mono text-xs">${new Date(order.time).toLocaleTimeString()}</td>
                    <td class="py-3 font-medium ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}">${order.side}</td>
                    <td class="py-3 font-mono text-slate-900 dark:text-white">$${order.price}</td>
                    <td class="py-3 font-mono text-slate-900 dark:text-white">${order.amount}</td>
                    <td class="py-3 text-right pr-2 text-slate-500">$${order.total}</td>
                    <td class="py-3 text-right pr-2"><span class="px-2 py-1 rounded text-[10px] font-medium ${order.status === 'Filled' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}">${order.status}</span></td>
                    <td class="py-3 text-right pr-2"><button onclick="cancelOrder(${index})" class="text-slate-400 hover:text-red-500 transition-colors"><i data-lucide="x" class="w-4 h-4"></i></button></td>
                `;
                ordersTableBody.appendChild(tr);
            });
            lucide.createIcons();
        }
    };

    // Global cancel function
    window.cancelOrder = (index) => {
        const orders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
        // In real app, we'd use ID, here index is fragile if list changes but sufficient for mock
        // Since we display reversed, real index is len - 1 - displayedIndex
        const realIndex = orders.length - 1 - index;
        orders.splice(realIndex, 1);
        localStorage.setItem('aura_orders', JSON.stringify(orders));
        loadOrders();
        showToast('Order cancelled');
    };

    placeOrderBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) {
            showToast('Invalid amount', 'error');
            return;
        }

        const price = isLimit ? (parseFloat(priceInput.value) || 0) : currentPrice;
        const total = (price * amount).toFixed(2);

        const newOrder = {
            id: Date.now(),
            time: Date.now(),
            side: isBuy ? 'Buy' : 'Sell',
            type: isLimit ? 'Limit' : 'Market',
            price: price.toFixed(2),
            amount: amount,
            total: total,
            status: isLimit ? 'Open' : 'Filled' // Market fills instantly
        };

        const orders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
        orders.push(newOrder);
        localStorage.setItem('aura_orders', JSON.stringify(orders));

        loadOrders();
        showToast(`${newOrder.side} order placed successfully`);
        amountInput.value = '';
        calculate();
    });

    loadOrders();
}


// Chart.js Configuration
const ctx = document.getElementById('marketChart');

if (ctx) {
    // Create gradient
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(45, 212, 191, 0.4)'); // Primary color with opacity
    gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
            datasets: [{
                label: 'Portfolio Value',
                data: [120000, 125000, 122000, 128000, 134000, 131000, 140000],
                borderColor: '#2dd4bf',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4, // Smooth curve
                fill: true,
                pointBackgroundColor: '#050505',
                pointBorderColor: '#2dd4bf',
                pointHoverBackgroundColor: '#2dd4bf',
                pointHoverBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 17, 21, 0.9)',
                    titleColor: '#e2e8f0',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return '$ ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: "'Space Mono', monospace",
                            size: 11
                        },
                        callback: function (value) {
                            return '$' + value / 1000 + 'k';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });
}

// Analytics Page Charts
const growthCtx = document.getElementById('growthChart');
if (growthCtx) {
    const gradient = growthCtx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(45, 212, 191, 0.4)');
    gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

    const chart = new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Growth',
                data: [100000, 115000, 108000, 125000, 132000, 128450],
                borderColor: '#2dd4bf',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });

    // Timeframe Logic
    const btnMonth = document.getElementById('btnMonth');
    const btnQuarter = document.getElementById('btnQuarter');
    const btnYear = document.getElementById('btnYear');
    const timeframes = [btnMonth, btnQuarter, btnYear];

    const dataMap = {
        'btnMonth': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [100000, 115000, 108000, 125000, 132000, 128450]
        },
        'btnQuarter': {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            data: [105000, 125000, 118000, 145000]
        },
        'btnYear': {
            labels: ['2023', '2024', '2025', '2026'],
            data: [50000, 85000, 110000, 128450]
        }
    };

    if (btnMonth && btnQuarter && btnYear) {
        timeframes.forEach(btn => {
            btn.addEventListener('click', () => {
                // Style update
                timeframes.forEach(b => b.className = 'timeframe-btn px-4 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors');
                btn.className = 'timeframe-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm transition-colors';

                // Data update
                const newData = dataMap[btn.id];
                chart.data.labels = newData.labels;
                chart.data.datasets[0].data = newData.data;
                chart.update();

                showToast(`Viewing ${btn.textContent} Growth`, 'info');
            });
        });
    }
}

const allocationCtx = document.getElementById('allocationChart');
if (allocationCtx) {
    new Chart(allocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['BTC', 'ETH', 'SOL', 'USDT', 'Others'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: ['#2dd4bf', '#3b82f6', '#a855f7', '#22c55e', '#64748b'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Settings Page Logic
document.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher Buttons
    const themeBtns = document.querySelectorAll('.theme-btn');
    if (themeBtns.length > 0) {
        const updateActiveThemeBtn = () => {
            const currentTheme = localStorage.theme || 'system';
            themeBtns.forEach(btn => {
                if (btn.dataset.theme === currentTheme || (currentTheme === 'system' && btn.dataset.theme === 'system')) {
                    btn.className = 'theme-btn px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-white/10 shadow-sm text-slate-900 dark:text-white';
                } else {
                    btn.className = 'theme-btn px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
                }
            });
        };
        updateActiveThemeBtn();

        updateActiveThemeBtn();

        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                if (theme === 'system') {
                    localStorage.removeItem('theme');
                    initTheme();
                } else {
                    localStorage.theme = theme;
                    initTheme(); // Re-run init logic

                    // Manually force class update if initTheme relies on system
                    if (theme === 'dark') document.documentElement.classList.add('dark');
                    else document.documentElement.classList.remove('dark');
                }
                updateActiveThemeBtn();
                showToast(`Theme set to ${theme}`, 'success');
            });
        });
    }

    // Accent Color Logic
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '45 212 191';
    };

    const setAccent = (colorHtmlBtn) => {
        const color = colorHtmlBtn.getAttribute('data-color');
        const rgb = hexToRgb(color);

        document.documentElement.style.setProperty('--color-primary', rgb);
        localStorage.setItem('aura_accent', color);

        // Visual Update
        document.querySelectorAll('[data-color]').forEach(b => {
            b.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-slate-50', 'dark:ring-offset-obsidian');
            b.classList.add('hover:scale-110');
            if (b === colorHtmlBtn) {
                b.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-slate-50', 'dark:ring-offset-obsidian');
                b.classList.remove('hover:scale-110');
            }
        });

        showToast('Accent color updated', 'success');
    };

    // Attach click listeners to accent buttons & Init
    const accentBtns = document.querySelectorAll('[data-color]');
    if (accentBtns.length > 0) {
        accentBtns.forEach(btn => {
            btn.onclick = () => setAccent(btn);
        });

        // Load saved accent
        const savedAccent = localStorage.getItem('aura_accent');

        // Reset all first to be safe
        accentBtns.forEach(btn => {
            btn.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-slate-50', 'dark:ring-offset-obsidian');
            btn.classList.add('hover:scale-110');
        });

        if (savedAccent) {
            const rgb = hexToRgb(savedAccent);
            document.documentElement.style.setProperty('--color-primary', rgb);
            // Set active state
            accentBtns.forEach(btn => {
                if (btn.dataset.color === savedAccent) {
                    btn.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-slate-50', 'dark:ring-offset-obsidian');
                    btn.classList.remove('hover:scale-110');
                }
            });
        } else {
            // Default active (teal)
            const defaultBtn = document.querySelector('[data-color="#2dd4bf"]');
            if (defaultBtn) {
                defaultBtn.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-slate-50', 'dark:ring-offset-obsidian');
                defaultBtn.classList.remove('hover:scale-110');
            }
        }
    }

    // Input Persistence
    const inputs = ['fullName', 'email', '2faToggle', 'emailNotif', 'pushNotif', 'soundNotif', 'language', 'currency'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Load saved
            const saved = localStorage.getItem(`settings_${id}`);
            if (saved !== null) {
                if (el.type === 'checkbox') el.checked = saved === 'true';
                else el.value = saved;
            }

            // Save on change
            el.addEventListener('change', () => {
                const val = el.type === 'checkbox' ? el.checked : el.value;
                localStorage.setItem(`settings_${id}`, val);
                if (el.type !== 'text' && el.type !== 'email') showToast('Setting saved', 'success');
            });
        }
    });

    // Profile Image Preview
    const profileUpload = document.getElementById('profileUpload');
    const profilePreview = document.getElementById('profilePreview');
    if (profileUpload && profilePreview) {
        profileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePreview.src = e.target.result;
                    localStorage.setItem('profileImage', e.target.result);
                    showToast('Profile image updated', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
        // Load saved image
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) profilePreview.src = savedImage;
    }

    // Password Strength
    const passInput = document.getElementById('newPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    if (passInput) {
        passInput.addEventListener('input', (e) => {
            const val = e.target.value;
            let strength = 0;
            if (val.length > 5) strength += 20;
            if (val.length > 8) strength += 20;
            if (/[A-Z]/.test(val)) strength += 20;
            if (/[0-9]/.test(val)) strength += 20;
            if (/[^A-Za-z0-9]/.test(val)) strength += 20;

            strengthBar.style.width = `${strength}%`;

            if (strength < 40) {
                strengthBar.className = 'h-full bg-red-500 transition-all duration-300';
                strengthText.textContent = 'Weak';
                strengthText.className = 'text-xs text-red-500 text-right';
            } else if (strength < 80) {
                strengthBar.className = 'h-full bg-yellow-500 transition-all duration-300';
                strengthText.textContent = 'Medium';
                strengthText.className = 'text-xs text-yellow-500 text-right';
            } else {
                strengthBar.className = 'h-full bg-green-500 transition-all duration-300';
                strengthText.textContent = 'Strong';
                strengthText.className = 'text-xs text-green-500 text-right';
            }
        });
    }
});

// Wallet Page Advanced Logic
document.addEventListener('DOMContentLoaded', () => {
    // Only run if on wallet page elements exist
    if (!document.querySelector('.balance-display')) return;

    // --- State ---
    const defaultBalances = {
        BTC: 2.8450,
        ETH: 14.5020,
        USDT: 25430.00
    };
    const defaultTransactions = [
        { type: 'Deposit', asset: 'BTC', amount: 0.45, date: Date.now() - 3600000, status: 'Completed' },
        { type: 'Withdraw', asset: 'ETH', amount: 2.0, date: Date.now() - 86400000, status: 'Completed' },
        { type: 'Deposit', asset: 'USDT', amount: 5000, date: Date.now() - 172800000, status: 'Completed' },
        { type: 'Withdraw', asset: 'BTC', amount: 0.1, date: Date.now() - 259200000, status: 'Pending' }
    ];

    let balances = JSON.parse(localStorage.getItem('aura_balances')) || defaultBalances;
    let transactions = JSON.parse(localStorage.getItem('aura_transactions')) || defaultTransactions;
    let showBalance = localStorage.getItem('aura_show_balance') !== 'false'; // Default true

    // --- DOM Elements ---
    const totalBalanceEl = document.getElementById('totalBalance');
    const toggleBalanceBtn = document.getElementById('toggleBalance');
    const balanceDisplays = document.querySelectorAll('.balance-display');
    const transactionsTable = document.getElementById('transactionsTable');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // --- Functions ---

    // Toggle Balance Visibility
    const updateBalanceVisibility = () => {
        const eyeIcon = toggleBalanceBtn.querySelector('i');
        if (showBalance) {
            totalBalanceEl.textContent = '$128,450.00'; // Mock total derived calculations
            balanceDisplays.forEach(el => {
                const asset = el.dataset.asset;
                el.textContent = `${balances[asset]} ${asset}`;
            });
            eyeIcon.setAttribute('data-lucide', 'eye');
        } else {
            totalBalanceEl.textContent = '••••••••';
            balanceDisplays.forEach(el => {
                const asset = el.dataset.asset;
                el.textContent = `•••••• ${asset}`;
            });
            eyeIcon.setAttribute('data-lucide', 'eye-off');
        }
        lucide.createIcons();
    };

    toggleBalanceBtn.addEventListener('click', () => {
        showBalance = !showBalance;
        localStorage.setItem('aura_show_balance', showBalance);
        updateBalanceVisibility();
    });

    // Render Transactions
    const renderTransactions = (filter = 'all') => {
        transactionsTable.innerHTML = '';

        const filtered = transactions.filter(tx => {
            if (filter === 'all') return true;
            if (filter === 'income') return tx.type === 'Deposit';
            if (filter === 'expense') return tx.type === 'Withdraw';
            return true;
        });

        filtered.sort((a, b) => b.date - a.date).forEach(tx => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer';

            // Icon
            const icon = tx.type === 'Deposit' ? 'arrow-down-left' : 'arrow-up-right';
            const color = tx.type === 'Deposit' ? 'text-green-500' : 'text-slate-500 dark:text-slate-400';
            const bg = tx.type === 'Deposit' ? 'bg-green-500/10' : 'bg-slate-100 dark:bg-white/10';

            tr.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full ${bg} flex items-center justify-center ${color} mr-3">
                            <i data-lucide="${icon}" class="w-5 h-5"></i>
                        </div>
                        <span class="font-medium text-slate-900 dark:text-white">${tx.type}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">${tx.asset}</td>
                <td class="px-6 py-4 font-mono text-slate-900 dark:text-white font-medium ${tx.type === 'Deposit' ? 'text-green-500' : ''}">
                    ${tx.type === 'Deposit' ? '+' : '-'}${tx.amount}
                </td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                    ${new Date(tx.date).toLocaleDateString()}
                    <br>
                    ${new Date(tx.date).toLocaleTimeString()}
                </td>
                <td class="px-6 py-4 text-right">
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }">${tx.status}</span>
                </td>
            `;
            transactionsTable.appendChild(tr);
        });
        lucide.createIcons();
    };

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.className = 'filter-btn px-4 py-2 text-sm font-medium rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
            });
            btn.className = 'filter-btn px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-white/10 shadow-sm text-slate-900 dark:text-white transition-all';
            renderTransactions(btn.dataset.filter);
        });
    });

    // Modals
    window.openModal = (id, asset) => {
        const modal = document.getElementById(id);
        const modalContent = modal.querySelector('div');

        // Setup specific content
        if (id === 'depositModal') document.getElementById('depositAsset').value = asset;
        if (id === 'withdrawModal') {
            document.getElementById('withdrawAsset').value = asset;
            // Update available bal logic mock
            document.getElementById('modalAvailableBal').textContent = balances[asset] + ' ' + asset;
        }

        modal.classList.remove('hidden');
        // Small delay for transition
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }, 10);
    };

    window.closeModal = (id) => {
        const modal = document.getElementById(id);
        const modalContent = modal.querySelector('div');

        modal.classList.add('opacity-0');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    window.copyAddress = (text) => {
        navigator.clipboard.writeText(text);
        showToast('Address copied to clipboard');
    };

    window.simulateDeposit = () => {
        const asset = document.getElementById('depositAsset').value;
        const amount = (Math.random() * 2).toFixed(4); // Random amount

        balances[asset] = (parseFloat(balances[asset]) + parseFloat(amount)).toFixed(4);
        transactions.unshift({
            type: 'Deposit',
            asset: asset,
            amount: amount,
            date: Date.now(),
            status: 'Completed'
        });

        localStorage.setItem('aura_balances', JSON.stringify(balances));
        localStorage.setItem('aura_transactions', JSON.stringify(transactions));

        updateBalanceVisibility();
        renderTransactions();
        closeModal('depositModal');
        showToast(`Successfully deposited ${amount} ${asset}`);
    };

    window.processWithdraw = () => {
        const asset = document.getElementById('withdrawAsset').value;
        const amountInput = document.getElementById('withdrawAmount');
        const amount = parseFloat(amountInput.value);

        if (!amount || amount <= 0) {
            showToast('Invalid amount', 'error');
            return;
        }
        if (amount > balances[asset]) {
            showToast('Insufficient funds', 'error');
            return;
        }

        balances[asset] = (parseFloat(balances[asset]) - amount).toFixed(4);
        transactions.unshift({
            type: 'Withdraw',
            asset: asset,
            amount: amount,
            date: Date.now(),
            status: 'Pending'
        });

        localStorage.setItem('aura_balances', JSON.stringify(balances));
        localStorage.setItem('aura_transactions', JSON.stringify(transactions));

        updateBalanceVisibility();
        renderTransactions();
        closeModal('withdrawModal');
        amountInput.value = '';
        showToast(`Withdrawal of ${amount} ${asset} processing`);
    }

    // Init
    updateBalanceVisibility();
    renderTransactions();
});




// Global Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Notification Link handled via inline onclick in HTML for robustness, 
    // but adding safety check here or other global listeners if needed.

    // Timeframe Buttons (Overview)
    const timeframeBtns = document.querySelectorAll('.glass-panel button.px-3');
    timeframeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset all
            timeframeBtns.forEach(b => {
                b.className = 'px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/5';
            });
            // Set active
            btn.className = 'px-3 py-1 rounded-lg bg-primary/20 text-xs text-primary border border-primary/20';

            showToast(`Timeframe changed to ${btn.textContent}`, 'success');
        });
    });

    // Overview Bottom Cards
    const statusCards = document.querySelectorAll('.glass-panel.cursor-pointer');
    statusCards.forEach(card => {
        card.addEventListener('click', () => {
            // Avoid triggering on buttons inside
            const title = card.querySelector('h4')?.textContent;
            if (title) {
                showToast(`${title} status check: Optimal`, 'success');
            }
        });
    });

    // New Transfer Button (Overview)
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.textContent.includes('New Transfer')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'wallet.html';
            });
        }
        if (btn.textContent.includes('View All') && btn.closest('.glass-panel')) {
            btn.addEventListener('click', () => {
                window.location.href = 'wallet.html';
            });
        }
    });
});
