import { describe, expect, it } from "@jest/globals";
import {
  calculateDvFromTituloFieldSum,
  calculateDvModulo11Arrecadacao,
  calculateDvModulo11Cobranca,
} from "../../utils/boleto/dv";

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

describe("calculateDvFromTituloFieldSum", () => {
  it("returns complement digit for modulo 10 field sum", () => {
    expect(calculateDvFromTituloFieldSum(45)).toBe(5);
    expect(calculateDvFromTituloFieldSum(50)).toBe(0);
  });
});

describe("calculateDvModulo11Cobranca", () => {
  it("returns 1 when result is 0 or 10 or more", () => {
    expect(calculateDvModulo11Cobranca(11)).toBe(1);
    expect(calculateDvModulo11Cobranca(0)).toBe(1);
  });

  it("returns 11 minus remainder for other cases", () => {
    expect(calculateDvModulo11Cobranca(24)).toBe(9);
    expect(calculateDvModulo11Cobranca(14)).toBe(8);
  });
});
