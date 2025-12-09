// // AddWeightEntry.jsx
// import React, { useState } from 'react';
// import api from 'api/api';

// export default function AddWeightEntry({ userId, onAdded }) {
//   const [weight, setWeight] = useState('');

//   const save = async () => {
//     await api.post('/report/weight/entry', {
//       userId,
//       weight: Number(weight),
//     });

//     setWeight('');
//     onAdded();
//   };

//   return (
//     <div className="p-4 bg-white rounded-xl shadow space-y-3">
//       <input
//         type="number"
//         placeholder="وزن امروز"
//         className="border p-2 rounded w-full"
//         value={weight}
//         onChange={(e) => setWeight(e.target.value)}
//       />

//       <button
//         onClick={save}
//         className="bg-green-600 text-white w-full py-2 rounded">
//         ثبت وزن جدید
//       </button>
//     </div>
//   );
// }

import { useState } from 'react';
import api from 'api/api';

export default function AddWeightEntry({ userId, onAdded }) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(''); // optional
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!weight) return;

    setLoading(true);
    try {
      await api.post('/report/weight/entry', {
        userId,
        weight: Number(weight),
        date: date || undefined, // ← اگر خالی بود نمی‌فرسته
      });

      setWeight('');
      setDate('');
      onAdded && onAdded();
    } catch (err) {
      console.error('Add weight error:', err);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-4 rounded-xl shadow space-y-4">
      <h3 className="font-bold text-lg">ثبت وزن جدید</h3>

      {/* وزن */}
      <div>
        <label className="text-sm text-gray-600">وزن فعلی (کیلوگرم)</label>
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 w-full p-2 border rounded-xl"
          placeholder="مثال: 74.5"
          required
        />
      </div>

      {/* تاریخ اختیاری */}
      <div>
        <label className="text-sm text-gray-600">
          تاریخ وزن‌گیری (اختیاری)
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full p-2 border rounded-xl"
        />

        <p className="text-xs text-gray-500 mt-1">
          اگر تاریخ را خالی بگذارید، تاریخ امروز ثبت می‌شود.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
        {loading ? 'در حال ثبت...' : 'ثبت وزن'}
      </button>
    </form>
  );
}
