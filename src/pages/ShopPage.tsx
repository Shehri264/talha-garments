import { useState } from "react";
import ProductGrid from "../components/ProductGrid";
import { DEMO_PRODUCTS } from "../data/demoProducts";
import { PRODUCT_CATEGORIES } from "../data/productCategories";
import type { Product, ProductSize } from "../types/product";

const normalizeSearchText = (value: string): string =>
  value.trim().replace(/\s+/g, " ").toLowerCase();

const parsePriceInput = (value: string): number | null => {
  if (value.trim() === "") return null;

  const parsedPrice = Number(value);
  return Number.isFinite(parsedPrice) && Number.isInteger(parsedPrice) && parsedPrice >= 0
    ? parsedPrice
    : Number.NaN;
};

type ProductSortOption = "featured" | "price-low-to-high" | "price-high-to-low" | "newest";

// Demo products currently have no sale prices, so filtering and sorting fall back to regular prices.
const getEffectivePrice = (product: Product): number => product.salePrice ?? product.price;

const CATEGORIES_WITH_PRODUCTS = PRODUCT_CATEGORIES.filter(({ id }) =>
  DEMO_PRODUCTS.some((product) => product.categoryId === id),
);

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedSize, setSelectedSize] = useState<ProductSize | "">("");
  const [selectedColour, setSelectedColour] = useState("");
  const [minimumPriceInput, setMinimumPriceInput] = useState("");
  const [maximumPriceInput, setMaximumPriceInput] = useState("");
  const [sortOption, setSortOption] = useState<ProductSortOption>("featured");
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategoryId !== "all" ||
    selectedSize !== "" ||
    selectedColour !== "" ||
    minimumPriceInput !== "" ||
    maximumPriceInput !== "" ||
    sortOption !== "featured";
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("all");
    setSelectedSize("");
    setSelectedColour("");
    setMinimumPriceInput("");
    setMaximumPriceInput("");
    setSortOption("featured");
  };
  const normalizedQuery = normalizeSearchText(searchQuery);
  const minimumPrice = parsePriceInput(minimumPriceInput);
  const maximumPrice = parsePriceInput(maximumPriceInput);
  const minimumPriceInvalid = minimumPrice !== null && !Number.isFinite(minimumPrice);
  const maximumPriceInvalid = maximumPrice !== null && !Number.isFinite(maximumPrice);
  const priceOrderInvalid =
    !minimumPriceInvalid &&
    !maximumPriceInvalid &&
    minimumPrice !== null &&
    maximumPrice !== null &&
    minimumPrice > maximumPrice;
  const priceRangeError = minimumPriceInvalid
    ? "Minimum price must be a non-negative whole number in Rs."
    : maximumPriceInvalid
      ? "Maximum price must be a non-negative whole number in Rs."
      : priceOrderInvalid
        ? "Minimum price cannot exceed maximum price."
        : "";
  const productsMatchingSearchAndCategory = DEMO_PRODUCTS.filter((product) => {
    if (selectedCategoryId !== "all" && product.categoryId !== selectedCategoryId) {
      return false;
    }
    if (!normalizedQuery) return true;

    const categoryName =
      PRODUCT_CATEGORIES.find(({ id }) => id === product.categoryId)?.name ?? product.categoryId;
    const searchValues = [
      product.name,
      categoryName,
      product.categoryId,
      product.brand,
      ...product.variants.map(({ sku }) => sku),
    ];

    return searchValues.some((value) => normalizeSearchText(value).includes(normalizedQuery));
  });
  const productsMatchingSearchCategoryAndPrice = priceRangeError
    ? []
    : productsMatchingSearchAndCategory.filter((product) => {
        const effectivePrice = getEffectivePrice(product);
        return (
          (minimumPrice === null || effectivePrice >= minimumPrice) &&
          (maximumPrice === null || effectivePrice <= maximumPrice)
        );
      });
  const availableSizes = Array.from(
    new Set(
      productsMatchingSearchCategoryAndPrice.flatMap((product) =>
        product.variants
          .filter((variant) => !selectedColour || variant.colour === selectedColour)
          .map((variant) => variant.size),
      ),
    ),
  );
  if (selectedSize && !availableSizes.includes(selectedSize)) availableSizes.unshift(selectedSize);

  const availableColours = Array.from(
    new Set(
      productsMatchingSearchCategoryAndPrice.flatMap((product) =>
        product.variants
          .filter((variant) => !selectedSize || variant.size === selectedSize)
          .map((variant) => variant.colour),
      ),
    ),
  );
  if (selectedColour && !availableColours.includes(selectedColour)) {
    availableColours.unshift(selectedColour);
  }

  const matchingProducts = productsMatchingSearchCategoryAndPrice.filter((product) =>
    product.variants.some(
      (variant) =>
        (!selectedSize || variant.size === selectedSize) &&
        (!selectedColour || variant.colour === selectedColour),
    ),
  );
  const sortedProducts = [...matchingProducts];

  switch (sortOption) {
    case "price-low-to-high":
      sortedProducts.sort((first, second) => getEffectivePrice(first) - getEffectivePrice(second));
      break;
    case "price-high-to-low":
      sortedProducts.sort((first, second) => getEffectivePrice(second) - getEffectivePrice(first));
      break;
    case "newest":
      // No product dates are stored, so Newest uses reverse existing catalogue order.
      sortedProducts.reverse();
      break;
    case "featured":
    default:
      // Featured preserves the existing DEMO_PRODUCTS order.
      break;
  }

  return (
    <section className="layout-section bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="page-container">
        <header className="mb-8 max-w-3xl border-b border-[var(--color-border-subtle)] pb-6 sm:mb-12 sm:pb-10">
          <p className="type-label mb-4">DEMO CATALOGUE</p>
          <h1 className="type-display max-w-[12ch]">SHOP THE COLLECTION</h1>
          <p className="type-body mt-4 max-w-2xl text-[var(--color-text-secondary)]">
            Explore the Talha Garments selection of refined men's fashion.
          </p>
        </header>

        <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-end sm:gap-4">
            <div className="min-w-0">
              <label className="type-label" htmlFor="shop-product-search">
                Search products
              </label>
              <input
                id="shop-product-search"
                className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                type="search"
                value={searchQuery}
                placeholder="Name, brand, category, SKU"
                autoComplete="off"
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
              />
            </div>
            <div className="min-w-0">
              <label className="type-label" htmlFor="shop-product-category">
                Category
              </label>
              <select
                id="shop-product-category"
                className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                value={selectedCategoryId}
                onChange={(event) => setSelectedCategoryId(event.currentTarget.value)}
              >
                <option value="all">All Categories</option>
                {CATEGORIES_WITH_PRODUCTS.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div className="min-w-0">
              <label className="type-label" htmlFor="shop-product-size">
                Size
              </label>
              <select
                id="shop-product-size"
                className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                value={selectedSize}
                onChange={(event) =>
                  setSelectedSize(event.currentTarget.value as ProductSize | "")
                }
              >
                <option value="">All Sizes</option>
                {availableSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="type-label" htmlFor="shop-product-colour">
                Colour
              </label>
              <select
                id="shop-product-colour"
                className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                value={selectedColour}
                onChange={(event) => setSelectedColour(event.currentTarget.value)}
              >
                <option value="">All Colours</option>
                {availableColours.map((colour) => (
                  <option key={colour} value={colour}>
                    {colour}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 min-w-0 lg:col-span-1">
              <label className="type-label" htmlFor="shop-product-sort">
                Sort by
              </label>
              <select
                id="shop-product-sort"
                className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                value={sortOption}
                onChange={(event) => setSortOption(event.currentTarget.value as ProductSortOption)}
              >
                <option value="featured">Featured</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <fieldset className="col-span-2 grid min-w-0 grid-cols-2 gap-3 border-0 p-0 lg:col-span-1">
              <legend className="type-label col-span-2">Price range (Rs.)</legend>
              <div className="min-w-0">
                <label className="type-label" htmlFor="shop-min-price">
                  Minimum
                </label>
                <input
                  id="shop-min-price"
                  className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  type="number"
                  min={0}
                  max={maximumPrice !== null && Number.isFinite(maximumPrice) ? maximumPrice : undefined}
                  step={1}
                  inputMode="numeric"
                  value={minimumPriceInput}
                  aria-invalid={minimumPriceInvalid || priceOrderInvalid}
                  aria-describedby={minimumPriceInvalid || priceOrderInvalid ? "shop-price-error" : undefined}
                  onChange={(event) => setMinimumPriceInput(event.currentTarget.value)}
                />
              </div>
              <div className="min-w-0">
                <label className="type-label" htmlFor="shop-max-price">
                  Maximum
                </label>
                <input
                  id="shop-max-price"
                  className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  type="number"
                  min={minimumPrice !== null && Number.isFinite(minimumPrice) ? minimumPrice : 0}
                  step={1}
                  inputMode="numeric"
                  value={maximumPriceInput}
                  aria-invalid={maximumPriceInvalid || priceOrderInvalid}
                  aria-describedby={maximumPriceInvalid || priceOrderInvalid ? "shop-price-error" : undefined}
                  onChange={(event) => setMaximumPriceInput(event.currentTarget.value)}
                />
              </div>
            </fieldset>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              Featured keeps catalogue order; Newest reverses it because creation dates are unavailable. Demo products have no sale prices yet, so price filters and sorting use regular prices.
            </p>
            <button
              type="button"
              className="min-h-11 shrink-0 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </button>
          </div>
          {priceRangeError && (
            <p
              id="shop-price-error"
              className="text-sm text-[var(--color-accent)]"
              role="alert"
            >
              {priceRangeError}
            </p>
          )}
        </div>

        {!priceRangeError &&
          (matchingProducts.length > 0 ? (
            <ProductGrid products={sortedProducts} layout="balanced" />
          ) : (
            <p
              className="border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 text-[var(--color-text-secondary)]"
              role="status"
            >
              No products match{normalizedQuery ? ` “${normalizedQuery}”` : ""} with the current filters. Try changing your search or selecting All Categories, All Sizes, and All Colours.
            </p>
          ))}
      </div>
    </section>
  );
}
