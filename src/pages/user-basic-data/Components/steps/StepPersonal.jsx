import React from 'react';

export default function StepPersonal({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">اطلاعات اولیه</h2>

      <input
        placeholder="سن"
        type="number"
        value={data.age || ''}
        onChange={(e) => setData({ ...data, age: e.target.value })}
        className="input-box"
      />

      <input
        placeholder="قد (سانتی‌متر)"
        type="number"
        value={data.height || ''}
        onChange={(e) => setData({ ...data, height: e.target.value })}
        className="input-box"
      />

      <select
        value={data.gender || ''}
        onChange={(e) => setData({ ...data, gender: e.target.value })}
        className="input-box">
        <option value="">جنسیت</option>
        <option value="male">مرد</option>
        <option value="female">زن</option>
      </select>
    </div>
  );
}
