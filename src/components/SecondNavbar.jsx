import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SecondNavbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const categories = [
    "Electronics", "Fashion", "Home & Kitchen", "Beauty",
    "Sports", "Toys", "Automotive", "Books"
  ];

  const countries = [
    { name: "Pakistan", flag: "/flags/pakistan.png" },
    { name: "USA", flag: "/flags/usa.png" },
    { name: "UK", flag: "/flags/uk.png" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <div className="bg-white shadow font-sans" ref={dropdownRef}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-2">
        {/* Categories Dropdown: Hide on mobile */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setOpenDropdown(openDropdown === "categories" ? null : "categories")}
            className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-200 text-sm transition-colors"
          >
            ☰ All Categories
          </button>
          {openDropdown === "categories" && (
            <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-50 border">
              <ul className="py-2">
                {categories.map((cat, i) => (
                  <li 
                    key={i} 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link to="/products" className="hover:text-blue-600 transition-colors">
            All Products
          </Link>
          <Link to="/offers" className="hover:text-blue-600 transition-colors">
            Hot Offers
          </Link>
          <Link to="/gifts" className="hover:text-blue-600 transition-colors">
            Gift Boxes
          </Link>
          <Link to="/menu" className="hover:text-blue-600 transition-colors">
            Menu
          </Link>
          <Link to="/help" className="hover:text-blue-600 transition-colors">
            Help
          </Link>
        </nav>

        {/* Ship to & Language */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          {/* Country Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "country" ? null : "country")}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              📍 Ship to ▼
            </button>
            {openDropdown === "country" && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg z-50 border">
                {countries.map((country, i) => (
                  <div
                    key={i}
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <img 
                      src={country.flag} 
                      alt={`${country.name} flag`} 
                      className="w-5 h-5 object-cover rounded-sm" 
                    />
                    <span>{country.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "lang" ? null : "lang")}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              🌐 EN ▼
            </button>
            {openDropdown === "lang" && (
              <div className="absolute right-0 mt-2 w-24 bg-white shadow-lg rounded-lg z-50 border">
                <div 
                  onClick={() => setOpenDropdown(null)} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  EN
                </div>
                <div 
                  onClick={() => setOpenDropdown(null)} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  UR
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}