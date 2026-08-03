import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { academyFeatures } from '../../config/features';

const primaryItems = [
  { id: 'home', label: 'خانه', path: '/user-dashboard', icon: 'Home' },
  { id: 'report', label: 'گزارش', path: '/progress-report-submission', icon: 'FileChartColumnIncreasing' },
  { id: 'learn', label: 'آموزش', path: '/training-video-player', icon: 'PlayCircle' },
  { id: 'more', label: 'بیشتر', path: null, icon: 'LayoutGrid' },
];

const secondaryItems = [
  { label: 'پروفایل و اطلاعات اولیه', path: '/user-basic-data', icon: 'UserRoundPen' },
  { label: 'سوابق پرداخت', path: '/payment-history', icon: 'CreditCard', enabled: academyFeatures.paymentHistory },
  { label: 'آزمون دوره', path: '/quiz', icon: 'NotebookPen', enabled: academyFeatures.courseQuiz },
  { label: 'گواهی دوره', path: '/request-for-certificate', icon: 'Award', enabled: academyFeatures.courseCertificate },
].filter((item) => item.enabled !== false);

const BottomTabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  if (['/', '/login', '/registration-stepper', '/register'].includes(location.pathname)) {
    return null;
  }

  const isActive = (item) =>
    item.path
      ? location.pathname.startsWith(item.path)
      : secondaryItems.some(({ path }) => location.pathname.startsWith(path));

  const go = (item) => {
    if (item.id === 'more') {
      setShowMore(true);
      return;
    }
    navigate(item.path);
  };

  return (
    <>
      <aside
        dir="rtl"
        className="fixed inset-y-0 right-0 z-40 hidden w-72 border-l border-white/10 bg-[#1c2c29] text-[#f7f2e9] lg:flex lg:flex-col">
        <div className="px-7 pb-8 pt-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#df6b52] shadow-[0_12px_30px_rgba(223,107,82,.25)]">
              <Icon name="Activity" size={21} />
            </div>
            <div>
              <p className="text-sm font-black">Shape Up Academy</p>
              <p className="mt-0.5 text-[10px] text-white/45">مسیر شخصی سلامت شما</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.16em] text-white/35">مسیر من</p>
          <div className="space-y-1.5">
            {primaryItems.filter((item) => item.path).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-right text-sm font-bold transition ${
                  isActive(item)
                    ? 'bg-[#f7f2e9] text-[#1c2c29] shadow-xl'
                    : 'text-white/60 hover:bg-white/7 hover:text-white'
                }`}>
                <Icon name={item.icon} size={19} />
                {item.label}
              </button>
            ))}
          </div>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold tracking-[0.16em] text-white/35">حساب کاربری</p>
          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-right text-xs font-semibold transition ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-white/10 text-white'
                    : 'text-white/48 hover:bg-white/5 hover:text-white/80'
                }`}>
                <Icon name={item.icon} size={17} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="m-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/48">
          تغییر واقعی از تداوم‌های کوچک ساخته می‌شود.
        </div>
      </aside>

      <nav
        dir="rtl"
        className="fixed inset-x-3 bottom-3 z-50 rounded-[1.4rem] border border-white/80 bg-[#fffdf8]/92 p-1.5 shadow-[0_18px_45px_rgba(28,44,41,.18)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {primaryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item)}
              className={`relative flex min-h-[3.4rem] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition ${
                isActive(item) || (item.id === 'more' && showMore)
                  ? 'bg-[#1c2c29] text-white'
                  : 'text-[#7a827e]'
              }`}>
              <Icon name={item.icon} size={19} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {showMore && (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/40 p-3 backdrop-blur-sm lg:hidden" onClick={() => setShowMore(false)}>
          <section
            dir="rtl"
            onClick={(event) => event.stopPropagation()}
            className="w-full rounded-[2rem] bg-[#fffdf8] p-5 shadow-2xl">
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-[#1c2c29]/15" />
            <h2 className="mb-4 text-lg font-black">بخش‌های بیشتر</h2>
            <div className="grid grid-cols-2 gap-3">
              {secondaryItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    setShowMore(false);
                    navigate(item.path);
                  }}
                  className="flex min-h-24 flex-col items-start justify-between rounded-2xl border border-[#1c2c29]/10 bg-[#f3efe7]/70 p-4 text-right text-xs font-bold text-[#1c2c29]">
                  <Icon name={item.icon} size={21} className="text-[#df6b52]" />
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setShowMore(false)} className="academy-secondary-button mt-4 w-full">
              بستن
            </button>
          </section>
        </div>
      )}
    </>
  );
};

export default BottomTabNavigation;
