const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export const normalizeDigits = (value) =>
  String(value ?? '')
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/٫/g, '.')
    .replace(/[٬,]/g, '')
    .trim();

export const parseLocalizedNumber = (value) => {
  const normalized = normalizeDigits(value);
  if (normalized === '') return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};
