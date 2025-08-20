import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function normalizeImage(src) {
  if (!src) return "/products/sample1.png";
  if (/^https?:\/\//i.test(src)) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

export default function FeaturedProducts() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/products', { params: { limit: 8 } });
        const products = Array.isArray(res.data) ? res.data : res.data.items || [];
        setItems(products);
      } catch (e) {
        setError("Failed to load featured products");
      }
    })();
  }, []);

  if (error) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">Featured products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link
            to={`/product/${p.id ?? p._id}`}
            key={p._id || p.id}
            className="bg-white rounded shadow p-3 hover:shadow-md transition"
          >
            <img src={normalizeImage(p.image)} alt={p.name} className="w-full h-32 object-cover rounded" />
            <div className="mt-2 text-sm font-medium truncate">{p.name}</div>
            <div className="text-sm text-blue-600 font-semibold">${p.price}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}


