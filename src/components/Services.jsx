import {
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function Services() {
  const services = [
    {
      title: "Source from Industry Hubs",
      image: "services/service1.png",
      icon: <MagnifyingGlassIcon className="w-5 h-5 text-black" />,
    },
    {
      title: "Customize Your Products",
      image: "services/service2.png",
      icon: <WrenchScrewdriverIcon className="w-5 h-5 text-black" />,
    },
    {
      title: "Fast, reliable shipping by ocean or air",
      image: "services/service3.png",
      icon: <TruckIcon className="w-5 h-5 text-black" />,
    },
    {
      title: "Product monitoring and inspection",
      image: "services/service4.jpg",
      icon: <ShieldCheckIcon className="w-5 h-5 text-black" />,
    },
  ];

  return (
    <section className="bg-grey py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-lg font-semibold mb-4">Our extra services</h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
            >
              {/* Image container */}
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-32 object-cover"
                />

                {/* Icon circle */}
                <div className="absolute -bottom-5 right-4 bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shadow">
                  {service.icon}
                </div>
              </div>

              {/* Text */}
              <div className="pt-8 pb-4 px-4">
                <h3 className="text-sm font-medium">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
