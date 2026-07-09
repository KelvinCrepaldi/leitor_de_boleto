import { ErrorHandler } from "../error";
import {
  CONVENIO_CODE_LENGTH,
  TITULO_CODE_LENGTH,
} from "./constants";
import validateConvenioCode from "./convenio";
import validateTituloCode from "./titulo";
import { BoletoType } from "./types";

const isNumericCode = (value: string): boolean => {
  return /^(\-|\+)?([0-9]+|Infinity)$/.test(value);
};

const isValidBoletoLength = (code: string): boolean => {
  return (
    code.length === TITULO_CODE_LENGTH || code.length === CONVENIO_CODE_LENGTH
  );
};

const validateBoletoCode = (code: string): BoletoType => {
  if (!isNumericCode(code)) {
    throw new ErrorHandler(400, "The code is not a number.");
  }

  if (!isValidBoletoLength(code)) {
    throw new ErrorHandler(400, "Invalid code size");
  }

  if (code.length === CONVENIO_CODE_LENGTH) {
    validateConvenioCode(code);
    return "convenio";
  }

  validateTituloCode(code);
  return "titulo";
};

export default validateBoletoCode;
