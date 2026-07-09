import { describe, expect, it } from "@jest/globals";
import { generateConvenioBarcode } from "../../utils/boleto/convenio";

const CONVENIO_MOD10_CODE =
  "817700000000010936759702411310797039001433708318";

const CONVENIO_MOD11_CODE =
  "848000000006010936759701241131079700390014337082";

describe("generateConvenioBarcode", () => {
  it("generates barcode for modulo 10 convenio", () => {
    const result = generateConvenioBarcode(CONVENIO_MOD10_CODE);
    expect(result).toBe("8174000000001093675970411310797030014337083");
  });

  it("generates barcode for modulo 11 convenio", () => {
    const result = generateConvenioBarcode(CONVENIO_MOD11_CODE);
    expect(result).toBe("8480000000001093675970241131079703900143370");
  });
});
