"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES, SALON_SERVICES, ServiceItem } from "./data/services";
import { useCart } from "./context/CartContext";

export default function ParlourStorePage() {
  const router = useRouter();
  const {
    cart,
    totalItemsCount,
    grandTotal,
    totalSavings,
    promoDiscount,
    serviceMode,
    location,
    toastMessage,
    addToCart,
    removeFromCart,
    setServiceMode,
    setLocation,
    showToast,
  } = useCart();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "bestseller" | "budget" | "quick">("all");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Filtered & Sorted Services
  const filteredServices = useMemo(() => {
    let list = SALON_SERVICES;

    if (selectedCategory !== "all") {
      list = list.filter((s) => s.category === selectedCategory);
    }

    if (quickFilter === "bestseller") {
      list = list.filter((s) => s.badge || s.rating >= 4.9);
    } else if (quickFilter === "budget") {
      list = list.filter((s) => s.price < 999);
    } else if (quickFilter === "quick") {
      list = list.filter((s) => s.durationMinutes <= 40);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.brand.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "popular") return b.reviewsCount - a.reviewsCount;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, quickFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FCF8F9] text-gray-800 flex flex-col font-sans pb-28 md:pb-12 w-full overflow-x-hidden selection:bg-rose-200">
      {/* --- TOP LUXURY ANNOUNCEMENT STRIP --- */}
      <div className="bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#E11D48] text-white text-[11px] sm:text-xs py-1.5 px-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium truncate w-full sm:w-auto">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider uppercase shrink-0">
              Women Only
            </span>
            <span className="truncate">🌸 100% Female Certified Beauticians • Sealed Disposable Hygiene Kits</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-rose-100 shrink-0">
            <span className="flex items-center gap-1">🛡️ Police Verified Staff</span>
            <span className="flex items-center gap-1">⭐ 4.9/5 Rating (45k+ Appointments)</span>
          </div>
        </div>
      </div>

      {/* --- LUXURY HEADER NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          {/* Main Top Header Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#BE123C] via-[#E11D48] to-[#FB7185] flex items-center justify-center text-white shadow-md shadow-rose-300/40">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg sm:text-2xl font-black tracking-tight text-gray-900 leading-none">
                    Pure <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">Elegance</span>
                  </h1>
                  <span className="hidden sm:inline bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-rose-200">
                    Luxe
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-rose-500 font-bold mt-0.5">
                  Haute Coiffure &amp; Beauty Atelier
                </p>
              </div>
            </Link>

            {/* Desktop Location Dropdown */}
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-rose-100 text-xs text-gray-600">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 text-xs">
                📍
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium uppercase tracking-wider">Service Location</span>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Vaishali Nagar, Jaipur">Vaishali Nagar, Jaipur</option>
                  <option value="Mansarovar, Jaipur">Mansarovar, Jaipur</option>
                  <option value="Malviya Nagar, Jaipur">Malviya Nagar, Jaipur</option>
                  <option value="C-Scheme, Jaipur">C-Scheme, Jaipur</option>
                  <option value="Connaught Place, Delhi">Connaught Place, Delhi</option>
                  <option value="Bandra West, Mumbai">Bandra West, Mumbai</option>
                </select>
              </div>
            </div>

            {/* Desktop Mode Toggle (Salon at Home vs Visit Parlour) */}
            <div className="hidden md:flex bg-rose-50/80 p-1 rounded-2xl border border-rose-200/80 items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setServiceMode("home")}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  serviceMode === "home"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm font-bold"
                    : "text-gray-600 hover:text-rose-600"
                }`}
              >
                <span>🏠</span>
                <span>Salon at Home</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceMode("parlour")}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  serviceMode === "parlour"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm font-bold"
                    : "text-gray-600 hover:text-rose-600"
                }`}
              >
                <span>🏛️</span>
                <span>Visit Parlour</span>
              </button>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xs relative">
              <input
                type="text"
                placeholder="Search 'Diamond Facial', 'Rica Wax'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-200 rounded-full py-2 pl-9 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-gray-400"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Header Right Actions (Go to /cart Page) */}
            <div className="flex items-center gap-2">
              {/* Mobile Location */}
              <div className="lg:hidden flex items-center text-[11px] text-gray-700 bg-rose-50/80 px-2 py-1.5 rounded-xl border border-rose-200/80 max-w-[125px] truncate">
                <span className="text-rose-600 mr-1 shrink-0 text-xs">📍</span>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-gray-800 focus:outline-none cursor-pointer truncate w-full"
                >
                  <option value="Vaishali Nagar, Jaipur">Vaishali Nagar</option>
                  <option value="Mansarovar, Jaipur">Mansarovar</option>
                  <option value="Malviya Nagar, Jaipur">Malviya Nagar</option>
                  <option value="C-Scheme, Jaipur">C-Scheme</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>

              {/* Direct Link to Cart Page */}
              <Link
                href="/cart"
                className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-rose-300/40 transition-all transform active:scale-95 shrink-0"
              >
                <span>🛍️</span>
                <span className="hidden sm:inline">Go to Cart</span>
                {totalItemsCount > 0 ? (
                  <span className="bg-white text-rose-700 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-xs">
                    {totalItemsCount} • ₹{grandTotal}
                  </span>
                ) : (
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">0</span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Second Row: Mode Switcher */}
          <div className="md:hidden mt-2.5">
            <div className="grid grid-cols-2 bg-rose-50/80 p-1 rounded-xl border border-rose-200/80 text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setServiceMode("home")}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs ${
                  serviceMode === "home"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs font-black"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                <span>🏠</span>
                <span>Salon at Home</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceMode("parlour")}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs ${
                  serviceMode === "parlour"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs font-black"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                <span>🏛️</span>
                <span>Visit Parlour</span>
              </button>
            </div>
          </div>

          {/* Mobile Third Row: Search Input */}
          <div className="md:hidden mt-2 relative">
            <input
              type="text"
              placeholder="Search 'Facial', 'Rica Wax', 'Hair Spa'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-8 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-gray-400"
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-xs text-gray-400 px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* --- CATEGORY PILLS BAR (SWIPEABLE HORIZONTAL) --- */}
        <div className="border-t border-rose-100 bg-[#FFF7F9] py-2 shadow-inner">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all transform active:scale-95 shrink-0 ${
                      isActive
                        ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm shadow-rose-300"
                        : "bg-white text-gray-700 hover:bg-rose-50 border border-rose-200/80"
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* --- HERO SHOWCASE (CURATED LUXE OFFERS) --- */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 pb-2 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Bridal & Festive */}
          <div className="bg-gradient-to-br from-[#9F1239] via-[#BE123C] to-[#E11D48] text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="z-10">
              <span className="bg-white/20 backdrop-blur-md text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                👑 Wedding Sanctuary
              </span>
              <h2 className="text-lg sm:text-xl font-black mt-2 leading-tight">Pre-Bridal &amp; Event Makeover</h2>
              <p className="text-xs text-rose-100 mt-1">
                Flat 40% OFF on complete 7-in-1 head-to-toe makeover packages.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10 pt-2 border-t border-white/10">
              <span className="text-xs bg-black/30 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                Code: LUXE15
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("bridal");
                  showToast("Bridal & Makeover suite opened! 💄");
                }}
                className="bg-white text-rose-800 font-black text-xs px-3.5 py-1.5 rounded-xl shadow hover:bg-rose-50 transition-colors"
              >
                View Packages &rarr;
              </button>
            </div>
          </div>

          {/* Card 2: Welcome Gift */}
          <div className="bg-gradient-to-br from-[#581C87] via-[#7E22CE] to-[#A855F7] text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="z-10">
              <span className="bg-white/20 backdrop-blur-md text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                🎁 First Appointment Privilege
              </span>
              <h2 className="text-lg sm:text-xl font-black mt-2 leading-tight">Flat ₹200 OFF Today</h2>
              <p className="text-xs text-purple-100 mt-1">
                Valid on any beauty service or combo above ₹799. Auto-applied in your cart.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10 pt-2 border-t border-white/10">
              <span className="text-xs bg-black/30 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                Code: ELEGANCE200
              </span>
              <span className="text-xs text-purple-200 font-bold">✓ Applied in Cart</span>
            </div>
          </div>

          {/* Card 3: Safety & Hygiene */}
          <div className="bg-gradient-to-br from-[#9A3412] via-[#C2410C] to-[#EA580C] text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hidden md:flex">
            <div className="z-10">
              <span className="bg-white/20 backdrop-blur-md text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                🛡️ Sealed Hygiene Monodose
              </span>
              <h2 className="text-lg sm:text-xl font-black mt-2 leading-tight">100% Single-Use Disposables</h2>
              <p className="text-xs text-amber-100 mt-1">
                Every tool, wooden spatula, towel, and bedsheet is sealed &amp; opened in front of you.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10 pt-2 border-t border-white/10">
              <span className="text-xs bg-black/30 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full font-bold">
                🔒 Sealed Kits Only
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("waxing");
                  showToast("Painless Rica Waxing opened! 🍯");
                }}
                className="bg-white text-orange-900 font-black text-xs px-3.5 py-1.5 rounded-xl shadow hover:bg-orange-50 transition-colors"
              >
                Rica Italian Wax &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK FILTER PILLS & SORT CONTROLS --- */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-1 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setQuickFilter("all")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                quickFilter === "all"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter("bestseller")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                quickFilter === "bestseller"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span>⭐</span>
              <span>Bestsellers</span>
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter("budget")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                quickFilter === "budget"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span>💰</span>
              <span>Under ₹999</span>
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter("quick")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                quickFilter === "quick"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span>⚡</span>
              <span>Express (&lt; 40 mins)</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs ml-auto">
            <span className="text-gray-400 font-medium text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-[11px] font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer shadow-xs"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated (4.8+)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* --- SERVICES CATALOG GRID --- */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 flex-1 w-full">
        {/* Category Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name || "All Atelier Services"}
            </h3>
            <span className="bg-rose-100 text-rose-800 text-xs font-black px-2.5 py-0.5 rounded-full">
              {filteredServices.length} {filteredServices.length === 1 ? "Service" : "Services"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {serviceMode === "home"
              ? "Certified female aesthetician arrives with sanitized tools & disposable bedsheets."
              : "Walk-in experience at Pure Elegance sanitized boutique studio."}
          </p>
        </div>

        {/* Services Cards Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-rose-100 shadow-xs max-w-md mx-auto my-10">
            <span className="text-5xl block mb-3">🔍</span>
            <h4 className="text-lg font-bold text-gray-800">No Services Found</h4>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              We couldn&apos;t find any service matching your filter or search.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setQuickFilter("all");
              }}
              className="bg-rose-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow hover:bg-rose-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map((service) => {
              const qtyInCart = cart[service.id] || 0;
              const discountPercent = Math.round(
                ((service.originalPrice - service.price) / service.originalPrice) * 100
              );

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-rose-100/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-rose-300 w-full"
                >
                  {/* Card Image Area */}
                  <div className="relative">
                    <div className="w-full h-44 sm:h-48 overflow-hidden bg-rose-50 relative">
                      <Image
                        src={service.image}
                        alt={service.name}
                        width={700}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    {/* Badge */}
                    {service.badge && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                        ★ {service.badge}
                      </span>
                    )}

                    {/* Brand Pill */}
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                      {service.brand}
                    </span>

                    {/* Bottom Image Stats (Rating & Time) */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold">
                        <span className="text-amber-300">★</span>
                        <span>{service.rating}</span>
                        <span className="text-[10px] text-gray-300 font-normal">({service.reviewsCount})</span>
                      </span>
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
                        <span>⏱</span>
                        <span>{service.durationMinutes} mins</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-base leading-snug group-hover:text-rose-600 transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Included Steps Checklist */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {service.features.slice(0, 3).map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-rose-50 text-rose-800 font-semibold px-2 py-0.5 rounded-md border border-rose-100"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg sm:text-xl font-black text-gray-900">₹{service.price}</span>
                          <span className="text-xs text-gray-400 line-through">₹{service.originalPrice}</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                          {discountPercent}% OFF
                        </span>
                      </div>

                      {/* Add Button / Counter (Food Delivery Style) */}
                      <div>
                        {qtyInCart === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(service.id, service.name)}
                            className="bg-white border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white font-black text-xs px-5 py-2 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1.5 tracking-wider uppercase min-h-[40px] cursor-pointer"
                          >
                            <span>ADD</span>
                            <span className="text-sm font-black">+</span>
                          </button>
                        ) : (
                          <div className="flex items-center bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl shadow-md overflow-hidden text-xs font-black min-h-[40px]">
                            <button
                              type="button"
                              onClick={() => removeFromCart(service.id)}
                              className="px-3 py-2 hover:bg-rose-700 active:bg-rose-800 transition-colors"
                              title="Decrease"
                            >
                              −
                            </button>
                            <span className="px-3 py-2 bg-rose-800/80 text-white min-w-[28px] text-center font-black">
                              {qtyInCart}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(service.id, service.name)}
                              className="px-3 py-2 hover:bg-rose-700 active:bg-rose-800 transition-colors"
                              title="Increase"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="mt-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-bold underline decoration-dotted"
                      >
                        View Full Protocol &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- LUXURY TRUST STATS --- */}
        <section className="mt-14 sm:mt-18 bg-gradient-to-br from-rose-50/70 via-pink-50/40 to-amber-50/40 rounded-3xl p-6 sm:p-10 border border-rose-100">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="bg-rose-100 text-rose-800 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Uncompromising Safety &amp; Quality
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-gray-900 mt-2 tracking-tight">
              Why 50,000+ Women Trust Pure Elegance
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Elevating women&apos;s salon care with unmatched hygiene, branded products, and vetted aestheticians.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-rose-100/70">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                👩‍🦰
              </div>
              <h5 className="font-extrabold text-sm text-gray-900">100% Female Verified</h5>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Thorough background check &amp; minimum 3+ years salon experience.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xs border border-rose-100/70">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                🧴
              </div>
              <h5 className="font-extrabold text-sm text-gray-900">Sealed Disposable Kits</h5>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Single-use sheets, wooden spatulas, and sanitized tools opened in front of you.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xs border border-rose-100/70">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                💎
              </div>
              <h5 className="font-extrabold text-sm text-gray-900">100% Genuine Brands</h5>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Authentic L&apos;Oréal, O3+, Rica Italy, and VLCC professional products guaranteed.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xs border border-rose-100/70">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                💳
              </div>
              <h5 className="font-extrabold text-sm text-gray-900">Pay After Inspection</h5>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Inspect the glow and finish first. Pay seamlessly via UPI or Cash.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- FLOATING BOTTOM CART BAR (TAKES YOU DIRECTLY TO /cart) --- */}
      {totalItemsCount > 0 && (
        <aside
          aria-label="Floating Cart Summary"
          className="fixed bottom-3 left-3 right-3 z-40 bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#E11D48] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 max-w-xl mx-auto"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                {totalItemsCount} {totalItemsCount === 1 ? "Service" : "Services"}
              </span>
              <span className="text-base font-black">₹{grandTotal}</span>
            </div>
            {totalSavings > 0 && (
              <p className="text-[10px] text-rose-100">Saving ₹{totalSavings + promoDiscount} on this visit!</p>
            )}
          </div>
          <Link
            href="/cart"
            className="bg-white text-rose-800 font-black text-xs px-4 py-2 rounded-xl shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <span>Proceed to Cart &rarr;</span>
          </Link>
        </aside>
      )}

      {/* --- SERVICE DETAIL PROTOCOL MODAL --- */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative border border-rose-100 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm hover:bg-gray-200"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-rose-100 text-rose-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                {selectedService.category}
              </span>
              <span className="text-xs text-gray-500 font-semibold">• {selectedService.brand}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-gray-900">{selectedService.name}</h4>
            <div className="flex items-center gap-2.5 text-xs text-gray-600 my-2">
              <span className="font-bold text-amber-500">★ {selectedService.rating}</span>
              <span>({selectedService.reviewsCount} verified reviews)</span>
              <span>•</span>
              <span>⏱ {selectedService.durationMinutes}m duration</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mt-2">{selectedService.description}</p>

            <div className="mt-4 bg-[#FFF8FA] rounded-2xl p-4 border border-rose-100">
              <h5 className="text-xs font-black text-rose-900 mb-2 uppercase tracking-wider">
                Full Service Protocol &amp; Inclusions:
              </h5>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {selectedService.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-emerald-500 font-black">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <span className="text-xl font-black text-gray-900">₹{selectedService.price}</span>
                <span className="text-xs text-gray-400 line-through ml-2">₹{selectedService.originalPrice}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToCart(selectedService.id, selectedService.name);
                  setSelectedService(null);
                }}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                + Add To Bag
              </button>
            </div>
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
          <Link href="/cart" className="underline text-rose-300 ml-1">
            View Bag &rarr;
          </Link>
        </aside>
      )}

      {/* --- FOOTER --- */}
      <footer className="mt-16 border-t border-rose-100 bg-white py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-rose-600 text-base">✨</span>
            <span className="font-black text-gray-900">Pure Elegance Women&apos;s Salon &amp; Spa</span>
            <span className="hidden sm:inline">— India&apos;s Trusted Women-Only Beauty Atelier</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-[11px]">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Helpline: 1800-PURE-ELEGANCE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
