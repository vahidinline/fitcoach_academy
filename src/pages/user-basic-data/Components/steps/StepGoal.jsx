import React from 'react';

export default function StepGoal({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">هدف شما</h2>

      <select
        value={data.mainGoal || ''}
        onChange={(e) => setData({ ...data, mainGoal: e.target.value })}
        className="input-box">
        <option value="">هدف اصلی</option>
        <option value="fatloss">کاهش وزن</option>
        <option value="muscle">افزایش عضله</option>
        <option value="recomp">بازترکیب بدن</option>
        <option value="health">سلامتی عمومی</option>
      </select>

      <input
        placeholder="هدف وزنی (اختیاری)"
        type="number"
        value={data.targetWeight || ''}
        onChange={(e) => setData({ ...data, targetWeight: e.target.value })}
        className="input-box"
      />
    </div>
  );
}
