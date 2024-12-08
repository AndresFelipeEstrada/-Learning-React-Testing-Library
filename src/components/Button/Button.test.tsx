import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Button } from "./Button";

describe("<Button/>", () => {
  it("Deberia renderizar el boton", () => {
    render(<Button label="click" />);

    const button = screen.getByText("click");

    expect(button).toBeInTheDocument();
  });

  it("Deberia llamar a la funcion onClick", async () => {
    const handleClick = vi.fn();
    render(<Button label="click" onClick={handleClick} />);
    const button = screen.getByText("click");

    act(() => {
      fireEvent.click(button);
    });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
