import { useState } from "react";
export default function CategoryNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Toys",
    "Automotive",
    "Books",
  ];
   return (
    <div className="bg-gray-100 border-t border-b border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* All Categories Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            All Categories
            <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded border border-gray-200 z-10">
              <ul className="py-2 text-sm text-gray-700">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">
            Contact
          </a>
          <a href="/about" className="text-gray-700 hover:text-blue-600 transition">
            About
          </a>
        </div>
      </div>
    </div>
  );
}
