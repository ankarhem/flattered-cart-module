<script lang="ts">
  import type { components } from '@norce/checkout-lib/dist/types/checkout/models/openapi/orderService';
  import { getContext } from 'svelte';
  import { key, type CheckoutContext } from '../constants';

  export let item: components['schemas']['Item'];
  const { Checkout } = getContext<CheckoutContext>(key);

  const config = Checkout.config;
  const order = Checkout.order;

  console.log(item);

  const storlek = (item?.attributes?.productVariant as any)?.Storlek;
</script>

<div class="cart-item">
  <img src={item.imageUrl} alt={item.name} />

  <div class="cart-info">
    <div class="header-row">
      <a href={item.url} class="item-name" target="_blank" rel="noreferrer">
        <h2>{item.name}{storlek ? ` - ${storlek}` : ''}</h2>
      </a>
      <button
        on:click={() => Checkout.deleteFromCart(item.id)}
        disabled={$order.suspended}>&times;</button
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
          &minus;
        </button>
        <span>{item.quantity}</span>
        <button
          on:click={() => Checkout.addToCart(item.id)}
          disabled={$order.suspended}
        >
          &plus;
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
    display: inline-flex;
  }

  .cart-item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    font-size: small;
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
    margin: 0.5rem 0;
    align-items: center;
  }

  .header-row h2 {
    margin: 0;
    font-size: medium;
    font-weight: 400;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 30ch;
  }

  .header-row button {
    display: flex;
    align-items: center;
    height: 1.5rem;
    width: 1.5rem;
    border: none;
    background: none;
    font-size: 1.5rem;
    font-weight: 500;
    margin-right: -0.4rem;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .quantity-wrapper {
    display: inline-flex;
    gap: 1rem;
    align-items: center;
    font-size: 0.8rem;
  }

  .quantity-wrapper button {
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    border: none;
    width: 12px;
    height: 12px;
    padding: 0;
    background: #000;
    color: #fff;
    border-radius: 1rem;
    font-size: 0.8rem;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
