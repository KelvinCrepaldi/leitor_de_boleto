import { Request, Response } from "express";
import IBoleto from "../../interfaces/boletoInterface";
import {
  GetBoletoTituloService,
  GetBoletoConvenioService,
} from "../../services";

const getBoletoController = (req: Request, res: Response) => {
  const { code } = req.params;
  const { boletoType } = req.body;

  if (boletoType === "titulo") {
    const boletoInfo: IBoleto = new GetBoletoTituloService().execute(code);
    return res.status(200).json(boletoInfo);
  }

  if (boletoType === "convenio") {
    const boletoInfo: IBoleto = new GetBoletoConvenioService().execute(code);
    return res.status(200).json(boletoInfo);
  }
};

export default getBoletoController;
