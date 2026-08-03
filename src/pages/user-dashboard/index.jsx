import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Play,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import api from 'api/api';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import DashboardChecklist from '../../components/DashboardChecklist';
import Thumb01 from '../../assets/img/video01.jpg';

const fa = (value) =>
  value === null || value === undefined
    ? '—'
    : String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);

const getMondayState = () => {
  const now = new Date();
  const isMonday = now.getDay() === 1;
  const target = new Date(now);

  if (isMonday) {
    target.setHours(23, 59, 59, 999);
  } else {
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    target.setDate(now.getDate() + daysUntilMonday);
    target.setHours(0, 0, 0, 0);
  }

  const difference = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);

  return { isMonday, days, hours, minutes };
};

const subscriptionNames = {
  academy: 'آکادمی',
  pro: 'تکمیلی',
  private: 'خصوصی',
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch {
      return {};
    }
  }, []);
  const userId = storedUser?.id;

  const [data, setData] = useState({ client: null, subscription: null, reports: [] });
  const [status, setStatus] = useState('loading');
  const [monday, setMonday] = useState(getMondayState);
  const [starting, setStarting] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setStatus('loading');
    const [clientResult, subscriptionResult, reportsResult] = await Promise.allSettled([
      api.get(`/api/client/${userId}`),
      api.get(`/subscription/active/${userId}`),
      api.get(`/report/my?userId=${userId}`),
    ]);

    setData({
      client:
        clientResult.status === 'fulfilled'
          ? clientResult.value.data?.data || clientResult.value.data
          : storedUser,
      subscription:
        subscriptionResult.status === 'fulfilled'
          ? subscriptionResult.value.data?.subscription || null
          : null,
      reports:
        reportsResult.status === 'fulfilled'
          ? reportsResult.value.data?.reports || []
          : [],
    });
    setStatus('ready');
  }, [storedUser, userId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => setMonday(getMondayState()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const startAcademy = async () => {
    if (!window.confirm('با شروع دوره، شمارش ۹۰ روز از امروز آغاز می‌شود. ادامه می‌دهید؟')) return;
    setStarting(true);
    try {
      const response = await api.post(`/subscription/academy/${userId}/start`);
      setData((current) => ({ ...current, subscription: response.data.subscription }));
    } catch (error) {
      window.alert(error.response?.data?.message || 'شروع دوره انجام نشد.');
    } finally {
      setStarting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="academy-shell academy-grain">
        <ContextualHeader />
        <main className="academy-page" dir="rtl">
          <div className="grid animate-pulse gap-5 lg:grid-cols-3">
            <div className="h-72 rounded-[2rem] bg-white/60 lg:col-span-2" />
            <div className="h-72 rounded-[2rem] bg-white/60" />
            <div className="h-48 rounded-[2rem] bg-white/60 lg:col-span-3" />
          </div>
        </main>
        <BottomTabNavigation />
      </div>
    );
  }

  const { client, subscription, reports } = data;
  const remainingReports = subscription
    ? subscription.remainingReports ?? Math.max(0, subscription.reportLimit - subscription.reportsUsed)
    : 0;
  const reportPercent = subscription?.reportLimit
    ? Math.min(100, Math.max(0, (subscription.reportsUsed / subscription.reportLimit) * 100))
    : 0;
  const sortedReports = [...reports].sort(
    (first, second) => new Date(second.date || second.createdAt) - new Date(first.date || first.createdAt),
  );
  const latestFeedback = sortedReports.find((report) => report.coachFeedback?.comment);
  const isAcademyWaiting = subscription?.productType === 'academy' && !subscription.hasStarted;
  const isExpired = Boolean(subscription?.isExpired);

  const action = isAcademyWaiting
    ? {
        kicker: 'آماده‌ای شروع کنی؟',
        title: 'زمان دوره هنوز آغاز نشده است',
        description: 'هر زمان آماده بودی، دوره ۹۰ روزه و سهمیه‌های تو از همان لحظه فعال می‌شوند.',
        button: 'شروع دوره ۹۰ روزه',
        onClick: startAcademy,
      }
    : isExpired
      ? {
          kicker: 'آرشیو مسیر شما',
          title: 'دوره به پایان رسیده؛ آموزش‌ها همچنان همراه تو هستند',
          description: 'می‌توانی وارد پنل بمانی، ویدئوهای آفلاین را ببینی و مسیر ثبت‌شده‌ات را مرور کنی.',
          button: 'ادامه آموزش',
          onClick: () => navigate('/training-video-player'),
        }
      : monday.isMonday && remainingReports > 0
        ? {
            kicker: 'امروز روز گزارش است',
            title: 'گزارش این هفته را تا پایان امشب بفرست',
            description: `${fa(monday.hours)} ساعت و ${fa(monday.minutes)} دقیقه تا بسته‌شدن پنجره ارسال باقی مانده است.`,
            button: 'شروع گزارش هفته',
            onClick: () => navigate('/progress-report-submission'),
          }
        : {
            kicker: 'قدم بعدی شما',
            title: 'برای گزارش بعدی آماده بمان',
            description: `${fa(monday.days)} روز و ${fa(monday.hours)} ساعت تا دوشنبه بعدی باقی مانده است.`,
            button: 'مرور مسیر پیشرفت',
            onClick: () => navigate('/progress-report-submission?tab=notes'),
          };

  return (
    <div className="academy-shell academy-grain">
      <ContextualHeader />
      <main className="academy-page relative z-10" dir="rtl">
        <section className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="academy-kicker">مسیر امروز</p>
            <h2 className="academy-title mt-2">{client?.name ? `${client.name} عزیز،` : ''} امروز چه قدمی برمی‌داری؟</h2>
          </div>
          <p className="text-xs font-medium text-[#7a827e]">
            {new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.65fr_1fr]">
          <section className="relative overflow-hidden rounded-[2rem] bg-[#1c2c29] p-6 text-[#f7f2e9] shadow-[0_28px_70px_rgba(28,44,41,.22)] sm:p-9">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 left-20 h-56 w-56 rounded-full bg-[#df6b52]/15 blur-3xl" />
            <div className="relative">
              <div className="mb-10 flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-[#df9a89]">
                  {action.kicker}
                </span>
                <Sparkles size={19} className="text-[#df6b52]" />
              </div>
              <h3 className="max-w-xl text-2xl font-black leading-[1.55] tracking-[-0.04em] sm:text-4xl">
                {action.title}
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">{action.description}</p>
              <button
                type="button"
                disabled={starting}
                onClick={action.onClick}
                className="academy-primary-button mt-8 min-w-48">
                {starting ? 'در حال شروع…' : action.button}
                <ArrowLeft size={18} />
              </button>
            </div>
          </section>

          <section className="academy-surface p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="academy-kicker">وضعیت عضویت</p>
                <h3 className="mt-2 text-xl font-black">
                  {subscriptionNames[subscription?.productType] || 'بدون اشتراک فعال'}
                </h3>
              </div>
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-sm font-black text-[#1c2c29]"
                style={{ background: `conic-gradient(#df6b52 ${reportPercent}%, #e7e2d8 0)` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fffdf8]">
                  {fa(Math.round(reportPercent))}٪
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="academy-metric">
                <p className="text-[10px] font-semibold text-[#7a827e]">روز باقی‌مانده</p>
                <p className="mt-2 text-2xl font-black">{fa(subscription?.remainingDays ?? '—')}</p>
              </div>
              <div className="academy-metric">
                <p className="text-[10px] font-semibold text-[#7a827e]">گزارش باقی‌مانده</p>
                <p className="mt-2 text-2xl font-black">{fa(remainingReports)}</p>
              </div>
            </div>
            {subscription?.expiresAt && (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#68716d]">
                <CalendarDays size={16} />
                پایان دوره: {new Date(subscription.expiresAt).toLocaleDateString('fa-IR')}
              </div>
            )}
          </section>

          <section className="academy-surface p-5 sm:p-7 lg:col-span-2">
            <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1.2fr_.8fr]">
              <button
                type="button"
                onClick={() => navigate('/training-video-player')}
                className="group relative min-h-52 overflow-hidden rounded-[1.5rem] text-right">
                <img src={Thumb01} alt="ادامه آموزش" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-l from-[#1c2c29]/95 via-[#1c2c29]/70 to-transparent" />
                <div className="relative flex h-full max-w-sm flex-col justify-between p-6 text-white">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#df6b52] shadow-xl">
                    <Play size={18} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/50">ادامه یادگیری</p>
                    <h3 className="mt-2 text-xl font-black">جلسه بعدی مسیر آموزشی تو آماده است</h3>
                  </div>
                </div>
              </button>

              <div className="rounded-[1.5rem] border border-[#1c2c29]/10 bg-[#f3efe7]/55 p-5">
                <div className="flex items-center gap-2 text-[#c45843]">
                  <MessageCircle size={18} />
                  <p className="text-xs font-extrabold">آخرین پیام مربی</p>
                </div>
                {latestFeedback ? (
                  <>
                    <p className="mt-5 line-clamp-4 text-sm leading-8 text-[#394440]">
                      «{latestFeedback.coachFeedback.comment}»
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/progress-report-submission?tab=notes')}
                      className="mt-5 text-xs font-bold text-[#1c2c29] underline decoration-[#df6b52] decoration-2 underline-offset-4">
                      مشاهده تمام بازخوردها
                    </button>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <Clock3 className="mx-auto text-[#9aa19d]" size={24} />
                    <p className="mt-3 text-xs leading-6 text-[#7a827e]">پس از بررسی اولین گزارش، پیام مربی اینجا دیده می‌شود.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="academy-surface p-5 sm:p-7 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="academy-kicker">آماده‌سازی مسیر</p>
                <h3 className="mt-2 text-lg font-black">کارهای لازم برای شروع بهتر</h3>
              </div>
              <CheckCircle2 size={22} className="text-[#638176]" />
            </div>
            <DashboardChecklist />
          </section>
        </div>

        {status === 'error' && (
          <button type="button" onClick={load} className="academy-secondary-button mt-5">
            <RefreshCw size={17} /> تلاش دوباره
          </button>
        )}
      </main>
      <BottomTabNavigation />
    </div>
  );
};

export default UserDashboard;
