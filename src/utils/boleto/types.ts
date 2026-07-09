type BoletoType = "titulo" | "convenio";

type MultiplyFieldSumModulo10Type = 0;
type MultiplyFieldSumModulo11Type = 1;
type MultiplyFieldTituloType = 2;
type MultiplyFieldSumType =
  | MultiplyFieldSumModulo10Type
  | MultiplyFieldSumModulo11Type;
type MultiplyFieldType = MultiplyFieldSumType | MultiplyFieldTituloType;

type ConvenioMoedaModulo10 = "6" | "7";
type ConvenioMoedaModulo11 = "8" | "9";
type ConvenioMoeda = ConvenioMoedaModulo10 | ConvenioMoedaModulo11;

export type {
  BoletoType,
  MultiplyFieldSumModulo10Type,
  MultiplyFieldSumModulo11Type,
  MultiplyFieldTituloType,
  MultiplyFieldSumType,
  MultiplyFieldType,
  ConvenioMoedaModulo10,
  ConvenioMoedaModulo11,
  ConvenioMoeda,
};
