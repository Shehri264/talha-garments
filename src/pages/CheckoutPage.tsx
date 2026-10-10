import { useState, type FormEvent } from "react";
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

const DELIVERY_CITIES = ["Bahawalpur"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;

interface DeliveryDetailsErrors {
  recipientName?: string;
  phone?: string;
  email?: string;
  addressLine?: string;
  area?: string;
  city?: string;
}

function DeliveryDetailsForm() {
  const [errors, setErrors] = useState<DeliveryDetailsErrors>({});
  const [validationMessage, setValidationMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationMessage("");

    const formData = new FormData(event.currentTarget);
    const recipientName = String(formData.get("recipientName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const addressLine = String(formData.get("addressLine") ?? "").trim();
    const area = String(formData.get("area") ?? "").trim();
    const city = String(formData.get("city") ?? "");
    const phoneDigits = phone.replace(/\D/g, "");
    const nextErrors: DeliveryDetailsErrors = {};

    if (!recipientName) nextErrors.recipientName = "Enter the recipient's name.";
    if (!phone) nextErrors.phone = "Enter a phone number.";
    else if (!PHONE_PATTERN.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      nextErrors.phone = "Enter a valid phone number with 7–15 digits.";
    }
    if (!email) nextErrors.email = "Enter your email address.";
    else if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!addressLine) nextErrors.addressLine = "Enter a street or house address.";
    if (!area) nextErrors.area = "Enter your area.";
    if (!city || !DELIVERY_CITIES.includes(city)) {
      nextErrors.city = "Choose an available delivery city.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setValidationMessage(
      "Delivery details passed local validation for this session. They have not been saved and no order has been submitted.",
    );
  };

  return (
    <section
      className="border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 sm:p-7"
      aria-labelledby="delivery-details-heading"
    >
      <p className="type-label mb-3">DELIVERY</p>
      <h2 id="delivery-details-heading" className="type-section">
        Delivery Details
      </h2>
      <p id="delivery-details-note" className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        Fields marked <span className="text-[var(--color-accent)]">*</span> are required. Details are used for local validation only and are not saved.
      </p>
      <form
        className="mt-6 grid gap-5 sm:grid-cols-2"
        noValidate
        onSubmit={handleSubmit}
        onChange={() => setValidationMessage("")}
      >
        <div>
          <label className="type-label" htmlFor="delivery-recipient-name">
            Recipient name <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
          </label>
          <input
            id="delivery-recipient-name"
            className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            type="text"
            name="recipientName"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.recipientName)}
            aria-describedby={`delivery-details-note${errors.recipientName ? " delivery-recipient-name-error" : ""}`}
          />
          {errors.recipientName && (
            <p id="delivery-recipient-name-error" className="mt-2 text-sm text-rose-300" role="alert">
              {errors.recipientName}
            </p>
          )}
        </div>
        <div>
          <label className="type-label" htmlFor="delivery-phone">
            Phone number <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
          </label>
          <input
            id="delivery-phone"
            className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={`delivery-details-note${errors.phone ? " delivery-phone-error" : ""}`}
          />
          {errors.phone && (
            <p id="delivery-phone-error" className="mt-2 text-sm text-rose-300" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="type-label" htmlFor="delivery-email">
            Email <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
          </label>
          <input
            id="delivery-email"
            className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            type="email"
            name="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={`delivery-details-note${errors.email ? " delivery-email-error" : ""}`}
          />
          {errors.email && (
            <p id="delivery-email-error" className="mt-2 text-sm text-rose-300" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="type-label" htmlFor="delivery-address-line">
            Street or house address <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
          </label>
          <input
            id="delivery-address-line"
            className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            type="text"
            name="addressLine"
            autoComplete="street-address"
            required
            aria-invalid={Boolean(errors.addressLine)}
            aria-describedby={`delivery-details-note${errors.addressLine ? " delivery-address-line-error" : ""}`}
          />
          {errors.addressLine && (
            <p id="delivery-address-line-error" className="mt-2 text-sm text-rose-300" role="alert">
              {errors.addressLine}
            </p>
          )}
        </div>
        <div>
          <label className="type-label" htmlFor="delivery-area">
            Area <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
          </label>
          <input
            id="delivery-area"
            className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            type="text"
            name="area"
            autoComplete="address-level3"
            required
            aria-invalid={Boolean(errors.area)}
            aria-describedby={`delivery-details-note${errors.area ? " delivery-area-error" : ""}`}
          />
          {errors.area && (
            <p id="delivery-area-error" className="mt-2 text-sm text-rose-300" role="alert">
              {errors.area}
            </p>
          )}
        </div>
        <div>
          <label className="type-label" htmlFor="delivery-city">
            City <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
          </label>
          <select
            id="delivery-city"
            className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            name="city"
            autoComplete="address-level2"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.city)}
            aria-describedby={`delivery-city-note${errors.city ? " delivery-city-error" : ""}`}
          >
            <option value="">Select a city</option>
            {DELIVERY_CITIES.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
              </option>
            ))}
          </select>
          <p id="delivery-city-note" className="mt-2 text-xs text-[var(--color-text-secondary)]">
            More cities coming soon.
          </p>
          {errors.city && (
            <p id="delivery-city-error" className="mt-2 text-sm text-rose-300" role="alert">
              {errors.city}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="type-label" htmlFor="delivery-instructions">
            Delivery instructions <span className="text-[var(--color-text-secondary)]">(Optional)</span>
          </label>
          <textarea
            id="delivery-instructions"
            className="mt-2 min-h-24 w-full resize-y rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            name="deliveryInstructions"
            rows={3}
            autoComplete="off"
          />
        </div>
        <div className="sm:col-span-2">
          <button className="tg-button tg-button--secondary w-full sm:w-auto" type="submit">
            Check Delivery Details
          </button>
        </div>
        {validationMessage && (
          <p
            className="border border-[var(--color-border)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:col-span-2"
            role="status"
            aria-live="polite"
          >
            {validationMessage}
          </p>
        )}
      </form>
    </section>
  );
}

export default function CheckoutPage() {
  const { items } = useCart();
  const [checkoutPath, setCheckoutPath] = useState<"guest" | "sign-in">("guest");
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

        {items.length > 0 && (
          <section
            className="mb-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 sm:p-7"
            aria-labelledby="checkout-path-heading"
          >
            <p className="type-label mb-3">HOW WOULD YOU LIKE TO CONTINUE?</p>
            <h2 id="checkout-path-heading" className="type-section">
              Choose your checkout path
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group" aria-label="Checkout paths">
              <button
                className={`flex min-h-20 flex-col items-start justify-center gap-1 rounded-[var(--radius-sm)] border px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${
                  checkoutPath === "guest"
                    ? "border-[var(--color-accent)] bg-[var(--color-background)]"
                    : "border-[var(--color-border)] bg-[var(--color-background)]"
                }`}
                type="button"
                aria-pressed={checkoutPath === "guest"}
                onClick={() => setCheckoutPath("guest")}
              >
                <span className="font-medium text-[var(--color-text-primary)]">Continue as Guest</span>
                <span className="text-sm text-[var(--color-text-secondary)]">No account required</span>
              </button>
              <button
                className={`flex min-h-20 flex-col items-start justify-center gap-1 rounded-[var(--radius-sm)] border px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${
                  checkoutPath === "sign-in"
                    ? "border-[var(--color-accent)] bg-[var(--color-background)]"
                    : "border-[var(--color-border)] bg-[var(--color-background)]"
                }`}
                type="button"
                aria-pressed={checkoutPath === "sign-in"}
                onClick={() => setCheckoutPath("sign-in")}
              >
                <span className="font-medium text-[var(--color-text-primary)]">
                  Sign In to Existing Account
                </span>
                <span className="text-sm text-[var(--color-text-secondary)]">Not yet connected</span>
              </button>
            </div>
            {checkoutPath === "guest" ? (
              <p className="mt-4 text-sm text-[var(--color-text-secondary)]" role="status" aria-live="polite">
                Continue without creating an account. Your cart and delivery details stay available below.
              </p>
            ) : (
              <p className="mt-4 text-sm text-[var(--color-text-secondary)]" role="status" aria-live="polite">
                Sign-in is not yet connected; no authentication has been attempted. You can continue as a guest
                without losing your cart or any delivery details entered below.
              </p>
            )}
          </section>
        )}

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
            <div className="grid min-w-0 gap-8">
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
              <DeliveryDetailsForm />
            </div>

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
