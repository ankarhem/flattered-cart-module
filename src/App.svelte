<script lang="ts">
  import type { MountProps } from '@norce/module-adapter-svelte';
  import CartItem from './CartItem.svelte';
  import { onMount } from 'svelte';
  import { culture } from './translations';

  export let api: MountProps['api'];
  export let data: MountProps['data'];
  export let track: MountProps['track'];

  onMount(() => {
    culture.set(data.order.culture);
  });
</script>

<div class="grid gap-2 text-sm">
  <ul class="grid divide-black/50 divide-y">
    {#each data.order.cart.items as item}
      <CartItem {item} {api} {data} {track} />
    {/each}
  </ul>
</div>

<style global lang="postcss">
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
</style>
