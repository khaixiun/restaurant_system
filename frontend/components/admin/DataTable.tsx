"use client";

import React from "react";

export interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (row: T) => React.ReactNode;
    width?: string;
}

interface DataTableProps<T extends { id: number }> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export default function DataTable<T extends { id: number }>({
    data,
    columns,
    loading = false,
    emptyMessage = "No records found.",
    onEdit,
    onDelete,
}: DataTableProps<T>) {
    const showActions = onEdit || onDelete;

    if (loading) {
        return <p className="font-sans text-white/30 text-sm">Loading...</p>;
    }

    if (data.length === 0) {
        return <p className="font-sans text-white/30 text-sm">{emptyMessage}</p>;
    }

    return (
        <table className="w-full">
            <thead>
                <tr className="border-b border-white/10">
                    {columns.map((col) => (
                        <th
                            key={col.header}
                            className="text-left font-sans text-xs tracking-widest uppercase text-white/40 pb-4"
                            style={{ width: col.width }}
                        >
                            {col.header}
                        </th>
                    ))}
                    {showActions && (
                        <th className="text-left font-sans text-xs tracking-widest uppercase text-white/40 pb-4 w-32">
                            Actions
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        {columns.map((col) => (
                            <td key={col.header} className="py-4 font-sans text-white text-sm">
                                {col.render
                                    ? col.render(row)
                                    : col.accessor
                                    ? String(row[col.accessor] ?? "")
                                    : null}
                            </td>
                        ))}
                        {showActions && (
                            <td className="py-4 w-32">
                                <div className="flex gap-3">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(row)}
                                            className="font-sans text-xs text-brand-gold hover:text-white border border-brand-gold/30 hover:border-white/30 px-3 py-1.5 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(row)}
                                            className="font-sans text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/30 px-3 py-1.5 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}