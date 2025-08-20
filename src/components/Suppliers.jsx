export default function Suppliers() {
  const regions = [
    { name: "Pakistan", img: "flags/pakistan.png" },
    { name: "United Kingdom", img: "flags/uk.png" },
    { name: "United States", img: "flags/usa.png" },
    { name: "France", img: "flags/france.png" },
    { name: "China", img: "flags/china.png" },
    { name: "Iran", img: "flags/iran.png" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 font-sans">
      <h3 className="text-lg font-semibold mb-4">Suppliers by Region</h3>
      <div className="bg-white rounded-lg p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {regions.map((region, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex flex-col items-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:bg-blue-50"
            >
              <img
                src={region.img}
                alt={region.name}
                className="w-16 h-16 object-cover rounded-full mb-2 border border-gray-200"
              />
              <p className="text-sm font-medium text-center">{region.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
