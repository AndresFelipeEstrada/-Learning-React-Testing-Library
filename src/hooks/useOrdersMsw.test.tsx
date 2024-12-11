import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
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

  const setup = () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </SessionProvider>
    );
    const { result, waitForNextUpdate } = renderHook(() => useOrders(), {
      wrapper,
    });

    return { result, waitForNextUpdate };
  };

  beforeEach(() => {
    (useSession as Mock).mockReturnValue({ user: mockUser });
  });

  it("Deberia obtener los datos", async () => {
    const { result, waitForNextUpdate } = setup();
    const initialLoading = result.current.loading;

    expect(initialLoading).toBe(true);

    await waitForNextUpdate();

    const lengthOrders = result.current.orders.length;
    expect(lengthOrders).toBe(db.orders.length);
  });

  it("Deberia obtener un 500", async () => {
    server.use(
      http.get("http://localhost:3001/orders", () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      }),
    );

    const { result, waitForNextUpdate } = setup();
    await waitForNextUpdate();

    const error = result.current.error;

    expect(error).toBe("Failed to fetch orders. Please try again later.");
  });
});
