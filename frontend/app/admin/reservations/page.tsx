"use client"

import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable, { Column } from "@/components/admin/DataTable";
import { createReservation, deleteReservation, getReservations, updateReservation } from "@/lib/reservation";
import { getTables } from "@/lib/table";
import { getTimeSlots } from "@/lib/timeSlot";
import { ReservationFormInput, ReservationFormOutput, reservationSchema } from "@/schemas/reservation";
import { UpdateReservationFormInput, UpdateReservationFormOutput, updateReservationSchema } from "@/schemas/updateReservation";
import { Reservation } from "@/types/reservation";
import { Table } from "@/types/table";
import { TimeSlot } from "@/types/timeSlot";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const statuses = ["Reserved", "Cancelled", "Completed"];

const columns: Column<Reservation>[] = [
    { header: "ID", accessor: "id", width: "3rem" },
    { header: "Name", accessor: "name", width: "15rem" },
    {
        header: "Table No",
        width: "8rem",
        render: (r) => <span className="text-white/50">{r.tableNo}</span>,
    },
    { header: "Phone No", accessor: "phoneNo", width: "8rem" },
    { header: "Date", accessor: "date", width: "8rem" },
    {
        header: "Time Slot",
        width: "8rem",
        render: (r) => <span className="text-white/50">{r.startTime}</span>,
    },
    {
        header: "Status",
        width: "6rem",
        render: (r) => {
            const color =
                r.status === "Reserved" ? "text-brand-gold" :
                r.status === "Completed" ? "text-green-400" :
                "text-red-400";
            return <span className={`font-sans text-xs tracking-widest uppercase ${color}`}>{r.status}</span>;
        },
    },
];

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<Reservation | null>(null);

    const {
        register: createRegister,
        handleSubmit: createHandleSubmit,
        reset: createReset,
        formState: { errors: createErrors, isSubmitting: createSubmitting },
    } = useForm<ReservationFormInput, any, ReservationFormOutput>({
        resolver: zodResolver(reservationSchema),
        defaultValues: { name: "", tableId: 0, phoneNo: "", date: "", timeSlotId: 0 },
    });

    const {
        register: updateRegister,
        handleSubmit: updateHandleSubmit,
        reset: updateReset,
        formState: { errors: updateErrors, isSubmitting: updateSubmitting },
    } = useForm<UpdateReservationFormInput, any, UpdateReservationFormOutput>({
        resolver: zodResolver(updateReservationSchema),
        defaultValues: { tableId: 0, date: "", timeSlotId: 0, status: "" },
    });

    const fetchData = async () => {
        const [reservationsData, tablesData, timeSlotsData] = await Promise.all([
            getReservations(),
            getTables(),
            getTimeSlots(),
        ]);
        setReservations(reservationsData);
        setTables(tablesData);
        setTimeSlots(timeSlotsData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingReservation(null);
        createReset({ name: "", tableId: 0, phoneNo: "", date: "", timeSlotId: 0 });
        setIsModalOpen(true);
    };

    const handleEdit = (reservation: Reservation) => {
        setEditingReservation(reservation);
        updateReset({
            tableId: reservation.tableId,
            date: reservation.date,
            timeSlotId: reservation.timeSlotId,
            status: reservation.status,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (reservation: Reservation) => {
        setPendingDelete(reservation);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        await deleteReservation(pendingDelete.id);
        await fetchData();
        setConfirmOpen(false);
        setPendingDelete(null);
    };

    const onCreateSubmit = async (data: ReservationFormOutput) => {
        await createReservation(data);
        await fetchData();
        setIsModalOpen(false);
        createReset();
    };

    const onUpdateSubmit = async (data: UpdateReservationFormOutput) => {
        await updateReservation(editingReservation!.id, data);
        await fetchData();
        setIsModalOpen(false);
        updateReset();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-1">Manage</p>
                    <h1 className="font-serif text-white text-3xl">Reservations</h1>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-brand-gold text-brand-dark font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-brand-accent transition-colors"
                >
                    Add Reservation
                </button>
            </div>

            <DataTable
                data={reservations}
                columns={columns}
                loading={loading}
                emptyMessage="No reservations found."
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AdminModal
                isOpen={isModalOpen}
                title={editingReservation ? "Edit Reservation" : "Add Reservation"}
                onClose={() => setIsModalOpen(false)}
                hideFooter
                maxWidth="max-w-lg"
            >
                {editingReservation ? (
                    <form onSubmit={updateHandleSubmit(onUpdateSubmit)} className="space-y-5">
                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Table</label>
                            <select
                                {...updateRegister("tableId", { valueAsNumber: true })}
                                className="w-full bg-[#2a2a28] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            >
                                <option value={0} disabled>Select a table</option>
                                {tables
                                    .filter(t => t.isReservable || t.id === editingReservation?.tableId)
                                    .map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.tableNo} — {t.position} (cap. {t.capacity})
                                            {!t.isReservable ? " (not reservable)" : ""}
                                        </option>
                                    ))
                                }
                            </select>
                            {updateErrors.tableId && <p className="mt-1.5 text-xs text-red-400">{updateErrors.tableId.message}</p>}
                        </div>

                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Date</label>
                            <input
                                {...updateRegister("date")}
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            />
                            {updateErrors.date && <p className="mt-1.5 text-xs text-red-400">{updateErrors.date.message}</p>}
                        </div>

                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Time Slot</label>
                            <select
                                {...updateRegister("timeSlotId", { valueAsNumber: true })}
                                className="w-full bg-[#2a2a28] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            >
                                <option value={0} disabled>Select a time slot</option>
                                {timeSlots.map((ts) => (
                                    <option key={ts.id} value={ts.id}>{ts.startTime}</option>
                                ))}
                            </select>
                            {updateErrors.timeSlotId && <p className="mt-1.5 text-xs text-red-400">{updateErrors.timeSlotId.message}</p>}
                        </div>

                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Status</label>
                            <select
                                {...updateRegister("status")}
                                className="w-full bg-[#2a2a28] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            >
                                <option value="" disabled>Select a status</option>
                                {statuses.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            {updateErrors.status && <p className="mt-1.5 text-xs text-red-400">{updateErrors.status.message}</p>}
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
                                disabled={updateSubmitting}
                                className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 bg-brand-gold text-[#1E1E1D] hover:bg-brand-accent transition-colors disabled:opacity-50"
                            >
                                {updateSubmitting ? "Saving..." : "Update"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={createHandleSubmit(onCreateSubmit)} className="space-y-5">
                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Name</label>
                            <input
                                {...createRegister("name")}
                                placeholder="e.g. John Doe"
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                            />
                            {createErrors.name && <p className="mt-1.5 text-xs text-red-400">{createErrors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Phone No</label>
                            <input
                                {...createRegister("phoneNo")}
                                placeholder="e.g. 0123456789"
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                            />
                            {createErrors.phoneNo && <p className="mt-1.5 text-xs text-red-400">{createErrors.phoneNo.message}</p>}
                        </div>

                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Table</label>
                            <select
                                {...createRegister("tableId", { valueAsNumber: true })}
                                className="w-full bg-[#2a2a28] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            >
                                <option value={0} disabled>Select a table</option>
                                {tables.filter(t => t.isReservable).map((t) => (
                                    <option key={t.id} value={t.id}>{t.tableNo} — {t.position} (cap. {t.capacity})</option>
                                ))}
                            </select>
                            {createErrors.tableId && <p className="mt-1.5 text-xs text-red-400">{createErrors.tableId.message}</p>}
                        </div>

                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Date</label>
                            <input
                                {...createRegister("date")}
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            />
                            {createErrors.date && <p className="mt-1.5 text-xs text-red-400">{createErrors.date.message}</p>}
                        </div>

                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">Time Slot</label>
                            <select
                                {...createRegister("timeSlotId", { valueAsNumber: true })}
                                className="w-full bg-[#2a2a28] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            >
                                <option value={0} disabled>Select a time slot</option>
                                {timeSlots.map((ts) => (
                                    <option key={ts.id} value={ts.id}>{ts.startTime}</option>
                                ))}
                            </select>
                            {createErrors.timeSlotId && <p className="mt-1.5 text-xs text-red-400">{createErrors.timeSlotId.message}</p>}
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
                                disabled={createSubmitting}
                                className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 bg-brand-gold text-[#1E1E1D] hover:bg-brand-accent transition-colors disabled:opacity-50"
                            >
                                {createSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                )}
            </AdminModal>

            <ConfirmDialog
                isOpen={confirmOpen}
                message={`Reservation for "${pendingDelete?.name}" will be permanently deleted.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}