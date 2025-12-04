import React, { useEffect, useState } from 'react';
import api from 'api/api';
import ExtraPhotosUpload from './ExtraPhotosUpload';
import ReportQuota from './ReportQuota';
import { canSubmitToday } from 'utils/canSubmitReport';

const generateOptions = (step = 5) => {
  const arr = [];
  for (let i = 0; i <= 100; i += step) arr.push(i);
  return arr;
};

const daysOptions = [...Array(8).keys()]; // 0–7 days

const CalorieTrackingSection = () => {
  const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id;
  const [extraPhotos, setExtraPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [createdReport, setCreatedReport] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [periodType, setPeriodType] = useState('weekly');

  const [fields, setFields] = useState({
    avgCalories: '',
    proteinPercent: 30,
    carbsPercent: 50,
    fatsPercent: 20,
    avgSteps: '',
    strengthDays: 0,
    cardioDays: 0,
    note: '',
  });

  const macroOptions = generateOptions(5);
  const allowed = canSubmitToday();

  if (!allowed) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          ⛔ امکان ارسال گزارش امروز فعال نیست
        </h2>
        <p className="text-gray-700">
          شما فقط در روزهای دوشنبه و تا ساعت ۱۲ شب می‌توانید گزارش ارسال کنید.
        </p>
      </div>
    );
  }

  const computePeriod = () => {
    const end = new Date();
    const start = new Date();

    if (periodType === 'weekly') start.setDate(end.getDate() - 6);
    else start.setDate(end.getDate() - 30);

    return {
      periodStart: start.toISOString().split('T')[0],
      periodEnd: end.toISOString().split('T')[0],
    };
  };

  const submitReport = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSuccessMessage(null);

    const macroSum =
      Number(fields.proteinPercent) +
      Number(fields.carbsPercent) +
      Number(fields.fatsPercent);

    if (macroSum !== 100) {
      alert('مجموع درصد باید ۱۰۰ باشد');
      setSubmitting(false);
      return;
    }

    const { periodStart, periodEnd } = computePeriod();

    const payload = {
      userId,
      periodType,
      periodStart,
      periodEnd,
      avgCalories: Number(fields.avgCalories),
      proteinPercent: Number(fields.proteinPercent),
      carbsPercent: Number(fields.carbsPercent),
      fatsPercent: Number(fields.fatsPercent),
      avgSteps: Number(fields.avgSteps),
      strengthDays: Number(fields.strengthDays),
      cardioDays: Number(fields.cardioDays),
      note: fields.note,
      extraPhotos,
    };

    try {
      const res = await api.post('/report', payload);

      setCreatedReport(res.data.report); // ذخیره گزارش برای نمایش
      setSuccessMessage('گزارش شما با موفقیت ثبت شد');

      // پاک کردن فرم
      setFields({
        avgCalories: '',
        proteinPercent: 30,
        carbsPercent: 50,
        fatsPercent: 20,
        avgSteps: '',
        strengthDays: 0,
        cardioDays: 0,
        note: '',
      });
      setExtraPhotos([]);
    } catch (err) {
      setSuccessMessage('❌ مشکلی در ارسال گزارش پیش آمد.');
    }

    setSubmitting(false);
  };

  const loadSubscription = async () => {
    try {
      const res = await api.get(`/subscription/active/${userId}`);
      const sub = res.data.subscription;

      if (!sub) {
        setSubscription(null);
        return;
      }

      const remainingReports = sub.reportLimit - sub.reportsUsed;

      setSubscription({
        type: sub.productType,
        start: sub.startsAt,
        end: sub.expiresAt,
        limit: sub.reportLimit,
        used: sub.reportsUsed,
        remaining: remainingReports,
        unlimitedTime: sub.expiresAt === null,
      });

      setRemaining(remainingReports);
    } catch (err) {
      console.error('Subscription error:', err);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  return (
    <div>
      <ReportQuota
        subscription={subscription}
        remaining={remaining}
        onBuyClick={() => {
          // نمایش صفحه خرید، یا باز کردن modal
          console.log('User wants to buy more reports!');
        }}
      />
      {/* نمایش دکمه‌ها فقط در 1 ساعت اول */}
      {Date.now() < new Date(createdReport.editableUntil).getTime() ? (
        <>
          <p className="text-xs text-green-600">
            ⏳ می‌توانید تا یک ساعت این گزارش را ویرایش یا حذف کنید.
          </p>

          <button
            onClick={() => console.log('edit')}
            className="w-full bg-yellow-500 text-white p-2 rounded-xl">
            ویرایش گزارش
          </button>

          <button
            onClick={async () => {
              if (!confirm('گزارش حذف شود؟')) return;
              await api.delete(`/report/${createdReport._id}`);
              setCreatedReport(null);
              setSuccessMessage('گزارش حذف شد.');
            }}
            className="w-full bg-red-500 text-white p-2 rounded-xl">
            حذف گزارش
          </button>
        </>
      ) : (
        <p className="text-xs text-gray-500">
          ⛔ زمان ویرایش این گزارش تمام شده است
        </p>
      )}
      <form onSubmit={submitReport} className="space-y-5 p-4">
        {/* PERIOD TOGGLE */}
        <div className="flex gap-2">
          {subscription?.type === 'pro' ? (
            <button
              disabled
              type="button"
              onClick={() => setPeriodType('weekly')}
              className={`flex-1 py-2 rounded-xl transition ${
                periodType === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
              ۷ روز اخیر
            </button>
          ) : (
            <button
              disabled
              type="button"
              onClick={() => setPeriodType('monthly')}
              className={`flex-1 py-2 rounded-xl transition ${
                periodType === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
              ۳۰ روز اخیر
            </button>
          )}
        </div>

        {/* CALORIES */}
        <div>
          <label>کالری میانگین</label>
          <input
            type="number"
            className="input-box"
            value={fields.avgCalories}
            onChange={(e) =>
              setFields({ ...fields, avgCalories: e.target.value })
            }
            required
          />
        </div>

        {/* MACROS */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label>پروتئین (%)</label>
            <select
              className="input-box"
              value={fields.proteinPercent}
              onChange={(e) =>
                setFields({ ...fields, proteinPercent: Number(e.target.value) })
              }>
              {macroOptions.map((m) => (
                <option key={m} value={m}>
                  {m}٪
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>کرب (%)</label>
            <select
              className="input-box"
              value={fields.carbsPercent}
              onChange={(e) =>
                setFields({ ...fields, carbsPercent: Number(e.target.value) })
              }>
              {macroOptions.map((m) => (
                <option key={m} value={m}>
                  {m}٪
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>چربی (%)</label>
            <select
              className="input-box"
              value={fields.fatsPercent}
              onChange={(e) =>
                setFields({ ...fields, fatsPercent: Number(e.target.value) })
              }>
              {macroOptions.map((m) => (
                <option key={m} value={m}>
                  {m}٪
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* STEPS */}
        <div>
          <label>میانگین قدم‌ها</label>
          <input
            type="number"
            className="input-box"
            value={fields.avgSteps}
            onChange={(e) =>
              setFields({ ...fields, avgSteps: Number(e.target.value) })
            }
            required
          />
        </div>

        {/* DAYS SELECT */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>روزهای تمرین قدرتی</label>
            <select
              className="input-box"
              value={fields.strengthDays}
              onChange={(e) =>
                setFields({ ...fields, strengthDays: Number(e.target.value) })
              }>
              {daysOptions.map((d) => (
                <option key={d} value={d}>
                  {d} روز
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>روزهای تمرین هوازی</label>
            <select
              className="input-box"
              value={fields.cardioDays}
              onChange={(e) =>
                setFields({ ...fields, cardioDays: Number(e.target.value) })
              }>
              {daysOptions.map((d) => (
                <option key={d} value={d}>
                  {d} روز
                </option>
              ))}
            </select>
          </div>
        </div>
        <ExtraPhotosUpload maxFiles={10} onChange={setExtraPhotos} />

        {/* NOTE */}
        <div>
          <label>یادداشت</label>
          <textarea
            className="input-box"
            value={fields.note}
            onChange={(e) => setFields({ ...fields, note: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-xl font-semibold text-white transition
    ${
      submitting
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700'
    }
  `}>
          {submitting ? 'در حال ارسال...' : 'ارسال گزارش'}
        </button>
      </form>
      {submitting && (
        <div className="text-center p-3 text-blue-600 font-medium">
          لطفاً صبر کنید، گزارش در حال ارسال است...
        </div>
      )}

      {successMessage && (
        <div className="text-center p-3 bg-green-100 text-green-700 rounded-xl">
          {successMessage}
        </div>
      )}
      {createdReport && (
        <div className="p-4 bg-white rounded-xl shadow space-y-3 mt-4">
          <h3 className="font-bold text-lg">📄 گزارش ثبت‌شده</h3>

          <p>
            نوع گزارش: {createdReport.type === 'weekly' ? 'هفتگی' : 'ماهانه'}
          </p>
          <p>از: {createdReport.periodStart}</p>
          <p>تا: {createdReport.periodEnd}</p>

          <p className="text-sm text-gray-600">
            کالری میانگین: {createdReport.avgCalories}
          </p>

          {createdReport.extraPhotos?.length > 0 && (
            <div>
              <h4 className="font-bold text-sm mt-3">تصاویر ارسال‌شده:</h4>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {createdReport.extraPhotos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={async () => {
              if (!confirm('گزارش حذف شود؟')) return;

              await api.delete(`/report/${createdReport._id}`);
              setCreatedReport(null);
              setSuccessMessage('گزارش حذف شد.');
            }}
            className="mt-3 w-full bg-red-500 text-white p-2 rounded-xl">
            حذف گزارش
          </button>
        </div>
      )}
    </div>
  );
};

export default CalorieTrackingSection;
