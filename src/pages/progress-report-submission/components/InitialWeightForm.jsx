// InitialWeightForm.jsx
import React, { useState } from 'react';
import api from 'api/api';

export default function InitialWeightForm({ onComplete }) {
  const userId = JSON.parse(localStorage.getItem('userData')).id;

  const [startingWeight, setStartingWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');

  const save = async () => {
    await api.post('/report/weight/init', {
      userId,
      startingWeight: Number(startingWeight),
      goalWeight: Number(goalWeight),
    });

    alert('وزن اولیه ذخیره شد');
    onComplete();
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-4">
      <h3 className="font-bold">ثبت وزن اولیه</h3>

      <input
        type="number"
        placeholder="وزن فعلی"
        className="border p-2 rounded w-full"
        value={startingWeight}
        onChange={(e) => setStartingWeight(e.target.value)}
      />

      <input
        type="number"
        placeholder="وزن هدف"
        className="border p-2 rounded w-full"
        value={goalWeight}
        onChange={(e) => setGoalWeight(e.target.value)}
      />

      <button
        onClick={save}
        className="bg-blue-600 text-white py-2 w-full rounded">
        ذخیره
      </button>
    </div>
  );
}
