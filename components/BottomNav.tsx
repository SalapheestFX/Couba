"use client";

import { House, Coins, RefreshCw, Wallet } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { label: "Home", icon: House, href: "/dashboard" },
  { label: "Markets", icon: Coins, href: "/markets" },
  { label: "Trade", icon: RefreshCw, href: "/trade" },
  { label: "Assets", icon: Wallet, href: "/assets" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto grid w-full max-w-[320px] grid-cols-4 rounded-[30px] border border-white/90 bg-white/85 px-1.5 py-1.5 shadow-[0_8px_30px_rgba(35,91,145,0.12)] ring-1 ring-sky-100/60 backdrop-blur-2xl">
        {items.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;

          return (
            <a
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 rounded-[22px] py-2 text-[9px] font-semibold leading-tight transition-colors ${
                active ? "bg-sky-50 text-[#1769b8]" : "text-[#71869b] hover:text-[#1769aa]"
              }`}
            >
              <Icon size={17} strokeWidth={1.9} />
              <span>{label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
