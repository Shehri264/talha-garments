import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addCartItem,
  findCartProduct,
  normalizeCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../utils/cart";
import type { CartMutationResult } from "../utils/cart";
import type { Cart, CartItem } from "../types/cart";
import type { ProductSize } from "../types/product";

const CART_STORAGE_KEY = "talha-garments-cart";
const PRODUCT_SIZES: readonly ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<CartItem>;
  if (
    typeof candidate.productId !== "string" ||
    typeof candidate.colour !== "string" ||
    !PRODUCT_SIZES.includes(candidate.size as ProductSize) ||
    !Number.isInteger(candidate.quantity) ||
    (candidate.quantity ?? 0) < 1
  ) {
    return false;
  }

  return Boolean(
    findCartProduct(candidate.productId)?.variants.some(
      (variant) => variant.size === candidate.size && variant.colour === candidate.colour,
    ),
  );
}

function readStoredCart(): Cart {
  if (typeof window === "undefined") return [];

  try {
    const serializedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!serializedCart) return [];

    const storedCart: unknown = JSON.parse(serializedCart);
    if (!Array.isArray(storedCart)) return [];

    const validItems = storedCart.filter(isCartItem).map(({ productId, size, colour, quantity }) => ({
      productId,
      size,
      colour,
      quantity,
    }));
    return normalizeCartItems(validItems);
  } catch {
    return [];
  }
}

interface CartContextValue {
  items: readonly CartItem[];
  addItem: (item: CartItem) => CartMutationResult;
  updateQuantity: (item: CartItem, quantity: number) => CartMutationResult;
  removeItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<Cart>(readStoredCart);
  const addItem = useCallback(
    (item: CartItem): CartMutationResult => {
      const cartItem = {
        productId: item.productId,
        size: item.size,
        colour: item.colour,
        quantity: item.quantity,
      };
      const result = addCartItem(items, cartItem);
      if (result.success) setItems(result.cart);
      return result;
    },
    [items],
  );
  const updateQuantity = useCallback(
    (item: CartItem, quantity: number): CartMutationResult => {
      const result = updateCartItemQuantity(items, item, quantity);
      if (result.success) setItems(result.cart);
      return result;
    },
    [items],
  );
  const removeItem = useCallback((item: CartItem) => {
    setItems((currentItems) => removeCartItem(currentItems, item));
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedItems = items.map(({ productId, size, colour, quantity }) => ({
        productId,
        size,
        colour,
        quantity,
      }));
      // Persist only the minimal cart line fields; never customer or payment data.
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(savedItems));
    } catch {
      // Cart remains usable for the current page if browser storage is unavailable.
    }
  }, [items]);
  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem }),
    [items, addItem, updateQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider.");
  return context;
}
