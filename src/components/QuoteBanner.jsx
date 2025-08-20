import { useState } from "react";
import { useSnackbar } from "../context/SnackbarContext";

export default function QuoteBanner() {
  const { showSnackbar } = useSnackbar();
  const [item, setItem] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Pcs");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      //  integrate with backend if available
      showSnackbar("Your inquiry was sent to suppliers", { type: "success" });
      setItem("");
      setDetails("");
      setQuantity("");
      setUnit("Pcs");
    } catch (err) {
      showSnackbar("Failed to send inquiry", { type: "error" });
    }
  };
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          backgroundImage: "url('warehouse.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/90 to-blue-400/80"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="text-white flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
              An easy way to send <br /> requests to all suppliers
            </h2>
            <p className="mt-3 text-sm text-blue-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </p>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <form className="space-y-4" onSubmit={onSubmit}>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="What item you need?"
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                required
              />
              <textarea
                placeholder="Type more details"
                rows="3"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              ></textarea>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option>Pcs</option>
                  <option>Kg</option>
                  <option>Liters</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-half text-sm"
              >
                Send inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
