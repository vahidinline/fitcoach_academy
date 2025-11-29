import React from 'react';

export default function StepLifestyle({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">سبک زندگی</h2>

      <select
        value={data.activityLevel || ''}
        onChange={(e) => setData({ ...data, activityLevel: e.target.value })}
        className="input-box">
        <option value="">سطح فعالیت روزانه</option>
        <option value="low">کم تحرک</option>
        <option value="medium">متوسط</option>
        <option value="high">فعال</option>
      </select>

      <textarea
        placeholder="اگر نکته‌ای هست اینجا بنویسید"
        value={data.notes || ''}
        onChange={(e) => setData({ ...data, notes: e.target.value })}
        className="input-box"
      />
    </div>
  );
}
