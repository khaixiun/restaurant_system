"use client"

import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable, { Column } from "@/components/admin/DataTable";
import { createTimeSlot, deleteTimeSlot, getTimeSlots } from "@/lib/timeSlot";
import { TimeSlot } from "@/types/timeSlot";
import { useEffect, useState } from "react";

const columns: Column<TimeSlot>[] = [
    {header: "ID", accessor: "id", width: "3rem"},
    {header: "Start Time", accessor:"startTime", width: "8rem"},
    {
        header: "Created At",
        render: (row) => new Date(row.createdAt).toLocaleDateString(),
        width: "8rem"
    },
];

export default function TimeSlotsPage() {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<TimeSlot | null>(null);

    const fetchTimeSlots = async() => {
        const data = await getTimeSlots();
        setTimeSlots(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchTimeSlots();
    }, []);

    const handleAdd = () => {
        setNameError(null);
        setStartTime("");
        setIsModalOpen(true);
    }

    const handleClose = () => {
        setIsModalOpen(false);
        setNameError(null);
    };

    const handleSave = async() => {
        if(!startTime.trim()) {
            setNameError("Start Time required");
            return;
        }
        setNameError(null);
        await createTimeSlot(startTime);
        await fetchTimeSlots();
        setStartTime("");
        setIsModalOpen(false);
    }

    const handleDelete = (timeSlot: TimeSlot) => {
        setPendingDelete(timeSlot);
        setConfirmOpen(true);
    }

    const handleConfirmDelete = async() => {
        if(!pendingDelete) return;
        await deleteTimeSlot(pendingDelete.id);
        await fetchTimeSlots();
        setConfirmOpen(false);
        setPendingDelete(null);
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-1">Manage</p>
                    <h1 className="font-serif text-white text-3xl">Time Slots</h1>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-brand-gold text-brand-dark font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-brand-accent transition-colors"
                >
                    Add Time Slot
                </button>
            </div>

            <DataTable
                data={timeSlots}
                columns={columns}
                loading={loading}
                emptyMessage="No time slots found."
                onDelete={handleDelete}
            />

            <AdminModal
                isOpen={isModalOpen}
                title="Add Time Slot"
                saveLabel="Save"
                onClose={handleClose}
                onSave={handleSave}
            >
                <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                        Start Time
                    </label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                    />
                    {nameError && (
                        <p className="mt-1.5 text-xs text-red-400">{nameError}</p>
                    )}
                </div>
            </AdminModal>

            <ConfirmDialog
                isOpen={confirmOpen}
                message={`"${pendingDelete?.startTime}" will be permanently deleted.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}