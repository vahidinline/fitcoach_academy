import { useState, useEffect } from 'react';
import api from 'api/api';

export default function FailedModal({
  banTimeLeft,
  formatCountdown,
  handleRetry,
  canRetry,
  failedAttempts = 2,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">
          تلاش {failedAttempts} شما با موفقیت همراه نبود
        </h2>
        {banTimeLeft > 0 ? (
          <p className="mb-4 text-red-600">
            زمان باقی‌مانده تا امکان امتحان مجدد: {formatCountdown(banTimeLeft)}
          </p>
        ) : (
          <p className="mb-4 text-green-600">
            مدت محرومیت شما تمام شده است، می‌توانید دوباره امتحان دهید.
          </p>
        )}
        {failedAttempts >= 2 && (
          <p className="mb-5 rounded-2xl bg-amber-50 p-4 text-right text-sm leading-7 text-amber-800">
            برای شرکت مجدد، لطفاً ویدیوهای دوره را دوباره با دقت مشاهده کنید و سپس بعد از پایان محرومیت ۱۴ روزه آزمون دهید.
          </p>
        )}

        <button
          onClick={handleRetry}
          disabled={!canRetry}
          className={`py-2 px-6 rounded-xl transition mr-2 ${
            canRetry
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}>
          {canRetry
            ? 'امتحان مجدد'
            : `صبر کنید… (${formatCountdown(banTimeLeft)})`}
        </button>

        <button
          onClick={() => window.history.back()}
          className="bg-gray-300 text-gray-700 py-2 px-6 rounded-xl hover:bg-gray-400 transition">
          بازگشت
        </button>
      </div>
    </div>
  );
}
