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

const dietaryStyles = [
  { value: 'omnivore', label: 'همه‌چیزخوار', note: 'محدودیت سبک غذایی ندارم' },
  { value: 'vegetarian', label: 'گیاه‌خوار', note: 'بدون گوشت، مرغ و ماهی' },
  { value: 'vegan', label: 'وگن', note: 'بدون هر نوع فرآورده حیوانی' },
  { value: 'pescatarian', label: 'ماهی‌خوار', note: 'بدون گوشت قرمز و مرغ' },
];

const avoidances = [
  ['red-meat', 'گوشت قرمز'], ['poultry', 'مرغ و گوشت سفید'], ['seafood', 'ماهی و غذاهای دریایی'],
  ['dairy', 'لبنیات'], ['eggs', 'تخم‌مرغ'], ['gluten', 'گلوتن و گندم'],
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
  const selectedAvoidances = Array.isArray(data.foodAvoidances) ? data.foodAvoidances : [];
  const toggleAvoidance = (value) => setData({
    ...data,
    foodAvoidances: selectedAvoidances.includes(value)
      ? selectedAvoidances.filter((item) => item !== value)
      : [...selectedAvoidances, value],
  });

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

      <section className="rounded-[24px] border border-[#e2ded5] bg-[#fbfaf6] p-4 sm:p-5">
        <div>
          <h4 className="text-sm font-black text-[#1c2c29]">الگوی غذایی شما</h4>
          <p className="mt-1 text-xs leading-6 text-[#66736e]">این انتخاب مستقیماً در ساخت رژیم شما لحاظ می‌شود.</p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {dietaryStyles.map((style) => {
            const selected = data.dietaryStyle === style.value;
            return <button key={style.value} type="button" onClick={() => setData({ ...data, dietaryStyle: style.value })} className={`rounded-2xl border p-3 text-right transition ${selected ? 'border-[#df6b52] bg-[#fff4ef] ring-2 ring-[#df6b52]/15' : 'border-[#dedad1] bg-white hover:border-[#c7bcb2]'}`} aria-pressed={selected}>
              <span className="block text-sm font-black text-[#1c2c29]">{style.label}</span><span className="mt-1 block text-[11px] leading-5 text-[#68716d]">{style.note}</span>
            </button>;
          })}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e2ded5] bg-white p-4 sm:p-5">
        <h4 className="text-sm font-black text-[#1c2c29]">چه چیزهایی را نمی‌خورید یا می‌خواهید حذف شوند؟</h4>
        <p className="mt-1 text-xs leading-6 text-[#66736e]">هر تعداد گزینه که لازم است انتخاب کنید؛ حتی اگر با الگوی غذایی بالا هم‌پوشانی دارد.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {avoidances.map(([value, label]) => <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm font-bold transition ${selectedAvoidances.includes(value) ? 'border-[#df6b52] bg-[#fff4ef] text-[#9d442f]' : 'border-[#e2ded5] text-[#52605b]'}`}>
            <input type="checkbox" checked={selectedAvoidances.includes(value)} onChange={() => toggleAvoidance(value)} className="h-4 w-4 accent-[#df6b52]" />{label}
          </label>)}
        </div>
      </section>

      <Select
        label="آیا بیماری، دارو یا محدودیت جسمی دیگری دارید؟"
        placeholder="یکی را انتخاب کنید"
        value={declaredValue}
        onChange={updateDeclaration}
        options={[
          { value: false, label: 'خیر، مورد دیگری ندارم' },
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
