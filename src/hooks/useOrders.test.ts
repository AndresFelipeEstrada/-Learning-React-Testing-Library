import { describe, it, expect, vi, Mock } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import { useOrders } from "./useOrders";
import { getOrders } from "../services/getOrders";
import { useSession } from "../context/AuthContext";
import db from "../../datasets/db.json";

vi.mock("../services/getOrders.ts", () => ({
  getOrders: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useSession: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

// const mockNavigate = vi.fn();
const mockGetOrders = getOrders as Mock;
const mockUserSession = useSession as Mock;
const mockOrders = db.orders;

describe("useOrders", () => {
  it("Deberia obtener las ordenes", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    mockUserSession.mockReturnValue({ user: { id: 1 } });

    const { result, waitForNextUpdate } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.orders).toEqual(mockOrders);
  });

  it("Deberia mostrar error al obtener los datos", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useOrders());

    expect(result.current.error).toBeNull();

    mockGetOrders.mockRejectedValue(new Error("Error simulado"));

    const { result: resultAfterError } = renderHook(() => useOrders());
    mockUserSession.mockReturnValue({ user: { id: 1 } });

    await waitForNextUpdate();

    expect(resultAfterError.current.error).toBe(
      "Failed to fetch orders. Please try again later.",
    );
  });
});
