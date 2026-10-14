"use client";

import { useCallback, useEffect, useState } from "react";

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

function money(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function quantity(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
}

export default function TradePage() {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("100000");
  const [amount, setAmount] = useState("0.01");
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const total = Number(price) * Number(amount);

  const refreshMarket = useCallback(async () => {
    setRefreshing(true);

    try {
      const response = await fetch("/api/orders", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not load market data.");
      }

      setOrders(data.orders || []);
      setTrades((data.trades || []).slice(-20).reverse());
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load market data."
      );
      setMessageType("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshMarket();
  }, [refreshMarket]);

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const numericPrice = Number(price);
    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericPrice) ||
      !Number.isFinite(numericAmount) ||
      numericPrice <= 0 ||
      numericAmount <= 0
    ) {
      setMessage("Enter a valid positive price and amount.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          side,
          price: numericPrice,
          amount: numericAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Order submission failed.");
      }

      const executed = (data.executedTrades || []) as Trade[];
      const submittedOrder = data.order as Order;

      if (executed.length > 0) {
        const executedAmount = executed.reduce(
          (sum, trade) => sum + trade.amount,
          0
        );

        setMessage(
          `Order matched! ${quantity(executedAmount)} BTC traded across ${executed.length} execution(s).`
        );
      } else {
        setMessage(
          `Order ${submittedOrder.id} accepted. It is resting in the demo order book.`
        );
      }

      setMessageType("success");
      await refreshMarket();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Order submission failed."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  const buyOrders = orders
    .filter((order) => order.side === "buy")
    .sort((a, b) => b.price - a.price);

  const sellOrders = orders
    .filter((order) => order.side === "sell")
    .sort((a, b) => a.price - b.price);

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a
            href="/"
            className="text-xl font-black tracking-[0.18em] text-[#102b50]"
          >
            COUBA
          </a>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
            DEMO TRADING
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <a
          href="/"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to overview
        </a>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Spot market
              </p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                BTC <span className="text-slate-400">/</span> USDC
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Bitcoin against USD Coin · Simulated trading only
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 px-4 py-3">
              <p className="text-xs text-slate-500">Illustrative reference</p>
              <p className="mt-1 text-xl font-bold text-[#102b50]">
                $100,000.00
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Not a live market price
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Order book</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Outstanding demo orders
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void refreshMarket()}
                  disabled={refreshing}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 border-b border-slate-100 pb-3 text-xs text-slate-500">
                <span>Price (USDC)</span>
                <span className="text-right">Amount (BTC)</span>
                <span className="text-right">Total (USDC)</span>
              </div>

              <div className="mt-2 space-y-2">
                {sellOrders.length === 0 && buyOrders.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No open orders yet. Place a demo order to get started.
                  </p>
                ) : (
                  <>
                    {sellOrders.slice(0, 8).map((order) => (
                      <div
                        key={order.id}
                        className="grid grid-cols-3 text-sm"
                      >
                        <span className="font-semibold text-rose-600">
                          {money(order.price)}
                        </span>
                        <span className="text-right text-slate-600">
                          {quantity(order.remaining)}
                        </span>
                        <span className="text-right text-slate-600">
                          {money(order.price * order.remaining)}
                        </span>
                      </div>
                    ))}

                    <div className="my-3 border-t border-dashed border-slate-200" />

                    {buyOrders.slice(0, 8).map((order) => (
                      <div
                        key={order.id}
                        className="grid grid-cols-3 text-sm"
                      >
                        <span className="font-semibold text-emerald-600">
                          {money(order.price)}
                        </span>
                        <span className="text-right text-slate-600">
                          {quantity(order.remaining)}
                        </span>
                        <span className="text-right text-slate-600">
                          {money(order.price * order.remaining)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">
                  How matching works
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Compatible buy and sell orders can execute automatically.
                  The demo engine uses price-time priority and supports partial
                  fills. Open orders are stored in server memory only.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Recent demo trades</h2>

              <div className="mt-4 grid grid-cols-3 border-b border-slate-100 pb-3 text-xs text-slate-500">
                <span>Price (USDC)</span>
                <span className="text-right">Amount (BTC)</span>
                <span className="text-right">Total (USDC)</span>
              </div>

              {trades.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No executed trades yet.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {trades.map((trade) => (
                    <div key={trade.id} className="grid grid-cols-3 text-sm">
                      <span className="font-semibold text-slate-800">
                        {money(trade.price)}
                      </span>
                      <span className="text-right text-slate-600">
                        {quantity(trade.amount)}
                      </span>
                      <span className="text-right text-slate-600">
                        {money(trade.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">Place an order</h2>
            <p className="mt-1 text-xs text-slate-500">
              Limit order · Simulated funds
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setSide("buy")}
                className={`rounded-lg py-3 text-sm font-bold transition ${
                  side === "buy"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                Buy BTC
              </button>

              <button
                type="button"
                onClick={() => setSide("sell")}
                className={`rounded-lg py-3 text-sm font-bold transition ${
                  side === "sell"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                Sell BTC
              </button>
            </div>

            <form onSubmit={placeOrder} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold"
                >
                  Limit price (USDC)
                </label>
                <input
                  id="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#547da6] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-semibold"
                >
                  Amount (BTC)
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0.00000001"
                  step="0.00000001"
                  required
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#547da6] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-500">Estimated total</span>
                  <span className="text-right font-bold">
                    {Number.isFinite(total) && total >= 0
                      ? money(total)
                      : "0.00"}{" "}
                    USDC
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Estimate only. Trading fees and balance checks are not
                  implemented.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  side === "buy"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {loading
                  ? "Submitting order..."
                  : side === "buy"
                    ? "Place buy order"
                    : "Place sell order"}
              </button>
            </form>

            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-4 rounded-xl border p-3 text-sm leading-6 ${
                  messageType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                {message}
              </div>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Prototype only. No real cryptocurrency or funds are involved.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
