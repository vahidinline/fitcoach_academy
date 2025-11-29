import React, { useEffect, useState, useRef } from 'react';
import { Users } from 'lucide-react';
import gsap from 'gsap';
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import api from 'api/api';

const toFa = (num) =>
  num ? num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]) : '—';

const UserStatusCard = ({ userId }) => {
  const [client, setClient] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [weightProgress, setWeightProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref for GSAP animation
  const cardRef = useRef(null);

  // Animate card entry
  useEffect(() => {
    if (!loading) {
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, [loading]);

  // Load all API data
  useEffect(() => {
    if (!userId) return;

    const fetchAll = async () => {
      try {
        const results = await Promise.allSettled([
          api.get(`/api/client/${userId}`),
          api.get(`/api/subscription/active/${userId}`),
          api.get(`/ShapeUpAssessment/${userId}`),
          api.get(`/report/weight/${userId}`),
        ]);

        const [clientRes, subRes, assessRes, weightRes] = results;

        if (clientRes.status === 'fulfilled') {
          setClient(clientRes.value.data?.data || clientRes.value.data);
        }

        if (subRes.status === 'fulfilled') {
          setSubscription(subRes.value.data?.subscription || null);
        }

        if (assessRes.status === 'fulfilled') {
          setAssessment(assessRes.value.data?.data || null);
        }

        if (weightRes.status === 'fulfilled') {
          setWeightProgress(weightRes.value.data?.data || weightRes.value.data);
        }
      } catch (err) {
        console.error('Critical fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  // -----------------------
  // UI Loading (Glass + Glow)
  // -----------------------
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg animate-pulse">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground text-center mt-4">
          در حال بارگذاری...
        </p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="backdrop-blur-xl bg-red-100/20 rounded-xl p-6 border border-red-300/20 shadow-lg">
        <p className="text-red-500 text-sm text-center">کاربر یافت نشد.</p>
      </div>
    );
  }

  // -----------------------
  // Data extraction
  // -----------------------
  const { name, email, photo } = client;
  const height = assessment?.height || null;
  const mainGoal = assessment?.mainGoal;
  const startingWeight = weightProgress?.startingWeight || null;
  const goalWeight = weightProgress?.goalWeight || null;

  const lastEntry =
    weightProgress?.weightEntries?.length > 0
      ? weightProgress.weightEntries[weightProgress.weightEntries.length - 1]
      : null;

  const currentWeight = lastEntry?.weight || startingWeight;

  const calcBMI = () => {
    if (!height || !currentWeight) return null;
    const h = height / 100;
    return (currentWeight / (h * h)).toFixed(1);
  };

  // Subscription
  const sub = subscription;
  const daysLeft = sub?.expiresAt
    ? dayjs(sub.expiresAt).diff(dayjs(), 'day')
    : null;

  const remainingReports = sub ? sub.reportLimit - sub.reportsUsed : 0;
  const jalaliExpiry = sub?.expiresAt
    ? dayjs(sub.expiresAt).calendar('jalali').locale('fa').format('YYYY/MM/DD')
    : '—';

  const subscriptionLabel =
    sub?.productType === 'pro'
      ? 'پرو (۳ ماهه)'
      : sub?.productType === 'private'
      ? 'پرایویت (۱ ماهه)'
      : sub?.productType === 'academy'
      ? 'آکادمی (دائمی)'
      : '—';

  return (
    <div
      ref={cardRef}
      className="
    bg-gradient-to-r from-blue-100  to-white-400 opacity-40
    rounded-2xl
    p-6
    border border-white/60
    shadow-xl shadow-black/10
    text-right
    text-gray-900
  ">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img
            src={photo || '/default-avatar.png'}
            className="w-16 h-16 rounded-full border border-white/30 shadow"
          />

          <div>
            <h2 className="ext-xl font-bold text-gray-900">{name}</h2>
            <p className="text-white/30 text-sm">{email}</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-green-400 border border-green-300/20 text-white">
          فعال
        </span>
      </div>

      {/* SUBSCRIPTION */}
      <div className="grid grid-cols-2 gap-4 text-center text-white/80 border-t border-white/20 pt-4">
        <div>
          <p className="text-xs text-gray-600">نوع اشتراک</p>
          <p className="text-lg font-bold text-gray-900">{subscriptionLabel}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600">روز باقی‌مانده</p>
          <p className="text-lg font-bold text-gray-900">{toFa(daysLeft)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600">گزارش‌های باقی‌مانده</p>
          <p className="text-lg font-bold text-gray-900">
            {toFa(remainingReports)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-600">تاریخ پایان</p>
          <p className="text-lg font-bold text-gray-900">{jalaliExpiry}</p>
        </div>
      </div>

      {/* STATS */}
      {/* BODY METRICS */}
      <div className="mt-6 border-t border-white/40 pt-4">
        <h3 className="text-lg font-bold mb-4 text-gray-900">وضعیت بدنی</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white/30 p-3 rounded-xl backdrop-blur-md border border-white/40">
            <span className="text-gray-700">وزن فعلی</span>
            <span className="font-bold text-gray-900">
              {toFa(currentWeight)} کیلو
            </span>
          </div>

          <div className="flex items-center justify-between bg-white/30 p-3 rounded-xl backdrop-blur-md border border-white/40">
            <span className="text-gray-700">وزن اولیه</span>
            <span className="font-bold text-gray-900">
              {toFa(startingWeight)} کیلو
            </span>
          </div>

          <div className="flex items-center justify-between bg-white/30 p-3 rounded-xl backdrop-blur-md border border-white/40">
            <span className="text-gray-700">وزن هدف</span>
            <span className="font-bold text-gray-900">
              {toFa(goalWeight)} کیلو
            </span>
          </div>

          <div className="flex items-center justify-between bg-white/30 p-3 rounded-xl backdrop-blur-md border border-white/40">
            <span className="text-gray-700">قد</span>
            <span className="font-bold text-gray-900">
              {toFa(height)} سانتی‌متر
            </span>
          </div>

          <div className="flex items-center justify-between bg-white/30 p-3 rounded-xl backdrop-blur-md border border-white/40">
            <span className="text-gray-700">BMI</span>
            <span className="font-bold text-gray-900">{toFa(calcBMI())}</span>
          </div>
        </div>
      </div>

      {/* GOAL */}
      <div className="border-t border-white/20 pt-4 text-center text-white mt-6">
        <p className="text-xs text-gray-600">هدف</p>
        <p className="text-lg font-bold text-gray-900">
          {mainGoal === 'recomp'
            ? 'بادی‌رکامپ'
            : mainGoal === 'fat_loss'
            ? 'کاهش وزن'
            : mainGoal === 'muscle_gain'
            ? 'افزایش حجم'
            : '—'}
        </p>
      </div>
    </div>
  );
};

export default UserStatusCard;
