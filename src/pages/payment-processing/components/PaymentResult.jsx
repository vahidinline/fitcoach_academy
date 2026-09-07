import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from 'api/api';
export default function PaymentResult() {
  const [params] = useSearchParams();
  const authority = params.get('authority');
  const [state, setState] = useState('loading');
  const [refId, setRefId] = useState('');
  useEffect(() => {
    let active = true;
    setState('loading');
    if (!authority) { setState('unknown'); return; }
    api.get(`/api/zarinpal/status/${encodeURIComponent(authority)}`)
      .then(({ data }) => { if (active) { setState(data.status); setRefId(data.refId || ''); } })
      .catch(() => { if (active) setState('unknown'); });
    return () => { active = false; };
  }, [authority]);
  const success = state === 'completed';
  const retry = () => {
    const url = new URL('/api/zarinpal/callback', api.defaults.baseURL);
    url.searchParams.set('Authority', authority);
    url.searchParams.set('Status', 'OK');
    window.location.assign(url.href);
  };
  return <main dir="rtl" className="min-h-screen grid place-items-center bg-gray-900 text-white p-6">
    <section className="max-w-md w-full bg-gray-800 rounded-2xl p-8 text-center space-y-5" aria-live="polite">
      <h1 className="text-2xl font-bold">{state === 'loading' ? 'در حال استعلام پرداخت…' : success ? 'پرداخت با موفقیت انجام شد' : state === 'failed' ? 'پرداخت ناموفق بود' : 'پرداخت هنوز تأیید نشده است'}</h1>
      {success ? <><p>اشتراک شما ثبت شد.</p>{refId && <p>کد پیگیری: {refId}</p>}<Link className="block text-green-300" to="/user-dashboard">ورود به حساب</Link></> : state !== 'loading' && <>
        <p>ممکن است پرداخت لغو شده باشد یا تأیید آن کامل نشده باشد. اگر مبلغ کسر شده، دوباره پرداخت نکنید؛ ابتدا بررسی مجدد را بزنید و در صورت تداوم مشکل با پشتیبانی تماس بگیرید.</p>
        {authority && <><p className="break-all text-sm">شناسه پرداخت: {authority}</p><button className="w-full rounded-xl bg-orange-600 p-3" onClick={retry}>بررسی مجدد پرداخت</button></>}
        <Link className="block text-gray-300" to="/register">بازگشت به ثبت‌نام</Link>
      </>}
    </section>
  </main>;
}
