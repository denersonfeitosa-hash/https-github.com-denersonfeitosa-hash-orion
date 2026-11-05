/**
 * Converte um valor numérico para texto por extenso em reais (PT-BR)
 */
export function numberToCurrencyWords(amount: number): string {
  if (amount <= 0) return 'Zero reais';

  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  function convertGroup(n: number): string {
    if (n === 0) return '';
    if (n === 100) return 'cem';

    const h = Math.floor(n / 100);
    const rem = n % 100;
    const t = Math.floor(rem / 10);
    const u = rem % 10;

    const parts: string[] = [];

    if (h > 0) parts.push(hundreds[h]);

    if (rem >= 10 && rem < 20) {
      parts.push(teens[rem - 10]);
    } else {
      if (t > 1) parts.push(tens[t]);
      if (u > 0) parts.push(units[u]);
    }

    return parts.join(' e ');
  }

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  const thousands = Math.floor(integerPart / 1000);
  const remainder = integerPart % 1000;

  const resultParts: string[] = [];

  if (thousands > 0) {
    if (thousands === 1) {
      resultParts.push('mil');
    } else {
      resultParts.push(`${convertGroup(thousands)} mil`);
    }
  }

  if (remainder > 0) {
    resultParts.push(convertGroup(remainder));
  }

  let text = resultParts.join(' e ');
  if (integerPart === 1) {
    text += ' real';
  } else if (integerPart > 1) {
    text += ' reais';
  }

  if (decimalPart > 0) {
    const centsText = convertGroup(decimalPart);
    const centsSuffix = decimalPart === 1 ? ' centavo' : ' centavos';
    text += ` e ${centsText}${centsSuffix}`;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}
