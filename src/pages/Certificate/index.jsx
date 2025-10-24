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

        setCertificateData(res.data);
        setStatus('success');
      } catch (error) {
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

  const handlePaymentComplete = async (price) => {
    console.log('paymentResult', price);
    try {
      const res = await api.post('/zarinpal/rial', {
        amount: price,
        userId,
        name: certificateData.name,
        contact: contactInfo,
        product: 'Certificate_' + type,
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
      case 'delivered':
        return 'تحویل داده شده';
      default:
        return 'unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader />

      <main className="pt-16 pb-20 lg:pb-8 lg:pl-64">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Indicator */}
          {/* <ProgressIndicator currentStep={step} totalSteps={3} /> */}
          {status === 'loading' && <p>در حال دریافت سرتیفیکت...</p>}
          <div className="flex flex-row mb-4 gap-4 flex-wrap">
            {certificateData?.map((cert) => (
              <div
                key={cert._id}
                className="card bg-base-100 image-full w-96 shadow-sm">
                <figure>
                  <img src={CertTemp} alt="cert" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{cert.clientName}</h2>
                  <p>وضعیت گواهی: {getCertStatus(cert.certificateStatus)}</p>
                  <div className="card-actions justify-end">
                    {cert.certificateStatus === 'waitingForPayment' && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            handlePaymentComplete(
                              cert.certificateType === 'Nutrition'
                                ? 5000000
                                : 1000000
                            )
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

          {!certificateData && status === 'success' && (
            <div className="card bg-base-100 image-full w-96 shadow-sm">
              <figure>
                <img src={CertTemp} alt="cert" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{certificateData.clientName}</h2>
                <p>درخواست سرتیفیکت شما در حال بررسی می باشد</p>
                {certificateData.certificateStatus}
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">
                    پرداخت هزینه صدور گواهی {certificateData._id}
                  </button>
                </div>
              </div>
            </div>
          )}
          <p className="text-green-600  p-4 rounded-md">
            <SelectCert
              handleSelect={handleSelect}
              clientId={clientId}
              setType={setType}
              type={type}
            />
          </p>
        </div>
      </main>
      <BottomTabNavigation />
    </div>
  );
}
