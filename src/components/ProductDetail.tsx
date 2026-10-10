import { useId, useState } from "react";
import Button from "./Button";
import { useCart } from "../context/CartContext";
import { getCartItemQuantity } from "../utils/cart";
import type { Product, ProductSize } from "../types/product";

export interface ProductDetailProps {
  product: Product;
  className?: string;
}

type VariantSelection = {
  productId: string;
  colour: string;
  size: ProductSize | "";
};

const priceFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const formatPrice = (price: number): string => `Rs. ${priceFormatter.format(price)}`;

export function ProductDetail({ product, className }: ProductDetailProps) {
  const { items, addItem } = useCart();
  const [cartFeedback, setCartFeedback] = useState<{
    productId: string;
    message: string;
    kind: "success" | "error";
  } | null>(null);
  const visibleCartFeedback = cartFeedback?.productId === product.id ? cartFeedback : null;
  const [selection, setSelection] = useState(() => ({ productId: product.id, index: 0 }));
  const selectedImageIndex =
    selection.productId === product.id && selection.index < product.imageUrls.length
      ? selection.index
      : 0;
  const selectedImageUrl = product.imageUrls[selectedImageIndex];
  const selectedImageKey = `${product.id}:${selectedImageIndex}:${selectedImageUrl ?? ""}`;
  const [failedImageKey, setFailedImageKey] = useState<string | null>(null);
  const showFallback = !selectedImageUrl || failedImageKey === selectedImageKey;
  const imageUrl = showFallback ? product.fallbackImageUrl : selectedImageUrl;
  const imageAlt = showFallback
    ? product.fallbackImageAlt
    : product.imageAltTexts[selectedImageIndex] || product.name;
  const [variantSelection, setVariantSelection] = useState<VariantSelection>(() => ({
    productId: product.id,
    colour: "",
    size: "",
  }));
  const currentVariantSelection: VariantSelection =
    variantSelection.productId === product.id
      ? variantSelection
      : { productId: product.id, colour: "", size: "" };
  const variantColours = Array.from(new Set(product.variants.map(({ colour }) => colour)));
  const variantSizes = Array.from(new Set(product.variants.map(({ size }) => size)));
  const selectedColour = variantColours.includes(currentVariantSelection.colour)
    ? currentVariantSelection.colour
    : "";
  const selectedSize = variantSizes.find((size) => size === currentVariantSelection.size) ?? "";
  const selectionId = useId();
  const colourFieldId = `${selectionId}-colour`;
  const sizeFieldId = `${selectionId}-size`;
  const selectionStatusId = `${selectionId}-selection-status`;
  const stockStatusId = `${selectionId}-stock`;
  const matchingVariants = product.variants.filter(
    (variant) =>
      (!selectedColour || variant.colour === selectedColour) &&
      (!selectedSize || variant.size === selectedSize),
  );
  const hasAvailableStock = matchingVariants.some(({ stock }) => stock > 0);
  const selectedVariant =
    selectedColour && selectedSize
      ? matchingVariants.find(
          (variant) => variant.colour === selectedColour && variant.size === selectedSize,
        )
      : undefined;
  const selectedCartQuantity = selectedVariant
    ? getCartItemQuantity(items, {
        productId: product.id,
        size: selectedVariant.size,
        colour: selectedVariant.colour,
      })
    : 0;
  const remainingDemoStock = selectedVariant
    ? Math.max(0, selectedVariant.stock - selectedCartQuantity)
    : 0;
  const canAddToCart = Boolean(selectedVariant && remainingDemoStock > 0);
  const stockStatus = selectedVariant
    ? selectedVariant.stock < 1
      ? "Out of demo stock."
      : remainingDemoStock < 1
        ? `Maximum demo stock (${selectedVariant.stock}) is already in your cart.`
        : `${remainingDemoStock} available in demo stock.`
    : selectedColour && selectedSize
      ? "Unavailable combination in demo stock."
      : selectedColour || selectedSize
        ? matchingVariants.length === 0
          ? "Unavailable in demo stock."
          : hasAvailableStock
            ? "Demo stock available for this selection."
            : "Out of demo stock for this selection."
        : hasAvailableStock
          ? "Demo stock available."
          : "No demo stock available.";
  const selectionStatus =
    product.variants.length === 0
      ? "No size and colour variants are available for this product."
      : selectedColour && selectedSize
        ? `Selected: ${selectedColour} / ${selectedSize}`
        : selectedColour
          ? `Selected colour: ${selectedColour}. Choose a size to continue.`
          : selectedSize
            ? `Selected size: ${selectedSize}. Choose a colour to continue.`
            : "Select a colour and size to add this item to your cart.";
  const getColourOptionState = (colour: string) => {
    const compatibleVariants = product.variants.filter(
      (variant) =>
        variant.colour === colour && (!selectedSize || variant.size === selectedSize),
    );
    const isAvailable = compatibleVariants.some(({ stock }) => stock > 0);
    const unavailableLabel = isAvailable
      ? ""
      : compatibleVariants.length === 0 && selectedSize
        ? ` — Unavailable with size ${selectedSize}`
        : compatibleVariants.length === 0
          ? " — Unavailable"
          : selectedSize
            ? ` — Out of demo stock in size ${selectedSize}`
            : " — Out of demo stock";

    return { isAvailable, label: `${colour}${unavailableLabel}` };
  };
  const getSizeOptionState = (size: ProductSize) => {
    const compatibleVariants = product.variants.filter(
      (variant) =>
        variant.size === size && (!selectedColour || variant.colour === selectedColour),
    );
    const isAvailable = compatibleVariants.some(({ stock }) => stock > 0);
    const unavailableLabel = isAvailable
      ? ""
      : compatibleVariants.length === 0 && selectedColour
        ? ` — Unavailable with colour ${selectedColour}`
        : compatibleVariants.length === 0
          ? " — Unavailable"
          : selectedColour
            ? ` — Out of demo stock for ${selectedColour}`
            : " — Out of demo stock";

    return { isAvailable, label: `${size}${unavailableLabel}` };
  };
  const handleAddToCart = () => {
    if (!selectedVariant || remainingDemoStock < 1) return;

    const result = addItem({
      productId: product.id,
      size: selectedVariant.size,
      colour: selectedVariant.colour,
      quantity: 1,
    });
    if (result.success) {
      setCartFeedback({
        productId: product.id,
        kind: "success",
        message: `Added ${product.name} (${selectedVariant.colour}, size ${selectedVariant.size}) to your cart.`,
      });
      return;
    }

    const message =
      result.reason === "insufficient-stock"
        ? `Only ${Math.max(0, result.availableStock - result.currentQuantity)} more can be added in demo stock.`
        : result.reason === "unavailable-variant"
          ? "This size and colour are unavailable in demo stock."
          : "The selected quantity could not be added.";
    setCartFeedback({ productId: product.id, kind: "error", message });
  };
  const salePrice = product.salePrice;
  const detailClassName = ["flex w-full flex-col gap-3", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={detailClassName}>
      <figure className="m-0 aspect-[4/5] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-background)]">
        <img
          className="h-full w-full object-cover"
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (!showFallback) setFailedImageKey(selectedImageKey);
          }}
        />
      </figure>

      {product.imageUrls.length > 1 && (
        <div
          className="grid grid-cols-4 gap-3"
          role="group"
          aria-label="Additional product images"
        >
          {product.imageUrls.slice(1).map((imageUrl, additionalIndex) => {
            const imageIndex = additionalIndex + 1;
            const isSelected = selectedImageIndex === imageIndex;
            const imageAltText = product.imageAltTexts[imageIndex] || product.name;

            return (
              <button
                key={`${product.id}-image-${imageIndex}`}
                className={`aspect-square min-w-0 overflow-hidden rounded-[var(--radius-sm)] border bg-[var(--color-background)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${
                  isSelected
                    ? "border-[var(--color-accent)]"
                    : "border-[var(--color-border-subtle)]"
                }`}
                type="button"
                aria-label={`Show image ${imageIndex + 1}: ${imageAltText}`}
                aria-pressed={isSelected}
                onClick={() => setSelection({ productId: product.id, index: imageIndex })}
              >
                <img
                  className="h-full w-full object-cover"
                  src={imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      )}

      <section className="flex flex-col gap-3 pt-2">
        <h2>{product.name}</h2>

        <div className="flex items-baseline gap-2">
          {salePrice !== undefined ? (
            <>
              <span className="font-semibold text-[var(--color-accent)]">
                {formatPrice(salePrice)}
              </span>
              <del className="text-sm text-[var(--color-text-secondary)]">
                {formatPrice(product.price)}
              </del>
            </>
          ) : (
            <span className="font-semibold">{formatPrice(product.price)}</span>
          )}
        </div>

        <p className="type-body text-[var(--color-text-secondary)]">{product.description}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-medium text-[var(--color-text-primary)]">Material: </span>
          {product.material}
        </p>
        <div className="flex flex-col gap-3 text-sm text-[var(--color-text-secondary)]">
          <p>
            <span className="font-medium text-[var(--color-text-primary)]">Brand: </span>
            {product.brand}
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-[var(--color-text-primary)]" htmlFor={colourFieldId}>
              Colour
            </label>
            <select
              id={colourFieldId}
              className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
              value={selectedColour}
              aria-required="true"
              aria-describedby={`${selectionStatusId} ${stockStatusId}`}
              onChange={(event) => {
                setVariantSelection({
                  productId: product.id,
                  colour: event.currentTarget.value,
                  size: selectedSize,
                });
                setCartFeedback(null);
              }}
            >
              <option value="">Select a colour</option>
              {variantColours.map((colour) => {
                const optionState = getColourOptionState(colour);

                return (
                  <option
                    key={colour}
                    value={colour}
                    disabled={!optionState.isAvailable}
                  >
                    {optionState.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-[var(--color-text-primary)]" htmlFor={sizeFieldId}>
              Size
            </label>
            <select
              id={sizeFieldId}
              className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
              value={selectedSize}
              aria-required="true"
              aria-describedby={`${selectionStatusId} ${stockStatusId}`}
              onChange={(event) => {
                setVariantSelection({
                  productId: product.id,
                  colour: selectedColour,
                  size: event.currentTarget.value as ProductSize | "",
                });
                setCartFeedback(null);
              }}
            >
              <option value="">Select a size</option>
              {variantSizes.map((size) => {
                const optionState = getSizeOptionState(size);

                return (
                  <option key={size} value={size} disabled={!optionState.isAvailable}>
                    {optionState.label}
                  </option>
                );
              })}
            </select>
          </div>
          <p id={selectionStatusId} className="text-[var(--color-text-primary)]" aria-live="polite">
            {selectionStatus}
          </p>
          <p id={stockStatusId} aria-live="polite">
            <span className="font-medium text-[var(--color-text-primary)]">Stock status: </span>
            {stockStatus}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Demo stock is for validation only; adding an item does not reserve inventory.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          type="button"
          disabled={!canAddToCart}
          aria-describedby={`${selectionStatusId} ${stockStatusId}`}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        {visibleCartFeedback && (
          <p
            className={`rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm ${
              visibleCartFeedback.kind === "error"
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-accent)]"
            }`}
            role={visibleCartFeedback.kind === "error" ? "alert" : "status"}
            aria-live={visibleCartFeedback.kind === "error" ? "assertive" : "polite"}
          >
            {visibleCartFeedback.message}
          </p>
        )}
      </section>
    </div>
  );
}

export default ProductDetail;
