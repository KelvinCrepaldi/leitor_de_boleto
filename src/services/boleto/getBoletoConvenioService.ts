import IBoleto from "../../interfaces/boletoInterface";
import {
  formatConvenioAmount,
  generateConvenioBarcode,
} from "../../utils/boleto/convenio";

const getBoletoConvenio = (code: string): IBoleto => {
  const barCode = generateConvenioBarcode(code);

  return {
    barCode,
    amount: formatConvenioAmount(barCode),
    type: "convenio",
  };
};

export default getBoletoConvenio;
