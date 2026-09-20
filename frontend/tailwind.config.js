/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0F1720',
          900: '#16202C',
          800: '#1F2E3D',
          700: '#2C4054',
          600: '#3E5A73',
          400: '#7A93A6',
          200: '#C6D3DC',
        },
        paper: {
          50: '#FBFAF6',
          100: '#F5F2EA',
          200: '#EAE4D6',
        },
        brass: {
          400: '#C9A15A',
          500: '#B08D57',
          600: '#8F7040',
        },
        attention: {
          high: '#A6402F',
          highBg: '#FBEAE6',
          medium: '#B4791E',
          mediumBg: '#FBF1DF',
          low: '#3E6B52',
          lowBg: '#E9F2EC',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
