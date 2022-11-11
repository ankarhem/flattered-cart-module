import { createModule } from './module';
import App from './App.svelte';

export const { bootstrap, mount, unmount } = createModule(App);
