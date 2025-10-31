import { useState, useEffect } from 'react';
import api from 'api/api';

export default function GuideModal({ handleStart }) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">راهنمای آزمون</h2>
        <p className="mb-4 text-right">
          لطفاً قبل از شروع، تمام جلسات ضبط شده را با دقت مشاهده کنید. شما ۳۰
          دقیقه زمان دارید و می‌توانید حداکثر دو بار امتحان دهید.
        </p>
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition">
          شروع آزمون
        </button>
      </div>
    </div>
  );
}
