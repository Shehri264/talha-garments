import { formatPkrPrice } from "../data/demoProducts";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../types/cart";
import { calculateCartSubtotal, findCartProduct, priceCartItem } from "../utils/cart";

function CheckoutLineItem({ item }: { item: CartItem }) {
  const product = findCartProduct(item.productId);
  const pricedItem = priceCartItem(item);

  return (
    <li className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] py-5">
      <div className="min-w-0">
        <h3 className="break-words font-editorial text-lg font-medium">
          {product?.name ?? "Product unavailable"}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Size {item.size} · {item.colour} · Quantity {item.quantity}
        </p>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Unit price: {pricedItem ? formatPkrPrice(pricedItem.unitPrice) : "Unavailable"}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <span className="type-label block">Line total</span>
        <span className="mt-1 inline-block font-semibold text-[var(--color-accent)]">
          {pricedItem ? formatPkrPrice(pricedItem.lineTotal) : "Unavailable"}
        </span>
      </div>
    </li>
  );
}

export default function CheckoutPage() {
  const { items } = useCart();
  const subtotal = calculateCartSubtotal(items);

  return (
    <section className="layout-section bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="page-container">
        <header className="mb-10 max-w-3xl border-b border-[var(--color-border-subtle)] pb-8 sm:mb-12 sm:pb-10">
          <p className="type-label mb-4">ORDER REVIEW</p>
          <h1 className="type-display max-w-[12ch]">CHECKOUT</h1>
          <p className="type-body mt-4 max-w-2xl text-[var(--color-text-secondary)]">
            Review the items in your cart. This demo checkout is available without signing in.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-12 text-center sm:px-10 sm:py-16">
            <p className="type-label mb-4">NOTHING TO REVIEW</p>
            <h2 className="type-section">Your cart is empty.</h2>
            <p className="type-body mx-auto mt-4 max-w-xl text-[var(--color-text-secondary)]">
              Add a piece from the collection before continuing to checkout.
            </p>
            <a className="tg-button tg-button--primary mt-7" href="/shop">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <section
              className="border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-5 sm:px-7"
              aria-labelledby="checkout-items-heading"
            >
              <h2 id="checkout-items-heading" className="type-section py-5">
                Your Items
              </h2>
              <ul className="m-0 list-none p-0">
                {items.map((item) => (
                  <CheckoutLineItem
                    key={`${item.productId}-${item.size}-${item.colour}`}
                    item={item}
                  />
                ))}
              </ul>
            </section>

            <aside className="h-fit border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 sm:p-6">
              <h2 className="font-editorial text-xl font-medium" style={{ fontSize: "var(--type-xl)" }}>
                Order Summary
              </h2>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--color-border-subtle)] pt-4">
                <span className="type-label">Subtotal</span>
                <span className="text-lg font-semibold text-[var(--color-accent)]">
                  {subtotal === undefined ? "Unavailable" : formatPkrPrice(subtotal)}
                </span>
              </div>
              {subtotal === undefined && (
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]" role="status">
                  An item is no longer available in the catalogue, so the subtotal cannot be calculated.
                </p>
              )}
              <p className="mt-5 border-l-2 border-[var(--color-accent)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                This page is a checkout preview only. No order is submitted and no payment is processed.
              </p>
              <a className="tg-button tg-button--secondary mt-6 w-full" href="/cart">
                Back to Cart
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
