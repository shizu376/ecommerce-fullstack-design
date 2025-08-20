import { useState, useEffect } from "react";

export default function CouponCode({ onApplyCoupon }) {
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    const savedDiscount = localStorage.getItem("couponDiscount");

    if (savedCoupon && savedDiscount) {
      setCoupon(savedCoupon);
      onApplyCoupon(Number(savedDiscount));
      setMessage(`✅ Coupon "${savedCoupon}" applied! You saved ${savedDiscount}%.`);
    }
  }, [onApplyCoupon]);

  const handleApply = (e) => {
    e?.preventDefault?.();
    const coupons = {
      SAVE10: 10, 
      SAVE20: 20  
    };

    if (coupons[coupon.toUpperCase()]) {
      const discount = coupons[coupon.toUpperCase()];
      onApplyCoupon(discount);
      localStorage.setItem("appliedCoupon", coupon.toUpperCase());
      localStorage.setItem("couponDiscount", discount);

      setMessage(`✅ Coupon applied! You saved ${discount}%.`);
    } else {
      setMessage("❌ Invalid coupon code.");
      onApplyCoupon(0);
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("couponDiscount");
    }
  };

  return (
    <form onSubmit={handleApply} className="mt-3 bg-gray-50 p-3 rounded-lg border">
      <h3 className="font-semibold mb-2 text-sm">Have a Coupon Code?</h3>
      <div className="flex">
        <input
          type="text"
          placeholder="Enter coupon"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="border border-r-0 px-3 py-2 rounded-l w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 whitespace-nowrap"
        >
          Apply
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-xs ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
