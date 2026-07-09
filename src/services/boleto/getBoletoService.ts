import IBoleto from "../../interfaces/boletoInterface";
import GetBoletoConvenioService from "./getBoletoConvenioService";
import GetBoletoTituloService from "./getBoletoTituloService";
import validateBoletoCode from "./validateBoletoCode";

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
