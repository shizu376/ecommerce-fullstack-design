export default function HomeOutdoor() {
  const products = [
    { name: "Soft chairs", price: "From USD 19", image: "deals/soft-chair.jpg" },
    { name: "Sofa & chair", price: "From USD 19", image: "deals/sofa-chair.jpg" },
    { name: "Kitchen dishes", price: "From USD 19", image: "deals/dishes.jpg" },
    { name: "Smart watches", price: "From USD 19", image: "deals/deal-watch.png" },
    { name: "Kitchen mixer", price: "From USD 100", image: "deals/blender.jpg" },
    { name: "Blenders", price: "From USD 39", image: "deals/blender.jpg" },
    { name: "Home appliance", price: "From USD 19", image: "deals/home-app.jpg" },
    { name: "Coffee maker", price: "From USD 10", image: "deals/coffee-maker.jpg" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-4">
      
      {/* Left big category card */}
      <div
        className="relative rounded-lg overflow-hidden flex flex-col items-start justify-start p-6 text-white"
        style={{
          backgroundImage: "url('deals/home.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Beige overlay */}
        <div className="absolute inset-0 bg-[#f5f5dc]/50"></div>

        <h2 className="relative z-10 text-xl font-semibold mb-4">
          Home and outdoor
        </h2>
        <button className="relative z-10 bg-white text-gray-800 text-xs px-4 py-2 rounded shadow hover:bg-gray-100">
          Source now
        </button>
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
