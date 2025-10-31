import { useState, useEffect } from 'react';
import api from 'api/api';

export default function FailedModal({ userId, onRetryAllowed }) {
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [canRetry, setCanRetry] = useState(false);

  useEffect(() => {
    const fetchBanDate = async () => {
      try {
        const { data } = await api.get(`/quiz/progress/${userId}`);
        if (data.twoWeekBanDate) {
          const now = new Date();
          const banEnd = new Date(data.twoWeekBanDate);
          banEnd.setDate(banEnd.getDate() + 14); // add 2 weeks
          const diffSec = Math.max(0, Math.floor((banEnd - now) / 1000));
          setTimeLeft(diffSec);
          setCanRetry(diffSec <= 0);
        } else {
          setCanRetry(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanDate();
  }, [userId]);

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanRetry(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanRetry(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRetry = async () => {
    try {
      const { data } = await api.post('/quiz/retry', { userId });
      if (data.canRetry) {
        onRetryAllowed(); // callback to let quiz start
      } else {
        alert('هنوز دو هفته از آخرین تلاش شما نگذشته است.');
      }
    } catch (err) {
      console.error(err);
      alert('خطا در بررسی امکان امتحان مجدد');
    }
  };

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return d > 0
      ? `${d} روز ${h}:${m.toString().padStart(2, '0')}:${s
          .toString()
          .padStart(2, '0')}`
      : `${h}:${m.toString().padStart(2, '0')}:${s
          .toString()
          .padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">
          شما ۲ بار تلاش کردید و موفق نشدید
        </h2>
        <p className="mb-4">
          لطفاً مطالعه کنید و بعد از دو هفته دوباره امتحان دهید.
        </p>
        <p className="mb-4 text-gray-600">
          زمان باقی‌مانده تا امکان امتحان مجدد: {formatTime(timeLeft)}
        </p>
        <button
          onClick={handleRetry}
          disabled={!canRetry}
          className={`py-2 px-6 rounded-xl font-semibold transition ${
            canRetry
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}>
          امتحان مجدد
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-300 text-gray-700 py-2 px-6 rounded-xl hover:bg-gray-400 transition ml-2">
          بازگشت
        </button>
      </div>
    </div>
  );
}
