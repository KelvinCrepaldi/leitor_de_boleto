import IBoleto from "../../interfaces/boletoInterface";

class GetBoletoService {
  execute(code) {
    const value =
      parseInt(code.slice(37, 45)).toString() + "." + code.slice(45, 47);

    const date = code.slice(33, 37);
    console.log(value);

    const resultBoleto = {
      barCode: generateBarCode(code),
      value: value,
      date: new Date(),
    };

    return resultBoleto;
  }
}

const generateBarCode = (code) => {
  const barCodeList = [];
  barCodeList.push(code.slice(0, 4));
  barCodeList.push("0");
  barCodeList.push(code.slice(33, 47));
  barCodeList.push(code.slice(4, 9));
  barCodeList.push(code.slice(10, 20));
  barCodeList.push(code.slice(21, 31));

  const barCodeJoin = barCodeList.join("");
  barCodeList[1] = generateDV(barCodeJoin); //gera o DV do codigo e insere na posição correta
  const barCode = barCodeList.join("");

  return barCode;
};

const generateDV = (code) => {
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
    (count, number) => count + number,
    0
  );

  // divide a soma por 11, subtrai 11 pelo resto
  const rest = sumAllNumbers % 11;
  const result = 11 - rest;
  let verified = null;

  // se 0,10 ou 11 cv é igual a 1, se não então vai ser o próprio resultado
  if (rest == 0 || rest >= 10) {
    verified = 1;
  } else {
    verified = result;
  }
  return verified;
};

export default GetBoletoService;
