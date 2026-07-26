"use client"

import { useEffect, useState } from "react";
import { getTimeSlots } from "@/lib/timeSlot";
import { getTableAvailability } from "@/lib/reservation";
import { createReservation } from "@/lib/reservation";
import { TimeSlot } from "@/types/timeSlot";
import { TableAvailability } from "@/types/tableAvailability";
import TableCard from "@/components/reservation/TableCard";
import ReservationModal from "@/components/reservation/ReservationModal";

const positions = ["Indoor", "Window", "Outdoor", "Barside", "VIP", "Terrace"];

export default function ReservationPage() {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [date, setDate] = useState("");
    const [timeSlotId, setTimeSlotId] = useState<number>(0);
    const [tables, setTables] = useState<TableAvailability[]>([]);
    const [selectedTable, setSelectedTable] = useState<TableAvailability | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kuala_Lumpur" });

    useEffect(() => {
        getTimeSlots().then(setTimeSlots);
    }, []);

    useEffect(() => {
        if (!date || !timeSlotId) return;
        setLoading(true);
        setSelectedTable(null);
        setError(null);
        getTableAvailability(date, timeSlotId)
            .then(setTables)
            .finally(() => setLoading(false));
    }, [date, timeSlotId]);

    const selectedTimeSlot = timeSlots.find(ts => ts.id === timeSlotId);

    const groupedTables = positions.reduce<Record<string, TableAvailability[]>>((acc, pos) => {
        const filtered = tables.filter(t => t.position === pos);
        if (filtered.length > 0) acc[pos] = filtered;
        return acc;
    }, {});

    const handleSelectTable = (table: TableAvailability) => {
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    const handleConfirm = async (name: string, phoneNo: string) => {
        if (!selectedTable || !timeSlotId) return;
        setError(null);
        try {
            await createReservation({
                name,
                phoneNo,
                tableId: selectedTable.tableId,
                date,
                timeSlotId,
            });
            setIsModalOpen(false);
            setSelectedTable(null);
            setSuccess(true);
            // refresh availability
            const updated = await getTableAvailability(date, timeSlotId);
            setTables(updated);
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? "Something went wrong. Please try again.";
            setError(msg);
            setIsModalOpen(false);
        }
    };

    const isSlotPassedToday = (selectedDate: string, startTime: string) => {
        if(!selectedDate) return false;
        const now = new Date();
        if(selectedDate !== today) return false;

        const [hours, minutes] = startTime.split(":").map(Number);
        const slotTime = new Date(now);
        slotTime.setHours(hours, minutes, 0, 0);
        return slotTime <= now;
    }

    return (
        <main className="bg-brand-dark min-h-screen">
            <div className="max-w-6xl mx-auto px-6 md:px-12">

                <div className="pt-32 pb-16 border-b border-white/10">
                    <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
                        Dine With Us
                    </p>
                    <h1 className="font-serif text-white text-5xl md:text-6xl mb-4">
                        Reserve a Table
                    </h1>
                    <p className="font-sans text-white/40 text-sm max-w-lg leading-relaxed">
                        Select your preferred date and time, then choose your table from the available options below.
                    </p>
                </div>

                <div className="py-12 border-b border-white/10">
                    <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-6">
                        Step 1 — Choose Date & Time
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                min={today}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    setTimeSlotId(0);
                                    setSuccess(false);
                                }}
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                                Time Slot
                            </label>
                            <select
                                value={timeSlotId}
                                onChange={(e) => {
                                    setTimeSlotId(Number(e.target.value));
                                    setSuccess(false);
                                }}
                                className="w-full bg-[#2a2a28] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-gold transition-colors"
                            >
                                <option value={0} disabled>Select a time</option>
                                {timeSlots.map((ts) => {
                                    const isPassed = isSlotPassedToday(date, ts.startTime);
                                    return (
                                        <option
                                        key={ts.id}
                                        value={ts.id}
                                        disabled={isPassed}
                                    >
                                        {ts.startTime} {isPassed ? "(Passed)" : ""}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="py-12">
                    {!date || !timeSlotId ? (
                        <div className="text-center py-24">
                            <p className="font-sans text-white/20 text-sm tracking-widest uppercase">
                                Select a date and time to view available tables
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="text-center py-24">
                            <p className="font-sans text-white/20 text-sm tracking-widest uppercase">
                                Checking availability...
                            </p>
                        </div>
                    ) : success ? (
                        <div className="text-center py-24 border border-brand-gold/20 bg-brand-gold/5">
                            <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-3">Confirmed</p>
                            <h2 className="font-serif text-white text-3xl mb-4">Your table is reserved.</h2>
                            <p className="font-sans text-white/40 text-sm mb-8">
                                We look forward to welcoming you. Please arrive on time.
                            </p>
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setDate("");
                                    setTimeSlotId(0);
                                    setTables([]);
                                }}
                                className="font-sans text-xs tracking-[0.2em] uppercase px-8 py-3 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors"
                            >
                                Make Another Reservation
                            </button>
                        </div>
                    ) : error ? (
                        <div className="mb-8 border border-red-400/20 bg-red-400/5 px-6 py-4">
                            <p className="font-sans text-red-400 text-sm">{error}</p>
                        </div>
                    ) : tables.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="font-sans text-white/20 text-sm tracking-widest uppercase">
                                No tables available for this time slot
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-8">
                                Step 2 — Select Your Table
                            </p>
                            {Object.entries(groupedTables).map(([position, positionTables]) => (
                                <div key={position} className="mb-12">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="font-sans text-white/40 text-xs tracking-widest uppercase">{position}</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {positionTables.map(table => (
                                            <TableCard
                                                key={table.tableId}
                                                table={table}
                                                isSelected={selectedTable?.tableId === table.tableId}
                                                onSelect={handleSelectTable}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTable(null);
                }}
                onConfirm={handleConfirm}
                selectedTable={selectedTable}
                date={date}
                startTime={selectedTimeSlot?.startTime ?? ""}
            />
        </main>
    );
}