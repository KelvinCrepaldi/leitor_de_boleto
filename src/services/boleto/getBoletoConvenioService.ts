import IBoleto from "../../interfaces/boletoInterface";
import { multiplyAndSumField } from "../../middlewares/boleto/validateCodeMiddleware";

class GetBoletoConvenioService {
  execute(code: string) {
    const barCode = generateBarCode(code);
    const value = formatValue(barCode.slice(4, 14));
    const resultBoleto: IBoleto = {
      barCode: barCode,
      amount: value,
    };

    return resultBoleto;
  }
}

const generateBarCode = (code: string) => {
  const field1 = code.slice(0, 11);
  const field2 = code.slice(12, 23);
  const field3 = code.slice(24, 35);
  const field4 = code.slice(36, 47);
  const codeBar = [field1, field2, field3, field4].join("");
  return calculateDvBarCode(codeBar);
};

const calculateDvBarCode = (codeBar) => {
  const field1 = codeBar.slice(0, 3);
  const field2 = codeBar.slice(4, 43);
  const fieldJoin = [field1, field2].join("").split("").reverse();
  if (codeBar[2] === "6" || codeBar[2] === "7") {
    const fieldMultiply = multiplyAndSumField(fieldJoin, 0);
    const rest = fieldMultiply % 10;
    if (rest === 0) return [field1, "0", field2].join("");
    const result = 10 - rest;

    return [field1, result, field2].join("");
  }

  if (codeBar[2] === "8" || codeBar[2] === "9") {
    const fieldMultiply = multiplyAndSumField(fieldJoin, 1);
    const rest = fieldMultiply % 11;
    const result = 11 - rest;

    if (result >= 1) return [field1, "0", field2].join("");
    if (result === 10) return [field1, "1", field2].join("");

    return [field1, result, field2].join("");
  }
};

const formatValue = (value) => {
  return parseInt(value.slice(0, 8)).toString() + "." + value.slice(8, 11);
};

export default GetBoletoConvenioService;
export { calculateDvBarCode };
