<script lang="ts">
  import type { components } from '@norce/checkout-lib/dist/types/checkout/models/openapi/orderService';
  import { getContext } from 'svelte';
  import { key, type CheckoutContext } from '../constants';

  export let item: components['schemas']['Item'];
  const { Checkout } = getContext<CheckoutContext>(key);

  const config = Checkout.config;
  const order = Checkout.order;
</script>

<div class="cart-item">
  <img
    src={item.imageUrl
      ?.replace('flattered-test.jetshop.se', 'www.flattered.com')
      .replace('/thumbs/', '/original/')}
    alt={item.name}
  />

  <div class="cart-info">
    <div class="header-row">
      <a href={item.url} class="item-name" target="_blank" rel="noreferrer">
        <h2>{item.name}</h2>
      </a>
      <button
        on:click={() => Checkout.deleteFromCart(item.id)}
        disabled={$order.suspended}>X</button
      >
    </div>
    <div class="price-row">
      <span
        >{Intl.NumberFormat($order.culture, {
          currency: $order.currency,
          style: 'currency',
        }).format(item.price.includingVat)}</span
      >

      <div class="quantity-wrapper">
        <button
          on:click={() => Checkout.removeFromCart(item.id)}
          disabled={$order.suspended || item.quantity === 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          on:click={() => Checkout.addToCart(item.id)}
          disabled={$order.suspended}
        >
          +
        </button>
      </div>
    </div>
    <p>Omgående leverans</p>
  </div>
</div>

<style>
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  a {
    color: #000;
    text-decoration: none;
  }

  .cart-item {
    display: flex;
    gap: 2rem;
  }

  .cart-item > * {
    flex: 1;
  }

  .cart-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }

  .header-row h2 {
    margin: 0;
    font-size: medium;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 30ch;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
  }

  .quantity-wrapper {
    display: flex;
    gap: 1rem;
  }
</style>
