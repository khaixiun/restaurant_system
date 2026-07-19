"use client";

interface AdminModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSave?: () => void;
    saveLabel?: string;
    hideFooter?: boolean;
    maxWidth?: string;
    children: React.ReactNode;
}

export default function AdminModal({
    isOpen,
    title,
    onClose,
    onSave,
    saveLabel = "Save",
    hideFooter = false,
    maxWidth = "max-w-md",
    children,
}: AdminModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`relative z-10 w-full ${maxWidth} bg-[#2a2a28] border border-white/10 p-8 max-h-[90vh] overflow-y-auto`}>
                <h2 className="font-serif text-white text-2xl mb-6">{title}</h2>

                <div className="space-y-5">{children}</div>

                {!hideFooter && (
                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 bg-brand-gold text-[#1E1E1D] hover:bg-brand-accent transition-colors"
                        >
                            {saveLabel}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}