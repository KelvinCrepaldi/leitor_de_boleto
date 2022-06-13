import { NextFunction, Request, Response } from "express";

const validateCodeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next();
};

export default validateCodeMiddleware;
