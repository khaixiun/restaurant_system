"use client"

import { useState } from "react";
import { TableAvailability } from "@/types/tableAvailability";

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string, phoneNo: string) => void;
    selectedTable: TableAvailability | null;
    date: string;
    startTime: string;
}

export default function ReservationModal({
    isOpen,
    onClose,
    onConfirm,
    selectedTable,
    date,
    startTime,
}: ReservationModalProps) {
    const [name, setName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !selectedTable) return null;

    const handleClose = () => {
        setName("");
        setPhoneNo("");
        setNameError(null);
        setPhoneError(null);
        onClose();
    };

    const handleConfirm = async () => {
        let valid = true;

        if (!name.trim()) {
            setNameError("Name is required");
            valid = false;
        } else {
            setNameError(null);
        }

        const cleanPhone = phoneNo.replace(/[\s\-]/g, "");
        const phoneRegex = /^(\+?60|0)[0-9]{8,10}$/;
        if (!phoneRegex.test(cleanPhone)) {
            setPhoneError("Enter a valid Malaysian phone number");
            valid = false;
        } else {
            setPhoneError(null);
        }

        if (!valid) return;

        setSubmitting(true);
        await onConfirm(name.trim(), cleanPhone);
        setSubmitting(false);
        setName("");
        setPhoneNo("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />
            <div className="relative z-10 w-full max-w-md bg-[#2a2a28] border border-white/10 p-8">
                <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-1">Confirm Reservation</p>
                <h2 className="font-serif text-white text-2xl mb-6">Review Your Booking</h2>

                <div className="bg-white/5 border border-white/10 p-4 mb-6 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-sans text-white/40 text-xs tracking-widest uppercase">Table</span>
                        <span className="font-sans text-white text-sm">{selectedTable.tableNo} · {selectedTable.position}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-sans text-white/40 text-xs tracking-widest uppercase">Capacity</span>
                        <span className="font-sans text-white text-sm">{selectedTable.capacity} guests</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-sans text-white/40 text-xs tracking-widest uppercase">Date</span>
                        <span className="font-sans text-white text-sm">{date}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-sans text-white/40 text-xs tracking-widest uppercase">Time</span>
                        <span className="font-sans text-white text-sm">{startTime}</span>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                        />
                        {nameError && <p className="mt-1.5 text-xs text-red-400">{nameError}</p>}
                    </div>

                    <div>
                        <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            placeholder="e.g. 0123456789"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
                        />
                        {phoneError && <p className="mt-1.5 text-xs text-red-400">{phoneError}</p>}
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={handleClose}
                        className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={submitting}
                        className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 bg-brand-gold text-[#1E1E1D] hover:bg-brand-accent transition-colors disabled:opacity-50"
                    >
                        {submitting ? "Confirming..." : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
}