import React, { useEffect, useState, useRef } from 'react';
import api from 'api/api';
import dayjs from 'dayjs';
import { gsap } from 'gsap';

const SubscriptionStatus = ({ userId }) => {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardRef = useRef(null);
  const progressRef = useRef(null);
  const glowRef = useRef(null);

  // ========================= LOAD DATA =========================
  const load = async () => {
    try {
      const res = await api.get(`/subscription/active/${userId}`);
      setSub(res.data.subscription || null);
    } catch (e) {
      setSub(null);
    } finally {
      setLoading(false);
    }
  };

  const startAcademy = async () => {
    if (
      !window.confirm(
        'با شروع دوره، شمارش ۹۰ روز از امروز آغاز می‌شود. ادامه می‌دهید؟',
      )
    )
      return;
    try {
      const res = await api.post(`/subscription/academy/${userId}/start`);
      setSub(res.data.subscription);
    } catch (error) {
      alert(error.response?.data?.message || 'شروع دوره انجام نشد.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ========================= CARD ANIMATION =========================
  useEffect(() => {
    if (!loading && cardRef.current) {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, [loading]);

  // ========================= PROGRESS & BORDER FX =========================
  useEffect(() => {
    if (sub && progressRef.current) {
      const total = sub.reportLimit || 1;
      const remaining = sub.reportLimit - sub.reportsUsed;
      const percent = (remaining / total) * 100;

      gsap.to(progressRef.current, {
        width: `${percent}%`,
        duration: 1,
        ease: 'power3.out',
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        backgroundPosition: '200% 0',
        duration: 6,
        repeat: -1,
        ease: 'linear',
      });
    }
  }, [sub]);

  // ========================= AI Message Generator =========================
  const getAIMsg = () => {
    if (!sub) return 'برای شروع برنامه، یک اشتراک فعال تهیه کنید.';

    if (sub.productType === 'academy' && !sub.hasStarted)
      return 'دوره هنوز شروع نشده؛ هر زمان آماده بودی شروع کن. شمارش ۹۰ روز از همان روز آغاز می‌شود.';

    if (sub.productType === 'academy')
      return '🔥 سه گزارش و سه جلسه آنلاین در اختیار داری؛ ارسال گزارش هفتگی اجباری نیست.';

    if (sub.productType === 'pro')
      return '🚀 اشتراک PRO فعال است — هر هفته گزارش بده تا مربی مسیرت را دقیق‌تر تنظیم کند.';

    if (sub.productType === 'private')
      return '👑 شما در سطح PRIVATE هستید — مربی با شما مثل VIP رفتار می‌کند. فقط گزارش بده و بقیه‌اش با ما.';

    return '';
  };

  // ========================= BADGES =========================
  const Badge = () => {
    if (!sub) return null;

    const type = sub.productType;

    const map = {
      academy: { label: 'Academy', color: 'bg-blue-500' },
      pro: { label: 'تکمیلی', color: 'bg-purple-600' },
      private: { label: 'PRIVATE', color: 'bg-yellow-500 text-black' },
    };

    const badge = map[type];

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold text-white ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  // ========================= ULTRA-LOADER =========================
  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 animate-pulse">
        <div className="h-6 bg-white/40 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-white/30 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-1/2 mb-6"></div>
        <div className="h-3 bg-white/20 rounded w-full"></div>
      </div>
    );
  }

  // ========================= NO SUB =========================
  if (!sub) {
    return (
      <div className="p-6 rounded-2xl bg-red-100 text-red-700 border border-red-300">
        <p className="font-bold text-lg mb-2">❌ اشتراک فعال یافت نشد</p>
        <p className="text-sm">
          برای استفاده از خدمات ابتدا یکی از اشتراک‌ها را خریداری کنید.
        </p>
      </div>
    );
  }

  // ========================= SUB AVAILABLE =========================
  const remaining = sub.remainingReports ?? sub.reportLimit - sub.reportsUsed;
  const isExpired =
    sub.isExpired ?? (sub.expiresAt && dayjs(sub.expiresAt).isBefore(dayjs()));

  return (
    <div
      ref={cardRef}
      dir="rtl"
      className="relative p-6 rounded-3xl bg-white/50 backdrop-blur-2xl shadow-2xl border border-white/40">
      {/* Gradient Pulse Border */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-r from-green-500  to-white-400 opacity-40 blur-xl animate-none"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">وضعیت اشتراک</h3>
          <Badge />
        </div>

        <p className="text-gray-700 mb-2">
          {!sub.hasStarted
            ? '⏳ دوره هنوز شروع نشده است'
            : isExpired
              ? `دوره در ${dayjs(sub.expiresAt).format('YYYY-MM-DD')} پایان یافته است`
              : `⏳ ${sub.remainingDays} روز تا پایان دوره (${dayjs(sub.expiresAt).format('YYYY-MM-DD')})`}
        </p>

        {sub.startsAt && (
          <p className="text-xs text-gray-600">
            شروع: {dayjs(sub.startsAt).format('YYYY-MM-DD')} — پایان:{' '}
            {dayjs(sub.expiresAt).format('YYYY-MM-DD')}
          </p>
        )}

        <p className="text-gray-900 font-medium mt-4">
          گزارش‌های باقیمانده: <b>{remaining}</b> از <b>{sub.reportLimit}</b>
        </p>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-200/60 rounded-full mt-3 overflow-hidden">
          <div
            ref={progressRef}
            className={`h-full transition-all rounded-full ${
              remaining > 0 ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </div>

        {sub.productType === 'academy' && (
          <p className="text-gray-900 font-medium mt-3">
            جلسات آنلاین باقیمانده:{' '}
            <b>
              {sub.remainingOnlineSessions ??
                sub.onlineSessionLimit - sub.onlineSessionsUsed}
            </b>{' '}
            از <b>{sub.onlineSessionLimit}</b>
          </p>
        )}

        {sub.offlineVideoAccess && (
          <p className="mt-3 text-sm text-green-700 font-medium">
            دسترسی ورود و ویدئوهای آفلاین پس از پایان دوره نیز حفظ می‌شود.
          </p>
        )}

        {sub.productType === 'academy' && !sub.hasStarted && (
          <button
            onClick={startAcademy}
            className="w-full mt-5 py-3 text-white font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all">
            شروع دوره ۹۰ روزه
          </button>
        )}

        {/* AI Coach Message */}
        <div className="mt-5 p-4 rounded-xl bg-white/40 border border-white/50 shadow-inner text-sm text-gray-800">
          <span className="font-semibold">پیام مربی :</span>
          <br />
          {getAIMsg()}
        </div>

        {/* Renew Button */}
        {(sub.productType === 'pro' || sub.productType === 'private') &&
          (remaining <= 0 || isExpired) && (
            <button
              className="w-full mt-5 py-3 text-white font-semibold rounded-xl shadow-lg
                       bg-gradient-to-r from-blue-600 to-purple-600
                       hover:opacity-90 active:scale-95 transition-all
                       relative overflow-hidden">
              <span className="relative z-10">تمدید اشتراک</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-50 blur-xl animate-pulse"></div>
            </button>
          )}

        {/* Academy Extra Reports */}
        {sub.productType === 'academy' && remaining <= 0 && (
          <button className="w-full mt-5 py-3 bg-yellow-500 text-black font-semibold rounded-xl shadow hover:bg-yellow-600 active:scale-95 transition-all">
            خرید گزارش بیشتر
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;
