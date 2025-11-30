import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import StepIndicator from './components/StepIndicator';
import SelectUserType from './components/SelectUserType';
import LocationSelectionStep from './components/LocationSelectionStep';
import ServiceSelectionStep from './components/ServiceSelectionStep';
import AuthMethodStep from './components/AuthMethodStep';
import VerificationStep from './components/VerificationStep';
import PaymentStep from './components/PaymentStep';

import api from 'api/api';
import { useAuthStore } from 'store/useAuthStore';

const RegistrationStepper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedUserType,
    selectedService,
    selectedServiceName,
    selectedLocation,
    selectedAuthMethod,
    contactInfo,
    verificationCode,
    isVerified,
    userId,
    updateFields,
    reset,
  } = useAuthStore();

  const [services, setServices] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = 6;

  // ---------------------------------
  // Handle Next & Back
  // ---------------------------------
  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleExit = () => {
    reset();
    navigate('/login');
  };

  // ---------------------------------
  // STEP 3: Select Service → Save to Zustand
  // ---------------------------------
  const handleServiceSelect = (serviceId) => {
    const svc = services.find((s) => s._id === serviceId);

    if (!svc) return;

    updateFields({
      selectedService: serviceId,
      selectedServiceName: {
        name: svc.name.name,
        displayName: svc.name.displayName,
        code: svc.name.code,
      },
      selectedServicePrice: svc.price,
      selectedServiceRialPrice: svc.priceRial,
    });
  };

  // ---------------------------------
  // Handle Verification
  // ---------------------------------
  const handleVerificationComplete = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        'https://aziserver.azurewebsites.net/academyAuth/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: contactInfo,
            otp: verificationCode,
          }),
        }
      );

      const data = await res.json();

      if (data.status === 'ok') {
        updateFields({ isVerified: true, userId: data.userData.id });
        handleNext();
      } else {
        setError(data.error || 'کد تایید اشتباه است');
      }
    } catch (err) {
      setError('خطای سرور در تایید کد');
    }

    setLoading(false);
  };

  // ---------------------------------
  // Handle Send OTP
  // ---------------------------------
  const handleSendOtp = async (value) => {
    setLoading(true);

    try {
      const res = await fetch(
        'https://aziserver.azurewebsites.net/academyAuth/auth',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: selectedAuthMethod,
            email: selectedAuthMethod === 'email' ? value : undefined,
            phoneNumber: selectedAuthMethod === 'sms' ? value : undefined,
            location: selectedLocation,
            platform: 'web',
          }),
        }
      );

      const data = await res.json();

      if (data.status === 'ok') {
        updateFields({ userId: data.userId });
        setCurrentStep(5);
      } else {
        setError(data.error || 'مشکلی پیش آمده است');
      }
    } catch (err) {
      setError('خطا در ارسال کد');
    }

    setLoading(false);
  };

  // ---------------------------------
  // Handle Payment Result (from PaymentStep)
  // ---------------------------------
  const handlePaymentComplete = async (paymentResult) => {
    if (selectedLocation === 'iran') {
      const res = await api.post('/api/zarinpal/pay', {
        amount: paymentResult.amountRial,
        userId,
        productType: selectedServiceName.code,
        discountCode: paymentResult.discountCode,
      });

      return { url: res.data.url };
    }

    // stripe
    const res = await api.post('/api/stripe/create-session', {
      amount: paymentResult.amountUSD,
      userId,
      productType: selectedServiceName.code,
      discountCode: paymentResult.discountCode,
    });

    return { url: res.data.url };
  };

  // ---------------------------------
  // Load product list from backend
  // ---------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/productlist');
        setServices(res.data);
      } catch (err) {
        console.error('Product load failed:', err);
      }
    })();
  }, []);

  // ---------------------------------
  // Jump to Payment if already verified
  // ---------------------------------
  useEffect(() => {
    if (isVerified) {
      setCurrentStep(6);
    }
  }, []);

  // ---------------------------------
  // Render Step
  // ---------------------------------
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectUserType
            selectedUserType={selectedUserType}
            onUserSelect={(id) => updateFields({ selectedUserType: id })}
            onContinue={handleNext}
          />
        );

      case 2:
        return (
          <LocationSelectionStep
            selectedLocation={selectedLocation}
            onLocationSelect={(loc) => updateFields({ selectedLocation: loc })}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );

      case 3:
        return (
          <ServiceSelectionStep
            services={services}
            selectedService={selectedService}
            selectedLocation={selectedLocation}
            onServiceSelect={handleServiceSelect}
            onContinue={handleNext}
          />
        );

      case 4:
        return (
          <AuthMethodStep
            selectedLocation={selectedLocation}
            selectedAuthMethod={selectedAuthMethod}
            onAuthMethodSelect={(method) =>
              updateFields({ selectedAuthMethod: method, contactInfo: '' })
            }
            contactInfo={contactInfo}
            onContactInfoChange={(v) => updateFields({ contactInfo: v })}
            onContinue={handleSendOtp}
            onBack={handleBack}
            loading={loading}
          />
        );

      case 5:
        return (
          <VerificationStep
            selectedAuthMethod={selectedAuthMethod}
            contactInfo={contactInfo}
            verificationCode={verificationCode}
            onVerificationCodeChange={(v) =>
              updateFields({ verificationCode: v })
            }
            onContinue={handleVerificationComplete}
            onBack={handleBack}
            onResendCode={handleSendOtp}
            loading={loading}
          />
        );

      case 6:
        return (
          <PaymentStep
            onComplete={handlePaymentComplete}
            onBack={handleBack}
            onSkipTrial={() => navigate('/user-dashboard')}
          />
        );

      default:
        return null;
    }
  };

  // ---------------------------------
  // UI
  // ---------------------------------
  return (
    <div className="min-h-screen bg-background">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        onExit={handleExit}
      />

      <div className="max-w-md mx-auto">{renderCurrentStep()}</div>

      {/* Global Error Notification */}
      {error && (
        <div dir="rtl" className="alert alert-error mt-4">
          <span className="text-white">{error}</span>
          <button onClick={() => setError('')} className="btn btn-sm">
            بستن
          </button>
        </div>
      )}

      {/* Floating Button */}
      <div className="fab">
        <div tabIndex={0} role="button" className="btn btn-lg bg-orange-300">
          ?
        </div>

        <button
          onClick={() => window.open('https://t.me/fitlinezsupport', '_blank')}
          className="btn btn-lg bg-green-300 p-2">
          پشتیبانی تلگرام
        </button>
      </div>
    </div>
  );
};

export default RegistrationStepper;
