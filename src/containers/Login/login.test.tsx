import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider } from "../../context/AuthContext";
import { Login } from "./Login";
import { getAuth } from "../../services/getAuth";

const mockGetAuth = getAuth as Mock;
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../services/getAuth", () => ({
  getAuth: vi.fn(),
}));

const setup = () => {
  const utils = render(
    <SessionProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </SessionProvider>,
  );
  const userNameInput = screen.getByPlaceholderText("Username");
  const passwordInput = screen.getByPlaceholderText("Password");
  const buttonLogin = screen.getByRole("button", { name: "Login" });

  return {
    ...utils,
    userNameInput,
    passwordInput,
    buttonLogin,
  };
};

const handleLogin = async (username: string, password: string) => {
  const { userNameInput, passwordInput, buttonLogin } = setup();

  await act(async () => {
    fireEvent.change(userNameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(buttonLogin);
  });
};

describe("<Login/>", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deberia mostrar la password oculta", async () => {
    const { passwordInput } = setup();
    const hiddenButton = screen.getByRole("button", { name: /show/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(hiddenButton);
    expect(hiddenButton).toHaveTextContent("hide");
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(hiddenButton);
    expect(hiddenButton).toHaveTextContent("show");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("Deberia mostrar un mensaje de error", async () => {
    const invalidData = "Invalid username or password";

    mockGetAuth.mockRejectedValue(new Error(invalidData));

    await handleLogin("wrongUser", "whronPassword");

    const errorMessage = screen.getByText(invalidData);
    expect(errorMessage).toBeInTheDocument();
  });

  it("Deberia redirigir a /orders", async () => {
    const mockLogin = {
      username: "visualizer1@example.com",
      password: "vis1pass456@",
    };

    mockGetAuth.mockResolvedValue({ success: true });
    await handleLogin(mockLogin.username, mockLogin.password);

    await waitFor(() => {
      expect(mockGetAuth).toHaveBeenCalledWith(
        mockLogin.username,
        mockLogin.password,
      );
      expect(mockNavigate).toHaveBeenCalledWith("/orders");
    });
  });
});
