import api from "./axios";
import { Category } from "@/types/category";

export async function getCategories() : Promise<Category[]> {
    const res = await api.get<Category[]>("/categories");
    return res.data;
}

export async function createCategory( name : string) {
    await api.post("/categories", {name});
}

export async function updateCategory(id: number, name: string) {
    await api.put(`/categories/${id}`, {name});
}

export async function deleteCategory(id: number){
    await api.delete(`/categories/${id}`);
}