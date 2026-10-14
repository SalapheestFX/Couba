import { NextResponse } from "next/server";
import {
  submitOrder,
  getOrders,
  getTrades,
  type Side,
} from "@/lib/matching-engine";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: getOrders(),
    trades: getTrades(),
    demo: true,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const side = body.side;
    const price = Number(body.price);
    const amount = Number(body.amount);

    if (side !== "buy" && side !== "sell") {
      return NextResponse.json(
        { success: false, error: "Side must be buy or sell." },
        { status: 400 }
      );
    }

    if (
      typeof body.price === "boolean" ||
      typeof body.amount === "boolean" ||
      body.price === "" ||
      body.amount === ""
    ) {
      return NextResponse.json(
        { success: false, error: "Enter a valid price and amount." },
        { status: 400 }
      );
    }

    const result = submitOrder(side as Side, price, amount);

    return NextResponse.json({
      success: true,
      message: "Demo order processed successfully.",
      order: result.order,
      executedTrades: result.trades,
      openOrders: getOrders(),
      recentTrades: getTrades().slice(-20).reverse(),
      demo: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to process order.",
      },
      { status: 400 }
    );
  }
}
