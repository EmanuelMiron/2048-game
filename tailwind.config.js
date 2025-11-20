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
        // Soft Momentum Palette - Warm neutrals with depth
        cream: {
          50: '#fdfcfa',
          100: '#f9f7f4',
          200: '#f3efe8',
          300: '#e8e2d7',
          400: '#d9cfc0',
        },
        sand: {
          50: '#faf8f5',
          100: '#f0ebe3',
          200: '#e4dccf',
          300: '#cfc5b5',
          400: '#b8ab98',
          500: '#9d8f7c',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#fae8e0',
          200: '#f5d0bf',
          300: '#ebb191',
          400: '#de8f68',
          500: '#c97854',
          600: '#b06644',
          700: '#8f5235',
          800: '#733f2a',
          900: '#5a301f',
          950: '#3d1f14',
          1000: '#2a150d',
        },
        clay: {
          50: '#f8f6f4',
          100: '#ebe6e1',
          200: '#d9cfc4',
          300: '#c2b3a3',
          400: '#a89481',
          500: '#8a7461',
          600: '#6f5b4a',
          700: '#594537',
          800: '#44322a',
          900: '#3d3731',
          950: '#2a2622',
          1000: '#1a1612',
        },
        pop: {
          blush: '#fee4eb',
          lemon: '#fff7be',
          sky: '#d9f0ff',
          lilac: '#ede2ff',
          mint: '#dbf6e2',
          coal: '#111111',
          ink: '#1f1f1f'
        },
        // Tile colors with physical depth - Witty Pop Modernism pastels
        'tile-empty': {
          light: '#cdc1b4',
          dark: '#2a2a3e'
        },
        'tile-2': {
          light: '#fee4eb',
          dark: '#FFB4C2' // blush pink
        },
        'tile-4': {
          light: '#fff2d2',
          dark: '#FFF7BE' // lemon cream
        },
        'tile-8': {
          light: '#ffd39b',
          dark: '#FFCBA4' // peach
        },
        'tile-16': {
          light: '#ffb66f',
          dark: '#FF9B8A' // coral
        },
        'tile-32': {
          light: '#ff9a6d',
          dark: '#FF7F7F' // pastel red
        },
        'tile-64': {
          light: '#ff7a63',
          dark: '#C77DFF' // lavender
        },
        'tile-128': {
          light: '#ffd657',
          dark: '#FFE156' // buttery yellow
        },
        'tile-256': {
          light: '#ffc946',
          dark: '#A8E6CF' // mint green
        },
        'tile-512': {
          light: '#ffbf34',
          dark: '#87CEEB' // sky blue
        },
        'tile-1024': {
          light: '#ffb31e',
          dark: '#B4E7CE' // jade
        },
        'tile-2048': {
          light: '#ffe79c',
          dark: '#FFDAB9' // apricot
        },
        'tile-super': {
          light: '#1d1d1d',
          dark: '#E0BBE4' // dusty purple
        },
      },
      fontFamily: {
        serif: ['"Righteous"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', '"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(138, 116, 97, 0.15), 0 4px 16px -4px rgba(138, 116, 97, 0.08)',
        'soft-lg': '0 4px 16px -4px rgba(138, 116, 97, 0.2), 0 8px 32px -8px rgba(138, 116, 97, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(138, 116, 97, 0.1)',
        // Faux-3D tile shadows - layered for depth
        'tile-3d': '0 1px 0 0 rgba(255, 255, 255, 0.3), 0 2px 0 0 rgba(0, 0, 0, 0.05), 0 3px 2px -1px rgba(138, 116, 97, 0.15), 0 6px 8px -2px rgba(138, 116, 97, 0.08)',
        'tile-3d-low': '0 1px 0 0 rgba(255, 255, 255, 0.2), 0 1px 1px 0 rgba(138, 116, 97, 0.1)',
        'tile-3d-mid': '0 1px 0 0 rgba(255, 255, 255, 0.3), 0 3px 0 0 rgba(0, 0, 0, 0.06), 0 4px 4px -2px rgba(138, 116, 97, 0.2), 0 8px 12px -3px rgba(138, 116, 97, 0.12)',
        'tile-3d-high': '0 2px 0 0 rgba(255, 255, 255, 0.35), 0 4px 0 0 rgba(0, 0, 0, 0.08), 0 6px 6px -2px rgba(138, 116, 97, 0.25), 0 10px 16px -4px rgba(138, 116, 97, 0.15)',
        'tile-inner-bevel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}
