"use client"

import { FoodFormInput, FoodFormOutput, foodSchema } from '@/schemas/food';
import { Category } from '@/types/category';
import { Food } from '@/types/food';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getCategories } from "@/lib/category";
import { getFoods, createFood, updateFood, deleteFood } from "@/lib/foods";
import axios from 'axios';
import DataTable, { Column } from '@/components/admin/DataTable';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const columns: Column<Food>[] = [
    { header: "ID", accessor: "id", width: "3rem" },
    {
        header: "Image",
        width: "3rem",
        render: (food) =>
            food.imageUrl ? (
                <img src={food.imageUrl} alt={food.name} className="w-12 h-12 object-cover" />
            ) : (
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-xs">None</span>
                </div>
            ),
    },
    { header: "Name", accessor: "name", width: "10rem"},
    {
        header: "Price",
        width: "6rem",
        render: (food) => <span className="text-brand-gold">${food.price.toFixed(2)}</span>,
    },
    {
        header: "Category",
        width: "6rem",
        render: (food) => <span className="text-white/50">{food.categoryName}</span>,
    },
];

export default function FoodsPage() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<Food | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FoodFormInput, any, FoodFormOutput>({
        resolver: zodResolver(foodSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            imageUrl: "",
            categoryId: 0,
        }
    });

    const fetchData = async () => {
        const [foodsData, categoriesData] = await Promise.all([
            getFoods(),
            getCategories(),
        ]);
        const sortedFoods = [...foodsData].sort((a, b) => a.id - b.id);
        setFoods(sortedFoods);
        setCategories(categoriesData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingFood(null);
        setPreviewUrl(null);
        reset({ name: "", description: "", price: 0, imageUrl: "", categoryId: 0 });
        setIsModalOpen(true);
    };

    const handleEdit = (food: Food) => {
        setEditingFood(food);
        setPreviewUrl(food.imageUrl ?? null);
        reset({
            name: food.name,
            description: food.description ?? "",
            price: food.price,
            imageUrl: food.imageUrl ?? "",
            categoryId: food.categoryId,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (food: Food) => {
        setPendingDelete(food);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        await deleteFood(pendingDelete.id);
        await fetchData();
        setConfirmOpen(false);
        setPendingDelete(null);
    };

    const onSubmit = async (data: FoodFormOutput) => {
        if (editingFood) {
            await updateFood(editingFood.id, data);
        } else {
            await createFood(data);
        }
        await fetchData();
        setIsModalOpen(false);
        reset();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );

        setValue("imageUrl", res.data.secure_url);
        setPreviewUrl(res.data.secure_url);
        setUploading(false);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-1">Manage</p>
                    <h1 className="font-serif text-white text-3xl">Foods</h1>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-brand-gold text-brand-dark font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-brand-accent transition-colors"
                >
                    Add Food
                </button>
            </div>

            <DataTable
                data={foods}
                columns={columns}
                loading={loading}
                emptyMessage="No foods found."
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AdminModal
                isOpen={isModalOpen}
                title={editingFood ? "Edit Food" : "Add Food"}
                onClose={() => setIsModalOpen(false)}
                hideFooter
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            placeholder="e.g. Wagyu Tenderloin"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                        />
                        {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Description <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                        </label>
                        <textarea
                            {...register("description")}
                            placeholder="Describe the dish..."
                            rows={3}
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Price
                        </label>
                        <input
                            {...register("price", { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                        />
                        {errors.price && <p className="mt-1.5 text-xs text-red-400">{errors.price.message}</p>}
                    </div>

                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Category
                        </label>
                        <select
                            {...register("categoryId", { valueAsNumber: true })}
                            className="w-full bg-[#2a2a28] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                        >
                            <option value={0} disabled>Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="mt-1.5 text-xs text-red-400">{errors.categoryId.message}</p>}
                    </div>

                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Image <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                        </label>
                        {previewUrl && (
                            <img src={previewUrl} alt="preview" className="w-full h-40 object-cover mb-3" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-white/10 file:text-white/60 file:text-xs file:cursor-pointer hover:file:bg-white/20 transition-colors"
                        />
                        {uploading && <p className="mt-1.5 text-xs text-brand-gold">Uploading...</p>}
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || uploading}
                            className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 bg-brand-gold text-[#1E1E1D] hover:bg-brand-accent transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : editingFood ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </AdminModal>
            <ConfirmDialog
                isOpen={confirmOpen}
                message={`"${pendingDelete?.name}" will be permanently deleted.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}