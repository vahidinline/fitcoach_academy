import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from './components/StepIndicator';
import ServiceSelectionStep from './components/ServiceSelectionStep';
import LocationSelectionStep from './components/LocationSelectionStep';
import AuthMethodStep from './components/AuthMethodStep';
import VerificationStep from './components/VerificationStep';
import PaymentStep from './components/PaymentStep';
import SelectUserType from './components/SelectUserType';
import api from 'api/api';
import { useAuthStore } from 'store/useAuthStore';

const RegistrationStepper = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const product = queryParams.get('product');
  const [services, setServices] = useState([]);

  const totalSteps = 6;

  // Zustand store
  const {
    selectedUserType,
    selectedService,
    selectedLocation,
    selectedAuthMethod,
    contactInfo,
    verificationCode,
    isVerified,
    userId,
    setField,
    updateFields,
    reset,
  } = useAuthStore();

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleExit = () => {
    reset(); // clear Zustand store
    navigate('/login');
  };

  const handleServiceSelect = (serviceId) =>
    updateFields({
      selectedService: serviceId,
      selectedServicePrice:
        services.find((s) => s._id === serviceId)?.price || '',
      selectedServiceName:
        services.find((s) => s._id === serviceId)?.name || '',
      selectedServiceRialPrice:
        services.find((s) => s._id === serviceId)?.priceRial || '',
    });
  const handleSelectedUser = (userId) =>
    updateFields({ selectedUserType: userId });
  const handleLocationSelect = (loc) => updateFields({ selectedLocation: loc });
  const handleAuthMethodSelect = (methodId) =>
    updateFields({ selectedAuthMethod: methodId, contactInfo: '' });
  const handleContactInfoChange = (info) => updateFields({ contactInfo: info });
  const handleVerificationCodeChange = (code) =>
    updateFields({ verificationCode: code });
  console.log('isVerified', isVerified);
  const handleJump = () => {
    if (isVerified) setCurrentStep(6);
  };

  useEffect(() => {
    handleJump();
  }, []);

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
        setError(data.error || 'کد تایید نامعتبر است');
      }
    } catch (err) {
      setError(err.message || 'خطای سرور در تایید کد');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (info) => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://aziserver.azurewebsites.net/academyAuth/auth',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: selectedAuthMethod,
            email: selectedAuthMethod === 'email' ? info : undefined,
            phoneNumber: selectedAuthMethod === 'sms' ? info : undefined,
            location: selectedLocation,
            platform: 'web',
          }),
        }
      );
      const data = await res.json();
      if (data.status === 'ok') {
        updateFields({ userId: data.userId });
        setCurrentStep(5);
      } else setError(data.error || 'مشکلی رخ داده است');
    } catch (err) {
      setError(err.message || 'خطای سرور در ارسال کد');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async (paymentResult) => {
    console.log('paymentResult', paymentResult);
    try {
      const res = await api.post('/zarinpal/rial', {
        amount: paymentResult.amountRial,
        userId,
        name: paymentResult.firstName,
        contact: contactInfo,
        product: selectedService,
        location: selectedLocation,
      });
      console.log(res);
      if (res?.data?.url) window.location.href = res.data.url;
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const handleTrialStart = () => {
    reset();
    localStorage.removeItem('registrationFormData');
    navigate('/user-dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectUserType
            selectedUserType={selectedUserType}
            onUserSelect={handleSelectedUser}
            onContinue={handleNext}
          />
        );
      case 2:
        return (
          <LocationSelectionStep
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ServiceSelectionStep
            selectedLocation={selectedLocation}
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
            onContinue={handleNext}
            services={services}
          />
        );
      case 4:
        return (
          <AuthMethodStep
            selectedLocation={selectedLocation}
            selectedAuthMethod={selectedAuthMethod}
            onAuthMethodSelect={handleAuthMethodSelect}
            contactInfo={contactInfo}
            onContactInfoChange={handleContactInfoChange}
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
            onVerificationCodeChange={handleVerificationCodeChange}
            onContinue={handleVerificationComplete}
            onBack={handleBack}
            onResendCode={handleSendOtp}
            loading={loading}
          />
        );
      case 6:
        return (
          <PaymentStep
            contactInfo={contactInfo}
            selectedService={selectedService}
            selectedLocation={selectedLocation}
            onComplete={handlePaymentComplete}
            onBack={handleBack}
            onSkipTrial={handleTrialStart}
            services={services}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/productlist');
        setServices(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        onExit={handleExit}
      />
      <div className="max-w-md mx-auto">{renderCurrentStep()}</div>
      {error && (
        <div dir="rtl" className="alert alert-error mt-4">
          <span className="text-white">{error}</span>
          <button onClick={() => setError('')} className="btn btn-sm">
            بستن
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrationStepper;
