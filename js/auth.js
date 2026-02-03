// Authentication Logic

const checkAuth = () => {
    const token = localStorage.getItem('aura_auth_token');
    const path = window.location.pathname.toLowerCase();

    // Check for both .html and extensionless paths (Vercel cleanUrls)
    const isLoginPage = path.includes('login');
    const isSignupPage = path.includes('signup');
    // Public landing page is index.html or empty string (root)
    const isPublicPage = path.endsWith('/') || path.includes('index');

    if (token) {
        // User is logged in
        // If visiting login or signup, redirect to dashboard
        if (isLoginPage || isSignupPage) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is NOT logged in
        // If visiting a protected page, redirect to login
        if (!isLoginPage && !isSignupPage && !isPublicPage) {
            // Allow access to assets/css/js if they are somehow accessed directly? 
            // Browsers don't navigate to .css files usually.
            // But we should ensure we don't block valid resources if this script runs there (it won't).
            window.location.href = 'login.html';
        }
    }
};

const login = (email, password) => {
    // Mock login
    console.log(`Logging in as ${email}`);
    localStorage.setItem('aura_auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('aura_user_email', email);

    // Show toast if available (requires main.js or defined here)
    // For now just redirect
    window.location.href = 'dashboard.html';
};

const logout = () => {
    localStorage.removeItem('aura_auth_token');
    localStorage.removeItem('aura_user_email');
    window.location.href = 'login.html';
};

// Check auth immediately upon load
checkAuth();

// Expose to window
window.auth = {
    checkAuth,
    login,
    logout
};
