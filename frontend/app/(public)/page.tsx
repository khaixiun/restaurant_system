import { Suspense } from "react";
import MenuSection from "@/components/MenuSection";
import { Food } from "@/types/food";
import Link from "next/link";
import { groupByCategory } from "@/lib/foods";
import ErrorBanner from "@/components/ErrorBanner";

async function getFoods(): Promise<Food[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const foods = await getFoods();
  const grouped = groupByCategory(foods);

  return (
    <main className="bg-brand-dark min-h-screen">
      <Suspense fallback={null}>
        <ErrorBanner />
      </Suspense>
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="pt-32 pb-16">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-6">
            Seasonal Selection — Summer 2026
          </p>
          <h1 className="font-serif text-white text-6xl md:text-8xl mb-6">
            Our Menu
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-brand-gold" />
            <div className="w-1.5 h-1.5 rotate-45 bg-brand-gold" />
            <div className="w-12 h-px bg-brand-gold" />
          </div>
          <p className="font-sans text-white/50 text-sm leading-relaxed max-w-sm">
            Crafted with intention. Sourced with care. Each dish tells the story of a season.
          </p>
        </div>

        <div className="w-full h-px bg-white/10" />

        {Object.values(grouped).map((items) => (
          <MenuSection key={items[0].categoryId} items={items.slice(0, 3)} />
        ))}

        <div className="flex justify-center py-16">
          <Link
            href="/menu"
            className="font-sans text-xs tracking-[0.2em] uppercase border border-brand-gold text-brand-gold px-8 py-3 hover:bg-brand-gold hover:text-brand-dark transition-colors duration-300"
          >
            View Full Menu
          </Link>
        </div>

      </div>
    </main>
  );
}