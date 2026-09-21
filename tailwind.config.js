/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./registry/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)",    "system-ui", "sans-serif"],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        medical: {
          blue: '#0284c7',
          deep: '#0B1426',
          navy: '#0D1B2A',
          teal: '#06B6D4',
          emerald: '#22C55E',
          sky: '#38BDF8',
          card: '#13213c',
        }
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '70%': { boxShadow: '0 0 0 14px rgba(34, 197, 94, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
        pulseGlowBlue: {
          '0%': { boxShadow: '0 0 0 0 rgba(14, 165, 233, 0.5)' },
          '70%': { boxShadow: '0 0 0 16px rgba(14, 165, 233, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(14, 165, 233, 0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      },
      animation: {
        marquee: 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
        float: 'float 3.5s ease-in-out infinite',
        floatSlow: 'floatSlow 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s infinite',
        pulseGlowBlue: 'pulseGlowBlue 2.2s infinite',
        fadeInUp: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideInLeft: 'slideInLeft 0.5s ease-out forwards',
        popIn: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        fillBar: 'fillBar 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
