// MeasurementForm.jsx
import React, { useState } from 'react';
import api from 'api/api';
import MeasurementChart from './MeasurementCharts';

export default function MeasurementForm({ onSaved }) {
  const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id;
  const [status, setStatus] = useState(null);
  const [data, setData] = useState({
    unitSystem: 'metric',
    chest: '',
    waist: '',
    hips: '',
    bicep: '',
    custom: [],
  });

  const [customItem, setCustomItem] = useState({
    label: '',
    value: '',
    unit: '',
  });

  const save = async () => {
    const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id;

    const payload = {
      userId,
      unitSystem: data.unitSystem,
      measurements: {
        chest: data.chest,
        waist: data.waist,
        hips: data.hips,
        bicep: data.bicep,
        // اگر custom هم خواستی اضافه کنی:
        // ...data.custom
      },
      custom: data.custom, // اگر می‌خواهی جدا هم بفرستی
    };

    await api.post('/report/measurement', payload);
    onSaved?.();
    setStatus('saved');
    setTimeout(() => setStatus(null), 2000);
  };

  const addCustom = () => {
    if (!customItem.label || !customItem.value) return;
    setData({
      ...data,
      custom: [...data.custom, customItem],
    });
    setCustomItem({ label: '', value: '', unit: '' });
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl space-y-4">
      <h3 className="font-bold text-lg">ثبت اندازه‌های جدید</h3>

      {['chest', 'waist', 'hips', 'bicep'].map((k) => (
        <input
          key={k}
          type="number"
          placeholder={k}
          value={data[k] || ''}
          onChange={(e) => setData({ ...data, [k]: e.target.value })}
          className="border p-2 w-full rounded"
        />
      ))}

      {/* Custom fields */}
      {/* <div className="flex gap-2">
        <input
          className="border p-2 w-1/3"
          placeholder="label"
          value={customItem.label}
          onChange={(e) =>
            setCustomItem({ ...customItem, label: e.target.value })
          }
        />
        <input
          className="border p-2 w-1/3"
          placeholder="value"
          type="number"
          value={customItem.value}
          onChange={(e) =>
            setCustomItem({ ...customItem, value: e.target.value })
          }
        />
        <input
          className="border p-2 w-1/3"
          placeholder="unit"
          value={customItem.unit}
          onChange={(e) =>
            setCustomItem({ ...customItem, unit: e.target.value })
          }
        />
        <button
          onClick={addCustom}
          className="bg-blue-600 text-white px-3 rounded-xl">
          +
        </button>
      </div> */}

      <button
        onClick={save}
        className="bg-blue-600 text-white py-2 w-full rounded-lg">
        ذخیره
      </button>
      {status === 'saved' && (
        <div className="p-2 text-center bg-green-100 text-green-700 rounded-lg">
          اندازه‌گیری با موفقیت ذخیره شد ✔️
        </div>
      )}

      <MeasurementChart userId={userId} />
    </div>
  );
}
