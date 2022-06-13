import { expect, it } from "@jest/globals";
import IBoleto from "../interfaces/boletoInterface";

import {
  calculateExpirationDate,
  generateBarCode,
  generateDV,
} from "../services/boleto/getBoletoTituloService";
import { GetBoletoTituloService } from "../services";

it("Calculate expiration date from factor code.", () => {
  const result = calculateExpirationDate("1000");
  expect(result).toBe("2000-07-03");
});

it("Generate BarCode using boleto Titulo code.", () => {
  const result = generateBarCode(
    "21290001192110001210904475617405975870000002000"
  );
  expect(result).toBe("21299758700000020000001121100012100447561740");
});

it("Generate CV code for Titulo BarCode.", () => {
  const result = generateDV("21299758700000020000001121100012100447561740");
  expect(result).toBe(9);
});

it("Generate CV code for Titulo BarCode.But if it generate a code equal 0, it returns 1", () => {
  const result = generateDV("00000000000000000000000000000000000000000000");
  expect(result).toBe(1);
});

it("create object with barCode, amount and expirationDate generated correctly", () => {
  const expectedObject: IBoleto = {
    barCode: "21299758700000020000001121100012100447561740",
    amount: "20.00",
    expirationDate: "2018-07-16",
  };

  const result = new GetBoletoTituloService().execute(
    "21290001192110001210904475617405975870000002000"
  );
  expect(result).toStrictEqual(expectedObject);
});

it("if first number of date factor is 0, the code of value is extended", () => {
  const expectedObject: IBoleto = {
    barCode: "21291058700000020000001121100012100447561740",
    amount: "58700000020.00",
  };

  const result = new GetBoletoTituloService().execute(
    "21290001192110001210904475617405905870000002000"
  );
  expect(result).toStrictEqual(expectedObject);
});
