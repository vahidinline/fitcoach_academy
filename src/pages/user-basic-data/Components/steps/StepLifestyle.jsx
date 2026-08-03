import React from 'react';
import Select from '../../../../components/ui/Select';
const fieldClass = 'w-full rounded-2xl border border-[#dcd8cf] bg-[#fbfaf6] px-4 text-sm text-[#1c2c29] outline-none transition focus:border-[#df6b52] focus:ring-4 focus:ring-[#df6b52]/10';
export default function StepLifestyle({ data, setData }) {
  return <div className="space-y-6"><div><p className="text-xs font-black text-[#df6b52]">قدم چهارم</p><h3 className="mt-1 text-xl font-black text-[#1c2c29]">زندگی روزمره شما</h3><p className="mt-2 text-sm leading-7 text-[#66736e]">برنامه‌ای مفید است که با ریتم واقعی زندگی شما هماهنگ باشد.</p></div><div className="grid gap-4">
    <Select label="سطح فعالیت روزانه" value={data.activityLevel || ''} onChange={(activityLevel) => setData({ ...data, activityLevel })} options={[{ value: 'low', label: 'کم‌تحرک', description: 'بیشتر روز نشسته‌ام' }, { value: 'medium', label: 'متوسط', description: 'در طول روز حرکت دارم' }, { value: 'high', label: 'فعال', description: 'بیشتر روز در حرکت هستم' }]} />
    <label><span className="mb-2 block text-xs font-bold text-[#52605b]">نکته‌ای که مربی باید بداند (اختیاری)</span><textarea rows="5" placeholder="محدودیت زمانی، شرایط کاری یا هر نکته مؤثر دیگری…" value={data.notes || ''} onChange={(e) => setData({ ...data, notes: e.target.value })} className={`${fieldClass} resize-none py-3 leading-7`} /></label>
  </div></div>;
}
