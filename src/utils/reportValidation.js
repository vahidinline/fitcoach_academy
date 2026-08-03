import { parseLocalizedNumber } from './persianNumbers';

const numberRule = (value, label, min, max) => {
  const number = parseLocalizedNumber(value);
  if (number === null) return { error: `${label} را با عدد فارسی یا انگلیسی وارد کنید.` };
  if (number < min || number > max)
    return { error: `${label} باید بین ${min} و ${max} باشد.` };
  return { value: number };
};

export const validateReport = (fields, photos) => {
  const errors = {};
  const normalized = {};
  const rules = [
    ['avgCalories', 'میانگین کالری', 50, 10000],
    ['avgSteps', 'میانگین قدم‌ها', 0, 100000],
    ['proteinPercent', 'درصد پروتئین', 0, 100],
    ['carbsPercent', 'درصد کربوهیدرات', 0, 100],
    ['fatsPercent', 'درصد چربی', 0, 100],
    ['strengthDays', 'روزهای تمرین قدرتی', 0, 7],
    ['cardioDays', 'روزهای تمرین هوازی', 0, 7],
  ];

  rules.forEach(([key, label, min, max]) => {
    const result = numberRule(fields[key], label, min, max);
    if (result.error) errors[key] = result.error;
    else normalized[key] = result.value;
  });

  if (
    normalized.proteinPercent !== undefined &&
    normalized.carbsPercent !== undefined &&
    normalized.fatsPercent !== undefined &&
    normalized.proteinPercent + normalized.carbsPercent + normalized.fatsPercent !== 100
  ) {
    errors.macros = 'مجموع پروتئین، کربوهیدرات و چربی باید دقیقاً ۱۰۰٪ باشد.';
  }

  const note = String(fields.note || '').trim();
  if (note.length > 2000) errors.note = 'یادداشت نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد.';
  if (!Array.isArray(photos)) errors.extraPhotos = 'ساختار تصاویر گزارش معتبر نیست.';
  if (photos?.length > 10) errors.extraPhotos = 'حداکثر ۱۰ تصویر مجاز است.';

  return { valid: Object.keys(errors).length === 0, errors, normalized: { ...normalized, note } };
};
