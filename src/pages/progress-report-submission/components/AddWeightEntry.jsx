// AddWeightEntry.jsx
import React, { useState } from 'react';
import api from 'api/api';

export default function AddWeightEntry({ userId, onAdded }) {
  const [weight, setWeight] = useState('');

  const save = async () => {
    await api.post('/report/weight/entry', {
      userId,
      weight: Number(weight),
    });

    setWeight('');
    onAdded();
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-3">
      <input
        type="number"
        placeholder="وزن امروز"
        className="border p-2 rounded w-full"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button
        onClick={save}
        className="bg-green-600 text-white w-full py-2 rounded">
        ثبت وزن جدید
      </button>
    </div>
  );
}
