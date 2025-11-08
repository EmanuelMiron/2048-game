/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom colors for better dark mode support
        'tile-empty': {
          light: '#cdc1b4',
          dark: '#3a3a3c'
        },
        'tile-2': {
          light: '#eee4da',
          dark: '#48484a'
        },
        'tile-4': {
          light: '#ede0c8',
          dark: '#5a5a5c'
        },
        'tile-8': {
          light: '#f2b179',
          dark: '#ff9500'
        },
        'tile-16': {
          light: '#f59563',
          dark: '#ff8c00'
        },
        'tile-32': {
          light: '#f67c5f',
          dark: '#ff7b00'
        },
        'tile-64': {
          light: '#f65e3b',
          dark: '#ff6b00'
        },
        'tile-128': {
          light: '#edcf72',
          dark: '#ffd60a'
        },
        'tile-256': {
          light: '#edcc61',
          dark: '#ffcc02'
        },
        'tile-512': {
          light: '#edc850',
          dark: '#ffb700'
        },
        'tile-1024': {
          light: '#edc53f',
          dark: '#ff9500'
        },
        'tile-2048': {
          light: '#edc22e',
          dark: '#ff8500'
        },
        'tile-super': {
          light: '#3c3a32',
          dark: '#ff6b35'
        }
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionDuration: {
        '300': '300ms',
      }
    },
  },
  plugins: [],
}