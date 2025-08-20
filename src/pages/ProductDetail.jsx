import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { getVisibleLocalProducts } from "../data/localProductsHelpers";
import { useSnackbar } from "../context/SnackbarContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showSnackbar } = useSnackbar();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [error, setError] = useState("");
  const [thumbs, setThumbs] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const numericId = useMemo(() => {
    return /^\d+$/.test(id) ? Number(id) : null;
  }, [id]);

  const normalizeImage = (src) => {
    if (!src) return "/products/sample1.png";
    if (/^https?:\/\//i.test(src)) return src;
    return src.startsWith("/") ? src : `/${src}`;
  };

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      setError("");
      try {
        const res = await axios.get(`/api/products/${encodeURIComponent(id)}`);
        if (!isMounted) return;
        const apiProduct = res.data || null;
        if (apiProduct) {
          setProduct(apiProduct);
          setMainImage(normalizeImage(apiProduct.image));
          return;
        }
      } catch (err) {
        // Fallback to local data
      }

      // Local fallback
      const local = getVisibleLocalProducts().find((p) =>
        numericId != null ? p.id === numericId : String(p.id) === String(id)
      );
      if (local) {
        setProduct(local);
      } else {
        setError("Product not found.");
      }
    };
    fetch();
    return () => {
      isMounted = false;
    };
  }, [id, numericId]);

  useEffect(() => {
    if (!product) return;
    const images = [];
    const pushIf = (v) => {
      if (v) images.push(normalizeImage(v));
    };
    if (Array.isArray(product.images)) {
      product.images.forEach(pushIf);
    } else {
      pushIf(product.image);
      pushIf(product.image2);
      pushIf(product.image3);
      pushIf(product.image4);
    }
    if (images.length === 0) images.push("/products/sample1.png");
    while (images.length < 4) images.push(images[0]);
    setThumbs(images.slice(0, 4));
    setMainImage(images[0]);
  }, [product]);

  // Load recommended products from backend by category with local fallback
  useEffect(() => {
    if (!product?.category) {
      setRecommended([]);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get('/api/products', { params: { category: product.category, limit: 8 } });
        const items = Array.isArray(res.data) ? res.data : res.data.items || [];
        const filtered = items.filter((p) => (p.id ?? p._id) !== (product.id ?? product._id));
        if (mounted) setRecommended(filtered.slice(0, 4));
      } catch {
        const local = getVisibleLocalProducts()
          .filter((p) => (p.category && p.category === product.category) && ((p.id ?? p._id) !== (product.id ?? product._id)))
          .slice(0, 4);
        if (mounted) setRecommended(local);
      }
    })();
    return () => { mounted = false; };
  }, [product]);

  if (error) {
    return <div className="py-20 text-center text-red-600">{error}</div>;
  }
  if (!product) return <div className="py-20 text-center">Loading...</div>;

  const handleAdd = () => {
    addToCart({ ...product, id: product.id ?? product._id }, qty);
    showSnackbar(`${product.name} added to cart!`, { type: "success" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; <span>{product.name}</span>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="min-w-0">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-64 sm:h-80 md:h-auto max-h-[60vh] rounded shadow object-contain bg-white p-2"
          />
          <div className="flex gap-2 mt-4 overflow-x-auto -mx-1 px-1 pb-1">
            {thumbs.map((im, i) => (
              <img
                key={i}
                src={im}
                onClick={() => setMainImage(im)}
                className={
                  "w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer border shrink-0 " +
                  (im === mainImage ? "ring-2 ring-blue-500" : "")
                }
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-1 lg:col-span-2 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold break-words">{product.name}</h1>
          <div className="flex items-center gap-2 text-yellow-500 mt-2 flex-wrap">
            {"★".repeat(Math.floor(product.rating || 0))}{ "☆".repeat(5 - Math.floor(product.rating || 0)) }
            <span className="text-gray-500 ml-2">({product.rating ?? 0})</span>
          </div>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-blue-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through">${product.originalPrice}</span>
            )}
            {typeof product.discount === "number" && (
              <span className="text-green-600 font-semibold">-{product.discount}%</span>
            )}
            <span className="ml-4 text-sm text-green-600 font-medium">In Stock</span>
          </div>

          <p className="mt-3 sm:mt-4 text-gray-600">{product.description || "Product details not provided."}</p>

          <div className="flex flex-wrap gap-3 mt-6 items-center">
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-200 rounded">−</button>
              <span className="px-3 py-1 border rounded">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
            </div>

            <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded w-full sm:w-auto">Add to Cart</button>
            <button className="bg-green-600 text-white px-6 py-2 rounded w-full sm:w-auto">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Recommended products */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Recommended products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommended.map((p) => (
            <Link
              to={`/product/${p.id ?? p._id}`}
              key={p.id ?? p._id}
              className="bg-white rounded shadow hover:shadow-md transition p-2 sm:p-3 block"
            >
              <img src={normalizeImage(p.image)} alt={p.name} className="w-full h-28 sm:h-36 object-cover rounded" />
              <div className="mt-2">
                <div className="text-xs sm:text-sm font-medium line-clamp-1">{p.name}</div>
                <div className="text-[11px] sm:text-xs text-gray-500 line-clamp-2">{p.description}</div>
                <div className="text-sm font-semibold text-blue-600 mt-1">${p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
