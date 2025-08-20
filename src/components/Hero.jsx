export default function Hero() {
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
    <section className="py-4 md:py-6 bg-lightgrey">
      {/* Desktop layout */}
      <div className="hidden md:grid max-w-[1115px] mx-auto bg-white shadow-md rounded-lg grid-cols-4 overflow-hidden">
        {/* LEFT: Categories Sidebar */}
        <div className="col-span-1 bg-gray-50 border-r border-gray-200 p-4">
          <ul className="space-y-3 text-sm">
            {categories.map((cat, i) => (
              <li
                key={i}
                className="text-gray-700 hover:text-blue-600 cursor-pointer transition"
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* CENTER: Main Banner */}
        <div className="col-span-2 relative h-[300px]">
          <img
            src="/banner.jpg"
            alt="Main Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 bg-opacity-30 flex flex-col justify-center px-8">
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              Latest trending <br /> Electronic items
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit">
              Learn more
            </button>
          </div>
        </div>

        {/* RIGHT: Deals Promo */}
        <div className="col-span-1 bg-blue-100 p-4 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold text-blue-700 mb-2">
              Deals of the Day
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Up to 50% off on top brands!
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile single banner */}
      <div className="md:hidden max-w-6xl mx-auto px-4">
        <div className="relative rounded-xl overflow-hidden">
          <img src="/banner.jpg" alt="Main Banner" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 flex flex-col justify-center p-4">
            <h2 className="text-white text-xl font-semibold leading-snug">Latest trending Electronic items</h2>
            <button className="mt-3 bg-white text-gray-800 text-xs px-3 py-1.5 rounded shadow w-fit">Learn more</button>
          </div>
        </div>
      </div>
    </section>
  );
}
