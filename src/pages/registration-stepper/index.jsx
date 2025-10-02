import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './components/StepIndicator';
import ServiceSelectionStep from './components/ServiceSelectionStep';
import LocationSelectionStep from './components/LocationSelectionStep';
import AuthMethodStep from './components/AuthMethodStep';
import VerificationStep from './components/VerificationStep';
import PaymentStep from './components/PaymentStep';
import SelectUserType from './components/SelectUserType';
import { useLocation } from 'react-router-dom';
import api from 'api/api';

const RegistrationStepper = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const product = queryParams.get('product');
  console.log(product);
  const totalSteps = 6;

  // Form state
  const [formData, setFormData] = useState({
    selectedUserType: '',
    selectedService: product || '',
    selectedLocation: '',
    selectedAuthMethod: '',
    contactInfo: '',
    verificationCode: '',
    isVerified: false,
  });
  console.log(formData);
  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('registrationFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // Resume from the last incomplete step
        if (
          parsedData.selectedUserType &&
          parsedData.selectedService &&
          parsedData.selectedLocation &&
          parsedData.selectedAuthMethod &&
          parsedData.isVerified
        ) {
          setCurrentStep(5);
        } else if (
          parsedData.selectedUserType &&
          parsedData.selectedService &&
          parsedData.selectedLocation &&
          parsedData.selectedAuthMethod
        ) {
          setCurrentStep(4);
        } else if (parsedData.selectedService && parsedData.selectedLocation) {
          setCurrentStep(3);
        } else if (parsedData.selectedService) {
          setCurrentStep(2);
        }
        // Resume from the correct step based on progress
        if (parsedData.isVerified) {
          setCurrentStep(6); // jump to PaymentStep if already verified
        } else if (
          parsedData.selectedUserType &&
          parsedData.selectedService &&
          parsedData.selectedLocation &&
          parsedData.selectedAuthMethod
        ) {
          setCurrentStep(5); // verification step
        } else if (parsedData.selectedService && parsedData.selectedLocation) {
          setCurrentStep(3);
        } else if (parsedData.selectedService) {
          setCurrentStep(2);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('registrationFormData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    console.log('handleNext called', currentStep, totalSteps);
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      console.log('currentStep', currentStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExit = () => {
    // Clear saved data and navigate to login
    localStorage.removeItem('registrationFormData');
    navigate('/login');
  };

  const handleServiceSelect = (serviceId) => {
    updateFormData({ selectedService: serviceId });
  };

  const handleSelectedUser = (userId) => {
    updateFormData({ selectedUserType: userId });
  };

  const handleLocationSelect = (locationId) => {
    updateFormData({ selectedLocation: locationId });
  };

  const handleAuthMethodSelect = (methodId) => {
    // console.log('infos', methodId);
    updateFormData({ selectedAuthMethod: methodId, contactInfo: '' });
  };

  const handleContactInfoChange = (info) => {
    // console.log('info', info);
    updateFormData({ contactInfo: info });
  };

  const handleVerificationCodeChange = (code) => {
    updateFormData({ verificationCode: code });
  };

  const handleResendCode = async (contactInfo) => {
    // Simulate resending verification code
    //console.log('Resending verification code to:', formData.contactInfo);
    try {
      const res = await handleSendOtp(contactInfo);
      console.log('res of resend code', res);
    } catch {
      console.log('error resending code');
    }
  };
  const handleVerificationComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://aziserver.azurewebsites.net/academyAuth/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.contactInfo,
            otp: formData.verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (data.status === 'ok') {
        console.log('Verification success:', data);
        updateFormData({ isVerified: true, userId: data.userData.id });
        handleNext(); // move to PaymentStep
      } else {
        alert(data.error || 'کد تایید نامعتبر است');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      alert('خطای سرور در تایید کد');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (contactInfo) => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://aziserver.azurewebsites.net/academyAuth/auth',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: formData.selectedAuthMethod, // "email" or "sms"
            email:
              formData.selectedAuthMethod === 'email' ? contactInfo : undefined,
            phoneNumber:
              formData.selectedAuthMethod === 'sms' ? contactInfo : undefined,
            location: formData.selectedLocation,
            platform: 'web', // or "mobile"
            name: formData.name || '', // optional
          }),
        }
      );

      const data = await response.json();

      if (data.status === 'ok') {
        console.log('OTP sent:', data);
        updateFormData({ userId: data.userId });
        setCurrentStep(5); // move to verification
      } else {
        alert(data.error || 'مشکلی رخ داده است');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert('خطای سرور در ارسال کد');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async (paymentResult) => {
    console.log('paymentResult formData', formData);
    localStorage.setItem('priceRial', paymentResult.amountRial);
    try {
      const res = await api.post('/zarinpal/rial', {
        amount: paymentResult.amountRial,
        userId: formData.userId,
        name: paymentResult.firstName,
        contact: paymentResult.contactInfo,
        product: formData.selectedService,
        location: formData.selectedLocation,
      });

      console.log('res from backend after payment', res);

      if (res?.data?.data?.url) {
        // Redirect to Zarinpal payment gateway
        window.location.href = res.data.data.url;
        return; // Stop further execution
      } else if (res?.data?.url) {
        // in case backend sends { success, url } directly (as shown in your example)
        window.location.href = res.data.url;
        return;
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleTrialStart = (trialResult) => {
    // Clear form data and navigate to dashboard with trial status
    localStorage.removeItem('registrationFormData');

    // Store user session with trial status
    const userData = {
      id: Date.now().toString(),
      userType: formData.selectedUserType,
      service: formData.selectedService,
      location: formData.selectedLocation,
      contact: formData.contactInfo,
      paymentStatus: 'trial',
      registrationDate: new Date().toISOString(),
      ...trialResult,
    };

    localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
    localStorage.setItem('userData', JSON.stringify(userData));

    navigate('/user-dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectUserType
            selectedUserType={formData.selectedUserType}
            onUserSelect={handleSelectedUser}
            onContinue={handleNext}
          />
        );
      case 2:
        return (
          <LocationSelectionStep
            selectedLocation={formData.selectedLocation}
            onLocationSelect={handleLocationSelect}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );

      case 3:
        return (
          <ServiceSelectionStep
            selectedLocation={formData.selectedLocation}
            selectedService={formData.selectedService}
            onServiceSelect={handleServiceSelect}
            onContinue={handleNext}
          />
        );

      case 4:
        return (
          <AuthMethodStep
            selectedLocation={formData.selectedLocation}
            selectedAuthMethod={formData.selectedAuthMethod}
            onAuthMethodSelect={handleAuthMethodSelect}
            contactInfo={formData.contactInfo}
            onContactInfoChange={handleContactInfoChange}
            onContinue={handleSendOtp}
            onBack={handleBack}
            loading={loading}
          />
        );

      case 5:
        return (
          <VerificationStep
            selectedAuthMethod={formData.selectedAuthMethod}
            contactInfo={formData.contactInfo}
            verificationCode={formData.verificationCode}
            onVerificationCodeChange={handleVerificationCodeChange}
            onContinue={handleVerificationComplete}
            onBack={handleBack}
            onResendCode={handleResendCode}
            loading={loading}
          />
        );

      case 6:
        return (
          <PaymentStep
            contactInfo={formData.contactInfo}
            selectedService={formData.selectedService}
            selectedLocation={formData.selectedLocation}
            onComplete={handlePaymentComplete}
            onBack={handleBack}
            onSkipTrial={handleTrialStart}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        onExit={handleExit}
      />

      <div className="max-w-md mx-auto">{renderCurrentStep()}</div>

      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0" />
    </div>
  );
};

export default RegistrationStepper;
