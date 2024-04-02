import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      include: ['./packages/**/*.{test,spec}.{ts,tsx}'],
      globals: true,
    },
  },
])
