import React from 'react';
import { Link } from 'react-router-dom';

function SuccessModal() {
  return (
    <div dir="rtl" className="academy-shell academy-grain min-h-[70vh]">
      <main className="academy-page relative z-10 flex items-center justify-center">
        <section className="academy-surface w-full max-w-2xl overflow-hidden p-7 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f4e9] text-4xl">🎉</div>
          <p className="academy-kicker">دستاورد جدید</p>
          <h1 className="academy-title mt-3">آزمون را با موفقیت پشت سر گذاشتی!</h1>
          <p className="mx-auto mt-5 max-w-lg leading-8 text-[#68716d]">تبریک می‌گوییم. حالا می‌توانی درخواست صدور گواهی دوره را ثبت کنی و مراحل دریافت آن را پیگیری کنی.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/request-for-certificate" className="rounded-xl bg-[#df6b52] px-6 py-3 font-bold text-white shadow-[0_10px_22px_rgba(223,107,82,.22)] transition hover:bg-[#c95742]">درخواست گواهی دوره</Link>
            <Link to="/user-dashboard" className="rounded-xl border border-[#dce4db] px-6 py-3 font-semibold text-[#40534a] transition hover:bg-[#edf1e8]">بازگشت به داشبورد</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SuccessModal;
