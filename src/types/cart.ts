import type { ProductSize } from "./product";

/** A selected product variant and its quantity; prices are resolved from the catalogue. */
export interface CartItem {
  productId: string;
  size: ProductSize;
  colour: string;
  quantity: number;
}

/** A collection of selected cart items. */
export type Cart = CartItem[];

/** A derived cart item with its current unit price and extended line total. */
export interface PricedCartItem extends CartItem {
  unitPrice: number;
  lineTotal: number;
}
