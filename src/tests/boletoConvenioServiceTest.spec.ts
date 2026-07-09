import IBoleto from "../interfaces/boletoInterface";
import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { getBoletoConvenio } from "../services";

const CONVENIO_MOD10_CODE =
  "817700000000010936759702411310797039001433708318";

const CONVENIO_MOD11_CODE =
  "848000000006010936759701241131079700390014337082";

describe("getBoletoConvenio", () => {
  it("generates barcode and amount for modulo 10 convenio", () => {
    const expectedObject: IBoleto = {
      barCode: "8174000000001093675970411310797030014337083",
      amount: "0.10",
      type: "convenio",
    };

    const result = getBoletoConvenio(CONVENIO_MOD10_CODE);
    expect(result).toStrictEqual(expectedObject);
  });

  it("generates barcode and amount for modulo 11 convenio", () => {
    const expectedObject: IBoleto = {
      barCode: "8480000000001093675970241131079703900143370",
      amount: "0.10",
      type: "convenio",
    };

    const result = getBoletoConvenio(CONVENIO_MOD11_CODE);
    expect(result).toStrictEqual(expectedObject);
  });
});

describe("Convenio route validation", () => {
  it("rejects invalid reference digit at position 3", async () => {
    const response = await request(app).get(
      `/boleto/812300000000010936759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message:
        "Actual value identification or reference is invalid (third code number)",
    });
  });

  it("rejects invalid modulo 10 field DV", async () => {
    const response = await request(app).get(
      `/boleto/817700000000010236759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });

  it("rejects invalid modulo 11 field DV", async () => {
    const response = await request(app).get(
      `/boleto/848000000006010936759701241131079700390014337083`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });
});
