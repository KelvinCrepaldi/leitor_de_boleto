import Router from "express";
import { getBoletoController } from "../../controllers";
import { validateCodeMiddleware } from "../../middlewares";

const boletoRouter = Router();

boletoRouter.get("/boleto/:code", validateCodeMiddleware, getBoletoController);

export default boletoRouter;
