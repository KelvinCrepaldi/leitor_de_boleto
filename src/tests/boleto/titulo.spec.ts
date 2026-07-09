import { describe, expect, it } from "@jest/globals";
import {
  calculateExpirationDate,
  generateTituloBarcode,
} from "../../utils/boleto/titulo";

const TITULO_CODE = "21290001192110001210904475617405975870000002000";

describe("calculateExpirationDate", () => {
  it("calculates expiration date from factor code", () => {
    const result = calculateExpirationDate("1000");
    expect(result).toBe("2000-07-03");
  });
});

describe("generateTituloBarcode", () => {
  it("generates barcode from titulo digitable line", () => {
    const result = generateTituloBarcode(TITULO_CODE);
    expect(result).toBe(
      "21299758700000020000001121100012100447561740"
    );
  });
});
