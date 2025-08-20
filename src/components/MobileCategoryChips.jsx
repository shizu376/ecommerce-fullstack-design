import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getVisibleLocalProducts } from "../data/localProductsHelpers";

export default function MobileCategoryChips() {
  const navigate = useNavigate();

  const chips = useMemo(() => {
    const products = getVisibleLocalProducts();
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    const list = Array.from(set).slice(0, 6);
    if (list.length === 0) return ["All category", "Gadgets", "Clothes", "Accessories"];
    return ["All category", ...list];
  }, []);

  return (
    <div className="md:hidden max-w-6xl mx-auto px-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
        {chips.map((label, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (label === "All category") navigate("/products");
              else navigate(`/products?q=${encodeURIComponent(label)}`);
            }}
            className="shrink-0 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}


