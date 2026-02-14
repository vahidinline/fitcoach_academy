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
    return (
      <p className="text-center p-10 font-vazir">در حال بارگذاری اطلاعات...</p>
    );

  if (reports.length === 0) {
    return (
      <div
        className="bg-white p-6 rounded-2xl shadow-sm text-center text-gray-500 font-vazir"
        dir="rtl">
        هنوز هیچ گزارشی ثبت نکرده‌اید.
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
    <div className="space-y-6 font-vazir text-right pb-10" dir="rtl">
      {/* ===== ۱. آخرین گزارش ارسالی کاربر ===== */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">گزارش اخیر شما</h3>
          <span className="text-[10px] text-gray-400 font-medium">
            ثبت شده در:{' '}
            {formatDate(currentReport.date || currentReport.createdAt)}
          </span>
        </div>

        {timeLeft !== 'اتمام مهلت' ? (
          <div className="bg-blue-50 p-2 rounded-lg mb-4 text-center">
            <p className="text-[11px] text-blue-700 font-bold">
              ⏳ مهلت ویرایش یا حذف: {timeLeft}
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 mb-4 italic">
            ⛔ زمان ویرایش این گزارش تمام شده است.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 text-[12px] text-gray-600 mb-4">
          <div className="bg-gray-50 p-2 rounded-xl text-center">
            کالری:{' '}
            <span className="font-bold text-gray-900">
              {currentReport.avgCalories}
            </span>
          </div>
          <div className="bg-gray-50 p-2 rounded-xl text-center">
            قدم:{' '}
            <span className="font-bold text-gray-900">
              {currentReport.avgSteps}
            </span>
          </div>
        </div>

        {timeLeft !== 'اتمام مهلت' && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit-report/${currentReport._id}`)}
              className="flex-1 bg-amber-500 text-white py-2 rounded-xl text-sm font-bold shadow-md shadow-amber-100">
              ویرایش
            </button>
            <button
              onClick={async () => {
                if (window.confirm('گزارش حذف شود؟')) {
                  await api.delete(`/report/${currentReport._id}`);
                  load();
                }
              }}
              className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm font-bold">
              حذف
            </button>
          </div>
        )}
      </div>

      {/* ===== ۲. آخرین پاسخ مربی (بخش طلایی) ===== */}
      {!latestFeedbackReport ? (
        <div className="bg-gray-50 p-10 rounded-3xl text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-sm italic">
            گزارش شما دریافت شده و مربی به زودی به آن پاسخ خواهد داد.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* دکوراسیون پس زمینه */}
          <div className="absolute inset-0 bg-blue-600 rounded-[35px] translate-y-2 opacity-10"></div>

          <div className="relative bg-white border-2 border-blue-600 rounded-[32px] overflow-hidden shadow-xl">
            {/* Header فیدبک */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-lg leading-none">
                آخرین پاسخ مربی
              </h3>
              <div className="text-[10px] bg-blue-500/50 px-3 py-1 rounded-full border border-blue-400">
                تاریخ گزارش: {formatDate(latestFeedbackReport.date)}
              </div>
            </div>

            <div className="p-5">
              {/* نظر مربی */}
              {latestFeedbackReport.coachFeedback.comment && (
                <div className="mb-5 leading-relaxed text-gray-800 text-sm bg-blue-50/30 p-4 rounded-2xl italic border-r-4 border-blue-600">
                  "{latestFeedbackReport.coachFeedback.comment}"
                </div>
              )}

              {/* امتیاز */}
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black mb-6">
                ⭐ امتیاز مربی به شما:{' '}
                {latestFeedbackReport.coachFeedback.score} از 10
              </div>

              {/* برنامه دوره بعد */}
              {latestFeedbackReport.coachFeedback.nextPeriodPlan && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-3">
                    <span className="w-4 h-[2px] bg-blue-600"></span>
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
                            className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                            <span className="text-[9px] text-gray-400 mb-1">
                              {convertFieldLabel(key)}
                            </span>
                            <span className="text-xs font-black text-gray-800">
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
          <div className="flex items-center gap-3 mb-4 text-gray-400">
            <h4 className="font-bold text-md whitespace-nowrap">
              تاریخچه پاسخ‌ها
            </h4>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>

          <div className="space-y-4">
            {previousFeedbacks.map((r) => (
              <div
                key={r._id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-blue-600">
                    گزارش {formatDate(r.date)}
                  </span>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg text-gray-500 font-medium">
                    امتیاز: {r.coachFeedback.score}
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic line-clamp-2">
                  "{r.coachFeedback.comment}"
                </p>
                <button
                  onClick={() => {
                    /* می‌توانید اینجا مودال باز کنید یا به صفحه جزئیات ببرید */
                  }}
                  className="mt-2 text-[10px] text-blue-400 font-bold">
                  مشاهده کامل این برنامه ←
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
