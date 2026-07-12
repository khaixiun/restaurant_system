"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

export default function Navbar(){
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 50){
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return(
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration 300 ${
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
                    <Link href="/reservations" className="text-sm tracking-widest text-gray-300 hover:text-white transition-colors">
                        RESERVATIONS
                    </Link>
                    <Link href="/about" className="text-sm tracking-widest text-gray-300 hover:text-white transition-colors">
                        ABOUT
                    </Link>
                    <Link href="/contact" className="text-sm tracking-widest text-gray-300 hover:text-white transition-colors">
                        CONTACT
                    </Link>

                    <Link
                        href="/reservations"
                        className="bg-brand-gold/80 text-brand-dark font-medium tracking-widest text-xs px-6 py-3 hover:bg-brand-gold transition-colors duration-200"
                    >
                        RESERVE
                    </Link>
                </div>
            </div>
        </nav>
    );
}