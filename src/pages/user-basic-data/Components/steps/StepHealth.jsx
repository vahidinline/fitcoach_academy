import React from 'react';
import Select from '../../../../components/ui/Select';

const textareaClass = 'min-h-28 w-full resize-y rounded-2xl border border-[#dcd8cf] bg-[#fbfaf6] px-4 py-3 text-sm leading-7 text-[#1c2c29] outline-none transition placeholder:text-[#a1aaa6] focus:border-[#df6b52] focus:ring-4 focus:ring-[#df6b52]/10';
const healthFields = [
  { key: 'medicalConditions', label: 'بیماری یا وضعیت پزشکی خاص', placeholder: 'مانند دیابت، مشکلات قلبی، تیروئید، فشار خون، سابقه جراحی و…', legacyKey: 'illness' },
  { key: 'medications', label: 'داروها و مکمل‌های مصرفی', placeholder: 'نام دارو یا مکمل، دوز و تعداد دفعات مصرف را در صورت اطلاع بنویسید.', legacyKey: 'medication' },
  { key: 'physicalLimitations', label: 'درد، آسیب یا محدودیت حرکتی', placeholder: 'مانند زانو درد، دیسک کمر، محدودیت شانه یا حرکاتی که نباید انجام دهید.', legacyKey: 'pain' },
  { key: 'disabilities', label: 'معلولیت یا شرایط جسمی ویژه', placeholder: 'هر شرایطی که لازم است مربی برای طراحی برنامه در نظر بگیرد.' },
  { key: 'foodAllergies', label: 'حساسیت یا عدم تحمل غذایی', placeholder: 'مانند حساسیت به مغزها، گلوتن، لاکتوز و…' },
  { key: 'dietaryRestrictions', label: 'پرهیزها و ملاحظات غذایی', placeholder: 'مانند گیاه‌خواری، پرهیز مذهبی، غذاهای ممنوع یا رژیم تجویزشده توسط پزشک.' },
];

export default function StepHealth({ data, setData }) {
  const hasStoredDetails = healthFields.some(({ key, legacyKey }) => Boolean(data[key] || (legacyKey && data[legacyKey]))) || Boolean(data.healthNotes);
  const declaredValue = hasStoredDetails ? true : Object.prototype.hasOwnProperty.call(data, 'hasHealthConsiderations') ? data.hasHealthConsiderations : '';

  const updateDeclaration = (hasHealthConsiderations) => {
    if (hasHealthConsiderations) return setData({ ...data, hasHealthConsiderations });
    const cleared = { ...data, hasHealthConsiderations: false, healthNotes: '', illness: '', medication: '', pain: '' };
    healthFields.forEach(({ key }) => { cleared[key] = ''; });
    setData(cleared);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black text-[#df6b52]">سلامت و ایمنی</p>
        <h3 className="mt-1 text-xl font-black text-[#1c2c29]">ملاحظات مهم برای مربی</h3>
        <p className="mt-2 text-sm leading-7 text-[#66736e]">برای ایمن‌تر و دقیق‌تر شدن برنامه، هر موردی را که ممکن است روی تغذیه یا تمرین اثر بگذارد اعلام کنید.</p>
      </div>

      <div className="rounded-[24px] border border-[#d8dfd8] bg-[#eef3ed] p-4 text-xs leading-7 text-[#52605b]">
        این اطلاعات محرمانه و صرفاً برای شخصی‌سازی برنامه استفاده می‌شود. این فرم جایگزین تشخیص یا توصیه پزشک نیست.
      </div>

      <Select
        label="آیا بیماری، دارو، محدودیت جسمی یا ملاحظه غذایی خاصی دارید؟"
        placeholder="یکی را انتخاب کنید"
        value={declaredValue}
        onChange={updateDeclaration}
        options={[
          { value: false, label: 'خیر، مورد خاصی ندارم' },
          { value: true, label: 'بله، لازم است توضیح بدهم' },
        ]}
      />

      {declaredValue === true && (
        <div className="grid gap-4 sm:grid-cols-2">
          {healthFields.map(({ key, label, placeholder, legacyKey }) => (
            <label key={key}>
              <span className="mb-2 block text-xs font-bold text-[#52605b]">{label}</span>
              <textarea maxLength={2000} value={data[key] ?? (legacyKey ? data[legacyKey] : '') ?? ''} onChange={(event) => setData({ ...data, [key]: event.target.value })} placeholder={placeholder} className={textareaClass} />
            </label>
          ))}
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-bold text-[#52605b]">توضیحات تکمیلی برای مربی</span>
            <textarea maxLength={2000} value={data.healthNotes || ''} onChange={(event) => setData({ ...data, healthNotes: event.target.value })} placeholder="هر نکته دیگری که در گزینه‌های بالا پوشش داده نشده است…" className={textareaClass} />
          </label>
        </div>
      )}
    </div>
  );
}
