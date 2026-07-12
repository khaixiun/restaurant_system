import Image from "next/image";
import { Food } from "@/app/types/food";

interface FoodCardProps {
  food: Food;
}

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <div className="flex flex-col rounded-sm overflow-hidden bg-[#2a2a28] border border-white/5 hover:border-white/10 transition-colors duration-300">
      <div className="relative w-full aspect-4/3 overflow-hidden">
        {food.imageUrl ? (
          <Image
            src={food.imageUrl}
            alt={food.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#2a2a28] flex items-center justify-center">
            <span className="text-white/20 text-sm font-sans tracking-widest uppercase">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-white text-lg leading-snug">
            {food.name}
          </h3>
          <span className="font-serif text-brand-gold text-lg shrink-0">
            ${food.price.toFixed(2)}
          </span>
        </div>

        <div className="w-8 h-px bg-brand-gold/40" />

        {food.description && (
          <p className="font-sans text-white/50 text-sm leading-relaxed">
            {food.description}
          </p>
        )}
      </div>
    </div>
  );
}