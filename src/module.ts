import type { SvelteComponent } from 'svelte';

interface ModuleMethods {
  bootstrap: () => void;
  mount: (el: string) => void;
  unmount: (el: string) => void;
}

type Instances = Record<string, SvelteComponent>;

export const createModule = (App: typeof SvelteComponent): ModuleMethods => {
  let instances: Instances = {};
  return {
    bootstrap,
    mount: mount.bind(null, instances, App),
    unmount: unmount.bind(null, instances),
  };
};

const bootstrap = () => {
  return;
};

const mount = (
  instances: Instances,
  App: typeof SvelteComponent,
  el: HTMLElement
) => {
  if (!instances[el.id]) {
    const app = new App({
      target: el,
    });
    instances[el.id] = app;
  } else {
    console.log('Tried to mount an already mounted instance');
  }
};

const unmount = (instances: Instances, el: HTMLElement) => {
  if (instances[el.id]) {
    instances[el.id].$destroy
      ? instances[el.id].$destroy()
      : instances[el.id].destroy();
    delete instances[el.id];
  } else {
    console.log('Tried to unmount an already unmounted instance');
  }
};
