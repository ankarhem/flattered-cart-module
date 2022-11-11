import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  define: {
    'process.env.LOGGER_LEVEL': 'process.env.LOGGER_LEVEL',
    'process.env.NODE_ENV': 'process.env.NODE_ENV',
  },
  // optimizeDeps: {
  //   exclude: ['@norce/checkout-lib'],
  // },
  build: {
    minify: false,
    rollupOptions: {
      input: './src/main.ts',
      preserveEntrySignatures: 'strict',
      external: ['@norce/checkout-lib'],
      output: {
        entryFileNames: '[name].js',
        format: 'systemjs',
        name: null, // ensure anonymous System.register
        dir: 'dist',
      },
    },
  },
});
