import IBoleto from "../../interfaces/boletoInterface";
import {
  calculateDvModulo11Arrecadacao,
  multiplyAndSumField,
} from "../../utils/boleto/dvCalculations";

class GetBoletoConvenioService {
  execute(code: string) {
    const barCode = generateBarCode(code);
    const value = formatValue(barCode.slice(4, 14));
    const resultBoleto: IBoleto = {
      barCode: barCode,
      amount: value,
      type: "convenio",
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

const calculateDvBarCode = (codeBar: string): string => {
  const field1 = codeBar.slice(0, 3);
  const field2 = codeBar.slice(4, 43);
  const fieldJoin = [field1, field2].join("").split("").reverse();
  const moeda = codeBar[2];

  if (moeda === "6" || moeda === "7") {
    const fieldMultiply = multiplyAndSumField(fieldJoin, 0);
    const rest = fieldMultiply % 10;
    if (rest === 0) return [field1, "0", field2].join("");
    const result = 10 - rest;

    return [field1, result, field2].join("");
  }

  if (moeda === "8" || moeda === "9") {
    const fieldMultiply = multiplyAndSumField(fieldJoin, 1);
    const dv = calculateDvModulo11Arrecadacao(fieldMultiply);

    return [field1, dv, field2].join("");
  }

  return codeBar;
};

const formatValue = (value: string): string => {
  return parseInt(value.slice(0, 8), 10).toString() + "." + value.slice(8, 11);
};

export default GetBoletoConvenioService;
export { calculateDvBarCode };
