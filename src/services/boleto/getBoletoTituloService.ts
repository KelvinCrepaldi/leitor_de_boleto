import IBoleto from "../../interfaces/boletoInterface";

class GetBoletoTituloService {
  execute(code: string) {
    const date: string | false = calculateExpirationDate(code.slice(33, 37));
    const value: string = formatValue(code, date);
    const resultBoleto: IBoleto = {
      barCode: generateBarCode(code),
      amount: value,
    };

    if (date !== false) {
      resultBoleto.expirationDate = date;
    }

    return resultBoleto;
  }
}

const formatValue = (code: string, date: string | false) => {
  if (date === false) {
    return parseInt(code.slice(33, 45)).toString() + "." + code.slice(45, 47);
  }
  return parseInt(code.slice(37, 45)).toString() + "." + code.slice(45, 47);
};

const calculateExpirationDate = (factorCode: string) => {
  if (factorCode[0] == "0") {
    return false;
  }
  const dateBase = new Date("10-07-1997");
  dateBase.setDate(dateBase.getDate() + parseInt(factorCode));
  const formatedDay = formatDataNumber(dateBase.getDate());
  const formatedMonth = formatDataNumber(dateBase.getMonth() + 1);
  return `${dateBase.getFullYear()}-${formatedMonth}-${formatedDay}`;
};

const formatDataNumber = (number: number) => {
  if (number.toString().length == 1) {
    return `0${number}`;
  } else return `${number}`;
};

const generateBarCode = (code: string) => {
  const barCodeList = [];
  barCodeList.push(code.slice(0, 4));
  barCodeList.push("0");
  barCodeList.push(code.slice(33, 47));
  barCodeList.push(code.slice(4, 9));
  barCodeList.push(code.slice(10, 20));
  barCodeList.push(code.slice(21, 31));

  const barCodeJoin = barCodeList.join("");

  //gera o DV do codigo e insere na posição correta
  barCodeList[1] = generateDV(barCodeJoin);
  const barCode = barCodeList.join("");

  return barCode;
};

const generateDV = (code: string) => {
  const firstPosition = code.slice(0, 4); //separar primeira posição
  const secondPosition = code.slice(5, 44); //separar segunda posição
  const fullcode = firstPosition + secondPosition; //juntar posições
  const invertedCode = fullcode.split("").reverse(); //inverter ordem de trás para frente.

  //multiplicar todos os numeros da esquerda para a direita começando com 2...3...4...
  //os valores variam de 2 a 9, se 10 então volta para 2

  let count = 2;
  const multiplicatedNumbers = invertedCode.map((number) => {
    const n = parseInt(number) * count;
    count++;
    if (count === 10) {
      count = 2;
    }
    return n;
  });

  //soma todos os numeros
  const sumAllNumbers = multiplicatedNumbers.reduce(
    (sum, number) => sum + number,
    0
  );

  // divide a soma por 11, subtrai 11 pelo resto
  const rest = sumAllNumbers % 11;
  const result = 11 - rest;

  // se 0,10 ou 11 cv é igual a 1, se não então vai ser o próprio resultado
  if (result == 0 || result >= 10) {
    return 1;
  }
  return result;
};

export default GetBoletoTituloService;
export {
  calculateExpirationDate,
  generateBarCode,
  generateDV,
  formatDataNumber,
};
