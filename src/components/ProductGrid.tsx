import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

export interface ProductGridProps {
  products: Product[];
  className?: string;
  layout?: "editorial" | "balanced";
}

export function ProductGrid({ products, className, layout = "editorial" }: ProductGridProps) {
  const isBalanced = layout === "balanced";
  const gridClassName = [
    isBalanced
      ? "m-0 grid list-none grid-cols-1 gap-[var(--layout-grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      : "m-0 grid list-none grid-cols-1 gap-[var(--layout-grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-12",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ul className={gridClassName}>
      {products.map((product, index) => {
        const isEditorialFeature = index % 6 === 0 || index % 6 === 5;
        const desktopSpanClass = isBalanced
          ? ""
          : isEditorialFeature
            ? "lg:col-span-6"
            : "lg:col-span-3";
        const cardAlignmentClass = isBalanced ? "self-stretch" : "self-start";

        return (
          <li key={product.id} className={`min-w-0 ${cardAlignmentClass} ${desktopSpanClass}`}>
            <ProductCard product={product} />
          </li>
        );
      })}
    </ul>
  );
}

export default ProductGrid;
