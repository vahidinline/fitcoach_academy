import React, { useState } from 'react';
import api from 'api/api';

export default function InitialWeightForm({ onComplete }) {
  const userId = JSON.parse(localStorage.getItem('userData')).id;

  const [startingWeight, setStartingWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [date, setDate] = useState(''); // تاریخ اختیاری
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!startingWeight || !goalWeight) return;

    setLoading(true);
    try {
      await api.post('/report/weight/init', {
        userId,
        startingWeight: Number(startingWeight),
        goalWeight: Number(goalWeight),
        date: date || undefined, // ← اگر وارد نشود نمی‌فرستیم
      });

      onComplete && onComplete();
    } catch (err) {
      console.error('Initial weight save error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-4">
      <h3 className="font-bold">ثبت وزن اولیه</h3>

      {/* وزن اولیه */}
      <div>
        <label className="text-sm text-gray-600">وزن اولیه</label>
        <input
          type="number"
          className="border p-2 rounded w-full mt-1"
          value={startingWeight}
          onChange={(e) => setStartingWeight(e.target.value)}
          placeholder="مثال: 75"
        />
      </div>

      {/* وزن هدف */}
      <div>
        <label className="text-sm text-gray-600">وزن هدف</label>
        <input
          type="number"
          className="border p-2 rounded w-full mt-1"
          value={goalWeight}
          onChange={(e) => setGoalWeight(e.target.value)}
          placeholder="مثال: 60"
        />
      </div>

      {/* تاریخ اختیاری */}
      <div>
        <label className="text-sm text-gray-600">
          تاریخ وزن اولیه (اختیاری)
        </label>
        <input
          type="date"
          className="border p-2 rounded w-full mt-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          اگر خالی باشید، تاریخ امروز ثبت می‌شود.
        </p>
      </div>

      <button
        onClick={save}
        disabled={loading}
        className="bg-blue-600 text-white py-2 w-full rounded">
        {loading ? 'در حال ذخیره...' : 'ذخیره'}
      </button>
    </div>
  );
}
