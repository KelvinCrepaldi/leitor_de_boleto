import { describe, expect, it } from "@jest/globals";
import IBoleto from "../interfaces/boletoInterface";
import request from "supertest";
import app from "../app";
import { GetBoletoTituloService } from "../services";

const TITULO_CODE = "21290001192110001210904475617405975870000002000";

describe("GetBoletoTituloService", () => {
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
