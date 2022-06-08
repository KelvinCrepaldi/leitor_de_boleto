import { Request, Response } from "express";

const getBoletoController = (req: Request, res: Response) => {
  const { code } = req.params;
  return res.status(200).json();
};

export default getBoletoController;
