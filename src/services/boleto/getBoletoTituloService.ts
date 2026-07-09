import IBoleto from "../../interfaces/boletoInterface";
import {
  calculateExpirationDate,
  formatTituloAmount,
  generateTituloBarcode,
  sliceTituloValueSegments,
} from "../../utils/boleto/titulo";

const getBoletoTitulo = (code: string): IBoleto => {
  const { factor } = sliceTituloValueSegments(code);
  const expirationDate = calculateExpirationDate(factor);
  const resultBoleto: IBoleto = {
    barCode: generateTituloBarcode(code),
    amount: formatTituloAmount(code, expirationDate),
    type: "titulo",
  };

  if (expirationDate !== false) {
    resultBoleto.expirationDate = expirationDate;
  }

  return resultBoleto;
};

export default getBoletoTitulo;
