import { DEMO_PRODUCTS } from "../data/demoProducts";
import type { Cart, CartItem, PricedCartItem } from "../types/cart";
import type { Product } from "../types/product";

type CartVariantIdentity = Pick<CartItem, "productId" | "size" | "colour">;

export type CartMutationResult =
  | { success: true; cart: Cart; availableStock: number; quantity: number }
  | {
      success: false;
      reason: "invalid-quantity" | "unavailable-variant" | "insufficient-stock" | "missing-item";
      availableStock: number;
      currentQuantity: number;
      requestedQuantity: number;
    };

const isSameCartVariant = (first: CartVariantIdentity, second: CartVariantIdentity): boolean =>
  first.productId === second.productId &&
  first.size === second.size &&
  first.colour === second.colour;

/** Looks up a product in the supplied catalogue (the demo catalogue by default). */
export function findCartProduct(
  productId: CartItem["productId"],
  products: readonly Product[] = DEMO_PRODUCTS,
): Product | undefined {
  return products.find((product) => product.id === productId);
}

/** Returns the stock for one exact product, size, and colour combination. */
export function getCartItemStock(
  item: CartVariantIdentity,
  products: readonly Product[] = DEMO_PRODUCTS,
): number | undefined {
  return findCartProduct(item.productId, products)?.variants.find(
    (variant) => variant.size === item.size && variant.colour === item.colour,
  )?.stock;
}

/** Returns the current quantity for one exact product variant. */
export function getCartItemQuantity(
  cart: readonly CartItem[],
  item: CartVariantIdentity,
): number {
  return cart
    .filter((cartItem) => isSameCartVariant(cartItem, item))
    .reduce((quantity, cartItem) => quantity + cartItem.quantity, 0);
}

function mergeCartItem(cart: readonly CartItem[], item: CartItem): Cart {
  const firstMatchingIndex = cart.findIndex((existingItem) => isSameCartVariant(existingItem, item));
  if (firstMatchingIndex === -1) return [...cart, { ...item }];

  const mergedQuantity = item.quantity + getCartItemQuantity(cart, item);
  return cart.flatMap((entry, index) => {
    if (index === firstMatchingIndex) return [{ ...entry, quantity: mergedQuantity }];
    return isSameCartVariant(entry, item) ? [] : [entry];
  });
}

function replaceCartItemQuantity(
  cart: readonly CartItem[],
  item: CartVariantIdentity,
  quantity: number,
): Cart {
  const firstMatchingIndex = cart.findIndex((entry) => isSameCartVariant(entry, item));
  return cart.flatMap((entry, index) => {
    if (index === firstMatchingIndex) return [{ ...entry, quantity }];
    return isSameCartVariant(entry, item) ? [] : [entry];
  });
}

/** Adds an item only when the exact variant has enough available demo stock. */
export function addCartItem(
  cart: readonly CartItem[],
  item: CartItem,
  products: readonly Product[] = DEMO_PRODUCTS,
): CartMutationResult {
  const currentQuantity = getCartItemQuantity(cart, item);
  const requestedQuantity = currentQuantity + item.quantity;
  const availableStock = getCartItemStock(item, products) ?? 0;

  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    return { success: false, reason: "invalid-quantity", availableStock, currentQuantity, requestedQuantity };
  }
  if (availableStock < 1) {
    return { success: false, reason: "unavailable-variant", availableStock, currentQuantity, requestedQuantity };
  }
  if (requestedQuantity > availableStock) {
    return { success: false, reason: "insufficient-stock", availableStock, currentQuantity, requestedQuantity };
  }

  return {
    success: true,
    cart: mergeCartItem(cart, item),
    availableStock,
    quantity: requestedQuantity,
  };
}

/** Restores valid cart rows, dropping unavailable variants and capping saved quantities to stock. */
export function normalizeCartItems(
  items: readonly CartItem[],
  products: readonly Product[] = DEMO_PRODUCTS,
): Cart {
  return items.reduce<Cart>((cart, item) => {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) return cart;

    const availableStock = getCartItemStock(item, products);
    if (availableStock === undefined || availableStock < 1) return cart;

    const remainingStock = availableStock - getCartItemQuantity(cart, item);
    const acceptedQuantity = Math.min(item.quantity, remainingStock);
    if (acceptedQuantity < 1) return cart;

    return mergeCartItem(cart, {
      productId: item.productId,
      size: item.size,
      colour: item.colour,
      quantity: acceptedQuantity,
    });
  }, []);
}

/** Sets a line quantity within stock; decrements remain possible if saved data is over the limit. */
export function updateCartItemQuantity(
  cart: readonly CartItem[],
  item: CartItem,
  quantity: number,
  products: readonly Product[] = DEMO_PRODUCTS,
): CartMutationResult {
  const currentQuantity = getCartItemQuantity(cart, item);
  const availableStock = getCartItemStock(item, products) ?? 0;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return { success: false, reason: "invalid-quantity", availableStock, currentQuantity, requestedQuantity: quantity };
  }
  if (currentQuantity < 1) {
    return { success: false, reason: "missing-item", availableStock, currentQuantity, requestedQuantity: quantity };
  }
  if (quantity > availableStock && quantity >= currentQuantity) {
    const reason = availableStock < 1 ? "unavailable-variant" : "insufficient-stock";
    return { success: false, reason, availableStock, currentQuantity, requestedQuantity: quantity };
  }

  return {
    success: true,
    cart: replaceCartItemQuantity(cart, item, quantity),
    availableStock,
    quantity,
  };
}

/** Removes every matching product-variant line from the cart. */
export function removeCartItem(cart: readonly CartItem[], item: CartItem): Cart {
  return cart.filter((entry) => !isSameCartVariant(entry, item));
}

/** Resolves the current unit price and line total; unknown product IDs return undefined. */
export function priceCartItem(
  item: CartItem,
  products: readonly Product[] = DEMO_PRODUCTS,
): PricedCartItem | undefined {
  const product = findCartProduct(item.productId, products);
  if (!product) return undefined;

  const unitPrice = product.salePrice ?? product.price;
  return {
    ...item,
    unitPrice,
    lineTotal: unitPrice * item.quantity,
  };
}

/** Returns undefined if any cart item references a product missing from the catalogue. */
export function calculateCartSubtotal(
  items: readonly CartItem[],
  products: readonly Product[] = DEMO_PRODUCTS,
): number | undefined {
  let subtotal = 0;

  for (const item of items) {
    const pricedItem = priceCartItem(item, products);
    if (!pricedItem) return undefined;
    subtotal += pricedItem.lineTotal;
  }

  return subtotal;
}
