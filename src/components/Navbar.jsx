import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { products as localProducts } from "../data/productsData";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon, ChatBubbleLeftRightIcon, ClipboardDocumentListIcon, CheckIcon } from "@heroicons/react/24/outline";
import LogoMark from "./LogoMark";

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((s, i) => s + (i.quantity || 1), 0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openMobileCategories, setOpenMobileCategories] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get('/api/categories');
        let backendCategories = [];
        if (Array.isArray(res.data)) {
          backendCategories = res.data.map(c => c.name).filter(Boolean);
        }
        // Get local categories
        const localSet = new Set(localProducts.map((p) => p.category).filter(Boolean));
        // Merge and deduplicate
        const allCategories = Array.from(new Set([...backendCategories, ...localSet]));
        setCategories(allCategories);
      } catch {
        // Fallback to local products if API fails
        const set = new Set(localProducts.map((p) => p.category).filter(Boolean));
        setCategories(Array.from(set));
      }
    }
    fetchCategories();
  }, []);
  const searchRef = useRef();
  const mobileSearchRef = useRef();
  const mobileCategoriesRef = useRef();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    setResults([]);
  };

  useEffect(() => {
    if (!query) return setResults([]);
    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/products?q=${encodeURIComponent(query)}`);
        let items = Array.isArray(res.data) ? res.data : res.data.items || [];
        if (!items.length) {
          const q = query.toLowerCase();
          items = localProducts.filter((p) =>
            p.name.toLowerCase().includes(q) ||
            (p.category || '').toLowerCase().includes(q) ||
            (p.brand || '').toLowerCase().includes(q)
          );
        }
        setResults(items.slice(0, 8));
      } catch (_) {
        const q = query.toLowerCase();
        const items = localProducts.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q)
        );
        setResults(items.slice(0, 8));
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onDoc = (e) => {
      const target = e.target;
      const isInsideSearch = searchRef.current?.contains(target);
      const isInsideMobileSearch = mobileSearchRef.current?.contains(target);
      const isInsideMobileCat = mobileCategoriesRef.current?.contains(target);
      if (!isInsideSearch && !isInsideMobileSearch && !isInsideMobileCat) {
        setResults([]);
        setOpenCategories(false);
        setOpenMobileCategories(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, categoryQuery]);

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 sm:gap-4 w-full min-w-0">
        {/* Mobile hamburger left */}
        <button
          className="md:hidden p-1 -ml-2"
          aria-label="Open menu"
          onClick={() => setMobileDrawerOpen(true)}
        >
          <Bars3Icon className="w-7 h-7 text-gray-700" />
        </button>
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-blue-600 text-xl sm:text-2xl shrink-0">
          <LogoMark className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
          <span className="truncate">MyShop</span>
        </Link>

        {/* Mobile top-right icons */}
        <div className="ml-auto md:hidden flex items-center gap-3 sm:gap-4 shrink-0">
          <Link to="/login" aria-label="Login" className="text-gray-700">
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-gray-700">
            <ShoppingCartIcon className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Search (desktop) */}
        <div className="hidden md:block flex-1 relative min-w-0" ref={searchRef}>
          <form className="flex items-stretch" onSubmit={handleSearchSubmit}>
            <div className="relative flex-1 min-w-0" ref={searchRef}>
              <div className="flex items-center w-full border border-gray-200 rounded-full bg-gray-50 shadow-sm px-2 min-w-0">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 ml-2" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setOpenCategories((v) => !v); setCategoryQuery(""); }}
                    className="px-3 py-1.5 text-sm rounded-full hover:bg-white border border-transparent text-gray-700"
                  >
                    {selectedCategory || 'All Categories'} ▾
                  </button>
                  {openCategories && (
                    <div className="absolute left-0 mt-2 bg-white border rounded-xl shadow-xl z-50 w-64 overflow-hidden">
                      <div className="px-3 py-2 border-b bg-gray-50">
                        <div className="text-xs font-medium text-gray-600">Categories</div>
                      </div>
                      <div className="max-h-72 overflow-auto py-1">
                        {filteredCategories.length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                        )}
                        {filteredCategories.map((c) => (
                          <div
                            key={c}
                            className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                            onClick={() => {
                              setSelectedCategory(c);
                              setCategoryQuery("");
                              setOpenCategories(false);
                              navigate(`/products?q=${encodeURIComponent(c)}`);
                            }}
                          >
                            <span className="truncate">{c}</span>
                            {selectedCategory === c && <CheckIcon className="w-4 h-4 text-blue-600" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="seach here"
                  className="flex-1 bg-transparent px-3 py-2 focus:outline-none min-w-0"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-gray-400 hover:text-gray-600 mr-2"
                    aria-label="Clear search"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <button type="submit" className="ml-2 px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm text-sm">Search</button>
          </form>

          {results.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-50 max-h-96 overflow-auto">
              {results.map((r) => (
                <div
                  key={r._id || r.id}
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    navigate(`/product/${r.id ?? r._id}`);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img src={r.image?.startsWith('/') ? r.image : `/${r.image}`} alt={r.name} className="w-12 h-12 object-cover rounded" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-xs text-gray-500 truncate">{r.category || '—'} • ${r.price}</div>
                  </div>
                </div>
              ))}
              <div className="px-3 py-2 text-xs text-gray-500 border-t">Press Enter to see all results</div>
            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/login" className="flex flex-col items-center text-gray-700 hover:text-blue-600 text-xs">
            <ArrowRightOnRectangleIcon className="w-5 h-5 mb-0.5" />
            <span>Login</span>
          </Link>
          <a href="#" className="flex flex-col items-center text-gray-700 hover:text-blue-600 text-xs">
            <ChatBubbleLeftRightIcon className="w-5 h-5 mb-0.5" />
            <span>Message</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-700 hover:text-blue-600 text-xs">
            <ClipboardDocumentListIcon className="w-5 h-5 mb-0.5" />
            <span>Orders</span>
          </a>
          <Link to="/cart" className="flex flex-col items-center relative text-gray-700 hover:text-blue-600 text-xs">
            <ShoppingCartIcon className="w-5 h-5 mb-0.5" />
            <span>My cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile drawer overlay */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-[1000] md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[80vw] max-w-sm bg-white shadow-xl p-4 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">Menu</div>
                <button aria-label="Close menu" onClick={() => setMobileDrawerOpen(false)}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                <Link onClick={() => setMobileDrawerOpen(false)} to="#" className="block py-2 text-gray-700">Message</Link>
                <Link onClick={() => setMobileDrawerOpen(false)} to="#" className="block py-2 text-gray-700">Orders</Link>
              </div>

              <hr className="my-4" />

              {/* Secondary navbar links */}
              <div className="space-y-2">
                <Link onClick={() => setMobileDrawerOpen(false)} to="/products" className="block py-2 text-gray-700">All Products</Link>
                <a onClick={() => setMobileDrawerOpen(false)} href="#" className="block py-2 text-gray-700">Hot Offers</a>
                <a onClick={() => setMobileDrawerOpen(false)} href="#" className="block py-2 text-gray-700">Gift Boxes</a>
                <a onClick={() => setMobileDrawerOpen(false)} href="#" className="block py-2 text-gray-700">Menu</a>
                <a onClick={() => setMobileDrawerOpen(false)} href="#" className="block py-2 text-gray-700">Help</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden max-w-6xl mx-auto px-3 sm:px-4 pb-3" ref={mobileSearchRef}>
        <form className="relative" onSubmit={handleSearchSubmit}>
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="seach here"
            className="w-full border border-gray-200 rounded-full pl-10 pr-24 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-[15px]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-28 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setOpenMobileCategories((v) => !v); setCategoryQuery(""); }}
              className="text-gray-600 text-xs hover:text-blue-600"
            >
              Categories ▾
            </button>
            <button type="submit" className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Search</button>
          </div>
        </form>

        {openMobileCategories && (
          <div className="mt-2 bg-white border rounded-xl shadow-xl z-40 overflow-hidden" ref={mobileCategoriesRef}>
            <div className="px-3 py-2 border-b bg-gray-50">
              <div className="text-xs font-medium text-gray-600">Categories</div>
            </div>
            <div className="max-h-72 overflow-auto py-1">
              {filteredCategories.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
              )}
              {filteredCategories.map((c) => (
                <div
                  key={c}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    setSelectedCategory(c);
                    setCategoryQuery("");
                    setOpenMobileCategories(false);
                    navigate(`/products?q=${encodeURIComponent(c)}`);
                  }}
                >
                  <span className="truncate">{c}</span>
                  {selectedCategory === c && <CheckIcon className="w-4 h-4 text-blue-600" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-1 bg-white border rounded shadow z-50 max-h-96 overflow-auto">
            {results.map((r) => (
              <div
                key={r._id || r.id}
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  navigate(`/product/${r.id ?? r._id}`);
                }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <img src={r.image?.startsWith('/') ? r.image : `/${r.image}`} alt={r.name} className="w-12 h-12 object-cover rounded" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{r.name}</div>
                  <div className="text-xs text-gray-500 truncate">{r.category || '—'} • ${r.price}</div>
                </div>
              </div>
            ))}
            <div className="px-3 py-2 text-xs text-gray-500 border-t">Press Enter to see all results</div>
          </div>
        )}
      </div>
    </header>
  );
}
