<script lang="ts">
  import { setContext } from 'svelte';
  import CartItem from './components/CartItem.svelte';
  import Summary from './components/Summary.svelte';
  import { key, type CheckoutContext } from './constants';
  export let Checkout: CheckoutContext['Checkout'];
  export let EventEmitter: CheckoutContext['EventEmitter'];

  const order = Checkout.order;

  setContext<CheckoutContext>(key, {
    Checkout,
    EventEmitter,
  });

  EventEmitter.subscribe({
    event: 'add_to_cart',
    callback: async (payload) => {
      console.log('add_to_cart listener in custom module', payload);
    },
  });
</script>

<div class="wrapper">
  <span class="lock">🔒</span>
  <h1>Kassa</h1>

  <p class="usp">Free shipping and 60 days return policy.</p>
  <div class="cart">
    {#each $order?.cart.items as item}
      <CartItem {item} />
    {/each}
  </div>

  <Summary />
</div>

<style>
  h1 {
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    font-family: 'Avenir Next', Avenir, Lato, Arial, sans-serif;
  }
  .lock {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }

  .usp {
    margin: 3rem auto 5rem;
    font-size: 0.8rem;
    /* font-weight: 400; */
  }

  .cart {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 768px) {
    .cart {
      gap: 1rem;
      max-width: 620px;
    }
  }
</style>
