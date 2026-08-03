import React, { useEffect, useState } from 'react';
import api from 'api/api';
import ExtraPhotosUpload from './ExtraPhotosUpload';
import ReportQuota from './ReportQuota';
import { useNavigate } from 'react-router-dom';
import { normalizeDigits } from 'utils/persianNumbers';
import { validateReport } from 'utils/reportValidation';
import { canSubmitToday } from 'utils/canSubmitReport';
import Select from '../../../components/ui/Select';
import { CalendarClock, LockKeyhole, ShieldAlert } from 'lucide-react';
import { getNextMondayStart } from 'utils/canSubmitReport';

const generateOptions = (step = 5) => {
  const arr = [];
  for (let i = 0; i <= 100; i += step) arr.push(i);
  return arr;
};

const daysOptions = [...Array(8).keys()]; // 0–7 days

const CalorieTrackingSection = ({ submissionWindowOpen }) => {
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
  const isMonday = submissionWindowOpen ?? canSubmitToday();
  const [permissionLoading, setPermissionLoading] = useState(isMonday);
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

    if (!isMonday || reportPermission?.allowed !== true) {
      setSuccessMessage('❌ پنجره ارسال گزارش در حال حاضر بسته است.');
      return;
    }

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
    setPermissionLoading(true);
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
    } finally {
      setPermissionLoading(false);
    }
  };

  useEffect(() => {
    if (isMonday) loadSubscription();
    else {
      setReportPermission(null);
      setPermissionLoading(false);
    }
  }, [isMonday]);

  if (!isMonday) {
    const nextMonday = getNextMondayStart();
    return (
      <section className="flex min-h-[28rem] flex-col items-center justify-center rounded-[28px] border border-[#d9c6a8] bg-[#f7eddd] px-5 py-12 text-center">
        <span className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/75 text-[#765329] shadow-sm">
          <CalendarClock size={34} />
          <span className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[#1c2c29] text-white"><LockKeyhole size={15} /></span>
        </span>
        <p className="academy-kicker mt-7 !text-[#a26036]">پنجره ارسال بسته است</p>
        <h3 className="mt-2 text-2xl font-black text-[#2b3633]">گزارش هفتگی فقط دوشنبه‌ها ارسال می‌شود</h3>
        <p className="mt-3 max-w-md text-sm leading-8 text-[#6e6254]">فرم از ساعت ۰۰:۰۰ تا ۲۳:۵۹ روز دوشنبه، بر اساس منطقه زمانی دستگاه شما فعال خواهد شد.</p>
        <div className="mt-7 rounded-2xl border border-[#d9c6a8] bg-white/55 px-5 py-3 text-xs font-bold leading-6 text-[#765329]">
          نوبت بعدی: {nextMonday.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })}، ساعت ۰۰:۰۰
        </div>
        <p className="mt-4 text-[11px] text-[#8a7a68]">منطقه زمانی تشخیص‌داده‌شده: {timeZone}</p>
      </section>
    );
  }

  if (permissionLoading) {
    return <div className="flex min-h-[24rem] items-center justify-center"><div className="text-center"><span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-[#1c2c29]/15 border-t-[#df6b52]" /><p className="mt-4 text-sm font-bold text-[#66736e]">در حال بررسی امکان ارسال گزارش…</p></div></div>;
  }

  if (reportPermission?.allowed !== true) {
    return (
      <section className="flex min-h-[24rem] flex-col items-center justify-center rounded-[28px] border border-[#e4b8ae] bg-[#fff2ef] px-5 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#b84f3a] shadow-sm"><ShieldAlert size={28} /></span>
        <h3 className="mt-5 text-xl font-black text-[#2b3633]">امکان ارسال گزارش وجود ندارد</h3>
        <p className="mt-3 max-w-md text-sm leading-8 text-[#79625d]">{reportPermission?.message || 'مجوز ارسال گزارش از سرور دریافت نشد. کمی بعد دوباره تلاش کنید.'}</p>
        {reportPermission?.nextReportAt && <p className="mt-4 rounded-xl bg-white/70 px-4 py-2 text-xs font-bold text-[#9f4f3e]">زمان مجاز بعدی: {new Date(reportPermission.nextReportAt).toLocaleString('fa-IR')}</p>}
      </section>
    );
  }

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
          <Select label="پروتئین (%)" value={fields.proteinPercent} onChange={(proteinPercent) => setFields({ ...fields, proteinPercent })} options={macroOptions.map((amount) => ({ value: amount, label: `${amount}٪` }))} />

          <Select label="کربوهیدرات (%)" value={fields.carbsPercent} onChange={(carbsPercent) => setFields({ ...fields, carbsPercent })} options={macroOptions.map((amount) => ({ value: amount, label: `${amount}٪` }))} />

          <Select label="چربی (%)" value={fields.fatsPercent} onChange={(fatsPercent) => setFields({ ...fields, fatsPercent })} options={macroOptions.map((amount) => ({ value: amount, label: `${amount}٪` }))} />
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
          <Select label="روزهای تمرین قدرتی" value={fields.strengthDays} onChange={(strengthDays) => setFields({ ...fields, strengthDays })} options={daysOptions.map((day) => ({ value: day, label: `${day} روز` }))} />

          <Select label="روزهای تمرین هوازی" value={fields.cardioDays} onChange={(cardioDays) => setFields({ ...fields, cardioDays })} options={daysOptions.map((day) => ({ value: day, label: `${day} روز` }))} />
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
