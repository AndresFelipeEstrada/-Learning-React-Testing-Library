import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Contador } from "./Contador.tsx";

describe("<Contador/ >", () => {
  it("Deberia mostrear el valor inicial", () => {
    render(<Contador />);
    const contador = screen.getByText("Contador: 0");

    expect(contador).toBeInTheDocument();
  });

  it("Deberia incrementar el contador", () => {
    render(<Contador />);
    const boton = screen.getByText("Incrementar");
    act(() => {
      fireEvent.click(boton);
    });

    const contador = screen.getByText("Contador: 1");

    expect(contador).toBeInTheDocument();
  });
});
