import { useState } from "react";
import Button from "./Button";
import { useCart } from "../context/CartContext";

export interface HeaderProps {
  brandName?: string;
}

export default function Header({ brandName = "Talha Garments" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="tg-header">
      <div className="tg-header__inner page-container">
        <p className="tg-header__brand">{brandName}</p>
        <nav
          id="tg-mobile-navigation"
          className={`tg-header__navigation${isMenuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          <a className="tg-header__link" href="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </a>
          <a className="tg-header__link" href="/shop" onClick={() => setIsMenuOpen(false)}>
            Shop
          </a>
          <a className="tg-header__link" href="/collections" onClick={() => setIsMenuOpen(false)}>
            Collections
          </a>
          <a className="tg-header__link" href="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </a>
        </nav>
        <div className="tg-header__actions">
          <Button
            className="tg-header__menu"
            variant="secondary"
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="tg-mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg
              aria-hidden="true"
              className="tg-header__menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              focusable="false"
            >
              {isMenuOpen ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </Button>
          <Button
            className="tg-header__search"
            variant="secondary"
            type="button"
            aria-label="Search"
          >
            <svg
              aria-hidden="true"
              className="tg-header__search-icon"
              viewBox="0 0 24 24"
              fill="none"
              focusable="false"
            >
              <circle cx="10.75" cy="10.75" r="6.75" />
              <path d="m15.75 15.75 4.25 4.25" />
            </svg>
          </Button>
          <a
            className="tg-button tg-button--secondary tg-header__account"
            href="/account"
            aria-label="Account"
          >
            <svg
              aria-hidden="true"
              className="tg-header__account-icon"
              viewBox="0 0 24 24"
              fill="none"
              focusable="false"
            >
              <circle cx="12" cy="8" r="3.25" />
              <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
            </svg>
          </a>
          <a
            className="tg-button tg-button--secondary tg-header__cart relative"
            href="/cart"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          >
            <svg
              aria-hidden="true"
              className="tg-header__cart-icon"
              viewBox="0 0 24 24"
              fill="none"
              focusable="false"
            >
              <path d="M6 8h12l1 12H5L6 8Z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            <span
              className="pointer-events-none absolute -right-1 -top-1 z-10 flex min-h-5 min-w-5 items-center justify-center rounded-full border border-[var(--color-background)] bg-[var(--color-accent)] px-1 text-[10px] font-semibold leading-none text-[var(--color-background)] tabular-nums"
              aria-hidden="true"
            >
              {cartCount}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
