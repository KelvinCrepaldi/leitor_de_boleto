import Router from "express";
import { getBoletoController } from "../../controllers";
import { validateCodeMiddleware } from "../../middlewares/boleto";

const boletoRouter = Router();

boletoRouter.get("/boleto/:code", validateCodeMiddleware, getBoletoController);

export default boletoRouter;
