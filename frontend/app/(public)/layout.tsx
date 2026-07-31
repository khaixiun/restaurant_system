import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Aurelius | Luxury Dining",
  description: "Crafted with intention. Sourced with care.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {children}
      </main>
      <ChatWidget />
    </>
  );
}