import { describe, it, expect } from "vitest";

describe("My first test", () => {
  it("prueba", () => {
    const suma = (a: number, b: number) => a + b;
    const result = suma(5, 5);

    expect(result).toEqual(10);
  });

  it("dos texto deben ser iguales", () => {
    const text1 = "Platzi";
    const text2 = "Platzi";

    expect(text1).toBe(text2);
  });
});
