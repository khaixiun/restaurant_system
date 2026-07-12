import FoodCard from "@/components/FoodCard";
import { Food } from "@/app/types/food";

interface MenuSectionProps {
  items: Food[];
}

export default function MenuSection({ items }: MenuSectionProps) {
  if (items.length === 0) return null;

  const categoryName = items[0].categoryName;

  return (
    <section className="py-16">
      <div className="mb-10">
        <h2 className="font-serif text-white text-4xl mb-3">{categoryName}</h2>
        <div className="w-8 h-px bg-brand-gold" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </section>
  );
}