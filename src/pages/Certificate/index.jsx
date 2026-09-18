import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import ContextualHeader from 'components/ui/ContextualHeader';
import React, { useEffect, useState } from 'react';
import CertificateForm from './components/Request-for-cert';
import SelectCert from './components/SelectCert';
import ProgressIndicator from './components/ProgressIndicator';
import CertTemp from '../../assets/img/CertTemplate.png';
import { useAuthStore } from 'store/useAuthStore';
export default function CertificateIndex({ endpoint }) {
  const [clientId, setClientId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [certificateData, setCertificateData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState(1);
  const [type, setType] = React.useState(null);
  const {
    selectedUserType,
    selectedAuthMethod,
    contactInfo,
    verificationCode,
    isVerified,
    userId,
    setField,
    updateFields,
    reset,
  } = useAuthStore();
  console.log('certificateData', certificateData);
  // ✅ Load clientId on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setClientId(parsedUser.id);
      }
    } catch (error) {
      console.error('Error retrieving clientId:', error);
    }
  }, []);

  // ✅ Once clientId is set, fetch certificate automatically
  useEffect(() => {
    if (!clientId) return; // wait until clientId is available

    const fetchCertificate = async () => {
      setStatus('loading');
      try {
        const res = await api.get(`/certificate/${clientId}`);

        setCertificateData(Array.isArray(res.data) ? res.data : []);
        setStatus('success');
      } catch (error) {
        if (error.response?.status === 404) {
          setCertificateData([]);
          setStatus('success');
          return;
        }
        console.error('Error fetching certificate:', error);
        setStatus('error');
        setErrorMsg('خطا در دریافت سرتیفیکت.');
      }
    };

    fetchCertificate();
  }, [clientId]); // run only when clientId becomes available

  const handleSelect = (type) => {
    setType(type);
    setStep(type ? 2 : 1);

    // Here you can add the logic to handle the certificate selection
  };

  const handlePaymentComplete = async (cert) => {
    try {
      const res = await api.post('/zarinpal/rial', {
        amount: cert.certificateType === 'Nutrition' ? 5000000 : 1000000,
        userId: clientId || userId,
        name: cert.clientName,
        contact: contactInfo || JSON.parse(localStorage.getItem('userData') || '{}').phoneNumber || '',
        product: 'Certificate_' + cert.certificateType,
        location: '',
      });
      console.log(res);
      if (res?.data?.url) window.location.href = res.data.url;
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const getCertPrice = (certType) => {
    switch (certType) {
      case 'Nutrition':
        return '50 یورو ';
      case 'Participation':
        return '10 یورو';
      default:
        return 'نامشخص';
    }
  };

  const getCertRialPrice = (certType) => {
    switch (certType) {
      case 'Nutrition':
        return '۵ میلیون تومان ';
      case 'Participation':
        return '۱ میلیون تومان';
      default:
        return 'نامشخص';
    }
  };
  const getCertStatus = (certType) => {
    switch (certType) {
      case 'cancelled':
        return 'لغو شده';
      case 'shipped':
        return 'ارسال شده';
      case 'delivered':
        return 'تحویل داده شده';

      case 'pending':
        return 'در حال بررسی';
      case 'waitingForIssuance':
        return 'در انتظار صدور';
      case 'failed':
        return 'ناموفق';
      case 'waitingForPayment':
        return 'در انتظار پرداخت';
      case 'paid':
        return 'پرداخت شده';

      case 'issued':
        return 'صادر شده';
      case 'rejected':
        return 'رد شده';
      default:
        return 'unknown';
    }
  };

  return (
    <div className="academy-shell academy-grain">
      <ContextualHeader />

      <main className="academy-page relative z-10" dir="rtl">
        <div>
          <div className="mb-7">
            <p className="academy-kicker">دستاورد مسیر</p>
            <h2 className="academy-title mt-2">گواهی‌های من</h2>
            <p className="mt-3 text-sm text-[#68716d]">وضعیت صدور گواهی‌ها را ببین یا درخواست جدید ثبت کن.</p>
          </div>
          {/* Progress Indicator */}
          {/* <ProgressIndicator currentStep={step} totalSteps={3} /> */}
          {status === 'loading' && <p>در حال دریافت سرتیفیکت...</p>}
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            {certificateData?.map((cert) => (
              <div
                key={cert._id}
                className="card image-full w-full overflow-hidden rounded-[1.5rem] bg-[#fffdf8] shadow-[0_18px_45px_rgba(28,44,41,.1)]">
                <figure>
                  <img src={CertTemp} alt="cert" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{cert.clientName}</h2>
                  <p>وضعیت گواهی: {getCertStatus(cert.certificateStatus)}</p>
                  <div className="card-actions justify-end">
                    {['pending', 'waitingForPayment'].includes(cert.certificateStatus) && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            handlePaymentComplete(cert)
                          }
                          className="btn btn-primary">
                          پرداخت هزینه صدور گواهی{' '}
                          {getCertRialPrice(cert.certificateType)}
                        </button>
                      </div>
                    )}
                    {cert.certificateStatus === 'issued' && (
                      <button className="btn btn-secondary">
                        مشاهده گواهی
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {status === 'error' && <p className="text-red-600">{errorMsg}</p>}

          {Array.isArray(certificateData) && certificateData.length === 0 && status === 'success' && (
            <div className="mb-5 rounded-2xl border border-[#dce4db] bg-[#f7faf5] p-5 text-sm leading-7 text-[#547466]">
              هنوز درخواستی برای گواهی ثبت نشده است. نوع گواهی مورد نظر خود را انتخاب کنید.
            </div>
          )}
          {(!certificateData || certificateData.length === 0) && (
            <div className="academy-surface mt-5 p-5 text-[#547466]">
              <SelectCert
                handleSelect={handleSelect}
                clientId={clientId}
                setType={setType}
                type={type}
              />
            </div>
          )}
        </div>
      </main>
      <BottomTabNavigation />
    </div>
  );
}
