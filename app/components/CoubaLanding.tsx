"use client";

import Link from "next/link";

type Market = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
};

type Props = {
  featuredMarkets: Market[];
  money: (value: number) => string;
};

export default function CoubaLanding({
  featuredMarkets,
  money,
}: Props) {
  const coins = featuredMarkets.slice(0, 4);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#153754]">
      <header className="relative z-20 border-b border-blue-100/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center">
            <img
              src="/couba-logo.svg"
              alt="Couba"
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#markets" className="transition hover:text-blue-600">
              Markets
            </a>
            <a href="#features" className="transition hover:text-blue-600">
              Features
            </a>
            <a href="#about" className="transition hover:text-blue-600">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-50 sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-[#1769e0]/15 bg-white/70 px-5 py-2.5 text-sm font-bold text-[#1769e0] shadow-sm shadow-blue-900/5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1769e0]/30 hover:bg-blue-50/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section className="relative isolate">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-[550px] w-[550px] rounded-full bg-blue-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2 lg:px-8">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Explore the world of digital assets
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Your gateway to the{" "}
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                crypto market.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
              Discover digital assets, explore market prices, and experience
              a clearer way to navigate crypto trading.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#1769e0]/20 bg-white/70 px-8 py-4 text-sm font-bold text-[#1769e0] shadow-md shadow-blue-900/5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1769e0]/35 hover:bg-blue-50/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Get started <span className="ml-2">↗</span>
              </Link>
              <a
                href="#markets"
                className="rounded-2xl border border-blue-100 bg-white/80 px-7 py-4 text-sm font-bold text-[#153754] shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
              >
                Explore markets
              </a>
            </div>

            <div className="mt-9 flex items-center gap-3 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {coins.slice(0, 3).map((coin) => (
                  <img
                    key={coin.id}
                    src={coin.image}
                    alt={coin.name}
                    className="h-8 w-8 rounded-full border-2 border-white bg-white"
                  />
                ))}
              </div>
              <span>Explore digital assets in one place</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl py-5 sm:py-10">
            <div className="absolute left-[12%] top-[5%] h-24 w-24 rounded-full bg-cyan-200/60 blur-2xl" />
            <div className="absolute bottom-[8%] right-[5%] h-40 w-40 rounded-full bg-blue-300/40 blur-3xl" />

            <div className="absolute left-[4%] top-[12%] z-10 animate-[bounce_5s_infinite]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(234,120,30,0.2)] ring-4 ring-orange-100/50 backdrop-blur-xl sm:h-24 sm:w-24 sm:p-4">
                <img src="/crypto/bitcoin.png" alt="Bitcoin (BTC)" className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="absolute right-[4%] top-[5%] z-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white/90 p-2.5 shadow-[0_15px_35px_rgba(79,70,229,0.16)] ring-4 ring-blue-100/60 backdrop-blur-xl sm:h-20 sm:w-20 sm:p-3">
                <img src="/crypto/ethereum.png" alt="Ethereum (ETH)" className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="absolute bottom-[13%] left-[8%] z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white bg-white/90 p-2 shadow-xl ring-4 ring-cyan-100/70 backdrop-blur-xl sm:h-16 sm:w-16 sm:p-2.5">
                <img src="/crypto/solana.png" alt="Solana (SOL)" className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="absolute bottom-[10%] right-[4%] z-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white/90 p-2.5 shadow-xl ring-4 ring-emerald-100/60 backdrop-blur-xl sm:h-20 sm:w-20 sm:p-3">
                <img src="/crypto/usdt.png" alt="Tether (USDT)" className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="relative mx-auto w-[88%] rotate-[-2deg] rounded-[30px] border border-white/90 bg-white/75 p-4 shadow-[0_35px_100px_rgba(45,105,190,0.2)] backdrop-blur-2xl sm:p-6">
              <div className="flex items-center justify-between border-b border-blue-50 pb-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Market overview
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#153754]">
                    Crypto markets
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  Live reference data
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {coins.slice(0, 4).map((coin, index) => (
                  <div
                    key={coin.id}
                    className="rounded-2xl border border-blue-50 bg-gradient-to-br from-white to-blue-50/80 p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#153754]">
                          {coin.symbol.toUpperCase()}
                        </p>
                        <p className="truncate text-[11px] text-slate-500">
                          {coin.name}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 truncate text-sm font-bold text-[#153754]">
                      {money(coin.current_price)}
                    </p>
                    <p
                      className={`mt-1 text-xs font-semibold ${
                        (coin.price_change_percentage_24h ?? 0) >= 0
                          ? "text-emerald-600"
                          : "text-rose-500"
                      }`}
                    >
                      {(coin.price_change_percentage_24h ?? 0) >= 0
                        ? "+"
                        : ""}
                      {(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                      <span className="ml-1 font-normal text-slate-400">
                        24h
                      </span>
                    </p>
                    <div className="mt-3 flex h-7 items-end gap-1">
                      {[35, 55, 40, 75, 48, 88, 60, 95, 68, 80].map(
                        (height, i) => (
                          <span
                            key={i}
                            className={`w-full rounded-t-sm ${
                              index % 2 === 0
                                ? "bg-blue-300"
                                : "bg-cyan-300"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-blue-100/80 bg-white/90 p-4">
                <div>
                  <p className="text-xs text-slate-500">
                    Discover your next market
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#153754]">
                    Explore digital assets
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
                  ↗
                </span>
              </div>
            </div>

            <div className="absolute -right-1 top-[37%] z-20 hidden w-36 rotate-[7deg] rounded-[25px] border-[5px] border-white bg-gradient-to-b from-slate-50 to-blue-50 p-3 shadow-[0_25px_60px_rgba(21,55,84,0.22)] sm:block md:-right-3 md:w-40">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#153754]">
                    Couba
                  </span>
                  <span className="text-[10px] text-blue-600">•••</span>
                </div>
                <p className="mt-4 text-[10px] text-slate-500">
                  Market preview
                </p>
                <p className="mt-1 text-lg font-bold text-[#153754]">
                  {coins[0]
                    ? money(coins[0].current_price)
                    : "—"}
                </p>
                <div className="my-3 flex h-12 items-end gap-1">
                  {[30, 48, 35, 65, 48, 80, 58, 95, 72, 100].map(
                    (height, i) => (
                      <span
                        key={i}
                        className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-cyan-300"
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>
                <div className="rounded-lg bg-blue-600 py-2 text-center text-[10px] font-bold text-white">
                  Explore
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-1">
                <span className="h-1 w-1 rounded-full bg-blue-300" />
                <span className="h-1 w-1 rounded-full bg-blue-500" />
                <span className="h-1 w-1 rounded-full bg-blue-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="markets" className="relative border-y border-blue-50 bg-gradient-to-b from-blue-50/70 to-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Market discovery
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Explore the crypto market
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Discover popular digital assets and compare publicly
                available reference prices.
              </p>
            </div>
            <span className="rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 shadow-sm">
              Public reference prices
            </span>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-blue-100/80 bg-white shadow-[0_20px_70px_rgba(37,99,235,0.07)]">
            <div className="grid grid-cols-12 border-b border-blue-50 bg-blue-50/50 px-5 py-4 text-xs font-semibold text-slate-500 sm:px-7">
              <span className="col-span-6 sm:col-span-5">Asset</span>
              <span className="col-span-4 text-right sm:col-span-4">Price</span>
              <span className="col-span-2 text-right sm:col-span-3">24h</span>
            </div>

            {featuredMarkets.slice(0, 8).map((coin) => (
              <div
                key={coin.id}
                className="grid grid-cols-12 items-center border-b border-slate-100 px-5 py-4 transition last:border-0 hover:bg-blue-50/40 sm:px-7"
              >
                <div className="col-span-6 flex min-w-0 items-center gap-3 sm:col-span-5">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-9 w-9 shrink-0 rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#153754]">
                      {coin.name}
                    </p>
                    <p className="mt-0.5 text-xs uppercase text-slate-400">
                      {coin.symbol}
                    </p>
                  </div>
                </div>
                <p className="col-span-4 truncate text-right text-sm font-semibold text-[#153754] sm:col-span-4">
                  {money(coin.current_price)}
                </p>
                <div className="col-span-2 text-right sm:col-span-3">
                  <span
                    className={`inline-block rounded-lg px-2 py-1 text-xs font-semibold ${
                      (coin.price_change_percentage_24h ?? 0) >= 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-500"
                    }`}
                  >
                    {(coin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}
                    {(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}

            {featuredMarkets.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                Market data is temporarily unavailable. Please try again later.
              </div>
            )}
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-400">
            Prices are public market references, not trading quotes.
            Actual order execution and exchange liquidity are not yet enabled.
          </p>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              A clearer crypto experience
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Crypto, with more clarity.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              A clear starting point for exploring digital assets and
              navigating your crypto journey.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <article className="group rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-sky-50 p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-100 text-blue-700 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                  <ellipse cx="12" cy="6" rx="7.5" ry="3" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M4.5 6v5c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6M4.5 11v5c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-5" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M4.5 16v2c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-2" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold">Discover digital assets</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Explore cryptocurrencies and compare publicly available
                market information in one place.
              </p>
            </article>

            <article className="group rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-cyan-50 p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-100 text-cyan-700 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                  <path d="M3.5 19.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M5.5 16v-4M10 16V8M14.5 16v-6M19 16V4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                  <path d="m15.5 4.5 3.5 0 0 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold">Understand the market</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Review asset prices and 24-hour changes with a clean,
                readable market overview.
              </p>
            </article>

            <article className="group rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-indigo-50/60 p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-blue-100 text-[#2459a9] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                  <path d="M12 3.5 19 6v5.2c0 4.3-2.8 7.5-7 9.3-4.2-1.8-7-5-7-9.3V6l7-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold">Built around your journey</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Navigate a lightweight interface designed for desktop
                and mobile screens.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="px-5 pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#153754] via-[#1769e0] to-[#4aa9f5] px-7 py-12 text-white shadow-2xl shadow-blue-900/25 ring-1 ring-blue-200/50 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 right-[25%] h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
              Welcome to the crypto market
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              Your crypto journey starts with clarity.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-blue-50 sm:text-base">
              Explore digital assets and discover the market
              for the future of digital asset trading.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/15 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#153754]/20 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Create your account <span className="ml-2">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-slate-50/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <Link href="/" className="inline-flex">
              <img
                src="/couba-logo.svg"
                alt="Couba"
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
              A clearer way to explore the world of digital assets.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#153754]">Explore</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <a className="block hover:text-blue-600" href="#markets">
                Markets
              </a>
              <a className="block hover:text-blue-600" href="#features">
                Features
              </a>
              <a className="block hover:text-blue-600" href="#about">
                About
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#153754]">Account</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <Link className="block hover:text-blue-600" href="/login">
                Sign in
              </Link>
              <Link className="block hover:text-blue-600" href="/signup">
                Sign up
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#153754]">Important</h3>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Public market prices are informational references.
              trading, order execution, and liquidity must be implemented
              before real trading can be offered.
            </p>
          </div>
        </div>

        <div className="border-t border-blue-100 px-5 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </footer>
    </main>
  );
}
