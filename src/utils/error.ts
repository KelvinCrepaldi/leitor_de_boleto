import { Response } from "express";

class ErrorHandler extends Error {
  statusCode: number;

  constructor(statuscode: number, message: string) {
    super();
    this.statusCode = statuscode;
    this.message = message;
  }
}

const handleError = (error: ErrorHandler, res: Response): Response => {
  const { statusCode, message } = error;
  return res.status(statusCode).json({ message });
};

export { handleError, ErrorHandler };
