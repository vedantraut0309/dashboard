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
        if (isLoginPage || isSignupPage) {
            window.location.href = 'dashboard';
        }
    } else {
        // User is NOT logged in
        if (!isLoginPage && !isSignupPage && !isPublicPage) {
            window.location.href = 'login';
        }
    }
};

const login = (email, password) => {
    localStorage.setItem('aura_auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('aura_user_email', email);
    window.location.href = 'dashboard';
};

const logout = () => {
    localStorage.removeItem('aura_auth_token');
    localStorage.removeItem('aura_user_email');
    window.location.href = 'login';
};

// Check auth immediately upon load
checkAuth();

// Expose to window
window.auth = {
    checkAuth,
    login,
    logout
};
