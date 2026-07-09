import IBoleto from "../../interfaces/boletoInterface";
import { ErrorHandler } from "../../utils/error";
import {
  BARCODE_DV_PLACEHOLDER,
  EXPIRATION_DATE_BASE,
  TITULO_BARCODE_DV_POSITION,
  TITULO_BARCODE_VALUE_END,
  TITULO_BARCODE_VALUE_START,
  TITULO_BLOCK_1,
  TITULO_BLOCK_2,
  TITULO_BLOCK_3,
  TITULO_CENTS_END,
  TITULO_CENTS_START,
  TITULO_DV_POSITIONS,
  TITULO_FACTOR_END,
  TITULO_FACTOR_START,
  TITULO_VALUE_WITH_FACTOR_END,
  TITULO_VALUE_WITH_FACTOR_START,
  TITULO_VALUE_WITHOUT_FACTOR_END,
  TITULO_VALUE_WITHOUT_FACTOR_START,
} from "../../utils/boleto/constants";
import {
  calculateDvFromTituloFieldSum,
  calculateDvModulo11Cobranca,
  multiplyFieldModulo11,
  multiplyFieldTitulo,
} from "../../utils/boleto/dv";

const getBoletoTitulo = (code: string): IBoleto => {
  // Passo 1 — Validar DVs dos campos 1, 2 e 3 (módulo 10)
  // 1. Separar os 9 dígitos de cada bloco (sem o DV)
  const block1 = code.slice(TITULO_BLOCK_1.start, TITULO_BLOCK_1.end);
  const block2 = code.slice(TITULO_BLOCK_2.start, TITULO_BLOCK_2.end);
  const block3 = code.slice(TITULO_BLOCK_3.start, TITULO_BLOCK_3.end);

  // 2. Multiplicar alternadamente por 2 e 1 (da direita para a esquerda)
  const multipliedDigits = multiplyFieldTitulo(
    (block1 + block2 + block3).split("")
  );

  // 3. Somar os resultados de cada bloco e calcular o DV (complemento módulo 10)
  const field1Sum = multipliedDigits.slice(0, 9).reduce((sum, n) => sum + n, 0);
  const field2Sum = multipliedDigits.slice(9, 19).reduce((sum, n) => sum + n, 0);
  const field3Sum = multipliedDigits.slice(19, 29).reduce((sum, n) => sum + n, 0);

  const dv1 = calculateDvFromTituloFieldSum(field1Sum);
  const dv2 = calculateDvFromTituloFieldSum(field2Sum);
  const dv3 = calculateDvFromTituloFieldSum(field3Sum);

  // 4. Comparar com os DVs informados nas posições 10, 21 e 32
  if (parseInt(code[TITULO_DV_POSITIONS[0]], 10) !== dv1) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }
  if (parseInt(code[TITULO_DV_POSITIONS[1]], 10) !== dv2) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }
  if (parseInt(code[TITULO_DV_POSITIONS[2]], 10) !== dv3) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }

  // Passo 2 — Validar DV geral do código de barras (módulo 11)
  // 1. Montar o código de barras de 44 posições (placeholder no DV geral)
  const barcodeDraft =
    block1.slice(0, 4) +
    BARCODE_DV_PLACEHOLDER +
    code.slice(TITULO_BARCODE_VALUE_START, TITULO_BARCODE_VALUE_END) +
    block1.slice(4) +
    block2 +
    block3;

  // 2. Separar posições 1–4 e 6–44, percorrer da direita para a esquerda
  const barcodeWithoutDv =
    barcodeDraft.slice(0, 4) + barcodeDraft.slice(5, 44);
  const invertedBarcode = barcodeWithoutDv.split("").reverse();

  // 3. Multiplicar por pesos 2–9, somar e calcular DV = 11 − resto
  const barcodeSum = multiplyFieldModulo11(invertedBarcode);
  const generalDv = calculateDvModulo11Cobranca(barcodeSum);

  // 4. Comparar com o dígito na posição 33 (campo 4 — DV geral)
  if (parseInt(code[TITULO_BARCODE_DV_POSITION], 10) !== generalDv) {
    throw new ErrorHandler(400, "Verification code is invalid.");
  }

  // Passo 3 — Extrair dados
  // Código de barras: remontar os 44 dígitos com o DV geral calculado
  const barCode =
    barcodeDraft.slice(0, 4) + generalDv.toString() + barcodeDraft.slice(5);

  // Vencimento: fator nas posições 34–37 + data base 07/10/1997
  const factor = code.slice(TITULO_FACTOR_START, TITULO_FACTOR_END);
  let expirationDate: string | undefined;

  if (factor[0] !== "0") {
    const dateBase = new Date(EXPIRATION_DATE_BASE);
    dateBase.setDate(dateBase.getDate() + parseInt(factor, 10));
    const day =
      dateBase.getDate().toString().length === 1
        ? `0${dateBase.getDate()}`
        : `${dateBase.getDate()}`;
    const month =
      dateBase.getMonth() + 1 < 10
        ? `0${dateBase.getMonth() + 1}`
        : `${dateBase.getMonth() + 1}`;
    expirationDate = `${dateBase.getFullYear()}-${month}-${day}`;
  }

  // Valor: posições 38–47 (campo 5), em centavos
  const cents = code.slice(TITULO_CENTS_START, TITULO_CENTS_END);
  const integerPart =
    expirationDate === undefined
      ? code.slice(
          TITULO_VALUE_WITHOUT_FACTOR_START,
          TITULO_VALUE_WITHOUT_FACTOR_END
        )
      : code.slice(
          TITULO_VALUE_WITH_FACTOR_START,
          TITULO_VALUE_WITH_FACTOR_END
        );
  const amount = `${parseInt(integerPart, 10).toString()}.${cents}`;

  const resultBoleto: IBoleto = {
    barCode,
    amount,
    type: "titulo",
  };

  if (expirationDate !== undefined) {
    resultBoleto.expirationDate = expirationDate;
  }

  return resultBoleto;
};

export default getBoletoTitulo;
