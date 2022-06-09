import { Request, Response } from "express";
import IBoleto from "../../interfaces/boletoInterface";
import { GetBoletoService } from "../../services";

const getBoletoController = (req: Request, res: Response) => {
  const { code } = req.params;

  const boletoInfo = new GetBoletoService().execute(code);
  return res.status(200).json(boletoInfo);
};

export default getBoletoController;
