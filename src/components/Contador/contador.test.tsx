import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Contador } from "./Contador.tsx";

describe("<Contador/ >", () => {
  beforeEach(() => {
    render(<Contador />);
  });

  const getElementByText = (text: string) => screen.getByText(text);

  it("Deberia mostrear el valor inicial", () => {
    const contador = getElementByText("Contador: 0");
    expect(contador).toBeInTheDocument();
  });

  it("Deberia incrementar el contador", () => {
    const button = getElementByText("Incrementar");

    fireEvent.click(button);

    const contador = getElementByText("Contador: 1");

    expect(contador).toBeInTheDocument();
  });
});
