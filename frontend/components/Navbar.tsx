"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                ? "bg-brand-dark/90 backdrop-blur-md border-b border-brand-gold/20 shadow-sm"
                : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
                <Link
                    href="/"
                    className="font-serif text-2xl font-medium text-white tracking-wide hover:opacity-80 transition-opacity"
                >
                    FoodPro
                </Link>

                <div className="flex items-center gap-8">
                    <Link href="/menu" className="text-sm tracking-widest text-brand-gold hover:text-white transition-colors">
                        MENU
                    </Link>

                    {/* {user && (
                        <Link href="/reservations" className="text-sm tracking-widest text-gray-300 hover:text-white transition-colors">
                        RESERVATIONS
                        </Link>
                    )} */}

                    <Link href="/about" className="text-sm tracking-widest text-gray-300 hover:text-white transition-colors">
                        READ ME
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-white/50 font-sans">
                                {user.name}
                            </span>
                            <button
                                onClick={() => {
                                    logout();
                                    window.location.href = "/";
                                }}
                                className="bg-brand-gold/80 text-brand-dark font-medium tracking-widest text-xs px-6 py-3 hover:bg-brand-gold transition-colors duration-200"
                            >
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-brand-gold/80 text-brand-dark font-medium tracking-widest text-xs px-6 py-3 hover:bg-brand-gold transition-colors duration-200"
                        >
                            LOGIN
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}