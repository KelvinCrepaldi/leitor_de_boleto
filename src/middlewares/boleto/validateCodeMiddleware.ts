import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils";

const validateCodeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.params;

  if (code.length !== 47) {
    throw new ErrorHandler(400, "Invalid code, the code must have 47 numbers");
  }

  console.log(parseInt(code));

  if (!filterInt(code)) {
    throw new ErrorHandler(400, "The code is not a number");
  }

  return next();
};

const filterInt = function (value: string) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) return Number(value);
  return false;
};

export default validateCodeMiddleware;
