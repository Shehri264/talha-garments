import type { Product, ProductCategoryId, ProductSize, ProductVariant } from "../types/product";

export const formatPkrPrice = (price: number): string =>
  `Rs. ${price.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

const AVAILABLE_SIZES_BY_CATEGORY: Record<ProductCategoryId, ProductSize[]> = {
  "t-shirts": ["XS", "S", "M", "L", "XL", "XXL"],
  "polo-shirts": ["S", "M", "L", "XL", "XXL"],
  "denim-jeans": ["S", "M", "L", "XL", "XXL"],
  pants: ["S", "M", "L", "XL", "XXL"],
  trousers: ["S", "M", "L", "XL", "XXL"],
  "dress-pants": ["S", "M", "L", "XL", "XXL"],
  "dress-shirts": ["S", "M", "L", "XL", "XXL"],
  "sports-shirts": ["XS", "S", "M", "L", "XL", "XXL"],
  jackets: ["S", "M", "L", "XL", "XXL"],
  shorts: ["S", "M", "L", "XL", "XXL"],
  "track-suits": ["S", "M", "L", "XL", "XXL"],
  "denim-jackets": ["S", "M", "L", "XL", "XXL"],
};

const AVAILABLE_COLOURS_BY_CATEGORY: Record<ProductCategoryId, string[]> = {
  "t-shirts": ["Black", "White", "Navy", "Charcoal"],
  "polo-shirts": ["Navy", "Black", "Olive", "White"],
  "denim-jeans": ["Indigo", "Dark Blue", "Black"],
  pants: ["Khaki", "Navy", "Charcoal", "Black"],
  trousers: ["Black", "Charcoal", "Navy"],
  "dress-pants": ["Black", "Charcoal", "Navy"],
  "dress-shirts": ["White", "Light Blue", "Sky Blue"],
  "sports-shirts": ["Black", "Navy", "Charcoal", "Royal Blue"],
  jackets: ["Charcoal", "Black", "Navy", "Olive"],
  shorts: ["Khaki", "Navy", "Black", "Olive"],
  "track-suits": ["Black", "Navy", "Charcoal"],
  "denim-jackets": ["Indigo", "Light Blue", "Black"],
};

// Temporary men's fashion imagery reused across the demo catalogue.
export const PRODUCT_IMAGE_FALLBACK_URL = "/images/mens-fashion-hero.jpg";

const DEMO_IMAGE_URLS_BY_CATEGORY: Record<ProductCategoryId, [string, string]> = {
  "t-shirts": ["/images/collections/t-shirts.jpg", "/images/collections/polo-shirts.jpg"],
  "polo-shirts": ["/images/collections/polo-shirts.jpg", "/images/collections/dress-shirts.jpg"],
  "denim-jeans": ["/images/collections/denim.jpg", "/images/collections/trousers.jpg"],
  pants: ["/images/collections/trousers.jpg", "/images/collections/denim.jpg"],
  trousers: ["/images/collections/trousers.jpg", "/images/collections/dress-shirts.jpg"],
  "dress-pants": ["/images/collections/trousers.jpg", "/images/collections/jackets.jpg"],
  "dress-shirts": ["/images/collections/dress-shirts.jpg", "/images/collections/polo-shirts.jpg"],
  "sports-shirts": ["/images/collections/t-shirts.jpg", "/images/collections/polo-shirts.jpg"],
  jackets: ["/images/collections/jackets.jpg", "/images/collections/denim.jpg"],
  shorts: ["/images/collections/trousers.jpg", "/images/collections/t-shirts.jpg"],
  "track-suits": ["/images/collections/t-shirts.jpg", "/images/collections/trousers.jpg"],
  "denim-jackets": ["/images/collections/jackets.jpg", "/images/collections/denim.jpg"],
};

const createDemoProductImages = (productName: string, imageUrls: string[]) => ({
  imageUrls: [...imageUrls],
  imageAltTexts: imageUrls.map(
    (_, index) => `${productName} — demo product image ${index + 1} of ${imageUrls.length}`,
  ),
  fallbackImageUrl: PRODUCT_IMAGE_FALLBACK_URL,
  fallbackImageAlt: `${productName} — demo product image placeholder`,
});

const normalizeSkuPart = (value: string): string =>
  value.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");

const createDemoVariants = (
  productId: string,
  sizes: ProductSize[],
  colours: string[],
): ProductVariant[] => {
  const productSkuPrefix = normalizeSkuPart(productId);

  return colours.flatMap((colour, colourIndex) =>
    sizes.map((size, sizeIndex) => ({
      colour,
      size,
      sku: `${productSkuPrefix}-${normalizeSkuPart(colour)}-${size}`,
      stock: 5 + ((colourIndex * sizes.length + sizeIndex) % 21),
    })),
  );
};
const EXISTING_DEMO_PRODUCTS: Product[] = [
  {
    // Demo-only placeholders; not a live product listing.
    id: "demo-classic-t-shirt",
    name: "Men's Classic T-Shirt",
    price: 2490,
    description: "A refined everyday tee with an easy, versatile silhouette.",
    ...createDemoProductImages("Men's Classic T-Shirt", DEMO_IMAGE_URLS_BY_CATEGORY["t-shirts"]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId: "t-shirts",
    sizes: [...AVAILABLE_SIZES_BY_CATEGORY["t-shirts"]],
    colours: [...AVAILABLE_COLOURS_BY_CATEGORY["t-shirts"]],
    brand: "Talha Garments",
    material: "Cotton",
    variants: createDemoVariants(
      "demo-classic-t-shirt",
      AVAILABLE_SIZES_BY_CATEGORY["t-shirts"],
      AVAILABLE_COLOURS_BY_CATEGORY["t-shirts"],
    ),
  },
  {
    // Demo-only placeholders; not a live product listing.
    id: "demo-classic-polo-shirt",
    name: "Classic Polo Shirt",
    price: 3990,
    description: "A polished knit polo for smart, relaxed dressing.",
    ...createDemoProductImages("Classic Polo Shirt", DEMO_IMAGE_URLS_BY_CATEGORY["polo-shirts"]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId: "polo-shirts",
    sizes: [...AVAILABLE_SIZES_BY_CATEGORY["polo-shirts"]],
    colours: [...AVAILABLE_COLOURS_BY_CATEGORY["polo-shirts"]],
    brand: "Talha Garments",
    material: "Cotton Blend",
    variants: createDemoVariants(
      "demo-classic-polo-shirt",
      AVAILABLE_SIZES_BY_CATEGORY["polo-shirts"],
      AVAILABLE_COLOURS_BY_CATEGORY["polo-shirts"],
    ),
  },
  {
    // Demo-only placeholders; not a live product listing.
    id: "demo-slim-denim-jeans",
    name: "Slim Denim Jeans",
    price: 5990,
    description: "Slim-cut denim with a clean, versatile profile.",
    ...createDemoProductImages("Slim Denim Jeans", DEMO_IMAGE_URLS_BY_CATEGORY["denim-jeans"]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId: "denim-jeans",
    sizes: [...AVAILABLE_SIZES_BY_CATEGORY["denim-jeans"]],
    colours: [...AVAILABLE_COLOURS_BY_CATEGORY["denim-jeans"]],
    brand: "Talha Garments",
    material: "Denim",
    variants: createDemoVariants(
      "demo-slim-denim-jeans",
      AVAILABLE_SIZES_BY_CATEGORY["denim-jeans"],
      AVAILABLE_COLOURS_BY_CATEGORY["denim-jeans"],
    ),
  },
  {
    // Demo-only placeholders; not a live product listing.
    id: "demo-formal-dress-shirt",
    name: "Formal Dress Shirt",
    price: 4990,
    description: "A crisp formal shirt for polished occasionwear.",
    ...createDemoProductImages("Formal Dress Shirt", DEMO_IMAGE_URLS_BY_CATEGORY["dress-shirts"]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId: "dress-shirts",
    sizes: [...AVAILABLE_SIZES_BY_CATEGORY["dress-shirts"]],
    colours: [...AVAILABLE_COLOURS_BY_CATEGORY["dress-shirts"]],
    brand: "Talha Garments",
    material: "Cotton",
    variants: createDemoVariants(
      "demo-formal-dress-shirt",
      AVAILABLE_SIZES_BY_CATEGORY["dress-shirts"],
      AVAILABLE_COLOURS_BY_CATEGORY["dress-shirts"],
    ),
  },
  {
    // Demo-only placeholders; not a live product listing.
    id: "demo-classic-dress-pants",
    name: "Classic Dress Pants",
    price: 5990,
    description: "Tailored pants for a sharp, formal silhouette.",
    ...createDemoProductImages("Classic Dress Pants", DEMO_IMAGE_URLS_BY_CATEGORY["dress-pants"]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId: "dress-pants",
    sizes: [...AVAILABLE_SIZES_BY_CATEGORY["dress-pants"]],
    colours: [...AVAILABLE_COLOURS_BY_CATEGORY["dress-pants"]],
    brand: "Talha Garments",
    material: "Cotton Blend",
    variants: createDemoVariants(
      "demo-classic-dress-pants",
      AVAILABLE_SIZES_BY_CATEGORY["dress-pants"],
      AVAILABLE_COLOURS_BY_CATEGORY["dress-pants"],
    ),
  },
  {
    // Demo-only placeholders; not a live product listing.
    id: "demo-denim-jacket",
    name: "Denim Jacket",
    price: 8990,
    description: "A timeless denim layer with a structured, easy-wear fit.",
    ...createDemoProductImages("Denim Jacket", DEMO_IMAGE_URLS_BY_CATEGORY["denim-jackets"]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId: "denim-jackets",
    sizes: [...AVAILABLE_SIZES_BY_CATEGORY["denim-jackets"]],
    colours: [...AVAILABLE_COLOURS_BY_CATEGORY["denim-jackets"]],
    brand: "Talha Garments",
    material: "Denim",
    variants: createDemoVariants(
      "demo-denim-jacket",
      AVAILABLE_SIZES_BY_CATEGORY["denim-jackets"],
      AVAILABLE_COLOURS_BY_CATEGORY["denim-jackets"],
    ),
  },
  {
    // Demo-only placeholders; not a live product listing.
    id: "demo-casual-shorts",
    name: "Casual Shorts",
    price: 2490,
    description: "Relaxed warm-weather shorts with an easy everyday feel.",
    ...createDemoProductImages("Casual Shorts", DEMO_IMAGE_URLS_BY_CATEGORY["shorts"]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId: "shorts",
    sizes: [...AVAILABLE_SIZES_BY_CATEGORY["shorts"]],
    colours: [...AVAILABLE_COLOURS_BY_CATEGORY["shorts"]],
    brand: "Talha Garments",
    material: "Cotton",
    variants: createDemoVariants(
      "demo-casual-shorts",
      AVAILABLE_SIZES_BY_CATEGORY["shorts"],
      AVAILABLE_COLOURS_BY_CATEGORY["shorts"],
    ),
  },
  {
    // Demo-only placeholders; not a live product listing.
    id: "demo-mens-track-suit",
    name: "Men's Track Suit",
    price: 9990,
    description: "A coordinated track suit with a streamlined athletic look.",
    ...createDemoProductImages("Men's Track Suit", DEMO_IMAGE_URLS_BY_CATEGORY["track-suits"]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId: "track-suits",
    sizes: [...AVAILABLE_SIZES_BY_CATEGORY["track-suits"]],
    colours: [...AVAILABLE_COLOURS_BY_CATEGORY["track-suits"]],
    brand: "Talha Garments",
    material: "Polyester",
    variants: createDemoVariants(
      "demo-mens-track-suit",
      AVAILABLE_SIZES_BY_CATEGORY["track-suits"],
      AVAILABLE_COLOURS_BY_CATEGORY["track-suits"],
    ),
  },
];

const createDemoProduct = (
  slug: string,
  name: string,
  categoryId: ProductCategoryId,
  price: number,
  description: string,
  material: string,
): Product => {
  const id = `demo-${slug}`;
  const sizes = [...AVAILABLE_SIZES_BY_CATEGORY[categoryId]];
  const colours = [...AVAILABLE_COLOURS_BY_CATEGORY[categoryId]];

  return {
    id,
    name,
    price,
    description,
    ...createDemoProductImages(name, DEMO_IMAGE_URLS_BY_CATEGORY[categoryId]),
    rating: 0,
    reviewCount: 0,
    status: "inactive",
    categoryId,
    sizes,
    colours,
    brand: "Talha Garments",
    material,
    variants: createDemoVariants(id, sizes, colours),
  };
};

const ADDITIONAL_DEMO_PRODUCT_SPECS: Array<
  [string, string, ProductCategoryId, number, string, string]
> = [
  ["performance-training-shirt", "Performance Training Shirt", "sports-shirts", 2790, "Lightweight activewear designed for comfortable movement.", "Polyester"],
  ["classic-wool-jacket", "Classic Wool Jacket", "jackets", 12990, "A refined wool layer for cool-weather dressing.", "Wool Blend"],
];

export const DEMO_PRODUCTS: Product[] = [
  ...EXISTING_DEMO_PRODUCTS,
  ...ADDITIONAL_DEMO_PRODUCT_SPECS.map(([slug, name, categoryId, price, description, material]) =>
    createDemoProduct(slug, name, categoryId, price, description, material),
  ),
];
