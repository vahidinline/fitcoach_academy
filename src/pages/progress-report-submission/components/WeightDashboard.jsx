// WeightDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from 'api/api';
import AddWeightEntry from './AddWeightEntry';
import WeightChart from './WeightChart';
import InitialWeightForm from './InitialWeightForm'; // ← این مهمه

export default function WeightDashboard() {
  const userId = JSON.parse(localStorage.getItem('userData'))?.id;

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/report/weight/${userId}`);
      setRecord(res.data.data || null);
    } catch (err) {
      console.error('Load weight error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>در حال بارگذاری...</p>;

  // اگر هیچ اطلاعات وزنی نیست → فرم وزن اولیه را نشان بده
  if (!record) {
    return (
      <div className="max-w-md mx-auto mt-6">
        <InitialWeightForm onComplete={load} />
      </div>
    );
  }

  const { startingWeight, goalWeight, weightEntries } = record;
  const sortedEntries = [...weightEntries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const currentWeight = sortedEntries[sortedEntries.length - 1]?.weight;
  const lost = startingWeight - currentWeight;
  const progressPercent = Math.max(
    0,
    Math.min(
      100,
      ((startingWeight - currentWeight) / (startingWeight - goalWeight)) * 100
    )
  );

  return (
    <div className="space-y-6">
      {/* کارت‌های خلاصه */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard title="وزن اولیه" value={`${startingWeight} kg`} />
        <SummaryCard title="وزن هدف" value={`${goalWeight} kg`} />
        <SummaryCard title="وزن فعلی" value={`${currentWeight} kg`} />
        <SummaryCard
          title="تغییر وزن"
          value={lost >= 0 ? `${lost} kg -` : `+${Math.abs(lost)} kg`}
        />
      </div>

      {/* درصد پیشرفت */}
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="font-bold mb-2">پیشرفت تا هدف</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className="text-sm mt-2 text-gray-600">
          {progressPercent.toFixed(1)}%
        </p>
      </div>

      {/* چارت پیشرفت */}
      <WeightChart userId={userId} entries={sortedEntries} />

      {/* فرم ثبت وزن جدید */}
      <AddWeightEntry userId={userId} onAdded={load} />
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white p-4 shadow rounded-xl text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="font-bold text-xl mt-1">{value}</p>
    </div>
  );
}
