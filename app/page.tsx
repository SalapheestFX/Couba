"use client";

import CoubaHero from "./components/CoubaHero";
import CoubaLanding from "./components/CoubaLanding";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
  market_cap: number;
};

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n);

const compactMoney = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);

const featured = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple"];

export default function Home() {
  const [markets, setMarkets] = useState<Coin[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const loadMarkets = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
        { cache: "no-store" }
      );
      if (!response.ok) throw new Error("Market feed unavailable");
      setMarkets(await response.json());
      setError("");
    } catch {
      setError("Market prices are temporarily unavailable. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarkets();
    const timer = setInterval(loadMarkets, 60000);
    return () => clearInterval(timer);
  }, [loadMarkets]);

  const visibleMarkets = useMemo(() => {
    const term = query.trim().toLowerCase();
    return markets.filter((coin) => {
      const change = coin.price_change_percentage_24h ?? 0;
      const matchesSearch =
        !term ||
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term);
      const matchesFilter =
        filter === "All" ||
        (filter === "Gainers" && change > 0) ||
        (filter === "Losers" && change < 0);
      return matchesSearch && matchesFilter;
    });
  }, [markets, query, filter]);

  const featuredMarkets = featured
    .map((id) => markets.find((coin) => coin.id === id))
    .filter((coin): coin is Coin => Boolean(coin));

  const submitEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      window.location.href = `/signup?email=${encodeURIComponent(email.trim())}`;
    }
  };

  return (
    <CoubaLanding
      featuredMarkets={featuredMarkets}
      money={money}
    />
  );
}
