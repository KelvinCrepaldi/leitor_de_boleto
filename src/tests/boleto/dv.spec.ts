import { describe, expect, it } from "@jest/globals";
import { calculateDvModulo11Arrecadacao } from "../../utils/boleto/dv";
import { calculateDvTituloBarcode } from "../../utils/boleto/titulo";
import { insertConvenioBarcodeDv } from "../../utils/boleto/convenio";

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

describe("calculateDvTituloBarcode", () => {
  it("generates general barcode DV using modulo 11", () => {
    const result = calculateDvTituloBarcode(
      "21299758700000020000001121100012100447561740"
    );
    expect(result).toBe(9);
  });

  it("returns 1 when modulo 11 DV calculation results in 0 or 10", () => {
    const result = calculateDvTituloBarcode(
      "00000000000000000000000000000000000000000000"
    );
    expect(result).toBe(1);
  });
});

describe("insertConvenioBarcodeDv", () => {
  it("calculates modulo 10 barcode DV", () => {
    const result = insertConvenioBarcodeDv(
      "8170000000001093675970411310797030014337083"
    );
    expect(result).toBe("8174000000001093675970411310797030014337083");
  });

  it("calculates modulo 11 barcode DV", () => {
    const result = insertConvenioBarcodeDv(
      "8180000000000109367597024113107970390014337"
    );
    expect(result).toBe("8184000000000109367597024113107970390014337");
  });
});
