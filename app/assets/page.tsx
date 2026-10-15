"use client";

import BottomNav from "@/components/BottomNav";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Search,
  ShieldCheck,
  Wallet,
  Coins,
  CircleDollarSign,
  Info,
} from "lucide-react";
import { useMemo, useState } from "react";

type WalletAsset = {
  id: string;
  symbol: string;
  name: string;
  balance: string | null;
  color: string;
};

type AssetTab = "Overview" | "Funding" | "Spot" | "Balances";

const tabs: AssetTab[] = ["Overview", "Funding", "Spot", "Balances"];

const assets: WalletAsset[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", balance: null, color: "#f7931a" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", balance: null, color: "#627eea" },
  { id: "solana", symbol: "SOL", name: "Solana", balance: null, color: "#6d5ce8" },
  { id: "tether", symbol: "USDT", name: "Tether", balance: null, color: "#26a17b" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", balance: null, color: "#d9a514" },
];

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<AssetTab>("Overview");
  const [search, setSearch] = useState("");
  const [hideBalance, setHideBalance] = useState(false);

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(query) ||
        asset.symbol.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [search]);

  const pageTitle =
    activeTab === "Overview"
      ? "My Assets"
      : activeTab === "Funding"
        ? "Funding Account"
        : activeTab === "Spot"
          ? "Spot Account"
          : "Balances";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_12%_0%,_rgba(160,211,250,0.34)_0%,_transparent_38%),radial-gradient(ellipse_at_90%_25%,_rgba(207,232,255,0.38)_0%,_transparent_35%),linear-gradient(135deg,#f4faff_0%,#edf6ff_48%,#f8fbff_100%)] pb-28 text-[#142e49]">
      <div className="relative mx-auto max-w-6xl space-y-5 px-4 pb-6 pt-5 sm:px-6 sm:pt-6">

        {/* Portfolio card */}
        <section className="relative overflow-hidden rounded-[26px] border border-white/55 bg-white/[0.16] p-4 shadow-[0_12px_40px_rgba(38,104,160,0.06),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-3xl sm:p-5">
          <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-sky-200/35 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-[#71869b]">
              <CircleDollarSign size={17} />
              Total portfolio value
            </div>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              aria-label={hideBalance ? "Show balance" : "Hide balance"}
              className="rounded-full p-2 text-[#67849e] transition hover:bg-sky-50"
            >
              {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-[#153754]">
              {hideBalance ? "••••••••" : "$0.00"}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8295a7]">
              <Info size={13} />
              {hideBalance
                ? "Portfolio value hidden"
                : "Connect a wallet to view available balances"}
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-4 gap-2 border-t border-sky-100/80 pt-4">
            {[
              { label: "Deposit", icon: ArrowDownLeft, href: "/signup" },
              { label: "Withdraw", icon: ArrowUpRight, href: "/login" },
              { label: "Transfer", icon: ArrowLeftRight, href: "/login" },
              { label: "History", icon: Clock3, href: "/login" },
            ].map(({ label, icon: Icon, href }) => (
              <a
                href={href}
                key={label}
                className="group flex min-w-0 flex-col items-center gap-1.5 text-center"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[13px] border border-white/80 bg-white/55 text-[#2878b7] shadow-[0_4px_12px_rgba(43,105,157,0.07)] transition group-hover:-translate-y-0.5 group-hover:bg-sky-50">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <span className="text-[10px] font-semibold text-[#58738b] sm:text-[11px]">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Account tabs */}
        <section className="mt-4">
          <div className="overflow-x-auto rounded-[22px] border border-white/75 bg-white/30 p-1.5 shadow-[0_5px_20px_rgba(38,104,160,0.05)] ring-1 ring-sky-100/40 backdrop-blur-2xl">
            <div className="grid min-w-[300px] grid-cols-4 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="rounded-[17px] px-1.5 py-2.5 text-[11px] font-semibold text-[#8193a4] transition-colors duration-200 hover:bg-white/15"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Account overview cards */}
        {activeTab === "Overview" && (
          <section className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setActiveTab("Funding")}
              className="rounded-2xl border border-white/50 bg-white/[0.15] p-3 text-left shadow-[0_8px_24px_rgba(38,104,160,0.05)] backdrop-blur-2xl transition hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#2878b7]">
                <ArrowDownLeft size={19} />
              </span>
              <p className="mt-2.5 text-[13px] font-bold text-[#234c70]">Funding</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#8496a7]">
                Deposits and transfer funds
              </p>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#4b83ac]">
                Open account <ChevronRight size={15} />
              </div>
            </button>

            <button
              onClick={() => setActiveTab("Spot")}
              className="rounded-2xl border border-white/50 bg-white/[0.15] p-3 text-left shadow-[0_8px_24px_rgba(38,104,160,0.05)] backdrop-blur-2xl transition hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2878b7]">
                <Coins size={19} />
              </span>
              <p className="mt-2.5 text-[13px] font-bold text-[#234c70]">Spot</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#8496a7]">
                Assets for spot trading
              </p>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#4b83ac]">
                Open account <ChevronRight size={15} />
              </div>
            </button>
          </section>
        )}

        {/* Asset list */}
        <section className="mt-4 overflow-hidden rounded-[22px] border border-white/90 bg-white/70 shadow-[0_8px_30px_rgba(39,101,151,0.07)] ring-1 ring-sky-100/50 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-3.5 pb-2.5 pt-4 sm:px-4">
            <div>
              <h2 className="text-base font-bold text-[#204667]">
                {activeTab === "Funding"
                  ? "Funding assets"
                  : activeTab === "Spot"
                    ? "Spot assets"
                    : activeTab === "Balances"
                      ? "All balances"
                      : "Crypto assets"}
              </h2>
            </div>
          </div>

          <div className="mx-4 mb-3 flex items-center gap-2 rounded-xl border border-sky-100/80 bg-white/75 px-3 sm:mx-5">
            <Search size={16} className="shrink-0 text-[#94a6b6]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coin or symbol"
              className="h-9 w-full bg-transparent text-xs sm:text-sm text-[#234c70] outline-none placeholder:text-[#9aabba]"
            />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-y border-white/70 bg-white/15 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#8a9eaf] sm:px-5">
            <span>Asset</span>
            <span className="text-right">Available</span>
          </div>

          {filteredAssets.length > 0 ? (
            <div>
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between gap-2.5 border-b border-white/70 px-4 py-2.5 last:border-b-0 sm:px-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {asset.id === "binancecoin" ? (
                      <img
                        src="/crypto/bnb.png"
                        alt="BNB logo"
                        className="h-8 w-8 shrink-0 rounded-full bg-white object-contain"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <img
                        src={
                          asset.id === "bitcoin"
                            ? "/crypto/bitcoin.png"
                            : asset.id === "ethereum"
                              ? "/crypto/ethereum.png"
                              : asset.id === "solana"
                                ? "/crypto/solana.png"
                                : "/crypto/usdt.png"
                        }
                        alt={`${asset.name} logo`}
                        className="h-8 w-8 shrink-0 rounded-full bg-white object-contain"
                        width={32}
                        height={32}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#234c70]">
                        {asset.name}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium uppercase text-[#8b9eaf]">
                        {asset.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-[#345a78] sm:text-sm">
                      {hideBalance ? "••••••" : `0.00 ${asset.symbol}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#6f9abb]">
                <Search size={21} />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#456781]">
                No matching assets
              </p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#8c9eae]">
                Try another coin name or symbol.
              </p>
            </div>
          )}</section>

        {/* Security notice */}
        <section className="mt-4 flex items-start gap-2.5 rounded-xl border border-sky-100/80 bg-white/50 p-3 backdrop-blur-xl">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#3980b6]">
            <ShieldCheck size={18} />
          </span>
          <div>
            <p className="text-xs font-bold text-[#456781]">
              Your assets, clearly organized
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#8799a9]">
              Funding, Spot, and Balances are currently interface sections.
              Deposits, withdrawals, transfers, and wallet balances require
              backend integration before they can move real funds.
            </p>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
