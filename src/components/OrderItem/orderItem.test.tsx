import { render, screen } from "@testing-library/react";
import { OrderItem } from "./OrderItem";
import { Order } from "../../types/Orders";
import { describe, expect, it, vi } from "vitest";

vi.mock("../StatusBadge/StatusBadge.tsx", () => ({
  StatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
}));

const mockOrder: Order = {
  id: "1234567890abcdef",
  orderDate: "2023-11-01T10:30:00Z",
  status: "Shipped",
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  products: [
    { id: "prod1", name: "Product 1", quantity: 2, price: 19.99 },
    { id: "prod2", name: "Product 2", quantity: 1, price: 49.99 },
  ],
  paymentMethod: "CREDIT_CARD",
  total: 89.97,
};

function setup() {
  const utils = render(<OrderItem order={mockOrder} />);

  return {
    ...utils,
  };
}

describe("<OrderItem/>", () => {
  it("should display the order ID truncated to 8 characters", () => {
    setup();

    expect(screen.getByText("Order #12345678"));
  });

  it("should format and display the order date correctly", () => {
    setup();

    const formattedDate = new Date(mockOrder.orderDate).toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );

    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it("should display the customer's name and email", () => {
    setup();
    expect(screen.getByText(mockOrder.customer.name)).toBeInTheDocument();
  });

  it("should display the correct status in the StatusBadge", () => {
    setup();

    expect(screen.getByText(mockOrder.status)).toBeInTheDocument();
  });

  it("should list all products with correct quantity and price", () => {
    setup();
    mockOrder.products.forEach((product) => {
      expect(
        screen.getByText(`${product.name} x${product.quantity}`),
      ).toBeInTheDocument();

      expect(
        screen.getByText(`$${(product.price * product.quantity).toFixed(2)}`),
      ).toBeInTheDocument();
    });
  });

  it("should display the payment method correctly formatted", () => {
    setup();

    expect(screen.getByText("CREDIT CARD")).toBeInTheDocument();
  });

  it("should display the total amount with two decimal points", () => {
    setup();

    expect(
      screen.getByText(`$${mockOrder.total.toFixed(2)}`),
    ).toBeInTheDocument();
  });
});
