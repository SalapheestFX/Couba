export type Side = "buy" | "sell";

export type Order = {
  id: string;
  side: Side;
  price: number;
  amount: number;
  remaining: number;
  createdAt: number;
  status: "open" | "filled" | "partially_filled";
};

export type Trade = {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  price: number;
  amount: number;
  total: number;
  createdAt: number;
};

const orders: Order[] = [];
const trades: Trade[] = [];

let nextOrderId = 1;
let nextTradeId = 1;

export function getOrders(): Order[] {
  return orders
    .filter((order) => order.remaining > 0)
    .map((order) => ({ ...order }))
    .sort((a, b) => {
      if (a.side !== b.side) {
        return a.side === "buy" ? -1 : 1;
      }

      if (a.price !== b.price) {
        return a.side === "buy"
          ? b.price - a.price
          : a.price - b.price;
      }

      return a.createdAt - b.createdAt;
    });
}

export function getTrades(): Trade[] {
  return trades.map((trade) => ({ ...trade }));
}

export function submitOrder(
  side: Side,
  price: number,
  amount: number
): { order: Order; trades: Trade[] } {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(amount) ||
    price <= 0 ||
    amount <= 0
  ) {
    throw new Error("Price and amount must be positive valid numbers.");
  }

  const order: Order = {
    id: `ORD-${nextOrderId++}`,
    side,
    price,
    amount,
    remaining: amount,
    createdAt: Date.now(),
    status: "open",
  };

  const executedTrades: Trade[] = [];

  while (order.remaining > 0) {
    const candidates = orders
      .filter(
        (candidate) =>
          candidate.remaining > 0 &&
          candidate.side !== order.side &&
          (side === "buy"
            ? candidate.price <= price
            : candidate.price >= price)
      )
      .sort((a, b) => {
        if (a.price !== b.price) {
          return side === "buy"
            ? a.price - b.price
            : b.price - a.price;
        }

        return a.createdAt - b.createdAt;
      });

    const restingOrder = candidates[0];

    if (!restingOrder) {
      break;
    }

    const executedAmount = Math.min(
      order.remaining,
      restingOrder.remaining
    );

    // Execute at the price of the resting order.
    const executionPrice = restingOrder.price;

    const trade: Trade = {
      id: `TRD-${nextTradeId++}`,
      buyOrderId: side === "buy" ? order.id : restingOrder.id,
      sellOrderId: side === "sell" ? order.id : restingOrder.id,
      price: executionPrice,
      amount: executedAmount,
      total: executionPrice * executedAmount,
      createdAt: Date.now(),
    };

    order.remaining -= executedAmount;
    restingOrder.remaining -= executedAmount;

    if (restingOrder.remaining === 0) {
      restingOrder.status = "filled";
    } else {
      restingOrder.status = "partially_filled";
    }

    trades.push(trade);
    executedTrades.push(trade);
  }

  if (order.remaining === 0) {
    order.status = "filled";
  } else if (order.remaining < order.amount) {
    order.status = "partially_filled";
  }

  if (order.remaining > 0) {
    orders.push(order);
  }

  return {
    order: { ...order },
    trades: executedTrades.map((trade) => ({ ...trade })),
  };
}

export function cancelOrder(orderId: string): boolean {
  const index = orders.findIndex(
    (order) => order.id === orderId && order.remaining > 0
  );

  if (index === -1) {
    return false;
  }

  orders.splice(index, 1);
  return true;
}
