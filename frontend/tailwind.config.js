/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'codevault': {
          'black': '#000000',
          'green': '#00ff00',
          'dark-gray': '#111111',
          'medium-gray': '#1a1a1a',
          'light-gray': '#2a2a2a'
        }
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #00ff00 0%, #003300 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #111111 100%)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { 'box-shadow': '0 0 10px #00ff00' },
          'to': { 'box-shadow': '0 0 20px #00ff00, 0 0 30px #00ff00' }
        }
      }
    },
  },
  plugins: [],
}
