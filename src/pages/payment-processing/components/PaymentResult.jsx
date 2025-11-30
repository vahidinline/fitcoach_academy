import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentResult = () => {
  const [params] = useSearchParams();
  const status = params.get('status'); // success | failed
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-6">
      <div
        ref={cardRef}
        className="
          backdrop-blur-xl bg-white/10 border border-white/20
          shadow-2xl rounded-2xl p-8 w-full max-w-md text-center
        ">
        {isSuccess ? (
          <>
            <CheckCircle className="text-green-400 mx-auto" size={80} />
            <h1 className="text-2xl font-bold mt-4">
              پرداخت با موفقیت انجام شد
            </h1>
            <p className="text-gray-300 mt-2">اشتراک شما فعال شد.</p>

            <button
              onClick={() => navigate('/login')}
              className="mt-6 w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 transition text-lg font-bold">
              ورود به حساب
            </button>
          </>
        ) : (
          <>
            <XCircle className="text-red-400 mx-auto" size={80} />
            <h1 className="text-2xl font-bold mt-4">پرداخت ناموفق بود</h1>
            <p className="text-gray-300 mt-2">
              مشکلی در فرایند پرداخت رخ داد. لطفاً دوباره تلاش کنید.
            </p>

            <button
              onClick={() => navigate('/register')}
              className="mt-6 w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 transition text-lg font-bold">
              تلاش دوباره
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
