<script lang="ts">
  import type { components } from '@norce/checkout-lib/dist/types/checkout/models/openapi/orderService';
  import { getContext } from 'svelte';
  import { key, type CheckoutContext } from '../constants';

  export let item: components['schemas']['Item'];
  const { Checkout } = getContext<CheckoutContext>(key);
</script>

<img src={item.imageUrl} alt={item.name} />

<div>
  <h2>{item.name}</h2>
  <span>{item.price.includingVat}</span>
  <p>Omgående leverans</p>
</div>

<button on:click={() => Checkout.addToCart(item.id)}>Increment</button>
