import { BoletoType } from "../utils/boleto/types";

interface IBoleto {
  barCode: string;
  amount?: string;
  expirationDate?: string;
  type: BoletoType;
}

export default IBoleto;
