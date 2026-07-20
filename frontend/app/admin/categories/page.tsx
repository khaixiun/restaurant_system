"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/category";
import DataTable, { Column } from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const columns: Column<Category>[] = [
    { header: "ID", accessor: "id", width: "3rem" },
    { header: "Name", accessor: "name"},
    {
        header: "Created At",
        render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

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
        setCategoryName("");
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setNameError(null);
        setEditingCategory(category);
        setCategoryName(category.name);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setNameError(null);
    };

    const handleSave = async () => {
        if (!categoryName.trim()) {
            setNameError("Category name required");
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

    const handleDelete = (category: Category) => {
        setPendingDelete(category);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        await deleteCategory(pendingDelete.id);
        await fetchCategories();
        setConfirmOpen(false);
        setPendingDelete(null);
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

            <DataTable
                data={categories}
                columns={columns}
                loading={loading}
                emptyMessage="No categories found."
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AdminModal
                isOpen={isModalOpen}
                title={editingCategory ? "Edit Category" : "Add Category"}
                saveLabel={editingCategory ? "Update" : "Save"}
                onClose={handleClose}
                onSave={handleSave}
            >
                <div>
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