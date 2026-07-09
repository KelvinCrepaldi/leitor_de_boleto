import IBoleto from "../../interfaces/boletoInterface";
import validateBoletoCode from "../../utils/boleto/validateBoletoCode";
import getBoletoConvenio from "./getBoletoConvenioService";
import getBoletoTitulo from "./getBoletoTituloService";

const getBoleto = (code: string): IBoleto => {
  const type = validateBoletoCode(code);

  if (type === "titulo") {
    return getBoletoTitulo(code);
  }

  return getBoletoConvenio(code);
};

export default getBoleto;
