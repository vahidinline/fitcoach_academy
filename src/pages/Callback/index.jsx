import api from 'api/api';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from 'store/useAuthStore';

function ZarinpalCallback() {
  const [searchParams] = useSearchParams();
  const authority = searchParams.get('Authority');
  const status = searchParams.get('Status');
  const navigate = useNavigate();
  const [message, setMessage] = useState('در حال بررسی پرداخت...');
  const [reTry, setRetry] = useState(false);
  const [userData, setUserData] = useState(null);
  const [amount, setAmount] = useState(null);

  const {
    selectedService,
    selectedLocation,
    selectedServicePrice,
    selectedServiceName,
    selectedServiceRialPrice,
    contactInfo,
  } = useAuthStore();

  // ✅ Only set amount when Zustand value changes
  useEffect(() => {
    if (selectedServiceRialPrice) {
      setAmount(selectedServiceRialPrice);
    }
  }, [selectedServiceRialPrice]);

  // ✅ Read user data from localStorage once
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) setUserData(JSON.parse(storedUser));
  }, []);

  // ✅ Verify payment only when all required data is available
  useEffect(() => {
    if (!authority || !status) return;

    if (status !== 'OK') {
      setRetry(true);
      setMessage('پرداخت لغو شد یا ناموفق بود');
      return;
    }

    if (userData && amount) {
      verifyPayment();
    }
  }, [authority, status, amount, userData]);

  const verifyPayment = async () => {
    console.log('Verifying payment with authority');
    if (!authority || !userData?.id || !amount) {
      setMessage('اطلاعات پرداخت کامل نیست');
      return;
    }

    try {
      const res = await api.post('/zarinpal/callback', {
        authority,
        userId: userData.id,
        amount, // ✅ send amount too
      });

      if (res.data.success) {
        setMessage('✅ پرداخت با موفقیت انجام شد');
        //wait for a few seconds and then redirect to dashboard
        setTimeout(() => {
          navigate('/');
        }, 15000);
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
      <button className="btn btn-secondary mb-4" onClick={verifyPayment}>
        بررسی مجدد وضعیت پرداخت
      </button>

      <h2>{message}</h2>

      {status === 'OK' && (
        <div className="text-right">
          لطفا کمی صبر کنید تا اکانتتون فعال بشه. این کار معمولا ۱۵ دقیقه زمان
          می‌بره. سپس می‌تونید از طریق لینک زیر وارد صفحه ورود بشید:
          <br />
          <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
            صفحه ورود
          </a>
        </div>
      )}

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
