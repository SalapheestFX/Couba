"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, Bell, UserRound, ChevronRight, ArrowUpRight,
  ArrowDownLeft, Wallet, Repeat2, Star, Eye, EyeOff,
  TrendingUp, LayoutGrid, CandlestickChart, History,
  CircleHelp, RefreshCw, } from "lucide-react";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 5 : 2,
  }).format(value);

const formatCap = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return formatPrice(value);
};

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["bitcoin"]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function loadMarkets() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,tether,binancecoin,ripple,dogecoin&order=market_cap_desc&per_page=7&page=1&sparkline=false&price_change_percentage=24h",
        { cache: "no-store" }
      );
      if (!response.ok) throw new Error("Market request failed");
      setCoins(await response.json());
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarkets();
    const timer = setInterval(loadMarkets, 60000);
    return () => clearInterval(timer);
  }, []);

  const shortcuts = [
    { label: "Buy", icon: ArrowDownLeft, href: "/trade" },
    { label: "Sell", icon: ArrowUpRight, href: "/trade" },
    { label: "Deposit", icon: Wallet, href: "/signup" },
    { label: "Withdraw", icon: ArrowUpRight, href: "/login" },
    { label: "Convert", icon: Repeat2, href: "/trade" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_12%_0%,_rgba(160,211,250,0.34)_0%,_transparent_38%),radial-gradient(ellipse_at_90%_25%,_rgba(207,232,255,0.38)_0%,_transparent_35%),linear-gradient(135deg,#f4faff_0%,#edf6ff_48%,#f8fbff_100%)] pb-28 text-[#182536]">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-white/20 shadow-[0_8px_32px_rgba(38,104,160,0.07)] backdrop-blur-2xl">
        <div className="mx-auto flex h-[66px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/" aria-label="Couba home" className="flex items-center">
              <img src="/couba-logo.svg" alt="Couba" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="mx-auto min-w-0 max-w-5xl flex-[1.8] px-1 sm:px-4">
            <label className="group flex h-9 min-w-0 items-center gap-2 rounded-full border border-white/80 bg-white/30 px-4 shadow-[0_4px_20px_rgba(45,115,175,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl transition-all duration-300 focus-within:border-[#9bcdf5] focus-within:bg-white/55 focus-within:shadow-[0_6px_24px_rgba(45,115,175,0.15)] hover:bg-white/45 sm:h-9 sm:px-5">
              <Search size={17} className="shrink-0 text-[#6e91af] transition-colors group-focus-within:text-[#1769b8]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("market-search")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                placeholder="Search coins and markets..."
                aria-label="Search coins and markets"
                className="h-full w-full min-w-0 bg-transparent text-xs text-[#234762] outline-none placeholder:text-[#8ca5bb] sm:text-sm"
              />
            </label>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => alert("You're all caught up.")}
              aria-label="Notifications"
              className="relative rounded-xl border border-white/75 bg-white/35 p-2.5 text-[#47799f] shadow-[0_5px_18px_rgba(38,104,160,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/65"
            >
              <Bell size={19} />
            </button>
            <Link
              href="/login"
              aria-label="Profile and account"
              className="rounded-xl border border-white/75 bg-white/35 p-2.5 text-[#1769b8] shadow-[0_5px_18px_rgba(38,104,160,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/65"
            >
              <UserRound size={19} />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-4 sm:px-6">
        <section className="grid gap-6 border-b border-[#dce8f3]/80 pb-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="py-2">
            <div className="flex items-center gap-2 text-sm text-[#71869b]">
              Total Assets
              <button onClick={() => setBalanceHidden(!balanceHidden)} aria-label="Toggle balance visibility" className="rounded-md p-1 text-[#6384a2] hover:bg-white/70">
                {balanceHidden ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[#153754] sm:text-4xl">
                {balanceHidden ? "••••••••" : "— — —"}
              </span>
              <span className="text-sm font-medium text-[#8298ad]">USD</span>
            </div>
            <p className="mt-2 text-xs text-[#8ba0b3]">Account balance</p>
            <div className="mt-5 flex flex-wrap gap-3">
              
            </div>
          </div>

          <div className="rounded-[26px] border border-white/75 bg-white/25 p-5 shadow-[0_12px_40px_rgba(38,104,160,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#153754]">Quick access</h2>
              <LayoutGrid size={18} className="text-[#7392ae]" />
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {shortcuts.map(({ label, icon: Icon, href }) => (
                <Link key={label} href={href} className="group flex min-w-0 flex-col items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/75 bg-gradient-to-br from-white/65 to-[#dcefff]/55 backdrop-blur-xl text-[#1769b8] shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="text-center text-[11px] font-medium text-[#5e7890]">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="market-search" className="overflow-hidden rounded-[28px] border border-white/75 bg-white/30 shadow-[0_18px_55px_rgba(38,104,160,0.09),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/60 bg-white/20 px-5 py-5 backdrop-blur-xl sm:px-6">
            <div>
              <h2 className="text-lg font-bold">Markets</h2>
              <p className="mt-1 text-xs text-[#8a97a6]">Live public market reference prices</p>
            </div>
            <button onClick={loadMarkets} aria-label="Refresh market data" className="inline-flex items-center gap-2 rounded-lg border border-[#e5eaf0] px-3 py-2 text-xs font-semibold text-[#657589] hover:bg-[#f7f9fc]">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/15 px-5 py-3 backdrop-blur-xl sm:px-6">
            <div className="grid flex-1 grid-cols-[1.4fr_1fr_auto] gap-3 text-[11px] font-medium uppercase tracking-wide text-[#93a0ae] sm:grid-cols-[1.5fr_1fr_1fr_auto]">
            <span>Asset</span>
            <span className="text-right">Last price</span>
            <span className="hidden text-right sm:block">Market cap</span>
            <span className="text-right">24h change</span>
            </div>
            <span className="text-xs text-[#7894ad]">{filteredCoins.length} assets</span>
          </div>

          {searchTerm && (
            <div className="border-b border-white/70 bg-[#edf6ff]/60 px-5 py-2 text-xs text-[#547895]">
              Search results for <strong>{searchTerm}</strong>
              <button onClick={() => setSearchTerm("")} className="ml-3 font-semibold text-[#1769b8]">Clear</button>
            </div>
          )}

          {loading && (
            <div className="space-y-5 p-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex animate-pulse items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-[#edf1f6]" />
                  <div className="h-3 flex-1 rounded bg-[#edf1f6]" />
                  <div className="h-3 w-16 rounded bg-[#edf1f6]" />
                </div>
              ))}
            </div>
          )}

          {!loading && !failed && filteredCoins.map((coin) => {
            const change = coin.price_change_percentage_24h;
            const favorite = favorites.includes(coin.id);
            return (
              <div key={coin.id} className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-3 border-t border-[#f0f3f6] px-4 py-4 transition hover:bg-[#fafcff] sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:px-6">
                <div className="flex min-w-0 items-center gap-2.5">
                  <button onClick={() => setFavorites((old) => favorite ? old.filter((id) => id !== coin.id) : [...old, coin.id])} aria-label={favorite ? "Remove favorite" : "Add favorite"} className={favorite ? "text-[#e6aa36]" : "text-[#c5ced8]"}>
                    <Star size={15} fill={favorite ? "currentColor" : "none"} />
                  </button>
                  <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{coin.name}</p>
                    <p className="mt-0.5 text-[11px] uppercase text-[#93a0ae]">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="whitespace-nowrap text-xs font-semibold sm:text-sm">{formatPrice(coin.current_price)}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm text-[#607084]">{formatCap(coin.market_cap)}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block min-w-[68px] rounded-md px-2 py-1 text-center text-[11px] font-semibold sm:text-xs ${
                    change == null ? "bg-[#f0f3f6] text-[#778596]" :
                    change >= 0 ? "bg-[#e8f7ef] text-[#16865b]" : "bg-[#fff0f0] text-[#d84a4a]"
                  }`}>
                    {change == null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
                  </span>
                </div>
              </div>
            );
          })}

          {!loading && !failed && filteredCoins.length === 0 && (
            <div className="px-6 py-10 text-center">
              <Search size={26} className="mx-auto text-[#8ca2b8]" />
              <p className="mt-3 text-sm font-semibold">No matching assets</p>
              <p className="mt-1 text-xs text-[#8a97a6]">Try another coin name or ticker symbol.</p>
            </div>
          )}

          {!loading && failed && (
            <div className="px-6 py-12 text-center">
              <TrendingUp size={30} className="mx-auto text-[#8ca2b8]" />
              <p className="mt-3 font-semibold">Market data is temporarily unavailable</p>
              <p className="mt-1 text-sm text-[#8a97a6]">Try refreshing in a moment.</p>
              <button onClick={loadMarkets} className="mt-4 rounded-lg bg-[#1769b8] px-4 py-2 text-sm font-semibold text-white">Retry</button>
            </div>
          )}

          <Link href="/trade" className="flex items-center justify-center gap-2 border-t border-[#edf0f4] px-5 py-4 text-sm font-semibold text-[#1769b8] hover:bg-[#f8fbff]">
            View trading page <ChevronRight size={16} />
          </Link>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/70 bg-white/25 p-5 shadow-[0_14px_42px_rgba(38,104,160,0.07),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Recent activity</h2>
              <History size={19} className="text-[#91a0af]" />
            </div>
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf5fd] text-[#1769b8]">
                <History size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold">No transactions to display</p>
              <p className="mt-1 text-xs text-[#8a97a6]">Your account activity will appear here.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/25 p-5 shadow-[0_14px_42px_rgba(38,104,160,0.07),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Account support</h2>
              <CircleHelp size={19} className="text-[#91a0af]" />
            </div>
            <p className="mt-3 text-sm leading-6 text-[#748396]">
              Find account options and get help navigating Couba.
            </p>
            <Link href="/login" className="mt-5 flex items-center justify-between rounded-xl bg-[#f5f8fc] px-4 py-3 text-sm font-semibold text-[#42627f] hover:bg-[#edf4fc]">
              Account & security <ChevronRight size={17} />
            </Link>
          </div>
        </section>

        <p className="text-center text-[11px] leading-5 text-[#9aa5b1]">
          Market prices are informational references. Cryptocurrency trading involves risk.
        </p>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(10px,env(safe-area-inset-bottom))] md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 rounded-[30px] border border-white/80 bg-white/30 px-2 py-2 shadow-[0_16px_48px_rgba(24,76,120,0.13),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-[#d9ebfc]/45 backdrop-blur-2xl">
          {[
            { label: "Home", icon: LayoutGrid, href: "/dashboard" },
            { label: "Markets", icon: TrendingUp, href: "/trade" },
            { label: "Trade", icon: CandlestickChart, href: "/trade" },
            { label: "Profile", icon: UserRound, href: "/login" },
          ].map(({ label, icon: Icon, href }, index) => (
            <Link key={label} href={href} className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] transition-all duration-200 ${index === 0 ? "bg-gradient-to-b from-white/95 to-[#e3f2ff]/90 font-bold text-[#1769b8] shadow-sm ring-1 ring-white" : "font-medium text-[#8a9daf] hover:bg-white/70 hover:text-[#1769b8]"}`}>
              <Icon size={20} strokeWidth={index === 0 ? 2.2 : 1.8} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
