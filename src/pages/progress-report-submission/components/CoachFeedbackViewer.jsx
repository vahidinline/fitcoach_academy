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
      setReports(res.data.reports || []);
    } catch (err) {
      console.error('Error loading reports:', err);
    }
    setLoading(false);
  };

  if (loading) return <p>در حال بارگذاری...</p>;

  if (reports.length === 0) return <p>هنوز گزارشی ارسال نکرده‌اید.</p>;

  const latest = reports[0]; // چون /my آخرین‌ها را sort کرده بودیم
  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fa-IR');
  };

  // -------------------------
  //  تشخیص وجود فیدبک واقعی
  // -------------------------
  const hasFeedback =
    latest.coachFeedback &&
    (latest.coachFeedback.comment ||
      latest.coachFeedback.score ||
      Object.values(latest.coachFeedback.nextPeriodPlan || {}).some(
        (v) => v !== null && v !== ''
      ));

  return (
    <div className="space-y-6">
      {/* ===================== آخرین گزارش کاربر ===================== */}

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <h3 className="font-bold text-lg">آخرین گزارش شما</h3>

        <p className="text-gray-600">
          دوره: {latest.type === 'weekly' ? 'هفتگی' : 'ماهانه'}
        </p>
        <p className="text-gray-600 ">
          تاریخ ثبت گزارش: {formatDate(latest.date)}
        </p>
        <p>میانگین کالری: {latest.avgCalories}</p>

        <p>
          پروتئین: {latest.macros.protein}% — کربوهیدرات: {latest.macros.carbs}%
          — چربی: {latest.macros.fat}%
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

      {/* ===================== آخرین فیدبک مربی ===================== */}
      <div className="bg-white shadow p-4 rounded-xl">
        <h3 className="font-bold text-lg">فیدبک آخر مربی</h3>

        {!hasFeedback ? (
          <p className="text-red-500 mt-2">
            هنوز مربی برای آخرین گزارش شما فیدبک ثبت نکرده است.
          </p>
        ) : (
          <div className="space-y-3 mt-2">
            {latest.coachFeedback.comment && (
              <p>💬 {latest.coachFeedback.comment}</p>
            )}

            {latest.coachFeedback.score && (
              <p>⭐ امتیاز: {latest.coachFeedback.score} / 10</p>
            )}

            {/* Next Period Plan */}
            {latest.coachFeedback.nextPeriodPlan && (
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-1">برنامه دوره بعد:</h4>

                {Object.entries(latest.coachFeedback.nextPeriodPlan).map(
                  ([key, val]) =>
                    val ? (
                      <p key={key}>
                        {convertFieldLabel(key)}: {val}
                      </p>
                    ) : null
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================== فیدبک‌های قبلی ===================== */}
      <div className="bg-white shadow p-4 rounded-xl">
        <h3 className="font-bold text-lg">فیدبک‌های قبلی مربی</h3>

        {reports.length <= 1 ? (
          <p className="text-gray-500">فیدبک قبلی وجود ندارد.</p>
        ) : (
          reports.slice(1).map((r) => (
            <div key={r._id} className="border-b py-3 space-y-2">
              <p className="font-semibold">
                گزارش {r.type === 'weekly' ? 'هفتگی' : 'ماهانه'}
              </p>

              {/* متن و امتیاز */}
              {r.coachFeedback?.comment && (
                <p className="text-gray-700">💬 {r.coachFeedback.comment}</p>
              )}
              {typeof r.coachFeedback?.score === 'number' && (
                <p>⭐ {r.coachFeedback.score}/10</p>
              )}

              {/* برنامه دوره بعد */}
              {r.coachFeedback?.nextPeriodPlan && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                  <p className="font-semibold text-gray-800">
                    برنامه دوره بعد:
                  </p>

                  <p>
                    کالری روزانه: {r.coachFeedback.nextPeriodPlan.dailyCalories}
                  </p>

                  <p>
                    پروتئین (%): {r.coachFeedback.nextPeriodPlan.proteinPercent}{' '}
                    — کربوهیدرات (%):{' '}
                    {r.coachFeedback.nextPeriodPlan.carbsPercent} — چربی (%):{' '}
                    {r.coachFeedback.nextPeriodPlan.fatPercent}
                  </p>

                  <p>
                    فیبر روزانه: {r.coachFeedback.nextPeriodPlan.fiberTarget}{' '}
                    گرم
                  </p>

                  <p>
                    هدف قدم روزانه:{' '}
                    {r.coachFeedback.nextPeriodPlan.dailyStepsTarget} قدم
                  </p>

                  <p>
                    روزهای تمرین:{' '}
                    {r.coachFeedback.nextPeriodPlan.trainingDaysTarget} روز
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function convertFieldLabel(key) {
  const map = {
    dailyCalories: 'کالری روزانه',
    proteinPercent: 'پروتئین (%)',
    carbsPercent: 'کربوهیدرات (%)',
    fatPercent: 'چربی (%)',
    fiberTarget: 'فیبر روزانه (گرم)',
    dailyStepsTarget: 'هدف قدم روزانه',
    trainingDaysTarget: 'روزهای تمرین',
  };
  return map[key] || key;
}
