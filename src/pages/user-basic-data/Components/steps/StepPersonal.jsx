import React from 'react';
import Select from '../../../../components/ui/Select';

const toEnglishDigits = (value) => value.replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)).replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit)).replace(/[^0-9.]/g, '');
const fieldClass = 'h-[52px] w-full rounded-2xl border border-[#dcd8cf] bg-[#fbfaf6] px-4 text-sm text-[#1c2c29] outline-none transition focus:border-[#df6b52] focus:ring-4 focus:ring-[#df6b52]/10';

export default function StepPersonal({ data, setData }) {
  return <div className="space-y-6">
    <div><p className="text-xs font-black tracking-wide text-[#df6b52]">قدم اول</p><h3 className="mt-1 text-xl font-black text-[#1c2c29]">کمی از بدن شما بدانیم</h3><p className="mt-2 text-sm leading-7 text-[#66736e]">این اطلاعات برای شخصی‌سازی پیشنهادهای تمرینی استفاده می‌شود.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">
      {[['age','سن','مثلاً ۳۲'],['height','قد (سانتی‌متر)','مثلاً ۱۶۸']].map(([key,label,placeholder]) => <label key={key}><span className="mb-2 block text-xs font-bold text-[#52605b]">{label}</span><input inputMode="decimal" placeholder={placeholder} value={data[key] || ''} onChange={(e) => setData({ ...data, [key]: toEnglishDigits(e.target.value) })} className={fieldClass} /></label>)}
      <Select className="sm:col-span-2" label="جنسیت" value={data.gender || ''} onChange={(gender) => setData({ ...data, gender })} options={[{ value: 'male', label: 'مرد' }, { value: 'female', label: 'زن' }]} />
    </div>
  </div>;
}
