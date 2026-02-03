import { defineConfig } from 'vite';

import { resolve } from 'path';

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                login: resolve(__dirname, 'login.html'),
                signup: resolve(__dirname, 'signup.html'),
                analytics: resolve(__dirname, 'analytics.html'),
                notifications: resolve(__dirname, 'notifications.html'),
                settings: resolve(__dirname, 'settings.html'),
                trade: resolve(__dirname, 'trade.html'),
                wallet: resolve(__dirname, 'wallet.html'),
            },
        },
    }
});
