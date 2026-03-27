import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const ShopContext = createContext(null);

const fromStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(fromStorage("hozyan_cart", []));
  const [favorites, setFavorites] = useState(fromStorage("hozyan_favorites", []));

  const persist = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const addToCart = (product, qty = 1) => {
    const next = [...cart];
    const idx = next.findIndex((i) => i.id === product.id);
    if (idx >= 0) next[idx].qty += qty;
    else next.push({ ...product, qty });
    setCart(next);
    persist("hozyan_cart", next);
    toast.success("Товар добавлен в корзину");
  };

  const setQty = (id, qty) => {
    const next = cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
    setCart(next);
    persist("hozyan_cart", next);
  };

  const removeFromCart = (id) => {
    const next = cart.filter((i) => i.id !== id);
    setCart(next);
    persist("hozyan_cart", next);
  };

  const toggleFavorite = (product) => {
    const exists = favorites.some((f) => f.id === product.id);
    const next = exists ? favorites.filter((f) => f.id !== product.id) : [...favorites, product];
    setFavorites(next);
    persist("hozyan_favorites", next);
  };

  const clearCart = () => {
    setCart([]);
    persist("hozyan_cart", []);
  };

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
  const value = useMemo(
    () => ({ cart, favorites, addToCart, setQty, removeFromCart, toggleFavorite, total, clearCart }),
    [cart, favorites, total]
  );
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
