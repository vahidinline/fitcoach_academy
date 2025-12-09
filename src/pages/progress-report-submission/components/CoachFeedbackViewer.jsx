import React, { useEffect, useState } from 'react';
import api from 'api/api';
import { useNavigate } from 'react-router-dom';

export default function CoachFeedbackViewer({ userId }) {
  const navigate = useNavigate();

  // ---------------- Hooks (همیشه اجرا می‌شوند) ----------------
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  console.log('all reports', reports);
  // ---------------- Load reports ----------------
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get(`/report/my?userId=${userId}`);
      setReports(res?.data?.reports || []);
    } catch (err) {
      console.error('Error loading reports:', err);
      setReports([]);
    }
    setLoading(false);
  };

  // ---------------- Countdown updater ----------------
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

    if (hours > 0) {
      setTimeLeft(`${hours} ساعت و ${minutes} دقیقه باقی مانده`);
    } else {
      setTimeLeft(`${minutes} دقیقه و ${seconds} ثانیه باقی مانده`);
    }
  };

  // اجرای تایمر فقط وقتی REPORTS تغییر کند
  useEffect(() => {
    if (reports.length === 0) return;

    updateCountdown(); // initial

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [reports]);

  // ---------------- Helper ----------------
  const convertFieldLabel = (key) => {
    const map = {
      dailyCalories: 'کالری روزانه',
      proteinPercent: 'پروتئین (%)',
      carbsPercent: 'کربوهیدرات (%)',
      fatPercent: 'چربی (%)',
      fiberTarget: 'فیبر روزانه (گرم)',
      dailyStepsTarget: 'هدف قدم روزانه',
      trainingDaysTarget: 'روزهای تمرین',
      cardioDaysTarget: ' هوازی در هفته/دقیقه',
    };
    return map[key] || key;
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fa-IR') : '');

  // ---------------- Render logic ----------------
  if (loading) return <p>در حال بارگذاری...</p>;

  if (reports.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-gray-600">
        هنوز هیچ گزارشی ثبت نکرده‌اید.
      </div>
    );
  }

  const latest = reports[0];

  const feedback = latest?.coachFeedback || {};
  const hasFeedback =
    feedback?.comment ||
    typeof feedback?.score === 'number' ||
    Object.values(feedback?.nextPeriodPlan || {}).some(
      (v) => v !== null && v !== ''
    );

  return (
    <div className="space-y-6">
      {/* ===== گزارش واقعی ===== */}
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <h3 className="font-bold text-lg">آخرین گزارش شما</h3>

        {timeLeft !== 'اتمام مهلت' ? (
          <p className="text-xs text-green-600">
            ⏳ می‌توانید تا {timeLeft} این گزارش را ویرایش یا حذف کنید.
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            ⛔ زمان ویرایش این گزارش تمام شده است
          </p>
        )}

        {timeLeft !== 'اتمام مهلت' && (
          <div className="flex flex-row gap-2">
            <button
              onClick={() => navigate(`/edit-report/${latest._id}`)}
              className="w-full bg-yellow-500 text-white p-2 rounded-xl mt-2">
              ویرایش گزارش
            </button>

            <button
              onClick={async () => {
                if (!confirm('گزارش حذف شود؟')) return;
                await api.delete(`/report/${latest._id}`);
                load();
              }}
              className="w-full bg-red-500 text-white p-2 rounded-xl mt-2">
              حذف گزارش
            </button>
          </div>
        )}

        <p className="text-gray-600">
          دوره: {latest.type === 'weekly' ? 'هفتگی' : 'ماهانه'}
        </p>

        <p className="text-gray-600">
          تاریخ ثبت گزارش: {formatDate(latest.date)}
        </p>

        <p>میانگین کالری: {latest.avgCalories}</p>

        <p>
          پروتئین: {latest.macros?.protein}% — کربوهیدرات:{' '}
          {latest.macros?.carbs}% — چربی: {latest.macros?.fat}%
        </p>

        <p>
          قدم‌ها: {latest.avgSteps} — قدرتی: {latest.strengthDays} — هوازی:{' '}
          {latest.cardioDays}
        </p>

        {latest.extraPhotos?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
            {latest.extraPhotos.map((f) => (
              <div
                key={f}
                className="relative border rounded-lg overflow-hidden">
                <img src={f} className="w-full h-24 object-cover" />
              </div>
            ))}
          </div>
        )}

        {latest.note && (
          <p className="text-gray-700 whitespace-pre-line mt-3">
            📝 <strong>یادداشت شما:</strong> {latest.note}
          </p>
        )}
      </div>

      {/* ===== بدون فیدبک ===== */}
      {!hasFeedback && (
        <div className="bg-white p-4 rounded-xl shadow text-gray-500">
          برای این گزارش هنوز فیدبکی ثبت نشده است.
        </div>
      )}

      {/* ===== فیدبک ===== */}
      {hasFeedback && (
        <>
          <div className="bg-white shadow p-4 rounded-xl">
            <h3 className="font-bold text-lg">فیدبک آخر مربی</h3>

            {feedback.comment && <p>💬 {feedback.comment}</p>}
            {typeof feedback.score === 'number' && (
              <p>⭐ امتیاز: {feedback.score} / 10</p>
            )}

            {feedback.nextPeriodPlan && (
              <div className="bg-gray-50 p-3 rounded mt-2">
                <h4 className="font-semibold mb-1">برنامه دوره بعد:</h4>

                {Object.entries(feedback.nextPeriodPlan).map(
                  ([key, val]) =>
                    val && (
                      <p key={key}>
                        {convertFieldLabel(key)}: {val}
                      </p>
                    )
                )}
              </div>
            )}
          </div>

          {/* ===== فیدبک‌های قبلی ===== */}
          <div className="bg-white shadow p-4 rounded-xl">
            <h3 className="font-bold text-lg">فیدبک‌های قبلی مربی</h3>

            {reports.length <= 1 ? (
              <p className="text-gray-500">فیدبک قبلی وجود ندارد.</p>
            ) : (
              reports.slice(1).map((r) => {
                const fb = r.coachFeedback || {};

                return (
                  <div key={r._id} className="border-b py-3 space-y-2">
                    <p className="font-semibold">
                      گزارش {r.type === 'weekly' ? 'هفتگی' : 'ماهانه'}
                    </p>

                    {fb.comment && (
                      <p className="text-gray-700">💬 {fb.comment}</p>
                    )}
                    {typeof fb.score === 'number' && <p>⭐ {fb.score}/10</p>}

                    {fb.nextPeriodPlan && (
                      <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                        {Object.entries(fb.nextPeriodPlan).map(
                          ([key, val]) =>
                            val && (
                              <p key={key}>
                                {convertFieldLabel(key)}: {val}
                              </p>
                            )
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
