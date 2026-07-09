import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../app";

const TITULO_CODE = "21290001192110001210904475617405975870000002000";
const TITULO_WITH_EXPIRATION_CODE =
  "26090468898617118593663800000000590150000020759";
const CONVENIO_MOD10_CODE =
  "817700000000010936759702411310797039001433708318";
const CONVENIO_MOD11_CODE =
  "848000000006010936759701241131079700390014337082";

describe("Boleto route integration", () => {
  it("returns titulo data for a valid 47-digit code", async () => {
    const response = await request(app).get(`/boleto/${TITULO_CODE}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      barCode: "21299758700000020000001121100012100447561740",
      amount: "20.00",
      expirationDate: "2018-07-16",
    });
  });

  it("returns titulo data for another valid 47-digit code", async () => {
    const response = await request(app).get(
      `/boleto/${TITULO_WITH_EXPIRATION_CODE}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      barCode: "26095901500000207590468886171185936380000000",
      amount: "207.59",
      expirationDate: "2022-06-13",
    });
  });

  it("returns convenio data for a valid modulo 10 code", async () => {
    const response = await request(app).get(
      `/boleto/${CONVENIO_MOD10_CODE}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      barCode: "8174000000001093675970411310797030014337083",
      amount: "0.10",
    });
  });

  it("returns convenio data for a valid modulo 11 code", async () => {
    const response = await request(app).get(
      `/boleto/${CONVENIO_MOD11_CODE}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      barCode: "8480000000001093675970241131079703900143370",
      amount: "0.10",
    });
  });

  it("rejects code smaller than allowed", async () => {
    const response = await request(app).get(
      `/boleto/2609046889861711859366380000000590150000020759`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Invalid code size",
    });
  });

  it("rejects code larger than allowed", async () => {
    const response = await request(app).get(
      `/boleto/2609046889861711859366380000000590150000020759000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Invalid code size",
    });
  });

  it("rejects code with invalid characters", async () => {
    const response = await request(app).get(
      `/boleto/2609046889861711859x66380000000590150000020759000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "The code is not a number.",
    });
  });

  it("rejects convenio with invalid reference digit", async () => {
    const response = await request(app).get(
      `/boleto/812300000000010936759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message:
        "Actual value identification or reference is invalid (third code number)",
    });
  });

  it("rejects convenio with invalid field DV in block 1", async () => {
    const response = await request(app).get(
      `/boleto/817700000000010236759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });

  it("rejects convenio with invalid field DV in block 2", async () => {
    const response = await request(app).get(
      `/boleto/817700000000010136759702411310797039001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });

  it("rejects convenio with invalid field DV in block 3", async () => {
    const response = await request(app).get(
      `/boleto/817700000000010136759702411310797031001433708318`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Verification code is invalid.",
    });
  });
});
