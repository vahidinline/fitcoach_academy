import api from 'api/api';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function ZarinpalCallback() {
  const [searchParams] = useSearchParams();
  const authority = searchParams.get('Authority'); // زرین پال اینو پس میده
  const status = searchParams.get('Status'); // OK یا NOK
  const [message, setMessage] = useState('در حال بررسی پرداخت...');
  const [reTry, setRetry] = useState(false);

  useEffect(() => {
    if (status !== 'OK') {
      setMessage('پرداخت لغو شد یا ناموفق بود');
      return;
    }

    const amount = localStorage.getItem('priceRial'); // مبلغی که قبلا ذخیره کردی
    const email = localStorage.getItem('userEmail'); // اگه لازم داری

    if (!amount || !authority) {
      setMessage('اطلاعات پرداخت کامل نیست');
      return;
    }

    verifyPayment({ amount, authority, email });
  }, []);

  const verifyPayment = async ({ amount, authority, email }) => {
    try {
      const res = await api.post('/zarinpal/callback', {
        amount,
        authority,
        email,
      });

      if (res.data.success) {
        setMessage('✅ پرداخت با موفقیت انجام شد');
        // اینجا می‌تونی به داشبورد هدایت کنی
        // navigate("/dashboard");
      } else {
        setMessage('❌ پرداخت ناموفق بود');
        setRetry(true);
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ خطا در ارتباط با سرور');
      setRetry(true);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{message}</h2>
      <>{reTry}</>
      {reTry && (
        <button
          className="btn btn-primary mt-4"
          onClick={() =>
            (window.location.href = 'https://academy.azishafiei.com/register')
          }>
          تلاش مجدد
        </button>
      )}
    </div>
  );
}

export default ZarinpalCallback;
