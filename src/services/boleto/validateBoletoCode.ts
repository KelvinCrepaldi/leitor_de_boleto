import { ErrorHandler } from "../../utils";
import {
  calculateDvConvenio,
  calculateDVTitulo,
  compareDvConvenio,
  compareDVTitulo,
  generateDV,
  multiplyAndSumField,
} from "../../utils/boleto/dvCalculations";
import {
  BoletoType,
  ConvenioMoedaModulo10,
  ConvenioMoedaModulo11,
} from "../../utils/boleto/types";

const isNumericCode = (value: string): boolean => {
  return /^(\-|\+)?([0-9]+|Infinity)$/.test(value);
};

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

const validateTituloCode = (code: string): void => {
  const field1 = code.slice(0, 9);
  const field2 = code.slice(10, 20);
  const field3 = code.slice(21, 31);
  const fields = field1 + field2 + field3;
  const fieldSplited = fields.split("");

  const calculatedFields = multiplyAndSumField(fieldSplited, 2);

  const sumField1 = calculatedFields.slice(0, 9);
  const sumField2 = calculatedFields.slice(9, 19);
  const sumField3 = calculatedFields.slice(19, 29);
  const fieldsList: number[][] = [sumField1, sumField2, sumField3];
  const dvNumbers: string[] = [];

  fieldsList.forEach((field) => {
    dvNumbers.push(calculateDVTitulo(field));
  });

  if (!compareDVTitulo(dvNumbers, code)) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }

  const barCodeJoin =
    code.slice(0, 4) +
    "0" +
    code.slice(33, 47) +
    code.slice(4, 9) +
    code.slice(10, 20) +
    code.slice(21, 31);

  if (parseInt(code[32], 10) !== generateDV(barCodeJoin)) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }
};

const validateConvenioCode = (code: string): void => {
  const field1 = code.slice(0, 11).split("").reverse();
  const field2 = code.slice(12, 23).split("").reverse();
  const field3 = code.slice(24, 35).split("").reverse();
  const field4 = code.slice(36, 47).split("").reverse();
  const fields: string[][] = [field1, field2, field3, field4];

  const moeda = code[2];

  if (isConvenioMoedaModulo10(moeda)) {
    const multiplyedFields = fields.map((field) => {
      return multiplyAndSumField(field, 0);
    });
    const dvNumbers = multiplyedFields.map((number) => {
      return calculateDvConvenio(number, 0);
    });

    if (!compareDvConvenio(dvNumbers, code)) {
      throw new ErrorHandler(400, "Verification code is invalid.");
    }
    return;
  }

  if (isConvenioMoedaModulo11(moeda)) {
    const multiplyedFields = fields.map((field) => {
      return multiplyAndSumField(field, 1);
    });
    const dvNumbers = multiplyedFields.map((number) => {
      return calculateDvConvenio(number, 1);
    });

    if (!compareDvConvenio(dvNumbers, code)) {
      throw new ErrorHandler(400, "Verification code is invalid.");
    }
    return;
  }

  throw new ErrorHandler(
    400,
    "Actual value identification or reference is invalid (third code number)"
  );
};

const validateBoletoCode = (code: string): BoletoType => {
  if (!isNumericCode(code)) {
    throw new ErrorHandler(400, "The code is not a number.");
  }

  if (code.length < 47 || code.length > 48) {
    throw new ErrorHandler(400, "Invalid code size");
  }

  if (code.length === 48) {
    validateConvenioCode(code);
    return "convenio";
  }

  validateTituloCode(code);
  return "titulo";
};

export default validateBoletoCode;
