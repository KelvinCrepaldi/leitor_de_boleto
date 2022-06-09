import { NextFunction, Request, Response } from "express";

const validateCodeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.params;
  return next();
};

export default validateCodeMiddleware;
