<script lang="ts">
  import type { MountProps } from '@norce/module-adapter-svelte';
  import { createFormatter, convertItemToGA4Item } from '@norce/checkout-lib';
  import { t } from './translations';
  import { TrackingEvents } from '@norce/analytics';
  export let item: MountProps['data']['order']['cart']['items'][number];
  export let api: MountProps['api'];
  export let data: MountProps['data'];
  export let track: MountProps['track'];

  const formatter = createFormatter(data.order.culture, data.order.currency);

  $: pulsingClass =
    api.state === 'pending'
      ? 'text-transparent bg-black/20 rounded animate-pulse'
      : '';

  let quantity = item.quantity;
  let total = item.total.includingVat;

  // Reset pending UI when state is idle
  // this must be done since a request could fail
  $: {
    if (api.state === 'idle') {
      quantity = item.quantity;
      total = item.total.includingVat;
    }
  }
</script>

<li class="flex gap-4 py-4">
  <img
    src={item.imageUrl}
    alt={item.name}
    class="w-40 h-full object-contain rounded"
  />

  <!-- Item details -->
  <div class="grid flex-1">
    <div class="grid gap-4 self-start">
      <h2>{item.name}</h2>

      <div class="flex gap-1 items-center">
        <button
          class="py-1 px-2 -my-1 -ml-2"
          on:click={() => {
            quantity = quantity + 1;
            api.updateItem({
              itemReference: item.reference,
              quantity: String(quantity),
            });
            track(TrackingEvents.AddToCart, {
              items: [convertItemToGA4Item({ ...item, quantity: quantity })],
              currency: data.order.currency,
              value: item.price?.includingVat,
            });
          }}
          >&plus;
        </button>
        <span>{quantity}</span>
        <button
          class="py-1 px-2 -my-1"
          on:click={() => {
            quantity = quantity - 1;
            api.updateItem({
              itemReference: item.reference,
              quantity: String(quantity),
            });
            track(TrackingEvents.RemoveFromCart, {
              items: [convertItemToGA4Item({ ...item, quantity: quantity })],
              currency: data.order.currency,
              value: item.price?.includingVat,
            });
          }}
          >&minus;
        </button>
      </div>

      {#each Object.entries(item.attributes.productVariant || {}) as [key, value]}
        {#if key !== 'id'}
          <span>
            {`${key} - ${value}`}
          </span>
        {/if}
      {/each}

      {#if typeof item.attributes.STOCK_LEVEL === 'number'}
        <div class="flex gap-2 items-center">
          {#if item.attributes.STOCK_LEVEL > 0}
            <span class="w-2 h-2 rounded-full bg-green-600" />
            {t('Instant shipping')}
          {:else}
            <span>What to display here?</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Price / Remove -->
  <div class="grid gap-4 flex-0 self-start justify-items-end">
    <span class={pulsingClass}>
      {formatter.format(total)}
    </span>

    <button
      class="underline underline-offset-4"
      disabled={api.state === 'pending'}
      on:click={() => {
        api.deleteItem(item.reference);
        track(TrackingEvents.RemoveFromCart, {
          items: [convertItemToGA4Item({ ...item, quantity: 0 })],
          currency: data.order.currency,
          value: item.price?.includingVat,
        });
      }}
    >
      {t('Remove')}
    </button>
  </div>
</li>
