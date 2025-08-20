// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCart, syncCart, addCartItem, updateCartItem, removeCartItem as apiRemove } from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const getKey = (obj) => obj?.id ?? obj?._id;

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
    // Attempt background sync to backend (best-effort)
    (async () => {
      await syncCart(cart).catch(() => {});
    })();
  }, [cart]);

  // On mount, try to hydrate from backend cart when available
  useEffect(() => {
    (async () => {
      const serverCart = await fetchCart();
      if (Array.isArray(serverCart) && serverCart.length) {
        setCart(serverCart.map((i) => ({ ...i, id: getKey(i), quantity: i.quantity || 1 })));
      }
    })();
  }, []);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const productKey = getKey(product);
      const exists = prev.find(i => getKey(i) === productKey);
      if (exists) {
        return prev.map(i => (getKey(i) === productKey ? { ...i, quantity: (i.quantity || 0) + qty } : i));
      }
      return [...prev, { ...product, id: productKey, quantity: qty }];
    });
    // Fire-and-forget server add
    addCartItem({ ...product, id: getKey(product) }, qty).catch(() => {});
  };

  const removeFromCart = idOrKey => {
    setCart(prev => prev.filter(i => getKey(i) !== idOrKey));
    apiRemove(idOrKey).catch(() => {});
  };

  const increaseQuantity = idOrKey => {
    setCart(prev => prev.map(i => (getKey(i) === idOrKey ? { ...i, quantity: (i.quantity || 1) + 1 } : i)));
    updateCartItem(idOrKey, { op: "inc", amount: 1 }).catch(() => {});
  };

  const decreaseQuantity = idOrKey => {
    setCart(prev =>
      prev.map(i => (getKey(i) === idOrKey ? { ...i, quantity: Math.max(1, (i.quantity || 1) - 1) } : i))
    );
    updateCartItem(idOrKey, { op: "inc", amount: -1 }).catch(() => {});
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
