import { PRODUCT_CATEGORIES } from "../data/productCategories";

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]["id"];

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  imageUrls: string[];
  /** Alternative text paired by index with imageUrls. */
  imageAltTexts: string[];
  /** Image consumers can show when no gallery image is available. */
  fallbackImageUrl: string;
  /** Alternative text for the fallback image. */
  fallbackImageAlt: string;
  rating: number;
  reviewCount: number;
  status: ProductStatus;
  categoryId: ProductCategoryId;
  sizes: ProductSize[];
  colours: string[];
  brand: string;
  material: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  colour: string;
  size: ProductSize;
  sku: string;
  stock: number;
}
