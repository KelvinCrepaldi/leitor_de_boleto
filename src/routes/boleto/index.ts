import { Router } from "express";
import { getBoletoController } from "../../controllers";
import { validateBoletoParamsMiddleware } from "../../middlewares";

const boletoRouter = Router();

boletoRouter.get(
  "/boleto/:code",
  validateBoletoParamsMiddleware,
  getBoletoController
);

export default boletoRouter;
