import { useState } from "react";
import { formatPkrPrice } from "../data/demoProducts";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../types/cart";
import {
  calculateCartSubtotal,
  findCartProduct,
  getCartItemStock,
  priceCartItem,
} from "../utils/cart";
import type { CartMutationResult } from "../utils/cart";

interface CartLineItemProps {
  item: CartItem;
  onQuantityChange: (item: CartItem, quantity: number) => CartMutationResult;
  onRemove: (item: CartItem) => void;
}

function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  const product = findCartProduct(item.productId);
  const pricedItem = priceCartItem(item);
  const availableStock = getCartItemStock(item) ?? 0;
  const [imageFailed, setImageFailed] = useState(false);
  const [quantityFeedback, setQuantityFeedback] = useState("");
  const stockMessage =
    availableStock < 1
      ? "Out of stock in the demo inventory for this variant. Remove this item from your cart."
      : item.quantity > availableStock
        ? `Insufficient demo stock: only ${availableStock} are available. Reduce the quantity or remove this item.`
        : item.quantity === availableStock
          ? `Insufficient demo stock to increase this quantity. Maximum available: ${availableStock}.`
          : "";
  const handleQuantityChange = (quantity: number) => {
    const result = onQuantityChange(item, quantity);
    if (result.success) {
      setQuantityFeedback("");
    } else if (result.reason === "insufficient-stock") {
      setQuantityFeedback(
        `Insufficient demo stock: only ${result.availableStock} are available; ${result.currentQuantity} are already in your cart.`,
      );
    } else if (result.reason === "unavailable-variant") {
      setQuantityFeedback("This variant is unavailable in demo stock.");
    } else if (result.reason === "invalid-quantity") {
      setQuantityFeedback("Quantity must be at least one.");
    }
  };

  if (!product || !pricedItem) {
    return (
      <li className="border-b border-[var(--color-border-subtle)] py-5">
        <p className="font-medium text-[var(--color-text-primary)]">Product unavailable</p>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {item.productId} · {item.colour} · Size {item.size} · Quantity {item.quantity}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button
            className="min-h-11 px-3 text-sm text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled={item.quantity <= 1}
            aria-label={`Decrease quantity for ${item.productId}`}
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            −
          </button>
          <button
            className="min-h-11 px-3 text-sm text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled
            aria-label={`Increase quantity for ${item.productId}`}
          >
            +
          </button>
          <button
            className="min-h-11 text-sm text-[var(--color-text-secondary)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            type="button"
            onClick={() => onRemove(item)}
          >
            Remove
          </button>
        </div>
        {(quantityFeedback || stockMessage) && (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]" role="status">
            {quantityFeedback || stockMessage}
          </p>
        )}
      </li>
    );
  }

  const primaryImageUrl = product.imageUrls[0];
  const useFallbackImage = !primaryImageUrl || imageFailed;
  const imageUrl = useFallbackImage ? product.fallbackImageUrl : primaryImageUrl;
  const imageAlt = useFallbackImage
    ? product.fallbackImageAlt
    : product.imageAltTexts[0] || product.name;

  return (
    <li className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-4 border-b border-[var(--color-border-subtle)] py-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-6">
      <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-background)]">
        <img
          className="h-full w-full object-cover"
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      </div>

      <div className="min-w-0 self-center">
        <h2
          className="break-words font-editorial text-xl font-medium leading-tight"
          style={{ fontSize: "var(--type-xl)" }}
        >
          {product.name}
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
          <div className="min-w-0">
            <dt className="type-label">Size</dt>
            <dd className="mt-1 break-words text-[var(--color-text-primary)]">{item.size}</dd>
          </div>
          <div className="min-w-0">
            <dt className="type-label">Colour</dt>
            <dd className="mt-1 break-words text-[var(--color-text-primary)]">{item.colour}</dd>
          </div>
          <div className="min-w-0">
            <dt className="type-label">Unit price</dt>
            <dd className="mt-1 break-words text-[var(--color-text-primary)]">
              {formatPkrPrice(pricedItem.unitPrice)}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex min-w-0 flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div>
            <span className="type-label block">Quantity</span>
            <div
              className="mt-1 inline-flex overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)]"
              role="group"
              aria-label={`Quantity for ${product.name}, ${item.colour}, size ${item.size}`}
            >
              <button
                className="flex min-h-11 min-w-11 items-center justify-center border-r border-[var(--color-border)] bg-[var(--color-surface)] text-xl text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
                aria-label={`Decrease quantity of ${product.name}, ${item.colour}, size ${item.size}`}
                disabled={item.quantity <= 1}
                onClick={() => handleQuantityChange(item.quantity - 1)}
              >
                <span aria-hidden="true">−</span>
              </button>
              <output
                className="flex min-h-11 min-w-11 items-center justify-center border-r border-[var(--color-border)] px-2 text-sm tabular-nums text-[var(--color-text-primary)]"
                aria-live="polite"
                aria-atomic="true"
              >
                {item.quantity}
              </output>
              <button
                className="flex min-h-11 min-w-11 items-center justify-center bg-[var(--color-surface)] text-xl text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
                aria-label={`Increase quantity of ${product.name}, ${item.colour}, size ${item.size}`}
                disabled={availableStock < 1 || item.quantity >= availableStock}
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>
          <button
            className="min-h-11 text-sm font-medium tracking-normal text-[var(--color-text-secondary)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            type="button"
            aria-label={`Remove ${product.name}, ${item.colour}, size ${item.size} from cart`}
            onClick={() => onRemove(item)}
          >
            Remove
          </button>
        </div>
        {(quantityFeedback || stockMessage) && (
          <p
            className="mt-2 text-sm text-[var(--color-text-secondary)]"
            role={quantityFeedback ? "alert" : "status"}
            aria-live={quantityFeedback ? "assertive" : "polite"}
          >
            {quantityFeedback || stockMessage}
          </p>
        )}
      </div>

      <div className="col-span-2 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-3 sm:col-span-1 sm:min-w-32 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <span className="type-label">Line total</span>
        <span className="text-lg font-semibold text-[var(--color-accent)]">
          {formatPkrPrice(pricedItem.lineTotal)}
        </span>
      </div>
    </li>
  );
}

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = calculateCartSubtotal(items);

  return (
    <section className="layout-section bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="page-container">
        <header className="mb-10 max-w-3xl border-b border-[var(--color-border-subtle)] pb-8 sm:mb-12 sm:pb-10">
          <p className="type-label mb-4">YOUR SELECTION</p>
          <h1 className="type-display max-w-[12ch]">YOUR CART</h1>
          <p className="type-body mt-4 max-w-2xl text-[var(--color-text-secondary)]">
            Review the pieces selected for your wardrobe.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-12 text-center sm:px-10 sm:py-16">
            <p className="type-label mb-4">NOTHING SELECTED YET</p>
            <h2 className="type-section">Your cart is empty.</h2>
            <p className="type-body mx-auto mt-4 max-w-xl text-[var(--color-text-secondary)]">
              Discover the collection and find a piece that feels like yours.
            </p>
            <a className="tg-button tg-button--primary mt-7" href="/shop">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <ul className="m-0 list-none p-0">
              {items.map((item) => (
                <CartLineItem
                  key={`${item.productId}-${item.size}-${item.colour}`}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            <aside className="h-fit border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 sm:p-6">
              <h2 className="font-editorial text-xl font-medium" style={{ fontSize: "var(--type-xl)" }}>
                Cart Summary
              </h2>
              <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                Stock checks use demo catalogue values only; adding items does not reserve stock.
              </p>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--color-border-subtle)] pt-4">
                <span className="type-label">Subtotal</span>
                <span className="text-lg font-semibold text-[var(--color-accent)]">
                  {subtotal === undefined ? "Unavailable" : formatPkrPrice(subtotal)}
                </span>
              </div>
              {subtotal === undefined && (
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]" role="status">
                  A cart item is no longer available in the catalogue, so the subtotal cannot be calculated.
                </p>
              )}
              <a className="tg-button tg-button--primary mt-6 w-full" href="/checkout">
                Continue to Checkout
              </a>
              <a className="tg-button tg-button--secondary mt-3 w-full" href="/shop">
                Continue Shopping
              </a>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
