import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CouponCode from "../components/CouponCode";

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const totalItems = cart.reduce((s, i) => s + (i.quantity || 1), 0);
  const [couponPercent, setCouponPercent] = useState(() => Number(localStorage.getItem("couponDiscount") || 0));
  const discountAmount = subtotal * (couponPercent / 100);
  const total = Math.max(0, subtotal - discountAmount);

  if (!cart.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/products" className="text-blue-600 underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Cart {totalItems > 0 && `(${totalItems})`}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.map(item => (
            <div key={item.id ?? item._id} className="flex items-center gap-3 sm:gap-4 border rounded-lg p-3 sm:p-4 bg-white">
              <img
                src={
                  item.image
                    ? item.image.startsWith('http') || item.image.startsWith('/')
                      ? item.image
                      : `/${item.image}`
                    : ''
                }
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-blue-600 font-bold">${item.price}</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-2">
                  <button onClick={() => decreaseQuantity(item.id ?? item._id)} className="px-2 sm:px-3 py-1 bg-gray-200 rounded">−</button>
                  <span className="text-sm">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id ?? item._id)} className="px-2 sm:px-3 py-1 bg-gray-200 rounded">+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id ?? item._id)} className="text-red-500 text-sm sm:text-base">Remove</button>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm max-h-[60vh] lg:max-h-[70vh] overflow-auto text-sm lg:sticky lg:top-4">
          <h2 className="font-semibold text-base mb-2">Order Summary</h2>
          <div className="space-y-1">
          {cart.map(item => (
            <div key={item.id ?? item._id} className="py-1 border-b last:border-b-0">
              <div className="flex justify-between gap-2">
                <span className="truncate">{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
          </div>
          <div className="flex justify-between mt-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {couponPercent > 0 && (
            <div className="flex justify-between mt-1 text-green-600"><span>Coupon ({couponPercent}% off)</span><span>- ${discountAmount.toFixed(2)}</span></div>
          )}
          <div className="flex justify-between mt-1 text-base font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <CouponCode onApplyCoupon={(p) => setCouponPercent(p)} />
          <button className="w-full mt-3 bg-green-600 text-white py-2 rounded">Proceed to Checkout</button>
          <Link to="/products" className="block text-center mt-2 text-blue-600">Shop More</Link>
        </div>
      </div>
    </div>
  );
}
