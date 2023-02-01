import { createModule } from '@norce/module-adapter-svelte';
import App from './App.svelte';
import pkg from '../package.json';

export const { bootstrap, mount, unmount, update } = createModule({
  App: App,
  packageName: pkg.name,
});
