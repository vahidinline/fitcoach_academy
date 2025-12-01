import React, { useEffect, useRef, useState } from 'react';
import api from 'api/api';
import { gsap } from 'gsap';

const ReportQuota = ({ subscription, remaining, onBuyClick }) => {
  // const [subscription, setSubscription] = useState(null);
  // const [remaining, setRemaining] = useState(null);
  const progressRef = useRef(null);

  // Animate progress bar
  useEffect(() => {
    if (!progressRef.current || subscription === null) return;

    const percent =
      subscription.limit > 0
        ? (subscription.remaining / subscription.limit) * 100
        : 0;

    gsap.to(progressRef.current, {
      width: `${percent}%`,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, [subscription]);

  if (subscription === null)
    return (
      <div dir="rtl" className="p-4 text-red-600 bg-white rounded-xl shadow">
        شما هیچ اشتراک فعالی ندارید.
        <div className="mt-3">
          <button
            onClick={onBuyClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            خرید اشتراک
          </button>
        </div>
      </div>
    );

  const { type, limit, used } = subscription;
  const percent = limit ? (remaining / limit) * 100 : 0;

  return (
    <div
      dir="rtl"
      className="p-4 bg-white/30 backdrop-blur-xl rounded-2xl shadow-md border border-white/40">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        وضعیت گزارش‌های اشتراک ({type})
      </h3>

      {/* Progress Bar */}
      <div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className={`h-full transition-all rounded-full ${
            remaining > 0 ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-gray-700 text-sm mt-2">
        {remaining > 0 ? (
          <>
            شما <span className="font-bold">{remaining}</span> گزارش دیگر
            می‌توانید ارسال کنید.
          </>
        ) : (
          'سهمیه گزارش‌های شما تمام شده است.'
        )}
      </p>

      {/* Buy Button */}
      {remaining <= 0 && (
        <button
          onClick={onBuyClick}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition active:scale-95">
          خرید گزارش بیشتر
        </button>
      )}
    </div>
  );
};

export default ReportQuota;
