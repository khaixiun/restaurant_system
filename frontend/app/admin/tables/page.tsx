"use client"

import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable, { Column } from "@/components/admin/DataTable";
import { createTable, deleteTable, getTables, updateTable } from "@/lib/table";
import { TableFormInput, TableFormOutput, tableSchema } from "@/schemas/table";
import { Table } from "@/types/table";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const positions = ["Indoor", "Window", "Outdoor", "Barside", "VIP", "Terrace"];

const columns: Column<Table>[] = [
    { header: "ID", accessor: "id", width: "3rem" },
    { header: "Table No", accessor: "tableNo", width: "8rem" },
    { header: "Position", accessor: "position", width: "10rem" },
    { header: "Capacity", accessor: "capacity", width: "8rem" },
    {
        header: "Reservable",
        width: "7rem",
        render: (row) => (
            <span className={`font-sans text-xs tracking-widest uppercase ${row.isReservable ? "text-brand-gold" : "text-white/30"}`}>
                {row.isReservable ? "Yes" : "No"}
            </span>
        ),
    },
];

export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<Table | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<TableFormInput, any, TableFormOutput>({
        resolver: zodResolver(tableSchema),
        defaultValues: {
            tableNo: "",
            capacity: 1,
            position: "",
            isReservable: false,
            imageUrl: ""
        }
    });

    const fetchTables = async () => {
        const data = await getTables();
        setTables(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleAdd = () => {
        setPreviewUrl(null);
        setEditingTable(null);
        reset({ tableNo: "", capacity: 1, position: "", isReservable: false, imageUrl: ""});
        setIsModalOpen(true);
    };

    const handleEdit = (table: Table) => {
        setPreviewUrl(table.imageUrl ?? null);
        setEditingTable(table);
        reset({
            tableNo: table.tableNo,
            capacity: table.capacity,
            position: table.position,
            isReservable: table.isReservable,
            imageUrl: table.imageUrl ?? "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = (table: Table) => {
        setPendingDelete(table);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        await deleteTable(pendingDelete.id);
        await fetchTables();
        setConfirmOpen(false);
        setPendingDelete(null);
    };

    const onSubmit = async (data: TableFormOutput) => {
        if (editingTable) {
            await updateTable(editingTable.id, data);
        } else {
            await createTable(data);
        }
        await fetchTables();
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
                    <h1 className="font-serif text-white text-3xl">Tables</h1>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-brand-gold text-brand-dark font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-brand-accent transition-colors"
                >
                    Add Table
                </button>
            </div>

            <DataTable
                data={tables}
                columns={columns}
                loading={loading}
                emptyMessage="No tables found."
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AdminModal
                isOpen={isModalOpen}
                title={editingTable ? "Edit Table" : "Add Table"}
                onClose={() => setIsModalOpen(false)}
                hideFooter
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Table No
                        </label>
                        <input
                            {...register("tableNo")}
                            placeholder="e.g. A1"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                        />
                        {errors.tableNo && <p className="mt-1.5 text-xs text-red-400">{errors.tableNo.message}</p>}
                    </div>

                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Capacity
                        </label>
                        <input
                            {...register("capacity", { valueAsNumber: true })}
                            type="number"
                            min={1}
                            placeholder="e.g. 4"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                        />
                        {errors.capacity && <p className="mt-1.5 text-xs text-red-400">{errors.capacity.message}</p>}
                    </div>

                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Position
                        </label>
                        <select
                            {...register("position")}
                            className="w-full bg-[#2a2a28] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                        >
                            <option value="" disabled>Select a position</option>
                            {positions.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        {errors.position && <p className="mt-1.5 text-xs text-red-400">{errors.position.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 py-1">
                        <input
                            {...register("isReservable")}
                            type="checkbox"
                            id="isReservable"
                            className="w-4 h-4 accent-brand-gold cursor-pointer"
                        />
                        <label htmlFor="isReservable" className="font-sans text-xs tracking-widest uppercase text-white/50 cursor-pointer">
                            Reservable Online
                        </label>
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
                            disabled={isSubmitting}
                            className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 bg-brand-gold text-[#1E1E1D] hover:bg-brand-accent transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : editingTable ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </AdminModal>

            <ConfirmDialog
                isOpen={confirmOpen}
                message={`Table "${pendingDelete?.tableNo}" will be permanently deleted.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}