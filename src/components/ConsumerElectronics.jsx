export default function ConsumerElectronics() {
  const products = [
    { name: "Smart watches", price: "From USD 19", image: "deals/deal-watch.png" },
    { name: "Cameras", price: "From USD 89", image: "deals/deal-camera.png" },
    { name: "Headphones", price: "From USD 10", image: "deals/deal-headphones.png" },
    { name: "Smart watches", price: "From USD 90", image: "deals/deal-watch.png" },
    { name: "Gaming set", price: "From USD 35", image: "deals/deal-headphones.png" },
    { name: "Laptops & PC", price: "From USD 340", image: "deals/deal-laptop.png" },
    { name: "Smartphones", price: "From USD 19", image: "deals/deal-android.png" },
    { name: "Electric kettle", price: "From USD 240", image: "deals/kettle.jpg" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-4 items-stretch">
      {/* Left big category card */}
      <div
        className="relative rounded-lg overflow-hidden flex flex-col p-6 w-full h-full"
        style={{
          backgroundImage: "url('deals/electronics-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Light blue overlay */}
        <div className="absolute inset-0 bg-blue-200/50"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Consumer electronics and gadgets
          </h2>
          <button className="bg-white text-gray-800 text-xs px-4 py-2 rounded shadow hover:bg-gray-100">
            Source now
          </button>
        </div>
      </div>

      {/* Right product grid */}
      <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-lg p-4">
        {products.map((product, idx) => (
          <div key={idx} className="text-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-24 object-contain mb-2"
            />
            <p className="text-sm">{product.name}</p>
            <span className="text-xs text-gray-500">{product.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
