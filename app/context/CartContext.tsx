"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SALON_SERVICES, ServiceItem } from "../data/services";

export interface CartEntry {
  service: ServiceItem;
  qty: number;
}

interface CartContextType {
  cart: { [id: string]: number };
  cartEntries: CartEntry[];
  totalItemsCount: number;
  subtotal: number;
  originalTotal: number;
  totalSavings: number;
  hygieneKitFee: number;
  promoDiscount: number;
  grandTotal: number;
  appliedPromo: string | null;
  promoError: string;
  serviceMode: "home" | "parlour";
  location: string;
  toastMessage: string | null;
  addToCart: (id: string, name?: string) => void;
  removeFromCart: (id: string) => void;
  clearItem: (id: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  setServiceMode: (mode: "home" | "parlour") => void;
  setLocation: (loc: string) => void;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [serviceMode, setServiceMode] = useState<"home" | "parlour">("home");
  const [location, setLocation] = useState("Vaishali Nagar, Jaipur");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("pure_elegance_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedPromo = localStorage.getItem("pure_elegance_promo");
      if (savedPromo) {
        setAppliedPromo(savedPromo);
      }
      const savedMode = localStorage.getItem("pure_elegance_mode");
      if (savedMode === "home" || savedMode === "parlour") {
        setServiceMode(savedMode);
      }
      const savedLoc = localStorage.getItem("pure_elegance_location");
      if (savedLoc) {
        setLocation(savedLoc);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("pure_elegance_cart", JSON.stringify(cart));
      if (appliedPromo) {
        localStorage.setItem("pure_elegance_promo", appliedPromo);
      } else {
        localStorage.removeItem("pure_elegance_promo");
      }
      localStorage.setItem("pure_elegance_mode", serviceMode);
      localStorage.setItem("pure_elegance_location", location);
    } catch {
      // ignore
    }

    // Sync to Backend API Database
    if (typeof window !== "undefined") {
      const itemsArray = Object.entries(cart).map(([id, qty]) => {
        const s = SALON_SERVICES.find((serv) => serv.id === id);
        return {
          serviceId: id,
          name: s?.name || "Service",
          price: s?.price || 0,
          quantity: qty,
          durationMinutes: s?.durationMinutes || 30,
          brand: s?.brand || "Pure Elegance",
          image: s?.image || "",
        };
      });

      const timer = setTimeout(() => {
        fetch("http://localhost:5000/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "guest_session",
            items: itemsArray,
            serviceMode,
            location,
          }),
        }).catch(() => {
          // quiet fallback if backend server is starting
        });
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [cart, appliedPromo, serviceMode, location]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addToCart = (id: string, name?: string) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current + 1 };
    });
    if (name) {
      showToast(`Added "${name}" to bag ✨`);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const clearItem = (id: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
    try {
      localStorage.removeItem("pure_elegance_cart");
    } catch {
      // ignore
    }
  };

  const applyPromo = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "ELEGANCE200" || trimmed === "WELCOME200" || trimmed === "LUXE15") {
      setAppliedPromo(trimmed);
      setPromoError("");
      showToast(`Promo ${trimmed} applied! 🎉`);
      return true;
    } else {
      setPromoError("Invalid code. Try ELEGANCE200 or LUXE15");
      return false;
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
    showToast("Promo removed");
  };

  // Computations
  const cartEntries: CartEntry[] = Object.entries(cart)
    .map(([id, qty]) => {
      const service = SALON_SERVICES.find((s) => s.id === id);
      return service ? { service, qty } : null;
    })
    .filter((item): item is CartEntry => item !== null);

  const totalItemsCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  const subtotal = cartEntries.reduce((sum, item) => sum + item.service.price * item.qty, 0);

  const originalTotal = cartEntries.reduce(
    (sum, item) => sum + item.service.originalPrice * item.qty,
    0
  );

  const totalSavings = originalTotal - subtotal;
  const hygieneKitFee = subtotal > 0 && subtotal < 999 ? 49 : 0;

  let promoDiscount = 0;
  if (appliedPromo && subtotal > 0) {
    if (appliedPromo === "ELEGANCE200" || appliedPromo === "WELCOME200") {
      promoDiscount = Math.min(200, subtotal);
    } else if (appliedPromo === "LUXE15" || appliedPromo === "GLAM10") {
      promoDiscount = Math.round(subtotal * 0.15);
    }
  }

  const grandTotal = Math.max(0, subtotal + hygieneKitFee - promoDiscount);

  return (
    <CartContext.Provider
      value={{
        cart,
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
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

