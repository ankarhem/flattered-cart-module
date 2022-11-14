import type {
  Checkout,
  CheckoutEventEmitter as CEM,
} from '@norce/checkout-lib';
export interface CheckoutContext {
  Checkout: typeof Checkout;
  EventEmitter: typeof CEM;
}

export const key = Symbol();
