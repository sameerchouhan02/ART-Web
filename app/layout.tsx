import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Pure Elegance | Luxury Women-Only Salon & Parlour",
  description: "Book verified women-only salon & parlour beauty services at home or in-salon with Pure Elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#FCF8F9] text-gray-900 selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden w-full">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
