import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider, useSession } from "../../context/AuthContext";
import { Orders } from "./Orders";
import { getOrders } from "../../services/getOrders";
import db from "../../../datasets/db.json";
import { getSummaryOrders } from "../../utils/sumamry.ts";

vi.mock("../../context/AuthContext", async () => {
  const actual = await vi.importActual("../../context/AuthContext");

  return {
    ...actual,
    useSession: vi.fn(),
  };
});

vi.mock("../../services/getOrders", () => ({
  getOrders: vi.fn(),
}));

const mockGetOrders = getOrders as Mock;

type User = {
  id: string;
  role: string;
};

const setup = (userRole: User) => {
  const mockUser = userRole ? { role: userRole.role } : null;
  (useSession as Mock).mockReturnValue({ user: mockUser });
  const utils = render(
    <SessionProvider>
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    </SessionProvider>,
  );

  return {
    ...utils,
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("<Orders/>", () => {
  it("Deberia mostrar las ordenes", async () => {
    mockGetOrders.mockResolvedValue(db.orders);

    setup({ role: "visualizer", id: "1" });

    await waitFor(() => {
      const orders = screen.getAllByRole("heading", { level: 3 });
      expect(orders).toHaveLength(db.orders.length);
    });
  });

  it("Deberia mostrar seccion para superadmins", async () => {
    mockGetOrders.mockResolvedValue(db.orders);

    setup({ role: "superadmin", id: "1" });

    await waitFor(async () => {
      const { totalOrders, totalValue, averageOrderValue } = getSummaryOrders(
        db.orders,
      );
      // Verifica el calculo total de ordenes
      expect(totalOrders).toEqual(db.orders.length);

      // Verifica el calculo del valor total de la orden
      const totalExpected = db.orders.reduce(
        (sum, order) => sum + order.total,
        0,
      );
      expect(totalValue).toEqual(totalExpected);

      // Verificar el cálculo del valor promedio de la orden
      const averageExpected = totalValue / totalOrders;
      expect(averageOrderValue).toBeCloseTo(averageExpected, 2);

      // Verificar que los datos se muestran correctamente en la interfaz de usuario
      const totalOrdersElement = screen.getByTestId("totalorders").textContent;
      expect(totalOrdersElement).toBe(totalOrders.toString());

      // Verificar que los detalles de cada orden se muestran correctamente
      const orderId = screen.getAllByTestId("orderid");

      orderId.forEach((order, index) => {
        expect(order.textContent?.trim()).toBe(
          `Order #${db.orders[index].id.slice(0, 8)}`,
        );

        const orderDetail = screen.getByText(db.orders[index].customer.name);
        expect(orderDetail).toBeInTheDocument();
      });
    });
  });
});
