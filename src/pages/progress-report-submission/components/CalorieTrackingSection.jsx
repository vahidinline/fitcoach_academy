import React, { useEffect, useState } from 'react';
import api from 'api/api';
import ExtraPhotosUpload from './ExtraPhotosUpload';
import ReportQuota from './ReportQuota';
import { useNavigate } from 'react-router-dom';
import { normalizeDigits } from 'utils/persianNumbers';
import { validateReport } from 'utils/reportValidation';
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
  const [reportPermission, setReportPermission] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const periodType = 'weekly';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isMonday = canSubmitToday();
  const [errors, setErrors] = useState({});
  const [uploadsPending, setUploadsPending] = useState(false);
  const navigate = useNavigate();
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

    if (uploadsPending) {
      setErrors({ extraPhotos: 'تا پایان آپلود تصاویر صبر کنید یا تصویر ناموفق را دوباره ارسال کنید.' });
      return;
    }

    setSubmitting(true);
    setSuccessMessage(null);

    const validation = validateReport(fields, extraPhotos);
    setErrors(validation.errors);
    if (!validation.valid) {
      setSuccessMessage('لطفاً خطاهای فرم را برطرف کنید.');
      setSubmitting(false);
      return;
    }

    const { periodStart, periodEnd } = computePeriod();

    const payload = {
      userId,
      periodType,
      periodStart,
      periodEnd,
      timeZone,
      ...validation.normalized,
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
      await loadSubscription();
      navigate('/progress-report-submission?tab=notes');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message;
      setSuccessMessage(`❌ ${message || 'مشکلی در ارسال گزارش پیش آمد. دوباره تلاش کنید.'}`);
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
      const permissionRes = await api.get(
        `/subscription/report-permission/${userId}?timeZone=${encodeURIComponent(timeZone)}`,
      );
      setReportPermission(permissionRes.data);
    } catch (err) {
      console.error('Subscription error:', err);
      setReportPermission(null);
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

      {!isMonday && (
        <div className="m-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-xl text-center">
          ارسال گزارش غیرفعال است. پنجره ارسال فقط روز دوشنبه از ساعت ۰۰:۰۰ تا
          ۲۳:۵۹ به وقت محلی شما باز می‌شود.
        </div>
      )}

      {reportPermission && !reportPermission.allowed && (
        <div className="m-4 p-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl text-sm">
          {reportPermission.message}
          {reportPermission.nextReportAt && (
            <span className="block mt-1">
              زمان مجاز بعدی:{' '}
              {new Date(reportPermission.nextReportAt).toLocaleString('fa-IR')}
            </span>
          )}
        </div>
      )}

      <form onSubmit={submitReport} className="space-y-5 p-4">
        {/* PERIOD TOGGLE */}
        <div className="flex gap-2">
          <button
            disabled
            type="button"
            className="flex-1 py-2 rounded-xl bg-blue-600 text-white">
            گزارش ۷ روز اخیر
          </button>
        </div>

        {/* CALORIES */}
        <div>
          <label>کالری میانگین</label>
          <input
            type="text"
            inputMode="numeric"
            className="input-box"
            value={fields.avgCalories}
            onChange={(e) =>
              setFields({ ...fields, avgCalories: normalizeDigits(e.target.value) })
            }
          />
          {errors.avgCalories && <p className="text-red-600 text-xs mt-1">{errors.avgCalories}</p>}
        </div>
        {errors.macros && <p className="text-red-600 text-xs">{errors.macros}</p>}

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
            type="text"
            inputMode="numeric"
            className="input-box"
            value={fields.avgSteps}
            onChange={(e) =>
              setFields({ ...fields, avgSteps: normalizeDigits(e.target.value) })
            }
          />
          {errors.avgSteps && <p className="text-red-600 text-xs mt-1">{errors.avgSteps}</p>}
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
        <ExtraPhotosUpload
          maxFiles={10}
          onChange={setExtraPhotos}
          onStatusChange={setUploadsPending}
        />
        {errors.extraPhotos && <p className="text-red-600 text-xs">{errors.extraPhotos}</p>}

        {/* NOTE */}
        <div>
          <label>یادداشت</label>
          <textarea
            className="input-box"
            value={fields.note}
            onChange={(e) => setFields({ ...fields, note: e.target.value })}
          />
          {errors.note && <p className="text-red-600 text-xs mt-1">{errors.note}</p>}
        </div>

        <button
          type="submit"
          disabled={
            submitting ||
            uploadsPending ||
            remaining <= 0 ||
            reportPermission?.allowed === false ||
            !isMonday
          }
          className={`w-full py-3 rounded-xl font-semibold text-white transition
    ${
      submitting || uploadsPending
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700'
    }
  `}>
          {uploadsPending
            ? 'در حال آپلود تصاویر...'
            : submitting
              ? 'در حال ارسال...'
              : 'ارسال گزارش'}
        </button>
      </form>
      {submitting && (
        <div className="text-center p-3 text-blue-600 font-medium">
          لطفاً صبر کنید، گزارش در حال ارسال است...
        </div>
      )}
      {successMessage && (
        <div
          className={`text-center p-3 rounded-xl ${
            successMessage.startsWith('❌')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
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

          {/* <button
            onClick={async () => {
              if (!confirm('گزارش حذف شود؟')) return;

              await api.delete(`/report/${createdReport._id}`);
              setCreatedReport(null);
              setSuccessMessage('گزارش حذف شد.');
            }}
            className="mt-3 w-full bg-red-500 text-white p-2 rounded-xl">
            حذف گزارش
          </button> */}
        </div>
      )}
    </div>
  );
};

export default CalorieTrackingSection;
