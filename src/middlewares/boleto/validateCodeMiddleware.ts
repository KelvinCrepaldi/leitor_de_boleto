import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils";

// middleware responsavel por calcular os códigos de verificação, e tratamento de erros.
// responsavel por definir o tipo de boleto, e verificar o código de moeda

const validateCodeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { code } = req.params;

  if (!filterInt(code)) {
    throw new ErrorHandler(400, "The code is not a number.");
  }

  if (code.length < 47 || code.length > 48) {
    throw new ErrorHandler(400, "Invalid code size");
  }

  if (code.length === 48) {
    const isValid = calculateConvenio(code);
    if (isValid === false) {
      throw new ErrorHandler(400, "Verification code is invalid.");
    }
    req.body["boletoType"] = "convenio";
    return next();
  }

  if (code.length === 47) {
    const isValid = calculateTitulo(code);
    if (isValid === false) {
      throw new ErrorHandler(400, "Verification code is invalid.");
    }
    req.body["boletoType"] = "titulo";
    return next();
  }

  return next();
};

const calculateTitulo = (code: string): boolean => {
  const field1 = code.slice(0, 9);
  const field2 = code.slice(10, 20);
  const field3 = code.slice(21, 31);
  const fields = field1 + field2 + field3;
  const fieldSplited = fields.split("");

  const calculatedFields = multiplyAndSumField(fieldSplited, 2);

  const sumField1 = calculatedFields.slice(0, 9);
  const sumField2 = calculatedFields.slice(9, 19);
  const sumField3 = calculatedFields.slice(19, 29);
  const fieldsList = [sumField1, sumField2, sumField3];
  const dvNumbers = [];

  fieldsList.forEach((field) => {
    dvNumbers.push(calculateDVTitulo(field));
  });

  return compareDVTitulo(dvNumbers, code);
};

const calculateConvenio = (code: string): boolean => {
  const field1 = code.slice(0, 11).split("").reverse();
  const field2 = code.slice(12, 23).split("").reverse();
  const field3 = code.slice(24, 35).split("").reverse();
  const field4 = code.slice(36, 47).split("").reverse();
  const fields = [];
  fields.push(field1, field2, field3, field4);

  const moeda = code[2];

  // calcular DAC de acordo com o campo moeda = code[2]
  // para convenio 6 e 7 módulo 10
  // para convenio 8 e 9 módulo 11

  if (moeda === "6" || moeda === "7") {
    const multiplyedFields = fields.map((field) => {
      return multiplyAndSumField(field, 0);
    });
    const dvNumbers = multiplyedFields.map((number) => {
      return calculateDvConvenio(number, 0);
    });
    return compareDvConvenio(dvNumbers, code);
  } else if (moeda === "8" || moeda === "9") {
    const multiplyedFields = fields.map((field) => {
      return multiplyAndSumField(field, 1);
    });
    const dvNumbers = multiplyedFields.map((number) => {
      return calculateDvConvenio(number, 1);
    });
    return compareDvConvenio(dvNumbers, code);
  } else {
    throw new ErrorHandler(
      400,
      "Actual value identification or reference is invalid (third code number)"
    );
  }
};

const multiplyAndSumField = (field, type): any => {
  let count = 2;

  const multiplyField = field.map((number) => {
    const n = parseInt(number) * count;
    const x = n.toString();

    if (type === 0 || type === 2) {
      if (count == 2) {
        count = 1;
      } else {
        count = 2;
      }

      if (x.length === 2) {
        const xSplit = x.split("");
        return parseInt(xSplit[0]) + parseInt(xSplit[1]);
      }
      return n;
    }

    if (type === 1) {
      count++;
      if (count === 10) {
        count = 2;
      }
      return n;
    }
  });
  if (type === 2) {
    return multiplyField;
  }

  const sumField = multiplyField.reduce(
    (sum, number) => sum + parseInt(number),
    0
  );

  return sumField;
};

const calculateDvConvenio = (number: number, type: number): number => {
  if (type === 0) {
    const rest = number % 10;
    if (rest === 0) return 0;
    const DAC = 10 - rest;
    return DAC;
  }

  if (type === 1) {
    const DAC = number % 11;
    if (DAC <= 1) return 0;
    if (DAC > 9) return 1;
    return DAC;
  }
};

const calculateDVTitulo = (field: any): string => {
  const sumField = field.reduce((sum, number) => sum + parseInt(number), 0);
  const rest = sumField % 10;
  const around = Math.ceil(sumField / 10) * 10;
  const result = around - rest;
  return result.toString()[1];
};

const compareDvConvenio = (dvNumbers, code: string): boolean => {
  if (parseInt(code[11]) !== dvNumbers[0]) return false;
  if (parseInt(code[23]) !== dvNumbers[1]) return false;
  if (parseInt(code[35]) !== dvNumbers[2]) return false;
  if (parseInt(code[47]) !== dvNumbers[3]) return false;
  return true;
};

const compareDVTitulo = (dvNumbers, code): boolean => {
  if (parseInt(code[9]) !== parseInt(dvNumbers[0])) return false;
  if (parseInt(code[20]) !== parseInt(dvNumbers[1])) return false;
  if (parseInt(code[31]) !== parseInt(dvNumbers[2])) return false;
  return true;
};

const filterInt = function (value: string): number | false {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) return Number(value);
  return false;
};

export default validateCodeMiddleware;
export { multiplyAndSumField };
