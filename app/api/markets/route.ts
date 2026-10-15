import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const allowedSorts = [
    "market_cap_desc",
    "market_cap_asc",
    "volume_desc",
    "volume_asc",
  ];

  const requestedSort = incoming.searchParams.get("order") || "market_cap_desc";
  const order = allowedSorts.includes(requestedSort)
    ? requestedSort
    : "market_cap_desc";

  const params = new URLSearchParams({
    vs_currency: "usd",
    order,
    per_page: "100",
    page: "1",
    sparkline: "false",
    price_change_percentage: "24h",
  });

  const category = incoming.searchParams.get("category");
  if (category) params.set("category", category);

  try {
    if (incoming.searchParams.get("resource") === "categories") {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/categories/list", { cache: "no-store" });
      if (!response.ok) return NextResponse.json({ error: "Category data unavailable." }, { status: 502 });
      const data = await response.json();
      if (!Array.isArray(data)) return NextResponse.json({ error: "Invalid category data." }, { status: 502 });
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`,
      {
        cache: "no-store",
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 429
              ? "CoinGecko rate limit reached. Wait briefly and retry."
              : `CoinGecko returned status ${response.status}.`,
        },
        {
          status: response.status === 429 ? 429 : 502,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid market data received." },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Couba market API error:", error);

    return NextResponse.json(
      { error: "Unable to reach CoinGecko. Please retry shortly." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
