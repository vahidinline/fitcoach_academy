import { useEffect } from 'react';
import api from 'api/api';
export default function ZarinpalCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = new URL('/api/zarinpal/callback', api.defaults.baseURL);
    target.searchParams.set('Authority', params.get('Authority') || '');
    target.searchParams.set('Status', params.get('Status') || 'NOK');
    window.location.replace(target.href);
  }, []);
  return <p dir="rtl" className="p-8 text-center">در حال بررسی پرداخت…</p>;
}
