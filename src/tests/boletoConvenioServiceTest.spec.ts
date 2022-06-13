import IBoleto from "../interfaces/boletoInterface";
import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../app";

import { GetBoletoConvenioService } from "../services";
import { calculateDvBarCode } from "../services/boleto/getBoletoConvenioService";

describe("Boleto route test", () => {
  it("Generate BarCode using boleto code.", () => {
    const expectedObject: IBoleto = {
      barCode: "8174000000001093675970411310797030014337083",
      amount: "0.10",
    };

    const result = new GetBoletoConvenioService().execute(
      "817700000000010936759702411310797039001433708318"
    );
    expect(result).toStrictEqual(expectedObject);
  });

  it("Generate error , position 3 of code invalid.", async () => {
    const response = await request(app).get(
      `/boleto/812300000000010936759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message:
        "Actual value identification or reference is invalid (third code number)",
    });
  });

  it("Generate BarCode using boleto Titulo code.", () => {
    const result = calculateDvBarCode(
      "8180000000000109367597024113107970390014337"
    );
    expect(result).toBe("8180000000000109367597024113107970390014337");
  });
});
