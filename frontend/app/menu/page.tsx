import MenuTabs from "@/components/MenuTabs";
import { Food } from "@/app/types/food";
import { getFoods, groupByCategory } from "@/lib/foods";

export default async function MenuPage() {
  const foods = await getFoods();
  const grouped = groupByCategory(foods);

  return (
    <main className="bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-12">

        <div className="pt-32 pb-16 border-b border-white/10">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
            Aurelius Restaurant
          </p>
          <h1 className="font-serif text-white text-5xl md:text-6xl">
            Full Menu
          </h1>
        </div>

        <div className="py-16">
          <MenuTabs grouped={grouped} />
        </div>

      </div>
    </main>
  );
}