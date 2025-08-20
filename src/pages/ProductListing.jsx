import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  Squares2X2Icon,
  Bars3Icon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { getVisibleLocalProducts } from "../data/localProductsHelpers"; 
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";

export default function ProductListing() {
  const USE_STATIC_PRODUCTS = import.meta.env.VITE_USE_STATIC_PRODUCTS === "true";
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = (params.get("q") || "").toLowerCase();
  const { wishlist, toggleWishlist } = useWishlist();
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
    features: []
  });
  const [viewMode, setViewMode] = useState("grid");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [openFilters, setOpenFilters] = useState({
    category: false,
    price: false,
    features: false,
    brands: false
  });
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  const isWished = (id) => wishlist.some((p) => (p.id ?? p._id) === id);
  const getProductKey = (p) => p.id ?? p._id;

  const toggleFilterSection = (filter) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleCheckboxChange = (filterName) => {
    setSelectedFilters((prev) => {
      const { type, value } = filterName;
      const arr = prev[type];
      return {
        ...prev,
        [type]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value]
      };
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedFilters({ category: [], brand: [], features: [] });
    setPriceRange([0, 2000]);
    setVerifiedOnly(false);
    setCurrentPage(1);
  };

  const filterOptions = {
    category: ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports"],
    features: ["Free Shipping", "Discount", "New Arrival", "Best Seller"],
    brand: ["Apple", "Samsung", "Sony", "Nike", "Adidas", "LG"]
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    count += selectedFilters.category.length;
    count += selectedFilters.brand.length;
    count += selectedFilters.features.length;
    count += verifiedOnly ? 1 : 0;
    count += priceRange[0] !== 0 || priceRange[1] !== 2000 ? 1 : 0;
    return count;
  }, [selectedFilters, verifiedOnly, priceRange]);

  // Load products from API with local fallback
  const [apiProducts, setApiProducts] = useState([]);
  useEffect(() => {
    if (USE_STATIC_PRODUCTS) {
      setApiProducts([]);
      return undefined;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`/api/products`, { params: { q: searchQuery || undefined, limit: 100 } });
        const items = Array.isArray(res.data) ? res.data : res.data.items || [];
        if (mounted) setApiProducts(items);
      } catch {
        if (mounted) setApiProducts([]);
      }
    })();
    return () => { mounted = false; };
  }, [searchQuery, USE_STATIC_PRODUCTS]);

  const fixedProducts = useMemo(() => {
    const local = getVisibleLocalProducts();
    if (USE_STATIC_PRODUCTS) return local;
    if (apiProducts.length === 0) return local;
    // Merge backend and local products, deduplicate by name+brand (prefer backend)
    const seen = new Set();
    const merged = [];
    for (const item of [...apiProducts, ...local]) {
      const key = `${(item.name || '').toLowerCase()}|${(item.brand || '').toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
    return merged;
  }, [apiProducts, USE_STATIC_PRODUCTS]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    let filtered = fixedProducts.filter((p) => {
      // Price filter
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      // Text search
      if (
        searchQuery !== "" &&
        !(
          p.name.toLowerCase().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery) ||
          p.brand?.toLowerCase().includes(searchQuery) ||
          (Array.isArray(p.features) && p.features.some((f) => f.toLowerCase().includes(searchQuery)))
        )
      ) {
        return false;
      }
      // Category filter
      if (
        selectedFilters.category.length > 0 &&
        !selectedFilters.category.includes(p.category)
      ) {
        return false;
      }
      // Brand filter
      if (
        selectedFilters.brand.length > 0 &&
        !selectedFilters.brand.includes(p.brand)
      ) {
        return false;
      }
      // Features filter
      if (
        selectedFilters.features.length > 0 &&
        !(Array.isArray(p.features) && p.features.some((f) => selectedFilters.features.includes(f)))
      ) {
        return false;
      }
      // Verified Only filter
      if (verifiedOnly && !p.isVerified) {
        return false;
      }
      return true;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default: // relevance
        break;
    }

    return filtered;
  }, [fixedProducts, priceRange, searchQuery, selectedFilters, verifiedOnly, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Filters Modal Component
  const FiltersModal = () => (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={() => setShowFiltersModal(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl z-50 md:hidden max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={() => setShowFiltersModal(false)}
            className="p-1"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-4 space-y-4">
          {/* Verified Only */}
          <div className="border-b pb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="mr-3 accent-blue-600 w-4 h-4"
              />
              <span className="font-medium">Verified Only</span>
            </label>
          </div>

          {/* Price Filter */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="space-y-3">
              <div className="flex gap-2 text-sm">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-20 border rounded px-2 py-1"
                  min="0"
                />
                <span className="self-center">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-20 border rounded px-2 py-1"
                />
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full"
              />
            </div>
          </div>

          {/* Other Filters */}
          {Object.entries(filterOptions).map(([key, options]) => (
            <div key={key} className="border-b pb-4">
              <h3 className="font-medium mb-3 capitalize">{key}</h3>
              <div className="space-y-2">
                {options.map((option, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters[key]?.includes(option)}
                      onChange={() => handleCheckboxChange({ type: key, value: option })}
                      className="mr-3 accent-blue-600 w-4 h-4"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={clearAllFilters}
            className="flex-1 py-2 border border-gray-300 rounded-lg font-medium"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowFiltersModal(false)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Selected Filters Tags (Mobile) */}
      {(activeFiltersCount > 0) && (
        <div className="md:hidden mb-4 flex flex-wrap gap-2">
          {selectedFilters.brand.map((brand) => (
            <span key={brand} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {brand}
              <button
                onClick={() => handleCheckboxChange({ type: 'brand', value: brand })}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
          {selectedFilters.category.map((category) => (
            <span key={category} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {category}
              <button
                onClick={() => handleCheckboxChange({ type: 'category', value: category })}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
          {selectedFilters.features.map((feature) => (
            <span key={feature} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {feature}
              <button
                onClick={() => handleCheckboxChange({ type: 'features', value: feature })}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block bg-white p-4 rounded shadow space-y-4">
          {Object.entries(filterOptions).map(([key, options]) => (
            <div key={key}>
              <button
                className="flex justify-between w-full font-semibold mb-2"
                onClick={() => toggleFilterSection(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {openFilters[key] ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>
              {openFilters[key] && (
                <ul className="space-y-2 text-sm">
                  {options.map((option, idx) => (
                    <li key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters[key]?.includes(option)}
                        onChange={() => handleCheckboxChange({ type: key, value: option })}
                        className="mr-2 accent-blue-600"
                      />
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Desktop Price Filter */}
          <div>
            <button
              className="flex justify-between w-full font-semibold mb-2"
              onClick={() => toggleFilterSection("price")}
            >
              Price
              {openFilters.price ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
            {openFilters.price && (
              <div className="space-y-2">
                <div className="flex gap-2 text-sm">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([+e.target.value, priceRange[1]])
                    }
                    className="w-16 border rounded p-1"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], +e.target.value])
                    }
                    className="w-16 border rounded p-1"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], +e.target.value])
                  }
                  className="w-full"
                />
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3">
          {/* Mobile Controls Row */}
          <div className="md:hidden flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                >
                  <option value="relevance">Sort: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name A-Z</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFiltersModal(true)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white"
              >
                <FunnelIcon className="w-4 h-4" />
                Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                <Bars3Icon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Header with controls */}
          <div className="hidden md:block bg-white p-4 rounded shadow mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-gray-600 text-sm">
                Showing <span className="font-semibold">{paginatedProducts.length}</span> out of <span className="font-semibold">{filteredProducts.length}</span> products
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Verified Only Checkbox */}
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="mr-2 accent-blue-600"
                  />
                  Verified Only
                </label>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name A-Z</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    } border-r border-gray-300`}
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Bars3Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {paginatedProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {paginatedProducts.map((product) => (
                <Link
                  to={`/product/${getProductKey(product)}`}
                  key={getProductKey(product)}
                  className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative ${
                    viewMode === "list" ? "flex items-start gap-4" : ""
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 z-10"
                  >
                    {isWished(getProductKey(product)) ? (
                      <HeartSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartOutline className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <img
                    src={product.displayImage || product.image}
                    alt={product.name}
                    className={`object-cover rounded-lg ${
                      viewMode === "list" 
                        ? "w-20 h-20 flex-shrink-0" 
                        : "w-full h-48 mb-3"
                    }`}
                  />
                  
                  <div className={`${viewMode === "list" ? "flex-1 min-w-0" : ""}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400 text-sm">
                        {"★".repeat(Math.floor(product.rating || 4.5))}
                        {"☆".repeat(5 - Math.floor(product.rating || 4.5))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {product.rating || "4.5"}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {product.orders || "154"} orders
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {product.features?.includes("Free Shipping") && (
                      <span className="inline-block text-xs text-green-600 font-medium mt-2">
                        Free Shipping
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">No products matched your filters.</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Filters Modal */}
      {showFiltersModal && <FiltersModal />}
    </div>
  );
}