import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import ContextualHeader from 'components/ui/ContextualHeader';
import React, { useEffect, useState } from 'react';
import CertificateForm from './components/Request-for-cert';
import SelectCert from './components/SelectCert';
import ProgressIndicator from './components/ProgressIndicator';
import CertTemp from '../../assets/img/CertTemplate.png';
export default function CertificateIndex({ endpoint }) {
  const [clientId, setClientId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [certificateData, setCertificateData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState(1);
  const [type, setType] = React.useState(null);
  console.log(certificateData);
  // ✅ Load clientId on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Stored clientId:', parsedUser);
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
        console.log('Certificate Response:', res.data);
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

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader />

      <main className="pt-16 pb-20 lg:pb-8 lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Indicator */}
          {/* <ProgressIndicator currentStep={step} totalSteps={3} /> */}
          {status === 'loading' && <p>در حال دریافت سرتیفیکت...</p>}

          {certificateData !== null && (
            <div className="card bg-base-100 image-full w-96 shadow-sm">
              <figure>
                <img src={CertTemp} alt="cert" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{certificateData.clientName}</h2>
                <p>درخواست سرتیفیکت شما در حال بررسی می باشد</p>
                <div className="card-actions justify-end">
                  <button
                    disabled={certificateData.status !== 'approved'}
                    className="btn btn-primary">
                    مشاهده
                  </button>
                </div>
              </div>
            </div>
          )}
          <p className="text-green-600">
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
