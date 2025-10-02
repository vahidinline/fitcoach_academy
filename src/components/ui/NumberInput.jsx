import React, { useState, useEffect } from 'react';

const englishToPersianMap = {
  0: '۰',
  1: '۱',
  2: '۲',
  3: '۳',
  4: '۴',
  5: '۵',
  6: '۶',
  7: '۷',
  8: '۸',
  9: '۹',
};

const persianToEnglishMap = Object.fromEntries(
  Object.entries(englishToPersianMap).map(([en, fa]) => [fa, en])
);

function convertEnglishToPersian(value) {
  return value.replace(/[0-9]/g, (d) => englishToPersianMap[d]);
}

function normalizeToEnglish(value) {
  return value.replace(/[۰-۹]/g, (d) => persianToEnglishMap[d]);
}

const PersianNumberInput = ({
  value = '',
  onChange,
  className = '',
  style = {},
}) => {
  const [internalValue, setInternalValue] = useState(
    convertEnglishToPersian(value?.toString() || '')
  );

  // Sync internal value when prop changes
  useEffect(() => {
    setInternalValue(convertEnglishToPersian(value?.toString() || ''));
  }, [value]);

  const handleChange = (e) => {
    let val = e.target.value;

    // Allow only English and Persian digits
    val = val.replace(/[^0-9۰-۹]/g, '');

    const persianVal = convertEnglishToPersian(val);
    setInternalValue(persianVal);

    if (onChange) {
      onChange(normalizeToEnglish(val));
    }
  };

  return (
    <input
      type="text"
      value={internalValue}
      onChange={handleChange}
      dir="rtl"
      className={className}
      style={{ textAlign: 'right', ...style }}
    />
  );
};

export default PersianNumberInput;
