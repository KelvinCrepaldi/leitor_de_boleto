import { describe, expect, it } from "@jest/globals";
import { calculateDvModulo11Arrecadacao } from "../utils/boleto/dvCalculations";

describe("calculateDvModulo11Arrecadacao", () => {
  it("returns 0 when remainder is 0 or 1", () => {
    expect(calculateDvModulo11Arrecadacao(11)).toBe(0);
    expect(calculateDvModulo11Arrecadacao(12)).toBe(0);
  });

  it("returns 1 when remainder is 10", () => {
    expect(calculateDvModulo11Arrecadacao(21)).toBe(1);
  });

  it("returns 11 minus remainder for other cases", () => {
    expect(calculateDvModulo11Arrecadacao(14)).toBe(8);
    expect(calculateDvModulo11Arrecadacao(16)).toBe(6);
    expect(calculateDvModulo11Arrecadacao(25)).toBe(8);
  });
});
