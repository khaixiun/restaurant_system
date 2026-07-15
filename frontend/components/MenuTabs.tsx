"use client";

import { useState } from "react";
import { Food } from "@/types/food";

interface MenuTabsProps {
  grouped: Record<number, Food[]>;
}

export default function MenuTabs({ grouped }: MenuTabsProps) {
  const categories = Object.values(grouped);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItems = categories[activeIndex];

  return (
    <div>
      <div className="flex flex-wrap gap-0 border-b border-white/10 mb-12">
        {categories.map((items, index) => (
          <button
            key={items[0].categoryId}
            onClick={() => setActiveIndex(index)}
            className={`font-sans text-xs tracking-[0.2em] uppercase px-6 py-4 transition-colors duration-200 border-b-2 -mb-px ${
              activeIndex === index
                ? "border-brand-gold text-brand-gold"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {items[0].categoryName}
          </button>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-white/5">
        {activeItems.map((food) => (
          <div key={food.id} className="flex items-start justify-between gap-8 py-6">
            <div className="flex flex-col gap-1.5">
              <h3 className="font-serif text-white text-xl">{food.name}</h3>
              {food.description && (
                <p className="font-sans text-white/40 text-sm leading-relaxed max-w-lg">
                  {food.description}
                </p>
              )}
            </div>

            <span className="font-serif text-brand-gold text-xl shrink-0">
              ${food.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}