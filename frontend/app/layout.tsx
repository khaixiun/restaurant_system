import type { Metadata } from "next";
import { Playfair_Display, Geist } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Aurelius | Luxury Dining",
  description: "Crafted with intention. Sourced with care.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${geist.variable}`}>
      <body className="bg-brand-dark text-white antialiased min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}