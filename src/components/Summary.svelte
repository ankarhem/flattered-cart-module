<script lang="ts">
  import { getContext } from 'svelte';
  import { key, type CheckoutContext } from '../constants';

  const { Checkout } = getContext<CheckoutContext>(key);
  const order = Checkout.order;
</script>

<div class="summary">
  <div class="summary-row">
    <span>Summa artiklar:</span>
    <span>
      {Intl.NumberFormat($order.culture, {
        currency: $order.currency,
        style: 'currency',
      }).format($order.cart.total.includingVat)}
    </span>
  </div>
  <div class="summary-row">
    <span> Frakt avgift: </span>
    <span>
      {Intl.NumberFormat($order.culture, {
        currency: $order.currency,
        style: 'currency',
      }).format(
        $order.shippings.reduce((acc, shipping) => {
          return acc + shipping.total.includingVat;
        }, 0)
      )}
    </span>
  </div>
  <div class="summary-row">
    <span>&check; Gränsen för fri frakt uppnåd</span>
  </div>
</div>

<div class="summary">
  <div class="summary-row">
    <span>Totalt inklusive moms:</span>
    <span>
      {Intl.NumberFormat($order.culture, {
        currency: $order.currency,
        style: 'currency',
      }).format($order.total.includingVat)}
    </span>
  </div>
  <div class="summary-row">
    <span>varav moms</span>
    <span>
      {Intl.NumberFormat($order.culture, {
        currency: $order.currency,
        style: 'currency',
      }).format($order.total.includingVat - $order.total.excludingVat)}
    </span>
  </div>
</div>

<style>
  .summary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: small;
    width: 100%;
    margin-top: 1rem;
    padding: 1rem 0.8rem;
    border: 1px solid black;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
  }

  .summary-row:first-of-type span {
    font-weight: 700;
  }
</style>
