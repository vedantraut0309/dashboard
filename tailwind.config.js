/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./*.html",
    "./*.js",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        'obsidian-light': '#0f1115',
        'obsidian-lighter': '#181b21',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-glow': '#2dd4bf80',
        glass: 'rgba(255, 255, 255, 0.05)',
        'glass-stroke': 'rgba(255, 255, 255, 0.1)',
        'accent-red': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'neon': '0 0 10px rgba(45, 212, 191, 0.5), 0 0 20px rgba(45, 212, 191, 0.3)'
      }
    },
  },
  plugins: [],
}
