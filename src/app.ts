import { NextFunction, Request, Response } from "express";
import express from "express";
import router from "./routes";
import { ErrorHandler, handleError } from "./utils";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json());
app.use("", router);
app.use(
  (error: ErrorHandler, req: Request, res: Response, _next: NextFunction) => {
    return handleError(error, res);
  }
);

export default app;
