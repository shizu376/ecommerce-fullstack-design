import { useEffect, useMemo, useState } from "react";

export default function Deals() {
  const deals = [
    { name: "Smart watches", discount: "-25%", image: "/deals/deal-watch.png" },
    { name: "Laptops", discount: "-15%", image: "/deals/deal-laptop.png" },
    { name: "GoPro cameras", discount: "-40%", image: "/deals/deal-camera.png" },
    { name: "Headphones", discount: "-25%", image: "/deals/deal-headphones.png" },
    { name: "Android", discount: "-25%", image: "/deals/deal-android.png" },
  ];

  // Countdown target: 3 months from first mount
  const target = useMemo(() => {
    const now = new Date();
    const m = new Date(now);
    m.setMonth(m.getMonth() + 3);
    return m.getTime();
  }, []);

  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, target - Date.now());
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((remaining / (1000 * 60)) % 60);
  const secs = Math.floor((remaining / 1000) % 60);

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Deals and offers</h2>
            <p className="text-sm text-gray-500">Hygiene equipments</p>
          </div>
          {/* Countdown */}
          <div className="flex gap-2">
            {[`${String(days).padStart(2, '0')} Days`, `${String(hours).padStart(2, '0')} Hour`, `${String(mins).padStart(2, '0')} Min`, `${String(secs).padStart(2, '0')} Sec`].map((time, idx) => (
              <div
                key={idx}
                className="bg-gray-100 px-2 py-1 rounded text-xs font-medium"
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {deals.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center border-r last:border-r-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-contain mb-2"
              />
              <p className="text-sm">{item.name}</p>
              <span className="text-red-500 text-xs font-semibold">
                {item.discount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
