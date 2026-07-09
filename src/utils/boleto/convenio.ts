import { ErrorHandler } from "../error";
import {
  CONVENIO_AMOUNT_END,
  CONVENIO_AMOUNT_START,
  CONVENIO_BARCODE_BODY_END,
  CONVENIO_BARCODE_BODY_START,
  CONVENIO_BARCODE_PREFIX_END,
  CONVENIO_BLOCK_1,
  CONVENIO_BLOCK_2,
  CONVENIO_BLOCK_3,
  CONVENIO_BLOCK_4,
  CONVENIO_DV_POSITIONS,
  CONVENIO_MOEDA_POSITION,
} from "./constants";
import {
  calculateDvModulo10,
  calculateDvModulo11Arrecadacao,
  multiplyFieldModulo10,
  multiplyFieldModulo11,
} from "./dv";
import { ConvenioMoeda, ConvenioMoedaModulo10, ConvenioMoedaModulo11 } from "./types";

// --- Parsing ---

const sliceConvenioDigitableBlocks = (code: string) => ({
  block1: code.slice(CONVENIO_BLOCK_1.start, CONVENIO_BLOCK_1.end),
  block2: code.slice(CONVENIO_BLOCK_2.start, CONVENIO_BLOCK_2.end),
  block3: code.slice(CONVENIO_BLOCK_3.start, CONVENIO_BLOCK_3.end),
  block4: code.slice(CONVENIO_BLOCK_4.start, CONVENIO_BLOCK_4.end),
});

const buildConvenioBarcodeDraft = (code: string): string => {
  const { block1, block2, block3, block4 } = sliceConvenioDigitableBlocks(code);
  return [block1, block2, block3, block4].join("");
};

// --- Moeda helpers ---

const isConvenioMoedaModulo10 = (
  moeda: string
): moeda is ConvenioMoedaModulo10 => {
  return moeda === "6" || moeda === "7";
};

const isConvenioMoedaModulo11 = (
  moeda: string
): moeda is ConvenioMoedaModulo11 => {
  return moeda === "8" || moeda === "9";
};

// --- DV ---

const calculateDvConvenioField = (
  sum: number,
  modulo: 0 | 1
): number => {
  if (modulo === 0) {
    return calculateDvModulo10(sum);
  }
  return calculateDvModulo11Arrecadacao(sum);
};

const calculateConvenioFieldDvs = (
  code: string,
  moeda: ConvenioMoeda
): number[] => {
  const { block1, block2, block3, block4 } = sliceConvenioDigitableBlocks(code);
  const blocks = [block1, block2, block3, block4].map((block) =>
    block.split("").reverse()
  );

  if (isConvenioMoedaModulo10(moeda)) {
    return blocks.map((block) => {
      const sum = multiplyFieldModulo10(block);
      return calculateDvConvenioField(sum, 0);
    });
  }

  return blocks.map((block) => {
    const sum = multiplyFieldModulo11(block);
    return calculateDvConvenioField(sum, 1);
  });
};

const insertConvenioBarcodeDv = (codeBar: string): string => {
  const field1 = codeBar.slice(0, CONVENIO_BARCODE_PREFIX_END);
  const field2 = codeBar.slice(
    CONVENIO_BARCODE_BODY_START,
    CONVENIO_BARCODE_BODY_END
  );
  const fieldJoin = [field1, field2].join("").split("").reverse();
  const moeda = codeBar[CONVENIO_MOEDA_POSITION];

  if (isConvenioMoedaModulo10(moeda)) {
    const sum = multiplyFieldModulo10(fieldJoin);
    const dv = calculateDvModulo10(sum);
    return [field1, dv, field2].join("");
  }

  if (isConvenioMoedaModulo11(moeda)) {
    const sum = multiplyFieldModulo11(fieldJoin);
    const dv = calculateDvModulo11Arrecadacao(sum);
    return [field1, dv, field2].join("");
  }

  return codeBar;
};

// --- Validation ---

const compareConvenioFieldDvs = (
  dvNumbers: number[],
  code: string
): boolean => {
  if (parseInt(code[CONVENIO_DV_POSITIONS[0]], 10) !== dvNumbers[0]) {
    return false;
  }
  if (parseInt(code[CONVENIO_DV_POSITIONS[1]], 10) !== dvNumbers[1]) {
    return false;
  }
  if (parseInt(code[CONVENIO_DV_POSITIONS[2]], 10) !== dvNumbers[2]) {
    return false;
  }
  if (parseInt(code[CONVENIO_DV_POSITIONS[3]], 10) !== dvNumbers[3]) {
    return false;
  }
  return true;
};

const validateConvenioCode = (code: string): void => {
  const moeda = code[CONVENIO_MOEDA_POSITION];

  if (!isConvenioMoedaModulo10(moeda) && !isConvenioMoedaModulo11(moeda)) {
    throw new ErrorHandler(
      400,
      "Actual value identification or reference is invalid (third code number)"
    );
  }

  const dvNumbers = calculateConvenioFieldDvs(code, moeda as ConvenioMoeda);

  if (!compareConvenioFieldDvs(dvNumbers, code)) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }
};

// --- Generation ---

const generateConvenioBarcode = (code: string): string => {
  const barcodeDraft = buildConvenioBarcodeDraft(code);
  return insertConvenioBarcodeDv(barcodeDraft);
};

// --- Formatting ---

const formatConvenioAmount = (barCode: string): string => {
  const amountSegment = barCode.slice(
    CONVENIO_AMOUNT_START,
    CONVENIO_AMOUNT_END
  );

  return (
    parseInt(amountSegment.slice(0, 8), 10).toString() +
    "." +
    amountSegment.slice(8, 11)
  );
};

export default validateConvenioCode;
export {
  insertConvenioBarcodeDv,
  generateConvenioBarcode,
  formatConvenioAmount,
};
