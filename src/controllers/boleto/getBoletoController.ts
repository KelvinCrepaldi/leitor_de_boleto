import { NextFunction, Request, Response } from "express";
import { getBoleto } from "../../services";

const getBoletoController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;
    const boletoInfo = getBoleto(code);
    return res.status(200).json(boletoInfo);
  } catch (error) {
    return next(error);
  }
};

export default getBoletoController;
