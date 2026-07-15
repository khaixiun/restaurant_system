"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/category";

const categoryHeaders = ["ID", "Name", "Created At", "Actions"];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);

    const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = () => {
        setNameError(null);
        setEditingCategory(null);
        setIsModalOpen(true);
        setCategoryName("");
    };

    const handleSave = async () => {
        if (!categoryName.trim()) {
            setNameError("Category name required")
            return;
        }
        setNameError(null);
        if (editingCategory) {
            await updateCategory(editingCategory.id, categoryName);
        } else {
            await createCategory(categoryName);
        }
        await fetchCategories();
        setCategoryName("");
        setIsModalOpen(false);
    };

    const handleEdit = (category: Category) => {
        setNameError(null);
        setEditingCategory(category);
        setIsModalOpen(true);
        setCategoryName(category.name);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        await deleteCategory(id);
        await fetchCategories();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-1">Manage</p>
                    <h1 className="font-serif text-white text-3xl">Categories</h1>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-brand-gold text-brand-dark font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-brand-accent transition-colors"
                >
                    Add Category
                </button>
            </div>

            {loading ? (
                <p className="font-sans text-white/30 text-sm">Loading...</p>
            ) : categories.length === 0 ? (
                <p className="font-sans text-white/30 text-sm">No categories found.</p>
            ) : (
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            {categoryHeaders.map((header) => (
                                <th key={header} className="text-left font-sans text-xs tracking-widest uppercase text-white/40 pb-4 last:w-32">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 font-sans text-white/40 text-sm w-16">{category.id}</td>
                                <td className="py-4 font-sans text-white text-sm">{category.name}</td>
                                <td className="py-4 font-sans text-white/40 text-sm w-40">
                                    {new Date(category.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 w-32">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="font-sans text-xs text-brand-gold hover:text-white border border-brand-gold/30 hover:border-white/30 px-3 py-1.5 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="font-sans text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/30 px-3 py-1.5 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className="relative z-10 w-full max-w-md bg-[#2a2a28] border border-white/10 p-8">
                        <h2 className="font-serif text-white text-2xl mb-6">
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </h2>

                        <div className="mb-6">
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                placeholder="e.g. Appetizers"
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                            />
                            {nameError && (
                                <p className="mt-1.5 text-xs text-red-400">{nameError}</p>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 bg-brand-gold text-[#1E1E1D] hover:bg-brand-accent transition-colors"
                            >
                                {editingCategory ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}