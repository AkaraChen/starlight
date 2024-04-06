import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts', './src/preference.ts'],
  dts: true,
  format: ['esm', 'cjs'],
})
