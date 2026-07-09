import IBoleto from "../../interfaces/boletoInterface";
import { generateDV } from "../../utils/boleto/dvCalculations";

class GetBoletoTituloService {
  execute(code: string) {
    const date: string | false = calculateExpirationDate(code.slice(33, 37));
    const value: string = formatValue(code, date);
    const resultBoleto: IBoleto = {
      barCode: generateBarCode(code),
      amount: value,
      type: "titulo",
    };

    if (date !== false) {
      resultBoleto.expirationDate = date;
    }

    return resultBoleto;
  }
}

const formatValue = (code: string, date: string | false): string => {
  if (date === false) {
    return (
      parseInt(code.slice(33, 45), 10).toString() + "." + code.slice(45, 47)
    );
  }
  return (
    parseInt(code.slice(37, 45), 10).toString() + "." + code.slice(45, 47)
  );
};

const calculateExpirationDate = (factorCode: string): string | false => {
  if (factorCode[0] == "0") {
    return false;
  }
  const dateBase = new Date("10-07-1997");
  dateBase.setDate(dateBase.getDate() + parseInt(factorCode, 10));
  const formatedDay = formatDataNumber(dateBase.getDate());
  const formatedMonth = formatDataNumber(dateBase.getMonth() + 1);
  return `${dateBase.getFullYear()}-${formatedMonth}-${formatedDay}`;
};

const formatDataNumber = (number: number): string => {
  if (number.toString().length == 1) {
    return `0${number}`;
  } else return `${number}`;
};

const generateBarCode = (code: string): string => {
  const barCodeList: string[] = [];
  barCodeList.push(code.slice(0, 4));
  barCodeList.push("0");
  barCodeList.push(code.slice(33, 47));
  barCodeList.push(code.slice(4, 9));
  barCodeList.push(code.slice(10, 20));
  barCodeList.push(code.slice(21, 31));

  const barCodeJoin = barCodeList.join("");

  //gera o DV do codigo e insere na posição correta
  barCodeList[1] = generateDV(barCodeJoin).toString();
  const barCode = barCodeList.join("");

  return barCode;
};

export default GetBoletoTituloService;
export {
  calculateExpirationDate,
  generateBarCode,
  generateDV,
  formatDataNumber,
};
