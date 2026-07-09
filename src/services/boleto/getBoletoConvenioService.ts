import IBoleto from "../../interfaces/boletoInterface";
import { ErrorHandler } from "../../utils/error";
import {
  CONVENIO_AMOUNT_END,
  CONVENIO_AMOUNT_START,
  CONVENIO_BARCODE_BODY_END,
  CONVENIO_BARCODE_BODY_START,
  CONVENIO_BARCODE_PREFIX_END,
  CONVENIO_BLOCK_1,
  CONVENIO_BLOCK_2,
  CONVENIO_BLOCK_3,
  CONVENIO_BLOCK_4,
  CONVENIO_DV_POSITIONS,
  CONVENIO_MOEDA_POSITION,
} from "../../utils/boleto/constants";
import {
  calculateDvModulo10,
  calculateDvModulo11Arrecadacao,
  multiplyFieldModulo10,
  multiplyFieldModulo11,
} from "../../utils/boleto/dv";

const getBoletoConvenio = (code: string): IBoleto => {
  // Identificar moeda/segmento na 3ª posição (define módulo 10 ou 11)
  const moeda = code[CONVENIO_MOEDA_POSITION];
  const usesModulo10 = moeda === "6" || moeda === "7";
  const usesModulo11 = moeda === "8" || moeda === "9";

  if (!usesModulo10 && !usesModulo11) {
    throw new ErrorHandler(
      400,
      "Actual value identification or reference is invalid (third code number)"
    );
  }

  const blocks = [
    code.slice(CONVENIO_BLOCK_1.start, CONVENIO_BLOCK_1.end),
    code.slice(CONVENIO_BLOCK_2.start, CONVENIO_BLOCK_2.end),
    code.slice(CONVENIO_BLOCK_3.start, CONVENIO_BLOCK_3.end),
    code.slice(CONVENIO_BLOCK_4.start, CONVENIO_BLOCK_4.end),
  ];

  // Passo 1 — Validar DVs dos 4 blocos
  for (let i = 0; i < blocks.length; i++) {
    // 1. Percorrer os 10 dígitos de dados da direita para a esquerda
    const reversedDigits = blocks[i].split("").reverse();
    let blockDv: number;

    if (usesModulo10) {
      // Módulo 10: multiplicar alternadamente por 2 e 1, somar, DV = 10 − resto
      const sum = multiplyFieldModulo10(reversedDigits);
      blockDv = calculateDvModulo10(sum);
    } else {
      // Módulo 11: multiplicar por pesos 2–9, somar, aplicar regra de arrecadação
      const sum = multiplyFieldModulo11(reversedDigits);
      blockDv = calculateDvModulo11Arrecadacao(sum);
    }

    // 2. Comparar com o DV informado no bloco
    if (parseInt(code[CONVENIO_DV_POSITIONS[i]], 10) !== blockDv) {
      throw new ErrorHandler(400, "Verification code is invalid.");
    }
  }

  // Passo 2 — Montar código de barras e calcular DV geral
  // 1. Unir os 4 blocos removendo os DVs de campo → 44 dígitos de conteúdo
  const barcodeDraft = blocks.join("");

  // 2. Separar as 3 primeiras posições e as 40 restantes
  const barcodePrefix = barcodeDraft.slice(0, CONVENIO_BARCODE_PREFIX_END);
  const barcodeBody = barcodeDraft.slice(
    CONVENIO_BARCODE_BODY_START,
    CONVENIO_BARCODE_BODY_END
  );
  const reversedForGeneralDv = (barcodePrefix + barcodeBody)
    .split("")
    .reverse();

  // 3. Aplicar o mesmo módulo da moeda e inserir o DV na 4ª posição
  let generalDv: number;

  if (usesModulo10) {
    const sum = multiplyFieldModulo10(reversedForGeneralDv);
    generalDv = calculateDvModulo10(sum);
  } else {
    const sum = multiplyFieldModulo11(reversedForGeneralDv);
    generalDv = calculateDvModulo11Arrecadacao(sum);
  }

  const barCode = barcodePrefix + generalDv.toString() + barcodeBody;

  // Passo 3 — Extrair valor (posições 5–14 do código de barras, em centavos)
  const amountSegment = barCode.slice(CONVENIO_AMOUNT_START, CONVENIO_AMOUNT_END);
  const amount =
    parseInt(amountSegment.slice(0, 8), 10).toString() +
    "." +
    amountSegment.slice(8, 11);

  return {
    barCode,
    amount,
    type: "convenio",
  };
};

export default getBoletoConvenio;
