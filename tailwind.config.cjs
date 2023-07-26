/** @type {import('tailwindcss').Config}*/
const config = {
  mode: 'jit',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        Quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        greenBackground: '#0B5324',
        green: '#1DB954',
        black: '#191414',
        grey: '#49554D',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#191414',
          secondary: '#ffffff',
          accent: '#1DB954',
          neutral: '#ffffff',
          'base-content': '#ffffff',
          'base-100': '#191414',
          info: '#2463EB',
          success: '#16A249',
          warning: '#DB7706',
          error: '#DC2828',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}

module.exports = config
