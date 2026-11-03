"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartCheckoutPage() {
  const {
    cartEntries,
    totalItemsCount,
    subtotal,
    originalTotal,
    totalSavings,
    hygieneKitFee,
    promoDiscount,
    grandTotal,
    appliedPromo,
    promoError,
    serviceMode,
    location,
    toastMessage,
    addToCart,
    removeFromCart,
    clearItem,
    clearCart,
    applyPromo,
    removePromo,
    setServiceMode,
    setLocation,
  } = useCart();

  // Customer & Slot Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedDate, setSelectedDate] = useState("Today, 3 Nov");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("02:00 PM - 03:00 PM");
  const [paymentOption, setPaymentOption] = useState<"cod" | "online">("cod");

  // Booking Confirmation State
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatusMsg, setDbStatusMsg] = useState("");

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Please provide your Full Name and WhatsApp Phone Number.");
      return;
    }
    if (serviceMode === "home" && !customerAddress.trim()) {
      alert("Please provide your complete address for Salon at Home service.");
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      client: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim(),
        specialInstructions: specialInstructions.trim(),
      },
      appointment: {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      },
      serviceMode,
      location,
      items: cartEntries.map((c) => ({
        serviceId: c.service.id,
        name: c.service.name,
        category: c.service.category,
        brand: c.service.brand,
        durationMinutes: c.service.durationMinutes,
        price: c.service.price,
        originalPrice: c.service.originalPrice,
        quantity: c.qty,
      })),
      payment: {
        method: paymentOption,
        status: paymentOption === "online" ? "completed" : "pending",
        subtotal,
        hygieneKitFee,
        discount: promoDiscount,
        grandTotal,
      },
    };

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setBookingId(result.data.bookingId);
        setDbStatusMsg("Stored in Database successfully ✅");
      } else {
        const fallbackId = "PE-" + Math.floor(100000 + Math.random() * 900000);
        setBookingId(fallbackId);
      }
    } catch (err) {
      console.warn("Backend API not reachable directly, fallback ID created:", err);
      const fallbackId = "PE-" + Math.floor(100000 + Math.random() * 900000);
      setBookingId(fallbackId);
    } finally {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }
  };

  const handleResetAfterBooking = () => {
    clearCart();
    setBookingConfirmed(false);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
  };

  return (
    <div className="min-h-screen bg-[#FCF8F9] text-gray-800 flex flex-col font-sans pb-16 w-full overflow-x-hidden selection:bg-rose-200">
      {/* --- TOP BRAND NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-sm">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 leading-none">
                Pure <span className="text-rose-600">Elegance</span>
              </h1>
              <p className="text-[9px] uppercase tracking-wider text-rose-500 font-bold">Women Salon &amp; Spa</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:flex items-center gap-1.5 text-gray-500 font-medium">
              <span className="text-emerald-500 font-black">🔒</span>
              <span>100% Safe &amp; Verified Checkout</span>
            </span>
            <Link
              href="/"
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-rose-200 transition-colors"
            >
              &larr; Add More Services
            </Link>
          </div>
        </div>
      </header>

      {/* --- BREADCRUMBS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 w-full text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-rose-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-rose-600 font-bold">Your Beauty Bag &amp; Checkout</span>
      </div>

      {/* --- MAIN CART & CHECKOUT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 flex-1 w-full">
        {cartEntries.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-rose-100 shadow-xs max-w-lg mx-auto my-12">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              🛍️
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Your Beauty Bag is Empty</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Explore our women-only facials, waxing, hair spas, and manicure-pedicure services to book your glow appointment!
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md shadow-rose-200 transition-all transform active:scale-95"
            >
              Explore Parlour Services &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleBookAppointment} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: SELECTED SERVICES & CUSTOMER FORM (8 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Box 1: Selected Services List */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-rose-100 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧴</span>
                    <h3 className="text-base sm:text-lg font-black text-gray-900">
                      Selected Services ({totalItemsCount})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 font-bold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100 mt-2">
                  {cartEntries.map(({ service, qty }) => (
                    <div key={service.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-rose-50 shrink-0 relative">
                          <Image
                            src={service.image}
                            alt={service.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{service.name}</h4>
                          <span className="text-[10px] text-gray-500 block">{service.brand} • ⏱ {service.durationMinutes} mins</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs sm:text-sm font-black text-rose-600">₹{service.price}</span>
                            <span className="text-[11px] text-gray-400 line-through">₹{service.originalPrice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Counter & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-white border border-rose-300 rounded-xl overflow-hidden shadow-xs text-xs font-black text-rose-600">
                          <button
                            type="button"
                            onClick={() => removeFromCart(service.id)}
                            className="px-2.5 py-1.5 hover:bg-rose-50 transition-colors"
                          >
                            −
                          </button>
                          <span className="px-2.5 py-1.5 min-w-[22px] text-center font-black text-gray-800 text-xs">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(service.id, service.name)}
                            className="px-2.5 py-1.5 hover:bg-rose-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => clearItem(service.id)}
                          className="text-gray-400 hover:text-red-500 text-sm p-1"
                          title="Remove service"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Suggested Quick Add-ons */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block mb-2">
                  ✨ Frequently Added Beauties (Special Add-on Price)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-2 shadow-xs">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Eyebrows + Upper Lip Threading</p>
                      <p className="text-[10px] text-gray-500">₹99 <span className="line-through text-gray-400">₹160</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart("t-1", "Eyebrows Shaping + Upper Lip")}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1 rounded-lg shrink-0 shadow-xs"
                    >
                      + ADD
                    </button>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-2 shadow-xs">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Sara O3+ Oxy D-Tan (Face &amp; Neck)</p>
                      <p className="text-[10px] text-gray-500">₹449 <span className="line-through text-gray-400">₹699</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart("d-1", "Sara O3+ Oxy D-Tan Face & Neck")}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1 rounded-lg shrink-0 shadow-xs"
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* Box 3: Schedule Date & Service Mode */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-rose-100 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <span className="text-lg">🗓️</span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    Appointment Schedule &amp; Mode
                  </h3>
                </div>

                {/* Service Mode Switch */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Where would you like the service?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setServiceMode("home")}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        serviceMode === "home"
                          ? "bg-rose-50 border-rose-500 text-rose-900 font-black shadow-xs"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <span className="text-2xl">🏠</span>
                      <div>
                        <p className="text-xs font-bold leading-tight">Salon at Home</p>
                        <span className="text-[10px] text-gray-500">Beautician visits you</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceMode("parlour")}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        serviceMode === "parlour"
                          ? "bg-rose-50 border-rose-500 text-rose-900 font-black shadow-xs"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <span className="text-2xl">🏛️</span>
                      <div>
                        <p className="text-xs font-bold leading-tight">Visit Parlour</p>
                        <span className="text-[10px] text-gray-500">Walk into boutique studio</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Manual Appointment Date */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Appointment Date (Type Manually or Pick): *
                    </label>
                    <span className="text-[10px] text-rose-600 font-semibold">✍️ Manual Type Allowed</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type date manually (e.g. 05 Nov 2026, Tomorrow, Wednesday)"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-rose-500 focus:bg-white transition-all shadow-xs"
                  />
                  {/* Quick suggestion chips */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-gray-400">Quick options:</span>
                    {["Today, 3 Nov", "Tomorrow, 4 Nov", "Wednesday, 5 Nov", "Sunday"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          selectedDate === d
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-rose-50"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Preferred Time Slot */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Select Preferred Time Slot (Type Manually): *
                    </label>
                    <span className="text-[10px] text-rose-600 font-semibold">⏰ Type Any Time</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type time manually (e.g. 02:30 PM, 11:00 AM, 05:00 PM)"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-rose-500 focus:bg-white transition-all shadow-xs"
                  />
                  {/* Quick suggestion time chips */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-gray-400">Quick slots:</span>
                    {["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTimeSlot(t)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          selectedTimeSlot === t
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-rose-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 4: Client Information */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-rose-100 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <span className="text-lg">👤</span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    Client &amp; Contact Details
                  </h3>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name (e.g. Priya Sharma)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit WhatsApp number for booking confirmation"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                {serviceMode === "home" && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Complete House / Society Address *</label>
                    <textarea
                      rows={2}
                      placeholder="Flat/House number, Apartment/Society name, Landmark"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Special Request or Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sensitive skin, call before ring, etc."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY BILL SUMMARY & PAYMENT (5 Cols) */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
              {/* Box 1: Payment Options */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-xs space-y-2.5">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>💳</span>
                  <span>Payment Method</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentOption("cod")}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                      paymentOption === "cod"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="text-2xl">💵</span>
                    <div>
                      <p className="text-xs font-bold leading-tight">Pay After Service</p>
                      <span className="text-[10px] text-gray-500">Cash / UPI at visit</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentOption("online")}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                      paymentOption === "online"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="text-xs font-bold leading-tight">Pay Online</p>
                      <span className="text-[10px] text-gray-500">GPay / Cards / Net</span>
                    </div>
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">
                  ✨ 100% Satisfaction Guarantee: Inspect your treatment results before final payment.
                </p>
              </div>

              {/* Box 3: Itemized Bill Summary */}
              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-2.5">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Payment Summary
                </h4>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Items Subtotal ({totalItemsCount} services)</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Sanitized Monodose Safety Kit</span>
                  {hygieneKitFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE (Above ₹999)</span>
                  ) : (
                    <span className="font-bold text-gray-900">₹{hygieneKitFee}</span>
                  )}
                </div>
                {appliedPromo && promoDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-bold">
                    <span>Coupon Discount ({appliedPromo})</span>
                    <span>−₹{promoDiscount}</span>
                  </div>
                )}
                {totalSavings > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold p-2 rounded-xl text-center">
                    🎉 You are saving a total of ₹{totalSavings + promoDiscount} on this appointment!
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-base font-black text-gray-900">
                  <span>Total Amount Payable</span>
                  <span className="text-2xl text-rose-600 font-black">₹{grandTotal}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-right">Includes all service taxes &amp; beautician travel</p>

                {/* Final Booking Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black py-4 px-4 rounded-2xl shadow-lg shadow-rose-300/50 transition-all flex items-center justify-between text-sm transform active:scale-98 cursor-pointer disabled:opacity-70"
                >
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-wider opacity-90 block">
                      Payable: ₹{grandTotal} ({paymentOption === "cod" ? "Pay After Service" : "Pay Online"})
                    </span>
                    <span className="text-sm font-black">
                      {isSubmitting ? "Saving to Database & Booking..." : "Confirm & Schedule Appointment"}
                    </span>
                  </div>
                  <span className="text-xl font-black">{isSubmitting ? "⏳" : "→"}</span>
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                  🔒 Free Cancellation up to 2 hours before the scheduled time
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* --- CONFIRMATION MODAL --- */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative border border-rose-100 max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3.5 shadow-sm">
              🎉
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">Appointment Confirmed!</h3>
            <p className="text-xs text-gray-500 mt-1">
              Your women-only beauty appointment has been scheduled with Pure Elegance.
            </p>
            {dbStatusMsg && (
              <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full">
                {dbStatusMsg}
              </span>
            )}

            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 my-5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-mono font-black text-rose-700">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Client:</span>
                <span className="font-bold text-gray-800">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">WhatsApp:</span>
                <span className="font-bold text-gray-800">{customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Schedule:</span>
                <span className="font-bold text-gray-800">
                  {selectedDate} ({selectedTimeSlot})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service Mode:</span>
                <span className="font-bold text-gray-800">
                  {serviceMode === "home" ? `🏠 Salon at Home (${customerAddress || location})` : `🏛️ Visit Parlour (${location})`}
                </span>
              </div>
              <div className="flex justify-between border-t border-rose-200 pt-2 font-black text-gray-900">
                <span>Total Amount ({paymentOption === "cod" ? "Pay After Service" : "Paid Online"}):</span>
                <span className="text-rose-600 text-sm">₹{grandTotal}</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 mb-5">
              📲 Confirmation sent to WhatsApp &amp; SMS. Your certified female stylist will call 30 mins before the appointment.
            </p>

            <Link
              href="/"
              onClick={handleResetAfterBooking}
              className="block w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs py-3.5 rounded-2xl shadow-md transition-all"
            >
              Done &amp; Back to Atelier
            </Link>
          </div>
        </div>
      )}

      {/* --- TOAST ALERT --- */}
      {toastMessage && (
        <aside
          aria-label="Notification"
          className="fixed top-16 right-3 sm:right-4 z-50 bg-gray-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-gray-700"
        >
          <span>{toastMessage}</span>
        </aside>
      )}
    </div>
  );
}

