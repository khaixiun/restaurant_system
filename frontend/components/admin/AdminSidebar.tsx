"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, UtensilsCrossed, CalendarDays, Armchair, Clock, ArrowLeft } from "lucide-react";

const navLinks = [
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { href: "/admin/foods", label: "Foods", icon: UtensilsCrossed },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/admin/tables", label: "Tables", icon: Armchair },
  { href: "/admin/timeslots", label: "Time Slots", icon: Clock },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#1a1a18] border-r border-white/10 flex flex-col">
      <div className="px-6 py-8 border-b border-white/10">
        <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-1">
          FoodPro
        </p>
        <h2 className="font-serif text-white text-xl">Admin Panel</h2>
      </div>

      <nav className="flex flex-col gap-1 p-4 flex-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-sans transition-colors ${
              pathname === href
                ? "bg-brand-gold/10 text-brand-gold"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-sans text-white/30 hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}