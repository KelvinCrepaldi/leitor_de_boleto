import {
  MultiplyFieldSumModulo10Type,
  MultiplyFieldSumModulo11Type,
  MultiplyFieldTituloType,
} from "./types";

function multiplyAndSumField(
  field: string[],
  type: MultiplyFieldSumModulo10Type
): number;
function multiplyAndSumField(
  field: string[],
  type: MultiplyFieldSumModulo11Type
): number;
function multiplyAndSumField(
  field: string[],
  type: MultiplyFieldTituloType
): number[];
function multiplyAndSumField(
  field: string[],
  type: MultiplyFieldSumModulo10Type | MultiplyFieldSumModulo11Type | MultiplyFieldTituloType
): number | number[] {
  let count = 2;

  const multiplyField = field.map((digit) => {
    const n = parseInt(digit, 10) * count;
    const x = n.toString();

    if (type === 0 || type === 2) {
      if (count === 2) {
        count = 1;
      } else {
        count = 2;
      }

      if (x.length === 2) {
        const xSplit = x.split("");
        return parseInt(xSplit[0], 10) + parseInt(xSplit[1], 10);
      }
      return n;
    }

    count++;
    if (count === 10) {
      count = 2;
    }
    return n;
  });

  if (type === 2) {
    return multiplyField;
  }

  return multiplyField.reduce((sum, number) => sum + number, 0);
}

const calculateDvModulo11Arrecadacao = (sum: number): number => {
  const rest = sum % 11;
  if (rest <= 1) return 0;
  if (rest === 10) return 1;
  return 11 - rest;
};

const calculateDvConvenio = (
  number: number,
  type: MultiplyFieldSumModulo10Type | MultiplyFieldSumModulo11Type
): number => {
  if (type === 0) {
    const rest = number % 10;
    if (rest === 0) return 0;
    return 10 - rest;
  }

  return calculateDvModulo11Arrecadacao(number);
};

const calculateDVTitulo = (field: number[]): string => {
  const sumField = field.reduce((sum, number) => sum + number, 0);
  const rest = sumField % 10;
  const around = Math.ceil(sumField / 10) * 10;
  const result = around - rest;
  return result.toString()[1];
};

const compareDvConvenio = (dvNumbers: number[], code: string): boolean => {
  if (parseInt(code[11], 10) !== dvNumbers[0]) return false;
  if (parseInt(code[23], 10) !== dvNumbers[1]) return false;
  if (parseInt(code[35], 10) !== dvNumbers[2]) return false;
  if (parseInt(code[47], 10) !== dvNumbers[3]) return false;
  return true;
};

const compareDVTitulo = (dvNumbers: string[], code: string): boolean => {
  if (parseInt(code[9], 10) !== parseInt(dvNumbers[0], 10)) return false;
  if (parseInt(code[20], 10) !== parseInt(dvNumbers[1], 10)) return false;
  if (parseInt(code[31], 10) !== parseInt(dvNumbers[2], 10)) return false;
  return true;
};

const generateDV = (code: string): number => {
  const firstPosition = code.slice(0, 4);
  const secondPosition = code.slice(5, 44);
  const fullcode = firstPosition + secondPosition;
  const invertedCode = fullcode.split("").reverse();

  let count = 2;
  const multiplicatedNumbers = invertedCode.map((digit) => {
    const n = parseInt(digit, 10) * count;
    count++;
    if (count === 10) {
      count = 2;
    }
    return n;
  });

  const sumAllNumbers = multiplicatedNumbers.reduce(
    (sum, number) => sum + number,
    0
  );

  const rest = sumAllNumbers % 11;
  const result = 11 - rest;

  if (result === 0 || result >= 10) {
    return 1;
  }
  return result;
};

export {
  multiplyAndSumField,
  calculateDvModulo11Arrecadacao,
  calculateDvConvenio,
  calculateDVTitulo,
  compareDvConvenio,
  compareDVTitulo,
  generateDV,
};
