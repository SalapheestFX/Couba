"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp, ArrowUpRight, RefreshCw, Search, Star,
  TrendingUp, TrendingDown, Clock3, X
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
};

type Category = {
  category_id: string;
  name: string;
};

const categoryNames = [
  "All Markets", "Layer 1", "Layer 2", "DeFi",
  "AI", "RWA", "Meme", "Gaming", "Infrastructure"
];

const categoryTerms: Record<string, string[]> = {
  "Layer 1": ["layer 1", "layer-1"],
  "Layer 2": ["layer 2", "layer-2"],
  DeFi: ["defi", "decentralized finance"],
  AI: ["artificial intelligence", "ai agents"],
  RWA: ["real world assets", "rwa"],
  Meme: ["meme"],
  Gaming: ["gaming", "gamefi"],
  Infrastructure: ["infrastructure"]
};

const localLogos: Record<string, string> = {
  bitcoin: "/crypto/bitcoin.png",
  ethereum: "/crypto/ethereum.png",
  solana: "/crypto/solana.png",
  tether: "/crypto/usdt.png",
  binancecoin: "/crypto/bnb.png"
};

const money = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 8
  });
};

const compactMoney = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return "—";
  return "$" + new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
};

const percentage = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
};

export default function MarketsPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("All Markets");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("market_cap_desc");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchOnly, setWatchOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("couba-market-watchlist");
      if (saved) setWatchlist(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleWatch = (id: string) => {
    setWatchlist(previous => {
      const next = previous.includes(id)
        ? previous.filter(item => item !== id)
        : [...previous, id];
      try {
        localStorage.setItem("couba-market-watchlist", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const loadCategories = useCallback(async () => {
    const response = await fetch(
      "/api/markets?resource=categories",
      { cache: "no-store" }
    );
    if (!response.ok) throw new Error("Category data unavailable");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid category data");
    setCategories(data);
    return data as Category[];
  }, []);

  const loadMarkets = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    setError("");

    try {
      let availableCategories = categories;

      if (category !== "All Markets" && !availableCategories.length) {
        availableCategories = await loadCategories();
      }

      let categoryId = "";

      if (category !== "All Markets") {
        const terms = categoryTerms[category] || [category.toLowerCase()];
        const found = availableCategories.find(item => {
          const name = item.name.toLowerCase();
          const id = item.category_id.toLowerCase();
          return terms.some(term => name.includes(term) || id.includes(term));
        });

        if (!found) {
          throw new Error(
            `No matching ${category} category was returned. Try All Markets.`
          );
        }
        categoryId = found.category_id;
      }

      const params = new URLSearchParams({
        vs_currency: "usd",
        order: sort,
        per_page: "100",
        page: "1",
        sparkline: "false",
        price_change_percentage: "24h"
      });

      if (categoryId) params.set("category", categoryId);

      const response = await fetch(
        `/api/markets?${params}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(response.status === 429
          ? "Market data is rate-limited. Wait a moment and retry."
          : "Unable to load live market data. Please retry.");
      }

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid market response.");

      setCoins(data);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Market data unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category, categories, loadCategories, sort]);

  useEffect(() => {
    setLoading(true);
    void loadMarkets();
    const timer = window.setInterval(() => void loadMarkets(), 60000);
    return () => window.clearInterval(timer);
  }, [loadMarkets]);

  const filteredCoins = useMemo(() => {
    const query = search.trim().toLowerCase();
    return coins.filter(coin => {
      const matchesSearch = !query ||
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query) ||
        coin.id.toLowerCase().includes(query);

      return matchesSearch &&
        (!watchOnly || watchlist.includes(coin.id));
    });
  }, [coins, search, watchOnly, watchlist]);

  const gainers = coins.filter(
    coin => (coin.price_change_percentage_24h ?? 0) > 0
  ).length;

  const losers = coins.filter(
    coin => (coin.price_change_percentage_24h ?? 0) < 0
  ).length;

  const logo = (coin: Coin) => localLogos[coin.id] || coin.image;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_12%_0%,_rgba(160,211,250,0.34)_0%,_transparent_38%),radial-gradient(ellipse_at_90%_25%,_rgba(207,232,255,0.38)_0%,_transparent_35%),linear-gradient(135deg,#f4faff_0%,#edf6ff_48%,#f8fbff_100%)] pb-28 text-[#182536]">
      <div className="relative z-10 mx-auto max-w-6xl space-y-4 px-3 pt-4 sm:px-6 sm:pt-5">
        <section className="overflow-hidden rounded-[24px] border border-white/80 bg-white/30 shadow-[0_12px_38px_rgba(38,104,160,0.06)] backdrop-blur-2xl">
          <div className="border-b border-sky-50 p-3 sm:p-4">
            <div className="mb-1 flex items-center justify-between gap-3"><h2 className="text-sm font-bold text-[#153754]">All cryptocurrencies</h2></div>

            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e4edf5] bg-white/50 px-3 py-2.5 backdrop-blur-xl sm:max-w-sm">
                <Search size={17} className="shrink-0 text-[#8295a8]" />
                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Search name or symbol"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a1afbd]"
                />
                {search && (
                  <button onClick={() => setSearch("")} aria-label="Clear search">
                    <X size={15} />
                  </button>
                )}
              </label>

              <button
                onClick={() => setWatchOnly(value => !value)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${
                  watchOnly
                    ? "border-sky-200 bg-sky-50 text-[#1769b8]"
                    : "border-[#e4edf5] bg-white text-[#71869b]"
                }`}
              >
                <Star size={15} fill={watchOnly ? "currentColor" : "none"} />
                Watchlist ({watchlist.length})
              </button>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {categoryNames.map(item => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                    category === item
                      ? "border-[#1769b8] bg-[#1769b8] text-white"
                      : "border-sky-100 bg-white text-[#70869c] hover:bg-white/75"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-2.5 border-b border-sky-50 px-3 py-3 sm:flex-row sm:items-center sm:px-4">
            <p className="text-xs text-[#8295a8]">
              Showing <strong className="text-[#45647f]">{filteredCoins.length}</strong> assets
              {category !== "All Markets" ? ` in ${category}` : ""}
            </p>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#71869b]">
              <ArrowDownUp size={15} />
              Sort by
              <select
                value={sort}
                onChange={event => setSort(event.target.value)}
                className="max-w-[190px] rounded-lg border border-white/80 bg-white/55 px-2.5 py-2 text-xs font-bold text-[#345875] outline-none"
              >
                <option value="market_cap_desc">Market cap: high to low</option>
                <option value="market_cap_asc">Market cap: low to high</option>
                <option value="volume_desc">Volume: high to low</option>
                <option value="volume_asc">Volume: low to high</option>
              </select>
            </label>
          </div>

          {error && (
            <div className="m-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 sm:m-6">
              <p className="text-sm font-bold text-amber-800">Market data unavailable</p>
              <p className="mt-1 text-xs leading-5 text-amber-700">{error}</p>
              <button
                onClick={() => void loadMarkets(true)}
                className="mt-3 rounded-lg bg-[#1769b8] px-4 py-2 text-xs font-bold text-white"
              >
                Try again
              </button>
            </div>
          )}

          {loading && !coins.length && !error && (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4, 5].map(item => (
                <div key={item} className="flex animate-pulse items-center gap-4 py-2">
                  <div className="h-10 w-10 rounded-full bg-sky-100" />
                  <div className="flex-1">
                    <div className="h-3 w-28 rounded bg-sky-100" />
                    <div className="mt-2 h-2.5 w-16 rounded bg-slate-100" />
                  </div>
                  <div className="h-4 w-20 rounded bg-sky-100" />
                </div>
              ))}
            </div>
          )}

          {!loading || coins.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[800px] border-collapse text-left">
                  <thead className="bg-[#f7fbff] text-[10px] font-bold uppercase tracking-wider text-[#8a9daf]">
                    <tr>
                      <th className="px-4 py-3">Asset</th>
                      <th className="px-3 py-3 text-right">Price</th>
                      <th className="px-3 py-3 text-right">24h change</th>
                      <th className="px-3 py-3 text-right">24h volume</th>
                      <th className="px-3 py-3 text-right">Market cap</th>
                      <th className="px-4 py-3 text-center">Watch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoins.map(coin => {
                      const change = coin.price_change_percentage_24h ?? 0;
                      const watched = watchlist.includes(coin.id);

                      return (
                        <tr key={coin.id} className="border-t border-sky-50 hover:bg-white/75/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="w-5 text-xs text-[#a1afbd]">
                                {coin.market_cap_rank ?? "—"}
                              </span>
                              <img src={logo(coin)} alt="" loading="lazy" className="h-8 w-8 rounded-full bg-white object-contain" />
                              <div>
                                <p className="text-[13px] font-semibold text-[#254966]">{coin.name}</p>
                                <p className="mt-0.5 text-[10px] font-bold uppercase text-[#94a5b5]">{coin.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right text-sm font-bold text-[#345875]">
                            {money(coin.current_price)}
                          </td>
                          <td className={`px-3 py-3 text-right text-xs font-bold ${change >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                            {percentage(coin.price_change_percentage_24h)}
                          </td>
                          <td className="px-3 py-3 text-right text-xs font-semibold text-[#607a91]">
                            {compactMoney(coin.total_volume)}
                          </td>
                          <td className="px-3 py-3 text-right text-xs font-semibold text-[#607a91]">
                            {compactMoney(coin.market_cap)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleWatch(coin.id)}
                              aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
                              className={`rounded-xl p-2 ${watched ? "bg-amber-50 text-amber-500" : "text-[#a0afbd] hover:bg-white/75"}`}
                            >
                              <Star size={17} fill={watched ? "currentColor" : "none"} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-sky-50 md:hidden">
                {filteredCoins.map(coin => {
                  const change = coin.price_change_percentage_24h ?? 0;
                  const watched = watchlist.includes(coin.id);

                  return (
                    <div key={coin.id} className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={logo(coin)} alt="" loading="lazy" className="h-10 w-10 rounded-full bg-white object-contain" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-[#254966]">{coin.name}</p>
                          <p className="mt-0.5 text-[10px] font-bold uppercase text-[#94a5b5]">
                            {coin.symbol} · Rank #{coin.market_cap_rank ?? "—"}
                          </p>
                        </div>
                        <button onClick={() => toggleWatch(coin.id)} aria-label="Toggle watchlist" className={watched ? "text-amber-500" : "text-[#9aacbd]"}>
                          <Star size={18} fill={watched ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[10px] text-[#91a2b2]">Price</p>
                          <p className="mt-1 text-xs font-extrabold text-[#345875]">{money(coin.current_price)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#91a2b2]">24h change</p>
                          <p className={`mt-1 text-xs font-bold ${change >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                            {percentage(coin.price_change_percentage_24h)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#91a2b2]">24h volume</p>
                          <p className="mt-1 text-xs font-bold text-[#607a91]">{compactMoney(coin.total_volume)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!error && filteredCoins.length === 0 && (
                <div className="px-5 py-14 text-center">
                  <Search size={22} className="mx-auto mb-3 text-[#8295a8]" />
                  <p className="text-sm font-bold text-[#345875]">No assets found</p>
                  <p className="mt-1 text-xs text-[#8295a8]">Try another search or category.</p>
                  {watchOnly && (
                    <button onClick={() => setWatchOnly(false)} className="mt-4 text-xs font-bold text-[#1769b8]">
                      Show all markets
                    </button>
                  )}
                </div>
              )}
            </>
          ) : null}

          <div className="border-t border-sky-50 bg-white/60 px-3 py-3 sm:px-6">
            <p className="text-[10px] leading-5 text-[#8a9daf]">
              Public reference data provided by CoinGecko. These are not Couba execution prices and do not confirm Couba listing support.
            </p>
          </div>
        </section>

        <section className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-sky-100 bg-white/60 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-extrabold text-[#254966]">Ready to trade?</p>
            <p className="mt-1 text-xs leading-5 text-[#8295a8]">
              Continue to Couba's separate spot-trading interface.
            </p>
          </div>
          <Link href="/trade" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1769b8] px-5 py-3 text-xs font-bold text-white">
            Open spot trading <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
