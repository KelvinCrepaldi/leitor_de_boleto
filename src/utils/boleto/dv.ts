const multiplyFieldModulo10 = (field: string[]): number => {
  let count = 2;

  const multiplied = field.map((digit) => {
    const product = parseInt(digit, 10) * count;
    count = count === 2 ? 1 : 2;

    const productText = product.toString();
    if (productText.length === 2) {
      return (
        parseInt(productText[0], 10) + parseInt(productText[1], 10)
      );
    }

    return product;
  });

  return multiplied.reduce((sum, number) => sum + number, 0);
};

const multiplyFieldModulo11 = (field: string[]): number => {
  let count = 2;

  const multiplied = field.map((digit) => {
    const product = parseInt(digit, 10) * count;
    count++;
    if (count === 10) {
      count = 2;
    }
    return product;
  });

  return multiplied.reduce((sum, number) => sum + number, 0);
};

const multiplyFieldTitulo = (field: string[]): number[] => {
  let count = 2;

  return field.map((digit) => {
    const product = parseInt(digit, 10) * count;
    count = count === 2 ? 1 : 2;

    const productText = product.toString();
    if (productText.length === 2) {
      return (
        parseInt(productText[0], 10) + parseInt(productText[1], 10)
      );
    }

    return product;
  });
};

const calculateDvModulo10 = (sum: number): number => {
  const rest = sum % 10;
  if (rest === 0) return 0;
  return 10 - rest;
};

const calculateDvModulo11Arrecadacao = (sum: number): number => {
  const rest = sum % 11;
  if (rest <= 1) return 0;
  if (rest === 10) return 1;
  return 11 - rest;
};

export {
  multiplyFieldModulo10,
  multiplyFieldModulo11,
  multiplyFieldTitulo,
  calculateDvModulo10,
  calculateDvModulo11Arrecadacao,
};
