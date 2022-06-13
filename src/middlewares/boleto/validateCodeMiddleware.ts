import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils";

const validateCodeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.params;
  const testDVFields = validateDVCodeFields(code);

  if (!filterInt(code)) {
    throw new ErrorHandler(400, "The code is not a number");
  }

  if (code.length !== 47) {
    throw new ErrorHandler(400, "Invalid code, the code must have 47 numbers");
  }

  if (testDVFields[0] !== code[9]) {
    throw new ErrorHandler(400, "Invalid DV code of field 1");
  }

  if (testDVFields[1] !== code[20]) {
    throw new ErrorHandler(400, "Invalid DV code of field 2");
  }

  if (testDVFields[2] !== code[31]) {
    throw new ErrorHandler(400, "Invalid DV code of field 3");
  }

  return next();
};

const filterInt = function (value: string) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) return Number(value);
  return false;
};

const validateDVCodeFields = (code: string) => {
  let count = 2;

  let field1 = code.slice(0, 9);
  let field2 = code.slice(10, 20);
  let field3 = code.slice(21, 31);
  let fields = field1 + field2 + field3;

  const codeMultiply = fields.split("").map((number) => {
    const n = parseInt(number) * count;
    const x = n.toString();
    if (count == 2) {
      count = 1;
    } else {
      count = 2;
    }
    if (x.length == 2) {
      const xSplit = x.split("");
      return parseInt(xSplit[0]) + parseInt(xSplit[1]);
    }
    return n;
  });

  const sumField1 = codeMultiply.slice(0, 9);
  const sumField2 = codeMultiply.slice(9, 19);
  const sumField3 = codeMultiply.slice(19, 29);
  const fieldsList = [sumField1, sumField2, sumField3];
  const resultList = [];

  fieldsList.forEach((field) => {
    resultList.push(calculateDVCodeField(field));
  });

  return resultList;
};

const calculateDVCodeField = (field: any) => {
  const sumField = field.reduce((sum, number) => sum + parseInt(number), 0);
  const rest = sumField % 10;
  const around = Math.ceil(sumField / 10) * 10;
  const result = around - rest;
  return result.toString()[1];
};

export default validateCodeMiddleware;
