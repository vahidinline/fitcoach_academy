import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import api from 'api/api';
import Icon from '../../../components/AppIcon';
import StepPersonal from './steps/StepPersonal';
import StepTraining from './steps/StepTraining';
import StepGoal from './steps/StepGoal';
import StepLifestyle from './steps/StepLifestyle';
import StepHealth from './steps/StepHealth';
import StepFinish from './steps/StepFinish';
import { useNavigate } from 'react-router-dom';

const stepMeta = [
  ['اطلاعات بدنی', 'UserRound'], ['سابقه تمرین', 'Dumbbell'], ['هدف شما', 'Target'], ['سلامت', 'ShieldPlus'], ['سبک زندگی', 'HeartPulse'], ['مرور نهایی', 'CheckCircle2'],
];

export default function AssessmentWizard() {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('userData') || '{}').id;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const containerRef = useRef(null);

  const loadAssessment = async () => {
    try {
      const res = await api.get(`/ShapeUpAssessment/${userId}`);
      if (res.data?.data) { setForm(res.data.data); setIsEditing(true); } else setIsEditing(false);
    } catch { setIsEditing(false); }
  };
  useEffect(() => { if (userId) loadAssessment(); }, [userId]);
  useEffect(() => { if (containerRef.current) gsap.fromTo(containerRef.current, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }); }, [step]);

  const submit = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      if (isEditing) await api.put(`/ShapeUpAssessment/${userId}`, form);
      else await api.post('/ShapeUpAssessment', { userId, ...form });
      setFeedback({ type: 'success', text: 'اطلاعات اولیه با موفقیت ذخیره شد؛ در حال بازگشت به داشبورد…' });
      await loadAssessment();
      window.setTimeout(() => navigate('/user-dashboard'), 1200);
    } catch (error) { console.error(error); setFeedback({ type: 'error', text: error.response?.data?.error || 'خطا در ذخیره اطلاعات اولیه. دوباره تلاش کنید.' }); }
    finally { setSaving(false); }
  };

  const steps = [
    <StepPersonal data={form} setData={setForm} />, <StepTraining data={form} setData={setForm} />,
    <StepGoal data={form} setData={setForm} />, <StepHealth data={form} setData={setForm} />, <StepLifestyle data={form} setData={setForm} />,
    <StepFinish data={form} isEditing={isEditing} />,
  ];

  const next = () => {
    if (step === 3) {
      if (!form.dietaryStyle) {
        alert('لطفاً الگوی غذایی خود را انتخاب کنید تا رژیم متناسب با آن تنظیم شود.');
        return;
      }
      const hasDeclaration = Object.prototype.hasOwnProperty.call(form, 'hasHealthConsiderations');
      const hasHealthDetails = ['medicalConditions', 'medications', 'physicalLimitations', 'disabilities', 'foodAllergies', 'dietaryRestrictions', 'healthNotes', 'illness', 'medication', 'pain']
        .some((field) => typeof form[field] === 'string' && form[field].trim());
      if (!hasDeclaration && !hasHealthDetails) {
        alert('لطفاً مشخص کنید آیا ملاحظه سلامتی یا غذایی خاصی دارید.');
        return;
      }
      if (form.hasHealthConsiderations === true && !hasHealthDetails) {
        alert('لطفاً حداقل یکی از ملاحظات سلامتی یا غذایی را توضیح دهید.');
        return;
      }
    }
    setStep((current) => current + 1);
  };

  return (
    <div className="mx-auto max-w-3xl" dir="rtl">
      <section className="academy-surface overflow-hidden p-0">
        <div className="border-b border-[#e2ded5] bg-[#fbfaf6] px-5 py-6 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="academy-kicker">شناخت بهتر مسیر</p><h2 className="mt-2 text-2xl font-black text-[#1c2c29]">اطلاعات اولیه</h2></div>
            <span className="rounded-full bg-[#1c2c29] px-3 py-1.5 text-xs font-bold text-white">مرحله {step + 1} از {steps.length}</span>
          </div>
          <div className="mt-6 grid grid-cols-6 gap-2">
            {stepMeta.map(([label, icon], index) => (
              <button key={label} type="button" onClick={() => index <= step && setStep(index)} className="group text-center" aria-label={label}>
                <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full transition ${index <= step ? 'bg-[#df6b52] text-white' : 'bg-[#e8e4db] text-[#929b97]'}`}><Icon name={index < step ? 'Check' : icon} size={16} /></span>
                <span className={`mt-2 hidden text-[10px] font-bold sm:block ${index === step ? 'text-[#1c2c29]' : 'text-[#87928e]'}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div ref={containerRef}>{steps[step]}</div>
          {feedback && <p className={`mt-5 rounded-2xl p-3 text-xs font-bold ${feedback.type === 'success' ? 'bg-[#dce6df] text-[#29483e]' : 'bg-red-50 text-red-700'}`}>{feedback.text}</p>}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#e6e1d8] pt-5">
            <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="academy-secondary-button disabled:invisible"><Icon name="ArrowRight" size={17} /> قبلی</button>
            {step < steps.length - 1 ? (
              <button onClick={next} className="academy-primary-button">مرحله بعد <Icon name="ArrowLeft" size={17} /></button>
            ) : (
              <button onClick={submit} disabled={saving} className="academy-primary-button disabled:opacity-60">{saving ? 'در حال ذخیره…' : isEditing ? 'ذخیره تغییرات' : 'ثبت نهایی'}</button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
