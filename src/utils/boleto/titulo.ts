import { ErrorHandler } from "../error";
import {
  BARCODE_DV_PLACEHOLDER,
  EXPIRATION_DATE_BASE,
  TITULO_BARCODE_DV_POSITION,
  TITULO_BARCODE_VALUE_END,
  TITULO_BARCODE_VALUE_START,
  TITULO_BLOCK_1,
  TITULO_BLOCK_2,
  TITULO_BLOCK_3,
  TITULO_CENTS_END,
  TITULO_CENTS_START,
  TITULO_DV_POSITIONS,
  TITULO_FACTOR_END,
  TITULO_FACTOR_START,
  TITULO_VALUE_WITH_FACTOR_END,
  TITULO_VALUE_WITH_FACTOR_START,
  TITULO_VALUE_WITHOUT_FACTOR_END,
  TITULO_VALUE_WITHOUT_FACTOR_START,
} from "./constants";
import {
  multiplyFieldModulo11,
  multiplyFieldTitulo,
} from "./dv";

// --- Parsing ---

const sliceTituloDataBlocks = (code: string) => ({
  block1: code.slice(TITULO_BLOCK_1.start, TITULO_BLOCK_1.end),
  block2: code.slice(TITULO_BLOCK_2.start, TITULO_BLOCK_2.end),
  block3: code.slice(TITULO_BLOCK_3.start, TITULO_BLOCK_3.end),
});

const sliceTituloValueSegments = (code: string) => ({
  factor: code.slice(TITULO_FACTOR_START, TITULO_FACTOR_END),
  valueWithoutFactor: code.slice(
    TITULO_VALUE_WITHOUT_FACTOR_START,
    TITULO_VALUE_WITHOUT_FACTOR_END
  ),
  valueWithFactor: code.slice(
    TITULO_VALUE_WITH_FACTOR_START,
    TITULO_VALUE_WITH_FACTOR_END
  ),
  cents: code.slice(TITULO_CENTS_START, TITULO_CENTS_END),
});

const buildTituloBarcodeDraft = (code: string): string => {
  const { block1, block2, block3 } = sliceTituloDataBlocks(code);

  return (
    block1.slice(0, 4) +
    BARCODE_DV_PLACEHOLDER +
    code.slice(TITULO_BARCODE_VALUE_START, TITULO_BARCODE_VALUE_END) +
    block1.slice(4) +
    block2 +
    block3
  );
};

// --- DV ---

const calculateDvTituloField = (field: number[]): string => {
  const sumField = field.reduce((sum, number) => sum + number, 0);
  const rest = sumField % 10;
  const around = Math.ceil(sumField / 10) * 10;
  const result = around - rest;
  return result.toString()[1];
};

const calculateDvTituloBarcode = (code: string): number => {
  const firstPosition = code.slice(0, 4);
  const secondPosition = code.slice(5, 44);
  const fullCode = firstPosition + secondPosition;
  const invertedCode = fullCode.split("").reverse();

  const sumAllNumbers = multiplyFieldModulo11(invertedCode);
  const rest = sumAllNumbers % 11;
  const result = 11 - rest;

  if (result === 0 || result >= 10) {
    return 1;
  }

  return result;
};

// --- Validation ---

const compareTituloFieldDvs = (
  dvNumbers: string[],
  code: string
): boolean => {
  if (
    parseInt(code[TITULO_DV_POSITIONS[0]], 10) !==
    parseInt(dvNumbers[0], 10)
  ) {
    return false;
  }
  if (
    parseInt(code[TITULO_DV_POSITIONS[1]], 10) !==
    parseInt(dvNumbers[1], 10)
  ) {
    return false;
  }
  if (
    parseInt(code[TITULO_DV_POSITIONS[2]], 10) !==
    parseInt(dvNumbers[2], 10)
  ) {
    return false;
  }
  return true;
};

const validateTituloFieldDvs = (code: string): void => {
  const { block1, block2, block3 } = sliceTituloDataBlocks(code);
  const fields = (block1 + block2 + block3).split("");
  const calculatedFields = multiplyFieldTitulo(fields);

  const sumField1 = calculatedFields.slice(0, 9);
  const sumField2 = calculatedFields.slice(9, 19);
  const sumField3 = calculatedFields.slice(19, 29);
  const fieldsList: number[][] = [sumField1, sumField2, sumField3];
  const dvNumbers = fieldsList.map((field) => calculateDvTituloField(field));

  if (!compareTituloFieldDvs(dvNumbers, code)) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }
};

const validateTituloBarcodeDv = (code: string): void => {
  const barcodeDraft = buildTituloBarcodeDraft(code);
  const expectedDv = calculateDvTituloBarcode(barcodeDraft);

  if (parseInt(code[TITULO_BARCODE_DV_POSITION], 10) !== expectedDv) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }
};

const validateTituloCode = (code: string): void => {
  validateTituloFieldDvs(code);
  validateTituloBarcodeDv(code);
};

// --- Generation ---

const generateTituloBarcode = (code: string): string => {
  const barcodeDraft = buildTituloBarcodeDraft(code);
  const dv = calculateDvTituloBarcode(barcodeDraft).toString();

  return barcodeDraft.slice(0, 4) + dv + barcodeDraft.slice(5);
};

// --- Formatting ---

const formatDatePart = (number: number): string => {
  if (number.toString().length === 1) {
    return `0${number}`;
  }
  return `${number}`;
};

const calculateExpirationDate = (factorCode: string): string | false => {
  if (factorCode[0] === "0") {
    return false;
  }

  const dateBase = new Date(EXPIRATION_DATE_BASE);
  dateBase.setDate(dateBase.getDate() + parseInt(factorCode, 10));
  const formattedDay = formatDatePart(dateBase.getDate());
  const formattedMonth = formatDatePart(dateBase.getMonth() + 1);

  return `${dateBase.getFullYear()}-${formattedMonth}-${formattedDay}`;
};

const formatAmountFromCents = (
  integerPart: string,
  centsPart: string
): string => {
  return `${parseInt(integerPart, 10).toString()}.${centsPart}`;
};

const formatTituloAmount = (
  code: string,
  expirationDate: string | false
): string => {
  const { valueWithoutFactor, valueWithFactor, cents } =
    sliceTituloValueSegments(code);

  if (expirationDate === false) {
    return formatAmountFromCents(valueWithoutFactor, cents);
  }

  return formatAmountFromCents(valueWithFactor, cents);
};

export default validateTituloCode;
export {
  sliceTituloValueSegments,
  calculateDvTituloBarcode,
  generateTituloBarcode,
  calculateExpirationDate,
  formatTituloAmount,
};
