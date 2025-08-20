import { products as baseLocalProducts } from "./productsData";

export const OVERLAY_KEY = 'ADMIN_FRONTEND_PRODUCT_OVERRIDES';
export const DELETED_KEY = 'ADMIN_FRONTEND_PRODUCT_DELETED_IDS';

export function getOverrides() {
  try {
    return JSON.parse(localStorage.getItem(OVERLAY_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveOverrides(overrides) {
  localStorage.setItem(OVERLAY_KEY, JSON.stringify(overrides || {}));
}

export function getDeletedSet() {
  try {
    const arr = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]');
    return new Set((Array.isArray(arr) ? arr : []).map(String));
  } catch {
    return new Set();
  }
}

export function saveDeletedSet(setLike) {
  const arr = Array.from(setLike || []).map(String);
  localStorage.setItem(DELETED_KEY, JSON.stringify(arr));
}

export function resolveImagePath(img) {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  return img.startsWith('/') ? img : `/${img}`;
}

export function applyOverridesToLocalProducts(localProducts = baseLocalProducts) {
  const overrides = getOverrides();
  return (localProducts || []).map((item) => {
    const feId = String(item.id);
    const ov = overrides?.[feId] || {};
    const merged = { ...item, ...ov };
    merged.displayImage = resolveImagePath(merged.image || item.image);
    merged.__source = 'frontend';
    merged.frontendId = item.id;
    return merged;
  });
}

export function getVisibleLocalProducts() {
  const deleted = getDeletedSet();
  return applyOverridesToLocalProducts().filter((p) => !deleted.has(String(p.frontendId)));
}


