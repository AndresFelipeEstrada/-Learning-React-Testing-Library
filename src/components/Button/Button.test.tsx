import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Button } from "./Button";

describe("<Button/>", () => {
  let button: HTMLButtonElement;
  let handleClick: Mock;

  beforeEach(() => {
    handleClick = vi.fn();
    render(<Button label="click" onClick={handleClick} />);
    button = screen.getByText("click");
  });
  it("Deberia renderizar el boton", () => {
    expect(button).toBeInTheDocument();
  });

  it("Deberia llamar a la funcion onClick", async () => {
    act(() => {
      fireEvent.click(button);
    });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
