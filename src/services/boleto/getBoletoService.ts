import IBoleto from "../../interfaces/boletoInterface";
import validateBoletoCode from "../../utils/boleto/validateBoletoCode";
import GetBoletoConvenioService from "./getBoletoConvenioService";
import GetBoletoTituloService from "./getBoletoTituloService";

class GetBoletoService {
  execute(code: string): IBoleto {
    const type = validateBoletoCode(code);

    if (type === "titulo") {
      return new GetBoletoTituloService().execute(code);
    }

    return new GetBoletoConvenioService().execute(code);
  }
}

export default GetBoletoService;
