import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils/error";
import {
  CONVENIO_CODE_LENGTH,
  TITULO_CODE_LENGTH,
} from "../../utils/boleto/constants";

const validateBoletoParamsMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { code } = req.params;

  // Passo 0 — Verificar se o código é numérico
  const isNumeric = /^(\-|\+)?([0-9]+|Infinity)$/.test(code);
  if (!isNumeric) {
    return next(new ErrorHandler(400, "The code is not a number."));
  }

  // Passo 0 — Verificar tamanho (47 dígitos = título, 48 = convênio)
  const isValidLength =
    code.length === TITULO_CODE_LENGTH ||
    code.length === CONVENIO_CODE_LENGTH;
  if (!isValidLength) {
    return next(new ErrorHandler(400, "Invalid code size"));
  }

  return next();
};

export default validateBoletoParamsMiddleware;
