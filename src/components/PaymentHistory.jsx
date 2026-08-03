import React, { useEffect, useState, useRef } from 'react';
import api from 'api/api';
import gsap from 'gsap';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import ContextualHeader from './ui/ContextualHeader';
import BottomTabNavigation from './ui/BottomTabNavigation';

dayjs.extend(jalaliday);
dayjs.locale('fa');

const toFa = (num) =>
  num ? num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]) : '—';

const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const cardsRef = useRef([]);
  const userId = JSON.parse(localStorage.getItem('userData')).id;

  useEffect(() => {
    api.get(`/api/zarinpal/history/${userId}`).then((res) => {
      const list = res.data.history || [];
      setHistory(list);
      setFiltered(list);
      setLoading(false);

      setTimeout(() => {
        gsap.from(cardsRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
        });
      }, 50);
    });
  }, [userId]);

  // ------------------------
  // Handle Filters
  // ------------------------
  useEffect(() => {
    if (filter === 'all') {
      setFiltered(history);
    } else {
      setFiltered(history.filter((h) => h.status === filter));
    }
  }, [filter, history]);

  // ------------------------
  // Total Paid Amount
  // (فقط پرداخت‌های موفق)
  // ------------------------
  const totalPaid = history
    .filter((h) => h.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);

  // ------------------------
  // Skeleton Loader
  // ------------------------
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="academy-shell academy-grain font-vazir">
      <ContextualHeader />

      <main className="academy-page relative z-10" dir="rtl">
        <div className="space-y-5">
          {/* =================== TITLE =================== */}
          <div className="mb-6">
            <p className="academy-kicker">مالی و اشتراک</p>
            <h2 className="academy-title mt-2">سوابق پرداخت</h2>
          </div>

          {/* =================== TOTAL PAID =================== */}
          <div className="academy-surface bg-[#dce6df]/70 p-5 text-right">
            <p className="text-gray-600 text-sm">جمع کل پرداخت‌های موفق</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {toFa(totalPaid)} تومان
            </p>
          </div>

          {/* =================== FILTERS =================== */}
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {[
              { key: 'all', label: 'همه' },
              { key: 'completed', label: 'موفق' },
              { key: 'failed', label: 'ناموفق' },
              { key: 'pending', label: 'در انتظار' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`
                  px-4 py-2 rounded-full text-sm border
                  ${
                    filter === f.key
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white/40 border-gray-300 text-gray-700'
                  }
                `}>
                {f.label}
              </button>
            ))}
          </div>

          {/* =================== LIST =================== */}
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              هیچ پرداختی با این فیلتر یافت نشد.
            </p>
          ) : (
            filtered.map((item, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="
                  bg-[#fffdf8]/90
                  shadow-[0_14px_40px_rgba(28,44,41,.06)]
                  border border-[#1c2c29]/10
                  rounded-[1.5rem]
                  p-5
                  text-right relative
                ">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 relative z-10">
                  {item.productType === 'pro'
                    ? 'اشتراک ۳ ماهه پرو'
                    : item.productType === 'private'
                    ? 'اشتراک ۱ ماهه پرایویت'
                    : item.productType === 'academy'
                    ? 'دوره آکادمی'
                    : 'پرداخت'}
                </h3>

                {/* Amount */}
                <p className="text-gray-700 mt-1 relative z-10">
                  مبلغ: {toFa(item.amount)} تومان
                </p>

                {/* Status Badge */}
                <span
                  className={`
                    text-sm font-bold px-3 py-1 rounded-full inline-block mt-3 relative z-10
                    ${
                      item.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'failed'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  `}>
                  {item.status === 'completed'
                    ? 'پرداخت موفق'
                    : item.status === 'failed'
                    ? 'پرداخت ناموفق'
                    : 'در انتظار تأیید'}
                </span>

                {/* Date */}
                <p className="text-gray-500 mt-3 text-sm">
                  تاریخ:{' '}
                  {dayjs(item.createdAt)
                    .calendar('jalali')
                    .locale('fa')
                    .format('YYYY/MM/DD - HH:mm')}
                </p>

                {/* RefID */}
                {item.RefID && (
                  <p className="text-gray-500 mt-1 text-xs">
                    کد پیگیری: {toFa(item.RefID)}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <BottomTabNavigation />
    </div>
  );
};

export default PaymentHistory;
