import React from 'react';

export default function StepTraining({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">سابقه ورزشی</h2>

      <select
        value={data.trainingExperience || ''}
        onChange={(e) =>
          setData({ ...data, trainingExperience: e.target.value })
        }
        className="input-box">
        <option value="">چقدر سابقه ورزش داری؟</option>
        <option value="none">هیچ</option>
        <option value="beginner">مبتدی (کمتر از ۶ ماه)</option>
        <option value="intermediate">متوسط (۶ ماه تا ۲ سال)</option>
        <option value="advanced">پیشرفته (۲ سال به بالا)</option>
      </select>

      <select
        value={data.trainingDays || ''}
        onChange={(e) =>
          setData({ ...data, trainingDays: Number(e.target.value) })
        }
        className="input-box">
        <option value="">چند روز در هفته تمرین می‌کنی؟</option>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
          <option key={d} value={d}>
            {d} روز
          </option>
        ))}
      </select>
    </div>
  );
}
