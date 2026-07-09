import { Router } from "express";
import { getBoletoController } from "../../controllers";

const boletoRouter = Router();

boletoRouter.get("/boleto/:code", getBoletoController);

export default boletoRouter;
