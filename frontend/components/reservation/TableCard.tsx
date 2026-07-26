"use client";

import { TableAvailability } from "@/types/tableAvailability";
import { Check, Maximize2 } from 'lucide-react';
import { useState } from "react";

const positionImages: Record<string, string> = {
    Indoor: "https://res.cloudinary.com/mfscuukt/image/upload/v1784815969/foodpro/ionyehwhxpu9mq0wrkos.jpg",
    Window: "https://res.cloudinary.com/mfscuukt/image/upload/v1784815910/foodpro/zmmsitqxrly1fjxodotm.webp",
    Outdoor: "https://res.cloudinary.com/mfscuukt/image/upload/v1784815873/foodpro/six2v093x7ysj9mogtoq.jpg",
    Barside: "https://res.cloudinary.com/mfscuukt/image/upload/v1784815784/foodpro/aihoxuwkydfemtjmvsbw.webp",
    VIP: "https://res.cloudinary.com/mfscuukt/image/upload/v1784815938/foodpro/r99xvkamxvdjp65tkqb0.webp",
    Terrace: "https://res.cloudinary.com/mfscuukt/image/upload/v1784815895/foodpro/sk2n7lmelocqnu6ec8zu.webp",
};

interface TableCardProps {
    table: TableAvailability;
    isSelected: boolean;
    onSelect: (table: TableAvailability) => void;
}

export default function TableCard({ table, isSelected, onSelect }: TableCardProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const image = table.imageUrl ?? positionImages[table.position] ?? null;

    return (
        <>
            <button
                onClick={() => table.isAvailable && onSelect(table)}
                disabled={!table.isAvailable}
                className={`
                    relative w-full text-left border transition-all duration-200 overflow-hidden
                    ${table.isAvailable
                        ? isSelected
                            ? "border-brand-gold bg-brand-gold/10 cursor-pointer"
                            : "border-white/10 hover:border-brand-gold/50 cursor-pointer"
                        : "border-white/5 opacity-40 cursor-not-allowed"
                    }
                `}
            >
                {image && (
                    <div className="w-full h-32 overflow-hidden">
                        <img
                            src={image}
                            alt={table.tableNo}
                            className="w-full h-full object-cover"
                        />
                        <div
                            role="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsZoomed(true);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer z-10"
                        >
                            <Maximize2 size={14} />
                        </div>
                    </div>
                )}

                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <span className="font-serif text-white text-lg">{table.tableNo}</span>
                        <span className={`font-sans text-xs tracking-widest uppercase ${table.isAvailable ? "text-brand-gold" : "text-white/30"}`}>
                            {table.isAvailable ? "Available" : "Booked"}
                        </span>
                    </div>
                    <p className="font-sans text-white/40 text-xs tracking-widest uppercase">
                        {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
                    </p>
                </div>

                {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-brand-gold flex items-center justify-center">
                        <Check size={12} strokeWidth={2.5} color="#1E1E1D" />
                    </div>
                )}
            </button>
            {isZoomed && image && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(false);
                    }}
                >
                    <img
                        src={image}
                        alt={table.tableNo}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    />
                </div>
            )}
        </>
    );
}