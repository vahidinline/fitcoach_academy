// CoachFeedbackViewer.jsx
import React, { useEffect, useState } from 'react';
import api from 'api/api';

export default function CoachFeedbackViewer({ userId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>در حال بارگذاری...</p>;

  // ---------------------------
  //  حالت 1: بدون گزارش → هیچ UI دیگری نده
  // ---------------------------
  if (reports.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-gray-600">
        هنوز هیچ گزارشی ثبت نکرده‌اید.
      </div>
    );
  }

  // از اینجا به بعد یعنی reports وجود دارد
  const latest = reports[0];
  const feedback = latest?.coachFeedback || {};

  const hasFeedback =
    feedback?.comment ||
    typeof feedback?.score === 'number' ||
    Object.values(feedback?.nextPeriodPlan || {}).some(
      (v) => v !== null && v !== ''
    );

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fa-IR') : '');
  return (
    <div className="space-y-6">
      {/* ===== گزارش واقعی کاربر ===== */}
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <h3 className="font-bold text-lg">آخرین گزارش شما</h3>

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

        {latest.note && (
          <p className="text-gray-700 whitespace-pre-line">
            📝 <strong>یادداشت شما:</strong> {latest.note}
          </p>
        )}
      </div>
      {/* ===== اگر فیدبک وجود نداشت ===== */}
      {!hasFeedback && (
        <div className="bg-white p-4 rounded-xl shadow text-gray-500">
          برای این گزارش هنوز فیدبکی ثبت نشده است.
        </div>
      )}
      {/* ===== اگر فیدبک وجود دارد ===== */}
      {hasFeedback && (
        <>
          <div className="bg-white shadow p-4 rounded-xl">
            <h3 className="font-bold text-lg">فیدبک آخر مربی</h3>

            {feedback.comment && <p>💬 {feedback.comment}</p>}
            {typeof feedback.score === 'number' && (
              <p>⭐ امتیاز: {feedback.score} / 10</p>
            )}

            {feedback.nextPeriodPlan && (
              <div className="bg-gray-50 p-3 rounded">
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
