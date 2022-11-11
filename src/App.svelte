<script lang="ts">
  import { Checkout } from '@norce/checkout-lib';
  const order = Checkout.order;

  // setTimeout(() => {
  //   throw new Error();
  // }, 2000);
</script>

<h1>hello from the other side</h1>
<p>{$order?.id}</p>

<style>
  h1 {
    color: #ff3e00;
    text-align: center;
    margin: 40px 0;
  }
</style>
