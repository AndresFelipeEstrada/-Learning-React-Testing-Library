import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider, useSession } from "../context/AuthContext";
import { useOrders } from "./useOrders";
import db from "../../datasets/db.json";

vi.mock("../context/AuthContext", async () => {
  const actual = await vi.importActual("../context/AuthContext");

  return {
    ...actual,
    useSession: vi.fn(),
  };
});

describe("useOrders MSW", () => {
  const mockUser = { id: 1, name: "andres" };

  beforeEach(() => {
    (useSession as Mock).mockReturnValue({ user: mockUser });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </SessionProvider>
  );

  it("Deberia obtener los datos", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useOrders(), {
      wrapper,
    });

    const initialLoading = result.current.loading;

    expect(initialLoading).toBe(true);

    await waitForNextUpdate();

    const lengthOrders = result.current.orders.length;
    expect(lengthOrders).toBe(db.orders.length);
  });
});
