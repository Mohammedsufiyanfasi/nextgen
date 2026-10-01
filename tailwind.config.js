/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#061326',
          900: '#0B1B34',
          800: '#102849',
          700: '#17365E',
        },
        electric: '#087CFF',
        bright: '#159BFF',
        cyan: '#22D3EE',
        ink: '#14213D',
        paper: '#F5F8FC',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.25), 0 10px 40px -10px rgba(8,124,255,0.45)',
        card: '0 10px 30px -12px rgba(6,19,38,0.25)',
        soft: '0 4px 20px -8px rgba(6,19,38,0.18)',
      },
      backgroundImage: {
        'grid-cyan':
          'linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)',
        'hero-radial':
          'radial-gradient(1200px 600px at 70% -10%, rgba(8,124,255,0.35), transparent 60%), radial-gradient(900px 500px at 10% 110%, rgba(34,211,238,0.22), transparent 55%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
        fadeIn: 'fadeIn 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
