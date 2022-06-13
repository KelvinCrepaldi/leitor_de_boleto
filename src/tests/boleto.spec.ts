import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../app";

describe("Boleto route test", () => {
  it("True code test", async () => {
    const response = await request(app).get(
      `/boleto/21290001192110001210904475617405975870000002000`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      barCode: "21299758700000020000001121100012100447561740",
      amount: "20.00",
      expirationDate: "2018-07-16",
    });
  });

  it("Is convenio type", async () => {
    const response = await request(app).get(
      `/boleto/26090468898617118593663800000000590150000020759`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      barCode: "26095901500000207590468886171185936380000000",
      amount: "207.59",
      expirationDate: "2022-06-13",
    });
  });

  it("Code size smaller than allowed", async () => {
    const response = await request(app).get(
      `/boleto/2609046889861711859366380000000590150000020759`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Invalid code size",
    });
  });

  it("Code size larger than allowed", async () => {
    const response = await request(app).get(
      `/boleto/2609046889861711859366380000000590150000020759000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Invalid code size",
    });
  });

  it("The code have invalid characters", async () => {
    const response = await request(app).get(
      `/boleto/2609046889861711859x66380000000590150000020759000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "The code is not a number.",
    });
  });

  it("Boleto type convenio", async () => {
    const response = await request(app).get(
      `/boleto/817700000000010936759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      barCode: "8174000000001093675970411310797030014337083",
      amount: "0.10",
    });
  });

  it("Boleto type convenio, invalid code in position[2]", async () => {
    const response = await request(app).get(
      `/boleto/812300000000010936759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message:
        "Actual value identification or reference is invalid (third code number)",
    });
  });

  it("Boleto type convenio, invalid DV code1", async () => {
    const response = await request(app).get(
      `/boleto/817700000000010236759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });

  it("Boleto type convenio, invalid DV code2", async () => {
    const response = await request(app).get(
      `/boleto/817700000000010136759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });

  it("Boleto type convenio, invalid DV code3", async () => {
    const response = await request(app).get(
      `/boleto/817700000000010136759702411310797031001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });
});
