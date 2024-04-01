import type { Config } from 'tailwindcss'

export default {
  content: ['./src/renderer/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        native: 'rgba(241,241,241)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
} satisfies Config
