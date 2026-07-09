interface IBoleto {
  barCode: string;
  amount?: string;
  expirationDate?: string;
  type: "titulo" | "convenio";
}

export default IBoleto;
