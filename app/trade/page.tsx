"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity, ArrowDownLeft, ArrowLeft, ArrowUpRight,
  BarChart3, ChevronDown, Clock3, RefreshCw, Wallet,
} from "lucide-react";

type Order = {
  id: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  remaining: number;
  status: "open" | "filled" | "partially_filled";
};

type Trade = {
  id: string;
  price: number;
  amount: number;
  total: number;
  createdAt: number;
};

const fmt = (value: number, digits = 2) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const qty = (value: number) =>
  Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 8,
  });

const shortTime = (value: number) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "--:--:--"
    : date.toLocaleTimeString([], {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
};

export default function TradePage() {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("100000");
  const [amount, setAmount] = useState("0.01");
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const total = Math.max(0, Number(price) || 0) *
    Math.max(0, Number(amount) || 0);

  const refreshMarket = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to load the order book.");
      }
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setTrades(Array.isArray(data.trades) ? data.trades.slice(-20).reverse() : []);
    } catch (error) {
      if (manual) {
        setMessage(error instanceof Error ? error.message : "Market refresh failed.");
        setMessageType("error");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshMarket();
    const timer = window.setInterval(() => void refreshMarket(), 15000);
    return () => window.clearInterval(timer);
  }, [refreshMarket]);

  useEffect(() => {
    let active = true;
    async function loadReferencePrice() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
          { cache: "no-store" }
        );
        if (!response.ok) throw new Error("Price unavailable");
        const data = await response.json();
        const btc = data?.bitcoin;
        if (active && typeof btc?.usd === "number") {
          setMarketPrice(btc.usd);
          setChange24h(typeof btc.usd_24h_change === "number"
            ? btc.usd_24h_change : null);
        }
      } catch {
        // Keep the market usable if reference data is unavailable.
      }
    }
    void loadReferencePrice();
    const timer = window.setInterval(loadReferencePrice, 60000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  async function placeOrder() {
    const parsedPrice = Number(price);
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setMessage("Enter a valid limit price.");
      setMessageType("error");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setMessage("Enter a valid BTC amount.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          side, price: parsedPrice, amount: parsedAmount,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to place order.");
      }
      const executed = Array.isArray(data.executedTrades)
        ? data.executedTrades : [];
      setMessage(executed.length
        ? `Order matched. ${executed.length} execution(s) completed.`
        : `Order ${data.order?.id || "accepted"} added to the order book.`);
      setMessageType("success");
      await refreshMarket();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Order placement failed.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  const sells = orders
    .filter(o => o.side === "sell" && o.remaining > 0)
    .sort((a, b) => a.price - b.price).slice(0, 8).reverse();

  const buys = orders
    .filter(o => o.side === "buy" && o.remaining > 0)
    .sort((a, b) => b.price - a.price).slice(0, 8);

  const bestSell = sells.length ? sells[sells.length - 1].price : null;
  const bestBuy = buys.length ? buys[0].price : null;
  const referenceLabel = marketPrice === null ? "—" : `$${fmt(marketPrice)}`;

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#172b4d]">
      <header className="sticky top-0 z-30 border-b border-[#e1e8f0] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102b50] text-lg font-black text-white">C</span>
            <span className="text-xl font-black tracking-[-0.06em] text-[#102b50]">
              Couba <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5a91d5]">Pro</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-500 md:flex">
            <a href="/" className="hover:text-[#102b50]">Overview</a>
            <a href="/trade" className="border-b-2 border-[#2766ac] py-[22px] text-[#102b50]">Trade</a>
            <a href="/wallet" className="hover:text-[#102b50]">Wallet</a>
          </nav>
          <a href="/wallet" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#102b50] px-3 text-xs font-bold text-white sm:px-4 sm:text-sm">
            <Wallet size={15} /> Wallet
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-3 pb-10 pt-4 sm:px-6 sm:pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <a href="/" className="hover:text-[#102b50]">Home</a>
            <span>/</span><span className="text-slate-600">Spot Trading</span>
          </div>
          <button onClick={() => void refreshMarket(true)} disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#dfe7f0] bg-white px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50">
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <section className="overflow-hidden rounded-xl border border-[#dfe7f0] bg-white shadow-[0_3px_14px_rgba(27,56,91,0.035)]">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 border-b border-[#e8edf3] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7931a]/10 text-lg font-black text-[#e18a12]">₿</div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold tracking-tight">BTC/USDC</h1>
                  <ChevronDown size={15} className="text-slate-400" />
                  <span className="rounded bg-[#edf5ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#3974b8]">Spot</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">Bitcoin / USD Coin</p>
              </div>
            </div>
            <div className="min-w-[145px]">
              <p className={`text-xl font-extrabold tracking-tight ${change24h !== null && change24h < 0 ? "text-rose-600" : "text-emerald-600"}`}>{referenceLabel}</p>
              <p className={`mt-1 text-xs font-semibold ${change24h === null ? "text-slate-400" : change24h >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {change24h === null ? "Reference price" : `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%`}
                <span className="ml-1 font-normal text-slate-400">24h</span>
              </p>
            </div>
            <div className="hidden min-w-[90px] sm:block">
              <p className="text-[11px] text-slate-400">Best bid</p>
              <p className="mt-1 text-sm font-bold text-emerald-600">{bestBuy === null ? "—" : fmt(bestBuy)}</p>
            </div>
            <div className="hidden min-w-[90px] sm:block">
              <p className="text-[11px] text-slate-400">Best ask</p>
              <p className="mt-1 text-sm font-bold text-rose-600">{bestSell === null ? "—" : fmt(bestSell)}</p>
            </div>
            <div className="ml-auto hidden items-center gap-2 text-xs text-slate-400 lg:flex">
              <Activity size={15} className="text-[#5b91ce]" /> Market reference updates periodically
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-0 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)]">
            <div className="min-w-0 border-b border-[#e8edf3] xl:border-b-0 xl:border-r">
              <div className="flex h-12 items-center justify-between border-b border-[#e8edf3] px-4 sm:px-5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#253c5a]">
                  <BarChart3 size={16} className="text-[#5b91ce]" />
                  Price chart
                </div>
                <div className="flex items-center gap-1">
                  {["15m", "1H", "4H", "1D"].map((interval) => (
                    <button
                      key={interval}
                      className={`rounded px-2 py-1 text-[11px] font-semibold ${
                        interval === "1H"
                          ? "bg-[#eaf3ff] text-[#2864a5]"
                          : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex min-h-[285px] flex-col justify-between overflow-hidden bg-white p-4 sm:min-h-[360px] sm:p-5">
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <div
                      key={line}
                      className="absolute w-full border-t border-dashed border-[#e9eff6]"
                      style={{ top: `${line * 17 + 8}%` }}
                    />
                  ))}
                </div>

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400">BTC reference · USD</p>
                    <p className="mt-1 text-xl font-bold text-[#172b4d]">{referenceLabel}</p>
                  </div>
                  <span className="rounded-md border border-[#e2ebf5] bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-500">
                    External reference
                  </span>
                </div>

                <div className="relative z-10 my-4 flex flex-1 items-center justify-center">
                  <svg
                    viewBox="0 0 700 210"
                    preserveAspectRatio="none"
                    className="h-[165px] w-full sm:h-[220px]"
                    role="img"
                    aria-label="Illustrative chart preview; historical candle data is not connected"
                  >
                    <defs>
                      <linearGradient id="coubaChartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5b9ce5" stopOpacity="0.20" />
                        <stop offset="100%" stopColor="#5b9ce5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 150 L35 139 L65 148 L100 112 L130 125 L165 96 L198 111 L230 80 L265 93 L300 63 L335 83 L370 54 L400 68 L435 40 L465 57 L500 36 L535 48 L570 24 L605 43 L640 17 L675 29 L700 12 L700 210 L0 210 Z"
                      fill="url(#coubaChartFill)"
                    />
                    <path
                      d="M0 150 L35 139 L65 148 L100 112 L130 125 L165 96 L198 111 L230 80 L265 93 L300 63 L335 83 L370 54 L400 68 L435 40 L465 57 L500 36 L535 48 L570 24 L605 43 L640 17 L675 29 L700 12"
                      fill="none"
                      stroke="#4f91d7"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="absolute bottom-0 left-0 rounded-md border border-[#e4ebf4] bg-white/95 px-3 py-2 text-[11px] leading-5 text-slate-500 shadow-sm">
                    <span className="block font-semibold text-[#315f94]">Chart preview</span>
                    Historical candles not connected
                  </div>
                </div>

                <div className="relative z-10 flex justify-between border-t border-[#edf1f6] pt-3 text-[10px] text-slate-400">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>Now</span>
                </div>
              </div>

              <div className="border-t border-[#e8edf3]">
                <div className="flex h-12 items-center justify-between px-4 sm:px-5">
                  <h2 className="text-sm font-bold text-[#253c5a]">Order book</h2>
                  <span className="text-[10px] text-slate-400">Price (USDC) · Amount (BTC)</span>
                </div>

                <div className="px-3 pb-4 sm:px-5">
                  <div className="mb-2 grid grid-cols-3 px-2 text-[10px] font-medium text-slate-400">
                    <span>Price (USDC)</span>
                    <span className="text-right">Amount (BTC)</span>
                    <span className="text-right">Total (USDC)</span>
                  </div>

                  <div className="space-y-0.5">
                    {sells.length === 0 && !loading && (
                      <p className="py-3 text-center text-xs text-slate-400">No open sell orders</p>
                    )}
                    {sells.map((order) => (
                      <div key={order.id} className="relative grid grid-cols-3 overflow-hidden rounded-sm px-2 py-1.5 text-[11px] tabular-nums">
                        <div
                          className="absolute inset-y-0 right-0 bg-rose-50"
                          style={{
                            width: `${Math.min(
                              75,
                              (order.remaining /
                                Math.max(...sells.map((item) => item.remaining), 0.00000001)) * 75
                            )}%`,
                          }}
                        />
                        <span className="relative font-semibold text-rose-600">{fmt(order.price)}</span>
                        <span className="relative text-right text-slate-600">{qty(order.remaining)}</span>
                        <span className="relative text-right text-slate-500">{fmt(order.price * order.remaining)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="my-3 flex items-center justify-between rounded-md bg-[#f5f8fc] px-3 py-2.5">
                    <span className={`text-base font-extrabold ${
                      change24h !== null && change24h < 0 ? "text-rose-600" : "text-emerald-600"
                    }`}>
                      {bestBuy === null && bestSell === null
                        ? referenceLabel
                        : fmt(bestBuy ?? bestSell ?? 0)}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Market reference</span>
                  </div>

                  <div className="space-y-0.5">
                    {buys.length === 0 && !loading && (
                      <p className="py-3 text-center text-xs text-slate-400">No open buy orders</p>
                    )}
                    {buys.map((order) => (
                      <div key={order.id} className="relative grid grid-cols-3 overflow-hidden rounded-sm px-2 py-1.5 text-[11px] tabular-nums">
                        <div
                          className="absolute inset-y-0 right-0 bg-emerald-50"
                          style={{
                            width: `${Math.min(
                              75,
                              (order.remaining /
                                Math.max(...buys.map((item) => item.remaining), 0.00000001)) * 75
                            )}%`,
                          }}
                        />
                        <span className="relative font-semibold text-emerald-600">{fmt(order.price)}</span>
                        <span className="relative text-right text-slate-600">{qty(order.remaining)}</span>
                        <span className="relative text-right text-slate-500">{fmt(order.price * order.remaining)}</span>
                      </div>
                    ))}
                  </div>

                  {loading && (
                    <p className="py-4 text-center text-xs text-slate-400">Loading order book…</p>
                  )}
                </div>
              </div>
            </div>

            <aside className="min-w-0">
              <div className="border-b border-[#e8edf3] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#253c5a]">Place limit order</h2>
                  <span className="rounded bg-[#f0f5fb] px-2 py-1 text-[10px] font-semibold text-slate-500">
                    BTC/USDC
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-[#f0f4f9] p-1">
                  <button
                    onClick={() => setSide("buy")}
                    className={`flex h-10 items-center justify-center gap-2 rounded-md text-sm font-bold transition ${
                      side === "buy"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <ArrowDownLeft size={16} /> Buy BTC
                  </button>
                  <button
                    onClick={() => setSide("sell")}
                    className={`flex h-10 items-center justify-center gap-2 rounded-md text-sm font-bold transition ${
                      side === "sell"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <ArrowUpRight size={16} /> Sell BTC
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
                      Limit price <span className="font-normal text-slate-400">USDC</span>
                    </span>
                    <div className="flex h-12 items-center rounded-lg border border-[#dce5ef] bg-white transition focus-within:border-[#6ca0d8] focus-within:ring-2 focus-within:ring-[#e4f0ff]">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#172b4d] outline-none"
                        placeholder="Price"
                      />
                      <span className="pr-3 text-xs font-semibold text-slate-400">USDC</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => marketPrice !== null && setPrice(String(marketPrice))}
                      disabled={marketPrice === null}
                      className="mt-1.5 text-[10px] font-semibold text-[#4d83bd] hover:text-[#102b50] disabled:opacity-40"
                    >
                      Use reference price {marketPrice === null ? "" : `($${fmt(marketPrice)})`}
                    </button>
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
                      Amount <span className="font-normal text-slate-400">BTC</span>
                    </span>
                    <div className="flex h-12 items-center rounded-lg border border-[#dce5ef] bg-white transition focus-within:border-[#6ca0d8] focus-within:ring-2 focus-within:ring-[#e4f0ff]">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#172b4d] outline-none"
                        placeholder="Amount"
                      />
                      <span className="pr-3 text-xs font-semibold text-slate-400">BTC</span>
                    </div>

                    <div className="mt-2 flex gap-2">
                      {["0.001", "0.01", "0.1", "1"].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setAmount(value)}
                          className={`flex-1 rounded border px-1 py-1.5 text-[10px] font-semibold transition ${
                            amount === value
                              ? "border-[#91b8e5] bg-[#edf5ff] text-[#245f9e]"
                              : "border-[#e3eaf2] text-slate-500 hover:border-[#b7cde5]"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </label>

                  <div className="space-y-2 rounded-lg bg-[#f5f8fc] p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Order type</span>
                      <span className="font-semibold text-[#253c5a]">Limit</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Estimated total</span>
                      <span className="font-bold text-[#172b4d]">{fmt(total)} USDC</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Available balance</span>
                      <span className="text-slate-400">Not connected</span>
                    </div>
                  </div>

                  <button
                    onClick={() => void placeOrder()}
                    disabled={submitting}
                    className={`flex h-12 w-full items-center justify-center rounded-lg text-sm font-extrabold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      side === "buy"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-rose-600 hover:bg-rose-700"
                    }`}
                  >
                    {submitting
                      ? "Submitting order…"
                      : `${side === "buy" ? "Buy" : "Sell"} BTC`}
                  </button>

                  {message && (
                    <div
                      className={`rounded-lg border px-3 py-2.5 text-xs leading-5 ${
                        messageType === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <p className="text-[10px] leading-5 text-slate-400">
                    Order placement is not connected to real customer funds.
                    The BTC price is an external reference, not an executable market quote.
                  </p>
                </div>
              </div>

              <div className="border-b border-[#e8edf3] px-4 py-4 sm:px-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#253c5a]">Recent trades</h2>
                  <Clock3 size={15} className="text-slate-400" />
                </div>

                <div className="grid grid-cols-3 gap-2 pb-2 text-[10px] font-medium text-slate-400">
                  <span>Price (USDC)</span>
                  <span className="text-right">Amount (BTC)</span>
                  <span className="text-right">Time</span>
                </div>

                {trades.length === 0 ? (
                  <div className="py-7 text-center">
                    <BarChart3 size={23} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-500">No executed trades yet</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Completed order matches appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {trades.slice(0, 10).map((trade) => (
                      <div key={trade.id} className="grid grid-cols-3 gap-2 py-2 text-[11px] tabular-nums">
                        <span className="font-semibold text-slate-700">{fmt(trade.price)}</span>
                        <span className="text-right text-slate-600">{qty(trade.amount)}</span>
                        <span className="text-right text-slate-400">{shortTime(trade.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
        <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-400">
          <span>COUBA PRO · SPOT MARKET</span>
          <span>Market data and order execution are separate services.</span>
        </footer>
      </div>
    </main>
  );
}
