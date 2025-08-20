import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => (p.id ?? p._id) === (product.id ?? product._id));
      if (exists) {
        return prev.filter((p) => (p.id ?? p._id) !== (product.id ?? product._id));
      }
      return [...prev, product];
    });
  };

  const isWished = (id) => wishlist.some((p) => (p.id ?? p._id) === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWished }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}


