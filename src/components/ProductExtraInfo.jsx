import { useState } from "react";

export default function ProductExtraInfo({ product }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-4">
      {/* Description */}
      <div className="mb-4 border-b pb-3">
        <button
          onClick={() => toggleSection("description")}
          className="w-full flex justify-between items-center font-semibold text-lg hover:text-blue-600"
        >
          Description
          <span className="text-gray-400">
            {openSection === "description" ? "−" : "+"}
          </span>
        </button>
        {openSection === "description" && (
          <p className="mt-3 text-gray-600 leading-relaxed transition-all duration-300">
            {product.description ||
              "No description available for this product. Please check back later."}
          </p>
        )}
      </div>

      {/* Shipping Info */}
      <div className="mb-4 border-b pb-3">
        <button
          onClick={() => toggleSection("shipping")}
          className="w-full flex justify-between items-center font-semibold text-lg hover:text-blue-600"
        >
          Shipping Information
          <span className="text-gray-400">
            {openSection === "shipping" ? "−" : "+"}
          </span>
        </button>
        {openSection === "shipping" && (
          <p className="mt-3 text-gray-600 leading-relaxed transition-all duration-300">
            Ships within <strong>3-5 business days</strong>. Free shipping on
            orders over $50. Returns accepted within 30 days of purchase.
          </p>
        )}
      </div>

      {/* Seller Info */}
      <div>
        <button
          onClick={() => toggleSection("seller")}
          className="w-full flex justify-between items-center font-semibold text-lg hover:text-blue-600"
        >
          Seller Information
          <span className="text-gray-400">
            {openSection === "seller" ? "−" : "+"}
          </span>
        </button>
        {openSection === "seller" && (
          <div className="mt-3 text-gray-600 leading-relaxed transition-all duration-300">
            <p>
              Sold by:{" "}
              <span className="font-medium">{product.seller || "N/A"}</span>
            </p>
            <p>Rating: {product.sellerRating || "N/A"} ★</p>
            <p>Ships from: Karachi, Pakistan</p>
            <p>Warranty: 1 Year</p>
          </div>
        )}
      </div>
    </div>
  );
}
