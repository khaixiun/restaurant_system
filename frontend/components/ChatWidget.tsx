"use client"

import api from "@/lib/axios";
import { MessageCircle, Send, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello, I'm your dining assistant. Ask me about our menu, tables, or availability.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages, loading]);

    const send = async() => {
        const text = input.trim();
        if (!text || loading) return;

        setInput("")
        setMessages((prev) => [...prev, { role: "user", content: text}]);
        setLoading(true);

        try {
            const res = await api.post("/chat", { message: text });
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: res.data.reply },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, someting went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") send();
    };

    return (
        <>
            <button
                onClick={() => setOpen((o) => !o)}    
                className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full bg-(--color-gold,#c9a84c) flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer border-none"
            >
                {open ? (
                    <X size={20} className="text-[#1a1a1a]" />
                ) : (
                    <MessageCircle size={20} className="text-[#1a1a1a]" />
                )}
            </button>

            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl overflow-hidden border border-[#c9a84c]/25 bg-[#1a1714] flex flex-col shadow-2xl">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[#c9a84c]/15 flex items-center gap-3 bg-[#1f1c18]">
                        <div className="w-8 h-8 rounded-full bg-[#c9a84c]/15 flex items-center justify-center shrink-0">
                            <MessageCircle size={14} className="text-[#c9a84c]" />
                        </div>
                        <div>
                            <p className="m-0 text-sm font-medium text-[#e8d5a3] font-serif">
                                Dining Assistant
                            </p>
                            <p className="m-0 text-[0.7rem] text-[#e8d5a3]/50">
                                Powered by Gemini AI
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-80 scrollbar-thin">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div 
                                    className={`max-w-[80%] px-3 py-2 text-[0.8125rem] leading-snug whitespace-pre-wrap rounded-xl ${
                                        msg.role === "user"
                                            ? "bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#e8d5a3] rounded-br-sm"
                                            : "bg-white/6 border border-white/8 text-white/85 rounded-bl-sm"
                                        }`}     
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-xl rounded-bl-sm bg-white/6 border border-white/8 flex gap-1 items-center">
                                    {[0,1,2].map((i) => (
                                        <span
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] opacity-60 animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-3 border-t border-[#c9a84c]/15 flex gap-2 bg-[#1f1c18]">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask about menu, tables, availability..."
                            disabled={loading}
                            className="flex-1 bg-white/6 border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-[0.8125rem] text-[#e8d5a3] placeholder:text-[#e8d5a3]/30 outline-none focus:border-[#c9a84c]/50 transition-colors font-sans disabled:opacity-50"
                        />
                        <button
                            onClick={send}
                            disabled={loading || !input.trim()}
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors disabled:cursor-not-allowed disabled:opacity-40 bg-[#c9a84c] hover:bg-[#b8973d] cursor-pointer border-none"
                        >
                            <Send size={14} className="text-[#1a1a1a]" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}