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
import { normalizeDigits } from 'utils/persianNumbers';

const getErrorMessage = (error, fallback) =>
  error.response?.data?.error || error.response?.data?.message || error.message || fallback;

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

  const hasVerifiedBrowserSession = () => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
      return Boolean(token && storedUser?.id && String(storedUser.id) === String(userId));
    } catch {
      return false;
    }
  };

  const isRegistrationVerified = isVerified && hasVerifiedBrowserSession();

  // ---------------------------------
  // Handle Next & Back
  // ---------------------------------
  const handleNext = () => {
    // A verified user may freely change the selected product without seeing OTP again.
    if (currentStep === 3 && isRegistrationVerified) {
      setCurrentStep(6);
      return;
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    // Do not send an already verified user back to the OTP screen from payment.
    if (currentStep === 6 && isRegistrationVerified) {
      setCurrentStep(3);
      return;
    }
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
      selectedServiceLaunchOffer: svc.launchOffer || null,
    });
  };

  // ---------------------------------
  // Handle Verification
  // ---------------------------------
  const handleVerificationComplete = async () => {
    setLoading(true);
    setError('');

    try {
      const data = (await api.post('/academyAuth/verify-otp', {
        ...(selectedAuthMethod === 'email' ? { email: contactInfo } : { phone: normalizeDigits(contactInfo).replace(/[\s-]/g, '') }),
        otp: normalizeDigits(verificationCode).replace(/\D/g, ''),
      })).data;

      if (data.status === 'ok' && data.token && data.userData?.id) {
        // Keep the verified session in this browser exactly like the regular login flow.
        // This lets the person return to product selection without requesting another OTP.
        const authenticatedUser = { ...data.userData, token: data.token };
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(authenticatedUser));

        updateFields({
          isVerified: true,
          userId: data.userData.id,
          verificationCode: '',
        });
        handleNext();
      } else {
        setError(data.error || 'کد تایید اشتباه است');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'خطای سرور در تایید کد'));
    }

    setLoading(false);
  };

  // ---------------------------------
  // Handle Send OTP
  // ---------------------------------
  const handleSendOtp = async (value) => {
    setLoading(true);
    setError('');
    const normalizedValue = selectedAuthMethod === 'sms'
      ? normalizeDigits(value).replace(/[\s-]/g, '')
      : value.trim().toLowerCase();

    try {
      const data = (await api.post('/academyAuth/auth', {
        method: selectedAuthMethod,
        email: selectedAuthMethod === 'email' ? normalizedValue : undefined,
        phoneNumber: selectedAuthMethod === 'sms' ? normalizedValue : undefined,
        location: selectedLocation,
        platform: 'web',
      })).data;

      if (data.status === 'ok') {
        updateFields({ userId: data.userId });
        setCurrentStep(5);
      } else {
        setError(data.error || 'مشکلی پیش آمده است');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'خطا در ارسال کد پیامکی'));
    }

    setLoading(false);
  };

  // ---------------------------------
  // Handle Payment Result (from PaymentStep)
  // ---------------------------------
  const handlePaymentComplete = async (paymentResult) => {
    if (selectedLocation === 'iran') {
      const res = await api.post('/api/zarinpal/pay', {
        expectedAmount: paymentResult.amountRial,
        userId,
        productType: selectedServiceName.code,
        discountCode: paymentResult.discountCode,
      });

      return { url: res.data.url };
    }

    const res = await api.post('/api/paypal/create-order', {
      expectedAmount: paymentResult.amountUSD,
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
  // Resume a partially completed registration from the payment step only when
  // the matching browser session is still available.
  // ---------------------------------
  useEffect(() => {
    if (isRegistrationVerified && selectedService && selectedLocation) {
      setCurrentStep(6);
    }
  }, [isRegistrationVerified, selectedLocation, selectedService]);

  // Guard against a stale navigation state exposing the OTP screen after a
  // successful verification.
  useEffect(() => {
    if (isRegistrationVerified && (currentStep === 4 || currentStep === 5)) {
      setCurrentStep(selectedService && selectedLocation ? 6 : 3);
    }
  }, [currentStep, isRegistrationVerified, selectedLocation, selectedService]);

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
