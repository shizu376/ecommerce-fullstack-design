import axios from "axios";

const normalizeItem = (item) => {
  if (!item) return null;
  const key = item.id ?? item._id;
  return { ...item, id: key };
};

export async function fetchCart() {
  try {
    const res = await axios.get("/api/cart");
    const items = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    return items.map(normalizeItem);
  } catch {
    return null;
  }
}

export async function syncCart(items) {
  try {
    await axios.post("/api/cart/sync", { items });
    return true;
  } catch {
    return false;
  }
}

export async function addCartItem(item, quantity = 1) {
  try {
    const res = await axios.post("/api/cart/items", { item, quantity });
    return normalizeItem(res.data?.item || res.data);
  } catch {
    return null;
  }
}

export async function updateCartItem(itemId, updates) {
  try {
    const res = await axios.patch(`/api/cart/items/${encodeURIComponent(itemId)}`, updates);
    return normalizeItem(res.data?.item || res.data);
  } catch {
    return null;
  }
}

export async function removeCartItem(itemId) {
  try {
    await axios.delete(`/api/cart/items/${encodeURIComponent(itemId)}`);
    return true;
  } catch {
    return false;
  }
}


