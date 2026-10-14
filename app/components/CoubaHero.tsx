"use client";

import { useState } from "react";

type Market = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
};

type Props = {
  featuredMarkets: Market[];
  money: (value: number) => string;
};

export default function CoubaHero({ featuredMarkets, money }: Props) {
  const [email, setEmail] = useState("");

  function continueWithEmail() {
    if (!email.trim() || !email.includes("@")) return;
    window.location.href = `/signup?email=${encodeURIComponent(email.trim())}`;
  }

  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-10 lg:pt-20">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-2 text-xs font-semibold text-[#24577d] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            A clearer way to explore crypto
          </div>

          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-[#102d4a] sm:text-5xl lg:text-7xl">
            Your crypto world.
            <span className="mt-2 block text-[#3185cf]">
              Made clearer.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Explore digital assets, follow market movements and discover
            opportunities with a cleaner, more focused crypto experience.
          </p>

          <div className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
            <input
              aria-label="Email address"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") continueWithEmail();
              }}
              placeholder="Enter your email address"
              className="couba-input min-w-0 flex-1 rounded-2xl px-4 py-4"
            />
            <button
              type="button"
              onClick={continueWithEmail}
              className="couba-button rounded-2xl px-6 py-4 font-bold"
            >
              Get started →
            </button>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Public market data for discovery. Trading availability is not yet enabled.
          </p>

          <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <span className="text-sky-600">✓</span> Clean market insights
            </span>
            <span className="flex items-center gap-2">
              <span className="text-sky-600">✓</span> Mobile-friendly design
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full bg-sky-200/60 blur-2xl" />
          <div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full bg-blue-200/60 blur-2xl" />

          <div className="glass-strong relative overflow-hidden rounded-[28px] border border-white/80 p-5 shadow-[0_24px_80px_rgba(37,99,160,0.14)] sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  COUBA MARKETS
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#153754]">
                  Market watch
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Public crypto reference prices
                </p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                Live data*
              </span>
            </div>

            <div className="my-6 rounded-2xl bg-gradient-to-br from-[#e9f5ff] via-white to-[#f4faff] p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Featured asset
                  </p>
                  <p className="mt-1 text-xl font-black text-[#153754]">
                    {featuredMarkets[0]?.name || "Bitcoin"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {featuredMarkets[0]?.symbol?.toUpperCase() || "BTC"}
                  </p>
                </div>
                {featuredMarkets[0]?.image ? (
                  <img
                    src={featuredMarkets[0].image}
                    alt=""
                    className="h-14 w-14 rounded-full"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    ₿
                  </div>
                )}
              </div>

              <p className="mt-4 text-3xl font-black tracking-tight text-[#153754] sm:text-4xl">
                {featuredMarkets[0]
                  ? money(featuredMarkets[0].current_price)
                  : "Loading…"}
              </p>

              {featuredMarkets[0] && (
                <p
                  className={`mt-2 text-sm font-bold ${
                    featuredMarkets[0].price_change_percentage_24h >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {featuredMarkets[0].price_change_percentage_24h >= 0
                    ? "+"
                    : ""}
                  {featuredMarkets[0].price_change_percentage_24h.toFixed(2)}%
                  <span className="ml-2 font-medium text-slate-500">
                    past 24 hours
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              {featuredMarkets.slice(1, 5).map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition hover:bg-sky-50/80"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={coin.image}
                      alt=""
                      className="h-9 w-9 rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#183654]">
                        {coin.name}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {coin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#183654]">
                      {money(coin.current_price)}
                    </p>
                    <p
                      className={`mt-1 text-xs font-semibold ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-4">
              <span className="text-xs text-slate-500">
                *Prices supplied by a public market-data provider.
              </span>
              <a
                href="/trade"
                className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Explore markets →
              </a>
            </div>
          </div>

          <div className="relative mx-auto mt-5 flex max-w-[390px] items-center gap-3 rounded-2xl border border-white/90 bg-white/75 p-4 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:-ml-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xl">
              ◈
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#183654]">
                Your market overview
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Follow assets and explore price movements in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
