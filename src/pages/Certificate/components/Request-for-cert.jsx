import api from 'api/api';
import React, { useState } from 'react';

// NutritionCertificateForm.jsx
// توضیحات: یک کامپوننت ری‌اکت ساده به زبان جاوااسکریپت که اطلاعات نام، نام خانوادگی، شماره پاسپورت
// و تاریخ تولد (میلادی) را می‌گیرد و به یک endpoint ارسال می‌کند.
// استفاده: <NutritionCertificateForm endpoint="https://api.example.com/submit" />

export default function CertificateForm({ clientId, type }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passport, setPassport] = useState('');
  const [dob, setDob] = useState(''); // YYYY-MM-DD (تاریخ میلادی)

  const [status, setStatus] = useState('idle'); // idle | submitting | submitted | error
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('نام و نام خانوادگی را وارد کنید.');
      return false;
    }
    if (!passport.trim() && type === 'nutrition') {
      setErrorMsg('شماره پاسپورت را وارد کنید.');
      return false;
    }
    if (!dob) {
      setErrorMsg('تاریخ تولد (میلادی) را وارد کنید.');
      return false;
    }
    // ساده: بررسی فرمت تاریخ YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      setErrorMsg('فرمت تاریخ باید YYYY-MM-DD باشد.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');

    const payload = {
      clientId: clientId,
      clientName: firstName.trim() + ' ' + lastName.trim(),
      passportNumber: passport.trim(),
      certificateType: type === 'participation' ? 'Participation' : 'Nutrition',
      clientDoB: dob,
    };

    try {
      await api.post('/certificate', payload);
      const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
      const payment = await api.post('/zarinpal/rial', {
        amount: type === 'participation' ? 1000000 : 5000000,
        product: type === 'participation' ? 'Certificate_Participation' : 'Certificate_Nutrition',
        name: payload.clientName,
        contact: storedUser.phoneNumber || storedUser.phone || storedUser.email || '',
        userId: clientId,
        location: '',
      });
      if (!payment.data?.success || !payment.data?.url) throw new Error(payment.data?.message || 'درگاه پرداخت در دسترس نیست.');
      setSubmittedData(payload);
      setStatus('submitted');
      window.location.assign(payment.data.url);
    } catch (err) {
      setErrorMsg(err.message || 'خطای غیرمنتظره هنگام ارسال اطلاعات.');
      setStatus('error');
    }
  };

  if (status === 'submitted') {
    return <div className="mx-auto max-w-2xl rounded-3xl border border-[#dce4db] bg-[#f7faf5] p-8 text-center text-[#40534a]"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dff1e3] text-2xl">✓</div><h2 className="text-2xl font-bold">درخواست شما ثبت شد</h2><p className="mt-3 leading-8 text-[#68716d]">اطلاعات شما با موفقیت ارسال شد و پس از بررسی، وضعیت گواهی در همین پنل نمایش داده می‌شود.</p><div className="mt-6 rounded-2xl bg-white p-5 text-right text-sm leading-8"><p><span className="text-[#819087]">نام:</span> {submittedData.clientName}</p><p><span className="text-[#819087]">تاریخ تولد:</span> {submittedData.clientDoB}</p></div></div>;
  }

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="mx-auto max-w-2xl rounded-3xl border border-[#e1e7df] bg-[#fbfcf8] p-5 sm:p-8">
      <div className="mb-8 border-b border-[#e4eae2] pb-6"><p className="text-sm font-semibold text-[#df6b52]">اطلاعات مورد نیاز برای صدور</p><h2 className="mt-2 text-2xl font-bold text-[#20332d]">فرم درخواست گواهی {type === 'nutrition' ? 'تغذیه' : 'شرکت در دوره'}</h2><p className="mt-2 text-sm leading-7 text-[#68716d]">نام و مشخصات را دقیقاً مطابق مدرک شناسایی و به زبان انگلیسی وارد کنید.</p></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm font-bold text-[#31433b]">نام انگلیسی <b className="text-[#df6b52]">*</b></span><input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" autoComplete="given-name" placeholder="مثلاً: Ali" className="h-12 w-full rounded-xl border border-[#dce4db] bg-white px-4 text-left outline-none transition placeholder:text-[#a6b0aa] focus:border-[#df6b52] focus:ring-4 focus:ring-[#df6b52]/10" dir="ltr" /><span className="mt-2 block text-xs text-[#819087]">نام کوچک به انگلیسی</span></label>
        <label className="block"><span className="mb-2 block text-sm font-bold text-[#31433b]">نام خانوادگی انگلیسی <b className="text-[#df6b52]">*</b></span><input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" autoComplete="family-name" placeholder="مثلاً: Ahmadi" className="h-12 w-full rounded-xl border border-[#dce4db] bg-white px-4 text-left outline-none transition placeholder:text-[#a6b0aa] focus:border-[#df6b52] focus:ring-4 focus:ring-[#df6b52]/10" dir="ltr" /><span className="mt-2 block text-xs text-[#819087]">نام خانوادگی به انگلیسی</span></label>
      </div>

            {type === 'nutrition' && (
              <label className="mt-5 block"><span className="mb-2 block text-sm font-bold text-[#31433b]">شماره پاسپورت <b className="text-[#df6b52]">*</b></span><input
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  placeholder="مثلاً: A1234567"
                  type="text"
                  className="h-12 w-full rounded-xl border border-[#dce4db] bg-white px-4 text-left outline-none transition placeholder:text-[#a6b0aa] focus:border-[#df6b52] focus:ring-4 focus:ring-[#df6b52]/10" dir="ltr" /><span className="mt-2 block text-xs text-[#819087]">مثلاً: A1234567</span></label>
            )}
            <label className="mt-5 block"><span className="mb-2 block text-sm font-bold text-[#31433b]">تاریخ تولد میلادی <b className="text-[#df6b52]">*</b></span><input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="h-12 w-full rounded-xl border border-[#dce4db] bg-white px-4 outline-none transition focus:border-[#df6b52] focus:ring-4 focus:ring-[#df6b52]/10" dir="ltr" /><span className="mt-2 block text-xs text-[#819087]">فرمت تاریخ: YYYY-MM-DD</span></label>
            {errorMsg && (
              <div className="mt-5 rounded-xl border border-[#efc0b5] bg-[#fff3ef] px-4 py-3 text-sm text-[#a74735]" role="alert">
                {errorMsg}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-xl bg-[#df6b52] px-6 py-3 font-bold text-white transition hover:bg-[#c95742] disabled:cursor-not-allowed disabled:opacity-50">
                {status === 'submitting' ? 'در حال ارسال...' : 'ثبت و ارسال'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFirstName('');
                  setLastName('');
                  setPassport('');
                  setDob('');
                  setErrorMsg('');
                  setStatus('idle');
                }}
                className="rounded-xl border border-[#dce4db] px-6 py-3 font-semibold text-[#52625a] transition hover:bg-[#edf1e8]">
                پاک کردن
              </button>
            </div>

            {status === 'error' && (
              <div className="mt-3 text-sm text-[#a74735]">
                ارسال با خطا مواجه شد. لطفاً دوباره تلاش کنید یا با پشتیبانی
                تماس بگیرید.
              </div>
            )}
    </form>
  );
}
