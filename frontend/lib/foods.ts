import { Food } from "@/app/types/food";

export async function getFoods(): Promise<Food[]> {
  const res = await fetch(`${process.env.API_URL}/foods`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}

export function groupByCategory(foods: Food[]): Record<number, Food[]> {
  return foods.reduce((acc, food) => {
    if (!acc[food.categoryId]) acc[food.categoryId] = [];
    acc[food.categoryId].push(food);
    return acc;
  }, {} as Record<number, Food[]>);
}