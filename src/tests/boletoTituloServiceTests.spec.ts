import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import IBoleto from "../interfaces/boletoInterface";
import app from "../app";

import {
  calculateExpirationDate,
  generateBarCode,
  generateDV,
} from "../services/boleto/getBoletoTituloService";
import { GetBoletoTituloService } from "../services";

const TITULO_CODE = "21290001192110001210904475617405975870000002000";

describe("GetBoletoTituloService", () => {
  it("calculates expiration date from factor code", () => {
    const result = calculateExpirationDate("1000");
    expect(result).toBe("2000-07-03");
  });

  it("generates barcode from titulo digitable line", () => {
    const result = generateBarCode(TITULO_CODE);
    expect(result).toBe(
      "21299758700000020000001121100012100447561740"
    );
  });

  it("generates general barcode DV using modulo 11", () => {
    const result = generateDV(
      "21299758700000020000001121100012100447561740"
    );
    expect(result).toBe(9);
  });

  it("returns 1 when modulo 11 DV calculation results in 0 or 10", () => {
    const result = generateDV(
      "00000000000000000000000000000000000000000000"
    );
    expect(result).toBe(1);
  });

  it("builds titulo response with barcode, amount and expiration date", () => {
    const expectedObject: IBoleto = {
      barCode: "21299758700000020000001121100012100447561740",
      amount: "20.00",
      expirationDate: "2018-07-16",
      type: "titulo",
    };

    const result = new GetBoletoTituloService().execute(TITULO_CODE);
    expect(result).toStrictEqual(expectedObject);
  });

  it("uses extended value when expiration factor starts with 0", () => {
    const expectedObject: IBoleto = {
      barCode: "21291058700000020000001121100012100447561740",
      amount: "58700000020.00",
      type: "titulo",
    };

    const result = new GetBoletoTituloService().execute(
      "21290001192110001210904475617405905870000002000"
    );
    expect(result).toStrictEqual(expectedObject);
  });
});

describe("Titulo route validation", () => {
  it("rejects invalid field DV", async () => {
    const response = await request(app).get(
      `/boleto/21290001102110001210904475617405975870000002000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });

  it("rejects invalid general barcode DV", async () => {
    const response = await request(app).get(
      `/boleto/21290001192110001210904475617405075870000002000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });
});
