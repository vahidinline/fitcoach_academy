import React from 'react';
import Select from '../../../../components/ui/Select';
export default function StepTraining({ data, setData }) {
  return <div className="space-y-6"><div><p className="text-xs font-black text-[#df6b52]">قدم دوم</p><h3 className="mt-1 text-xl font-black text-[#1c2c29]">ریتم تمرین شما</h3><p className="mt-2 text-sm leading-7 text-[#66736e]">سطح واقعی خودتان را انتخاب کنید؛ اینجا پاسخ درست یا غلطی وجود ندارد.</p></div><div className="grid gap-4">
    <Select label="سابقه ورزشی" value={data.trainingExperience || ''} onChange={(trainingExperience) => setData({ ...data, trainingExperience })} options={[{ value: 'none', label: 'تازه شروع کرده‌ام' }, { value: 'beginner', label: 'کمتر از ۶ ماه' }, { value: 'intermediate', label: '۶ ماه تا ۲ سال' }, { value: 'advanced', label: 'بیشتر از ۲ سال' }]} />
    <Select label="تعداد روزهای تمرین در هفته" value={data.trainingDays ?? ''} onChange={(trainingDays) => setData({ ...data, trainingDays })} options={[0,1,2,3,4,5,6,7].map((day) => ({ value: day, label: day === 0 ? 'فعلاً تمرین نمی‌کنم' : `${day} روز` }))} />
  </div></div>;
}
