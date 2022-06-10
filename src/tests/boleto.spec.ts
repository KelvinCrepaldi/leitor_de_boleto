import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../app";

describe("Boleto route test", () => {
  it("True code", async () => {
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

  it("The code is not a number", async () => {
    const response = await request(app).get(
      `/boleto/212900a1192110001210904475617405975870000002000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "The code is not a number",
    });
  });

  it("Code have less than 47 numbers", async () => {
    const response = await request(app).get(
      `/boleto/212900119211000104475617405975870000002000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Invalid code, the code must have 47 numbers",
    });
  });

  it("Code have more than 47 numbers", async () => {
    const response = await request(app).get(
      `/boleto/2129001192110001044753333333333617405975870000002000`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Invalid code, the code must have 47 numbers",
    });
  });
});
