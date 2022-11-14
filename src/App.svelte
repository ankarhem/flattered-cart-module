<script lang="ts">
  import { setContext } from 'svelte';
  import CartItem from './components/CartItem.svelte';
  import { key, type CheckoutContext } from './constants';
  export let Checkout: CheckoutContext['Checkout'];
  export let EventEmitter: CheckoutContext['EventEmitter'];

  const order = Checkout.order;

  setContext<CheckoutContext>(key, {
    Checkout,
    EventEmitter,
  });
</script>

<div>
  {#each $order?.cart.items as item}
    <CartItem {item} />
  {/each}
</div>

<style>
  h1 {
    color: #ff3e00;
    text-align: center;
    margin: 40px 0;
  }

  div {
    border: 1px solid #f1b1b1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
</style>
