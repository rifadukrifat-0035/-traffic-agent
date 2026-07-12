/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyber: '#00f3ff',
        neon: '#bd00ff',
        charcoal: '#090b10',
        abyss: '#03040a',
      },
      boxShadow: {
        cyber: '0 0 30px rgba(0, 243, 255, 0.25)',
        neon: '0 0 34px rgba(189, 0, 255, 0.22)',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 0 0, rgba(0,243,255,0.2) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}

