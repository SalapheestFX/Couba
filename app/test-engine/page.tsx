"use client";

import { useState } from "react";

export default function TestEnginePage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runTest() {
    setLoading(true);
    setResult("");

    try {
      const sellResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          side: "sell",
          price: 100,
          amount: 0.5,
        }),
      });

      const sellData = await sellResponse.json();

      if (!sellResponse.ok) {
        throw new Error(sellData.error || "Sell order failed");
      }

      const buyResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          side: "buy",
          price: 100,
          amount: 0.5,
        }),
      });

      const buyData = await buyResponse.json();

      if (!buyResponse.ok) {
        throw new Error(buyData.error || "Buy order failed");
      }

      setResult(
        JSON.stringify(
          {
            sellOrder: sellData.order,
            buyOrder: buyData.order,
            executedTrades: buyData.executedTrades,
          },
          null,
          2
        )
      );
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Test failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-sm font-semibold tracking-widest text-cyan-400">
          COUBA · DEVELOPMENT
        </p>

        <h1 className="mt-3 text-2xl font-bold">
          Matching Engine Test
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          This test submits a sell order and a matching buy order.
          It uses fictional prices and quantities and does not involve
          real funds.
        </p>

        <button
          onClick={runTest}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Run Matching Test"}
        </button>

        {result && (
          <pre className="mt-5 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-800 p-4 text-xs leading-6">
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}
