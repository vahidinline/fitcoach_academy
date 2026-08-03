import React, { useEffect, useState } from 'react';
import api from 'api/api';
import { useNavigate } from 'react-router-dom';

export default function CoachFeedbackViewer({ userId }) {
  const navigate = useNavigate();

  // ---------------- State Hooks ----------------
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  // ---------------- Load & Sort Reports ----------------
  useEffect(() => {
    load();
  }, [userId]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/report/my?userId=${userId}`);
      let list = res?.data?.reports || [];

      // مرتب‌سازی از جدیدترین به قدیمی‌ترین
      list = list.sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);
        return dateB - dateA;
      });

      setReports(list);
    } catch (err) {
      console.error('Error loading reports:', err);
      setReports([]);
    }
    setLoading(false);
  };

  // ---------------- Timer Logic ----------------
  const updateCountdown = () => {
    if (reports.length === 0) return;
    const latest = reports[0];
    if (!latest?.editableUntil) return;

    const end = new Date(latest.editableUntil).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) {
      setTimeLeft('اتمام مهلت');
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft(
      hours > 0
        ? `${hours} ساعت و ${minutes} دقیقه`
        : `${minutes} دقیقه و ${seconds} ثانیه`,
    );
  };

  useEffect(() => {
    if (reports.length === 0) return;
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [reports]);

  // ---------------- Helpers ----------------
  const convertFieldLabel = (key) => {
    const map = {
      dailyCalories: 'کالری روزانه',
      proteinPercent: 'پروتئین (%)',
      carbsPercent: 'کربوهیدرات (%)',
      fatPercent: 'چربی (%)',
      fiberTarget: 'فیبر روزانه',
      dailyStepsTarget: 'هدف قدم',
      trainingDaysTarget: 'روزهای تمرین',
      cardioDaysTarget: 'هوازی (دقیقه)',
    };
    return map[key] || key;
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fa-IR') : '-');

  // ---------------- Logic for UI ----------------
  if (loading)
    return <div className="academy-surface flex min-h-48 items-center justify-center text-sm font-bold text-[#66736e]">در حال دریافت گزارش‌ها…</div>;

  if (reports.length === 0) {
    return (
      <div className="academy-surface py-14 text-center" dir="rtl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5e9e2] text-xl">✦</span>
        <h3 className="mt-4 font-black text-[#1c2c29]">هنوز گزارشی ثبت نشده</h3>
        <p className="mt-2 text-sm text-[#66736e]">پس از اولین گزارش، پاسخ مربی و برنامه بعدی شما اینجا نمایش داده می‌شود.</p>
      </div>
    );
  }

  // جدا کردن آخرین گزارش ارسالی و فیدبک‌ها
  const currentReport = reports[0];
  const reportsWithFeedback = reports.filter(
    (r) =>
      r.coachFeedback?.comment ||
      (typeof r.coachFeedback?.score === 'number' &&
        r.coachFeedback?.score !== null),
  );

  const latestFeedbackReport = reportsWithFeedback[0];
  const previousFeedbacks = reportsWithFeedback.slice(1);

  return (
    <div className="space-y-6 pb-10 text-right" dir="rtl">
      {/* ===== ۱. آخرین گزارش ارسالی کاربر ===== */}
      <div className="academy-surface p-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div><p className="academy-kicker">آخرین ثبت شما</p><h3 className="mt-1 font-black text-[#1c2c29]">گزارش اخیر</h3></div>
          <span className="rounded-full bg-[#f3efe7] px-3 py-1.5 text-[11px] font-bold text-[#66736e]">
            ثبت شده در:{' '}
            {formatDate(currentReport.date || currentReport.createdAt)}
          </span>
        </div>

        {timeLeft !== 'اتمام مهلت' ? (
          <div className="mb-4 rounded-2xl border border-[#e7c9b9] bg-[#fff4ef] p-3 text-center">
            <p className="text-xs font-bold text-[#b84f3a]">
              مهلت ویرایش یا حذف: {timeLeft}
            </p>
          </div>
        ) : (
          <p className="mb-4 rounded-2xl bg-[#f3efe7] p-3 text-center text-xs text-[#66736e]">
            زمان ویرایش این گزارش به پایان رسیده است.
          </p>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3 text-xs text-[#66736e]">
          <div className="academy-metric text-center">میانگین کالری<br />
            <span className="mt-1 block text-lg font-black text-[#1c2c29]">
              {currentReport.avgCalories}
            </span>
          </div>
          <div className="academy-metric text-center">میانگین قدم<br />
            <span className="mt-1 block text-lg font-black text-[#1c2c29]">
              {currentReport.avgSteps}
            </span>
          </div>
        </div>

        {timeLeft !== 'اتمام مهلت' && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit-report/${currentReport._id}`)}
              className="academy-primary-button flex-1">
              ویرایش
            </button>
            <button
              onClick={async () => {
                if (window.confirm('گزارش حذف شود؟')) {
                  await api.delete(`/report/${currentReport._id}`);
                  load();
                }
              }}
              className="flex-1 rounded-2xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100">
              حذف
            </button>
          </div>
        )}
      </div>

      {/* ===== ۲. آخرین پاسخ مربی (بخش طلایی) ===== */}
      {!latestFeedbackReport ? (
        <div className="rounded-[28px] border border-dashed border-[#c9cec8] bg-[#f8f6f0] p-10 text-center">
          <p className="text-sm leading-7 text-[#66736e]">
            گزارش شما دریافت شده و مربی به زودی به آن پاسخ خواهد داد.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* دکوراسیون پس زمینه */}
          <div className="absolute inset-0 translate-y-2 rounded-[35px] bg-[#1c2c29] opacity-10"></div>

          <div className="relative overflow-hidden rounded-[32px] border border-[#1c2c29] bg-white shadow-[0_18px_50px_rgba(28,44,41,0.12)]">
            {/* Header فیدبک */}
            <div className="flex items-center justify-between bg-[#1c2c29] p-5 text-white">
              <h3 className="font-black text-lg leading-none">
                آخرین پاسخ مربی
              </h3>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px]">
                تاریخ گزارش: {formatDate(latestFeedbackReport.date)}
              </div>
            </div>

            <div className="p-5">
              {/* نظر مربی */}
              {latestFeedbackReport.coachFeedback.comment && (
                <div className="mb-5 rounded-2xl border-r-4 border-[#df6b52] bg-[#f3efe7] p-5 text-sm leading-8 text-[#293936]">
                  {latestFeedbackReport.coachFeedback.comment}
                </div>
              )}

              {/* امتیاز */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#fff0d2] px-4 py-1.5 text-xs font-black text-[#976316]">
                امتیاز مربی:{' '}
                {latestFeedbackReport.coachFeedback.score} از 10
              </div>

              {/* برنامه دوره بعد */}
              {latestFeedbackReport.coachFeedback.nextPeriodPlan && (
                <div className="space-y-3">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#b84f3a]">
                    <span className="h-[2px] w-4 bg-[#df6b52]"></span>
                    برنامه شما برای روزهای آینده
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(
                      latestFeedbackReport.coachFeedback.nextPeriodPlan,
                    ).map(
                      ([key, val]) =>
                        val && (
                          <div
                            key={key}
                            className="flex flex-col items-center rounded-2xl border border-[#e2ded5] bg-[#fbfaf6] p-3 text-center">
                            <span className="mb-1 text-[10px] text-[#87928e]">
                              {convertFieldLabel(key)}
                            </span>
                            <span className="text-sm font-black text-[#1c2c29]">
                              {val}
                            </span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== ۳. تاریخچه فیدبک‌های قبلی مربی ===== */}
      {previousFeedbacks.length > 0 && (
        <div className="pt-4 px-2">
          <div className="mb-4 flex items-center gap-3 text-[#66736e]">
            <h4 className="font-bold text-md whitespace-nowrap">
              تاریخچه پاسخ‌ها
            </h4>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>

          <div className="space-y-4">
            {previousFeedbacks.map((r) => (
              <div
                key={r._id}
                className="rounded-2xl border border-[#e2ded5] bg-white p-4 transition hover:border-[#b9c1bc]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-[#b84f3a]">
                    گزارش {formatDate(r.date)}
                  </span>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg text-gray-500 font-medium">
                    امتیاز: {r.coachFeedback.score}
                  </span>
                </div>
                <details className="group"><summary className="cursor-pointer list-none text-xs font-bold text-[#1c2c29]">مشاهده پاسخ مربی</summary><p className="mt-3 rounded-xl bg-[#f3efe7] p-3 text-xs leading-7 text-[#52605b]">{r.coachFeedback.comment || 'پاسخ متنی ثبت نشده است.'}</p></details>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
