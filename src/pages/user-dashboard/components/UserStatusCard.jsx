import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import api from 'api/api';

const toFa = (num) =>
  num !== null && num !== undefined
    ? num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
    : '—';

const UserStatusCard = ({ userId }) => {
  const [data, setData] = useState({
    client: null,
    subscription: null,
    assessment: null,
    weight: null,
  });

  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);

  // ==== Animation ====
  useEffect(() => {
    if (!loading) {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
      });
    }
  }, [loading]);

  // ==== Unified Data Fetch ====
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const [client, sub, assess, weight] = await Promise.allSettled([
          api.get(`/api/client/${userId}`),
          api.get(`/subscription/active/${userId}`),
          api.get(`/ShapeUpAssessment/${userId}`),
          api.get(`/report/weight/${userId}`),
        ]);

        setData({
          client:
            client.status === 'fulfilled'
              ? client.value.data?.data || client.value.data || null
              : null,

          subscription:
            sub.status === 'fulfilled'
              ? sub.value.data?.subscription || null
              : null,

          assessment:
            assess.status === 'fulfilled'
              ? assess.value.data?.data || null
              : null,

          weight:
            weight.status === 'fulfilled'
              ? weight.value.data?.data || weight.value.data || null
              : null,
        });
      } catch (err) {
        console.error('Unified fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // ==== Loading UI ====
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20 shadow animate-pulse">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-center text-muted-foreground mt-3">
          در حال بارگذاری...
        </p>
      </div>
    );
  }

  // ==== If NO CLIENT ====
  if (!data.client) {
    return (
      <div className="backdrop-blur-xl bg-red-100/20 rounded-xl p-6 border border-red-300 shadow">
        <p className="text-center text-red-500 text-sm">
          کاربر {userId} یافت نشد.
        </p>
      </div>
    );
  }

  // ==== Normalized Variables ====
  const client = data.client;
  const sub = data.subscription;
  const assess = data.assessment;
  const weight = data.weight;

  const height = assess?.height || null;
  const mainGoal = assess?.mainGoal || null;

  const startingWeight = weight?.startingWeight || null;
  const lastEntry =
    weight?.weightEntries?.length > 0
      ? weight.weightEntries[weight.weightEntries.length - 1]
      : null;

  const currentWeight = lastEntry?.weight || startingWeight;

  const calcBMI = () => {
    if (!height || !currentWeight) return null;
    const h = height / 100;
    return (currentWeight / (h * h)).toFixed(1);
  };

  const subscriptionLabel =
    sub?.productType === 'pro'
      ? 'پرو (۳ ماهه)'
      : sub?.productType === 'private'
      ? 'پرایویت (۱ ماهه)'
      : sub?.productType === 'academy'
      ? 'آکادمی (دائمی)'
      : '—';

  const daysLeft = sub?.expiresAt
    ? dayjs(sub.expiresAt).diff(dayjs(), 'day')
    : null;

  const remainingReports = sub ? sub.reportLimit - sub.reportsUsed : null;

  const jalaliExpiry = sub?.expiresAt
    ? dayjs(sub.expiresAt).calendar('jalali').locale('fa').format('YYYY/MM/DD')
    : '—';

  return (
    <div
      ref={cardRef}
      className="bg-blue-100 rounded-2xl p-6 border border-white/60 shadow-xl text-gray-900 text-right">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img
            src={client.photo || '/default-avatar.png'}
            className="w-16 h-16 rounded-full border border-white/30 shadow"
          />

          <div>
            <h2 className="text-xl font-bold">{client.name}</h2>
            <p className="text-gray-500 text-sm">{client.email}</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-green-500 text-white">
          فعال
        </span>
      </div>

      {/* SUBSCRIPTION */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4 text-center">
        <div>
          <p className="text-xs text-gray-600">نوع اشتراک</p>
          <p className="text-lg font-bold">{subscriptionLabel}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600">روز باقی‌مانده</p>
          <p className="text-lg font-bold">{toFa(daysLeft)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600">گزارش‌های باقی‌مانده</p>
          <p className="text-lg font-bold">{toFa(remainingReports)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600">تاریخ پایان</p>
          <p className="text-lg font-bold">{jalaliExpiry}</p>
        </div>
      </div>

      {/* BODY METRICS */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-bold mb-4">وضعیت بدنی</h3>

        <div className="space-y-3">
          {[
            ['وزن فعلی', `${toFa(currentWeight)} کیلو`],
            ['وزن اولیه', `${toFa(startingWeight)} کیلو`],
            ['وزن هدف', `${toFa(weight?.goalWeight || null)} کیلو`],
            ['قد', `${toFa(height)} سانتی‌متر`],
            ['BMI', toFa(calcBMI())],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="flex justify-between p-3 bg-white/30 border border-white/40 rounded-xl backdrop-blur-md">
              <span>{label}</span>
              <span className="font-bold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* GOAL */}
      <div className="border-t pt-4 mt-6 text-center">
        <p className="text-xs text-gray-600">هدف</p>
        <p className="text-lg font-bold">
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
