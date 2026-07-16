import { Food } from "@/types/food";
import api from "./axios";
import {foodSchema} from "@/schemas/food";
import { z } from "zod";

type FoodPayload = z.infer<typeof foodSchema>;

export async function getFoods(): Promise<Food[]> {
  const res = await api.get<Food []>("/foods");
  return res.data;
}

export function groupByCategory(foods: Food[]): Record<number, Food[]> {
  return foods.reduce((acc, food) => {
    if (!acc[food.categoryId]) acc[food.categoryId] = [];
    acc[food.categoryId].push(food);
    return acc;
  }, {} as Record<number, Food[]>);
}

export async function createFood(data: FoodPayload) {
  await api.post("/foods", data);
}

export async function updateFood(id: number, data: FoodPayload) {
  await api.put(`/foods/${id}`, data);
}

export async function deleteFood(id: number){
  await api.delete(`/foods/${id}`);
}