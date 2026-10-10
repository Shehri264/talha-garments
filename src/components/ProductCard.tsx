import { useState } from "react";
import Button from "./Button";
import { PRODUCT_CATEGORIES } from "../data/productCategories";
import type { Product } from "../types/product";

export interface ProductCardProps {
  product: Product;
  className?: string;
  onSelectProduct?: (product: Product) => void;
}

const priceFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const formatPrice = (price: number): string => `Rs. ${priceFormatter.format(price)}`;

export function ProductCard({ product, className, onSelectProduct }: ProductCardProps) {
  const primaryImageUrl = product.imageUrls[0];
  const imageKey = `${product.id}:${primaryImageUrl ?? ""}`;
  const [failedImageKey, setFailedImageKey] = useState<string | null>(null);
  const showFallback = !primaryImageUrl || failedImageKey === imageKey;
  const imageUrl = showFallback ? product.fallbackImageUrl : primaryImageUrl;
  const imageAlt = showFallback
    ? product.fallbackImageAlt
    : product.imageAltTexts[0] || product.name;
  const salePrice = product.salePrice;
  const categoryName =
    PRODUCT_CATEGORIES.find(({ id }) => id === product.categoryId)?.name ?? product.categoryId;
  const ratingText = product.rating.toFixed(1);
  const stockStatus = product.variants.some(({ stock }) => stock > 0) ? "In Stock" : "Out of Stock";
  const cardClassName = [
    "group flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-lg transition-shadow duration-200 hover:shadow-xl",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className="aspect-[4/5] overflow-hidden bg-[var(--color-background)]">
        <img
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (!showFallback) setFailedImageKey(imageKey);
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3
          className="break-words font-editorial text-xl font-medium leading-tight"
          style={{ fontSize: "var(--type-xl)" }}
        >
          {product.name}
        </h3>

        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-secondary)]">
          <span>{categoryName}</span>
          <span role="img" aria-label={`Rating: ${ratingText} out of 5`}>
            <span aria-hidden="true" className="text-[var(--color-accent)]">★</span> {ratingText}
          </span>
          <span>{stockStatus}</span>
        </div>

        <div className="mt-auto flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 pt-3">
          {salePrice !== undefined ? (
            <>
              <span className="min-w-0 max-w-full break-words font-semibold text-[var(--color-accent)]">
                {formatPrice(salePrice)}
              </span>
              <del className="min-w-0 max-w-full break-words text-sm text-[var(--color-text-secondary)]">
                {formatPrice(product.price)}
              </del>
            </>
          ) : (
            <span className="min-w-0 max-w-full break-words font-semibold">{formatPrice(product.price)}</span>
          )}
        </div>
        {onSelectProduct && (
          <Button
            className="mt-4 w-full"
            variant="secondary"
            type="button"
            aria-label={`Choose size and colour for ${product.name}`}
            onClick={() => onSelectProduct(product)}
          >
            Choose size &amp; colour
          </Button>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
