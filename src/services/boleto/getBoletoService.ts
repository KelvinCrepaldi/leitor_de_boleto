import IBoleto from "../../interfaces/boletoInterface";
import {
  CONVENIO_CODE_LENGTH,
  TITULO_CODE_LENGTH,
} from "../../utils/boleto/constants";
import { ErrorHandler } from "../../utils/error";
import getBoletoConvenio from "./getBoletoConvenioService";
import getBoletoTitulo from "./getBoletoTituloService";

const getBoleto = (code: string): IBoleto => {
  if (code.length === TITULO_CODE_LENGTH) {
    return getBoletoTitulo(code);
  }

  if (code.length === CONVENIO_CODE_LENGTH) {
    return getBoletoConvenio(code);
  }

  // Checagem defensiva para chamadas diretas fora da rota HTTP
  throw new ErrorHandler(400, "Invalid code size");
};

export default getBoleto;
