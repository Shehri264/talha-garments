import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

export interface ProductRecommendationsProps {
  selectedProduct: Product;
  products: readonly Product[];
  className?: string;
}

const MAX_RECOMMENDATIONS = 4;

export function ProductRecommendations({
  selectedProduct,
  products,
  className,
}: ProductRecommendationsProps) {
  const recommendations = products
    .filter(
      (product) =>
        product.id !== selectedProduct.id && product.categoryId === selectedProduct.categoryId,
    )
    .slice(0, MAX_RECOMMENDATIONS);

  if (recommendations.length === 0) return null;

  const sectionClassName = ["layout-section", className].filter(Boolean).join(" ");

  return (
    <section className={sectionClassName} aria-label="Recommended products">
      <div className="page-container">
        <h2 className="type-section mb-8">Recommended products</h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-[var(--layout-grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProductRecommendations;
