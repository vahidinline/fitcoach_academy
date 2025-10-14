import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import ContextualHeader from 'components/ui/ContextualHeader';
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
    if (!passport.trim()) {
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
      certificateType: 'Nutrition',
      clientDoB: dob,
    };

    try {
      const res = await api.post('/certificate', payload);
      setSubmittedData(payload);
      setStatus('submitted');
      console.log('Response:', res.data);
    } catch (err) {
      setErrorMsg(err.message || 'خطای غیرمنتظره هنگام ارسال اطلاعات.');
      setStatus('error');
    }
  };

  if (status === 'submitted') {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: 20,
          fontFamily: 'sans-serif',
        }}>
        <h2 style={{ textAlign: 'center' }}>اطلاعات ثبت شد</h2>
        <p style={{ textAlign: 'center' }}>
          اطلاعات شما ثبت شده و در حال بررسی است.
        </p>

        <div
          style={{
            marginTop: 16,
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 12,
          }}>
          <h3>مشخصات ثبت‌شده</h3>
          <dl>
            <dt>نام و نام خانوادگی</dt>
            <dd>{submittedData.clientName}</dd>
            <dt>شماره پاسپورت</dt>
            <dd>{submittedData.passportNumber}</dd>
            <dt>تاریخ تولد (میلادی)</dt>
            <dd>{submittedData.clientDoB}</dd>
          </dl>
        </div>

        <p style={{ marginTop: 12, color: '#555' }}>
          در صورت نیاز به‌روزرسانی اطلاعات، لطفاً با پشتیبانی تماس بگیرید.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader />

      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: 700,
              margin: '0 auto',
              padding: 20,
              fontFamily: 'sans-serif',
            }}
            dir="rtl">
            <h2 style={{ textAlign: 'center' }}>فرم صدور گواهی {type}</h2>

            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend className="fieldset-legend">نام </legend>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                className="input"
              />
              <p className="label">
                {type === 'nutrition'
                  ? ` لطفا نام خود را به انگلیسی وارد کنید `
                  : ''}
              </p>
            </fieldset>

            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend className="fieldset-legend">نام خانوادگی</legend>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                className="input"
              />
              <p className="label">
                {type === 'nutrition'
                  ? ` لطفا نام خانوادگی خود را به انگلیسی وارد کنید `
                  : ''}
              </p>
            </fieldset>

            {type === 'nutrition' && (
              <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">شماره پاسپورت </legend>
                <input
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  placeholder="مثلاً: A1234567"
                  type="text"
                  className="input"
                />
                <p className="label"></p>
              </fieldset>
            )}
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend className="fieldset-legend">تاریخ تولد (میلادی)</legend>

              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="input"
              />
              <small style={{ color: '#666' }}>
                توجه: تاریخ باید به میلادی (فرمت YYYY-MM-DD) باشد.
              </small>
            </fieldset>
            {errorMsg && (
              <div style={{ marginTop: 12, color: '#a00' }} role="alert">
                {errorMsg}
              </div>
            )}

            <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  padding: '10px 16px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}>
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
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}>
                پاک کردن
              </button>
            </div>

            {status === 'error' && (
              <div style={{ marginTop: 12, color: '#a00' }}>
                ارسال با خطا مواجه شد. لطفاً دوباره تلاش کنید یا با پشتیبانی
                تماس بگیرید.
              </div>
            )}
          </form>
        </div>
      </div>
      <BottomTabNavigation />
    </div>
  );
}
