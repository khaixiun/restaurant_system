"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [dismissed, setDismissed] = useState(false);

    if (!error || dismissed) return null;

    const messages: Record<string, string> = {
      unauthorized: "You don't have permission to access that page."
    };

    return (
      <div className="bg-red-900/20 border border-red-500/30 text-red-400 text-sm px-6 py-3 flex items-center justify-between">
        <span>{messages[error] ?? "Something went wrong."}</span>
        <button onClick={() => setDismissed(true)} className="text-red-400/60 hover:text-red-400">
          ✕
        </button>
      </div>
    );
}