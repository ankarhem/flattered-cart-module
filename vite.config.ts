import { defineConfig, Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as cp from 'child_process';
import livereload from 'rollup-plugin-livereload';

function serve(): Plugin {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    name: 'server',
    writeBundle() {
      if (server) return;
      server = cp.spawn('pnpm', ['start'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

const SERVE = process.env.SERVE === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      emitCss: false,
    }),
  ],
  // define: {
  //   'process.env.LOGGER_LEVEL': 'process.env.LOGGER_LEVEL',
  //   'process.env.NODE_ENV': 'process.env.NODE_ENV',
  // },
  // optimizeDeps: {
  //   exclude: ['@norce/checkout-lib'],
  // },
  build: {
    minify: false,
    rollupOptions: {
      plugins: [
        SERVE && serve(),
        SERVE &&
          livereload({
            watch: 'dist',
            delay: 150,
          }),
      ],
      input: './src/main.ts',
      preserveEntrySignatures: 'strict',
      // external: ['@norce/checkout-lib'],
      output: {
        entryFileNames: '[name].js',
        format: 'systemjs',
        name: null, // ensure anonymous System.register
        dir: 'dist',
      },
    },
  },
});
