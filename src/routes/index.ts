import { Router } from "express";
import boletoRouter from "./boleto";

const router = Router();

router.use("", boletoRouter);

export default router;
