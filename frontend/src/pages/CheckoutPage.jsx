import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShopStore } from "../store/shopStore";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import StripeCheckoutForm from "../components/StripeCheckoutForm";




import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, createBooking } = useShopStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    address: "",
    paymentMethod: "CashOnDelivery",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.address || !form.paymentMethod) {
      alert("Please fill all fields");
      return;
    }



    try {
      await createBooking({
        address: form.address,
        paymentMethod: form.paymentMethod,
      });


      navigate("/order");
    } catch (err) {
      alert("Failed to place booking");
    }
  };


 

  
const totalAmount = cart.reduce((acc, item) => {
  const price = parseFloat(item.tyre?.price) || 0;
  const qty = parseInt(item.quantity) || 1;
  return acc + price * qty;
}, 0);

const stripeAmount = Math.round(totalAmount * 100);






  return (
    <>
      <Navbar />

      {/* Progress Bar */}
      <div className="flex justify-center items-center space-x-3 mt-23 p-4 sm:mt-34 mb-8">
        <div className="text-green-700 font-medium">1. Shopping Cart</div>
        <span className="text-gray-400">—</span>
        <div className="text-green-700 font-medium">2. Checkout</div>
        <span className="text-gray-400">—</span>
        <div className="text-gray-400">3. Order Complete</div>
      </div>

      <div className="min-h-screen p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>

        <div className="space-y-4">
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Delivery Address(give your full address)"
            className="w-full border p-2 rounded"
          />

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="CashOnDelivery">Cash On Delivery</option>
            <option value="Stripe" >Stripe</option>
          </select>
          {/* Payment Method Selection Output */}
          {form.paymentMethod === "Stripe" && (
            <Elements stripe={stripePromise}>
              <StripeCheckoutForm
                amount={ stripeAmount} // in cents
                
                
                onSuccess={async () => {
                  try {
                    await createBooking({
                      address: form.address,
                      paymentMethod: "Stripe",
                    });
                    navigate("/order");
                  } catch (err) {
                    alert("Booking failed after Stripe payment");
                  }
                }}
              />
            </Elements>
          )}


          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <button
              onClick={() => navigate("/shipping")}
              className="w-full sm:w-auto border border-gray-400 text-gray-700 py-2 px-6 rounded hover:bg-gray-100 hover:cursor-pointer"
            >
              ← Back to Shipping
            </button>

            {form.paymentMethod === "CashOnDelivery" && (
              <button
                onClick={handlePlaceOrder}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded font-bold hover:cursor-pointer"
                disabled={cart.length === 0}
              >
                Place Order
              </button>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
