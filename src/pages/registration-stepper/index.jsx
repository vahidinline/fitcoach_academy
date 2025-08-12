import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './components/StepIndicator';
import ServiceSelectionStep from './components/ServiceSelectionStep';
import LocationSelectionStep from './components/LocationSelectionStep';
import AuthMethodStep from './components/AuthMethodStep';
import VerificationStep from './components/VerificationStep';
import PaymentStep from './components/PaymentStep';

const RegistrationStepper = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form state
  const [formData, setFormData] = useState({
    selectedService: '',
    selectedLocation: '',
    selectedAuthMethod: '',
    contactInfo: '',
    verificationCode: '',
    isVerified: false
  });

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('registrationFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // Resume from the last incomplete step
        if (parsedData.selectedService && parsedData.selectedLocation && parsedData.selectedAuthMethod && parsedData.isVerified) {
          setCurrentStep(5);
        } else if (parsedData.selectedService && parsedData.selectedLocation && parsedData.selectedAuthMethod) {
          setCurrentStep(4);
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
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
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

  const handleLocationSelect = (locationId) => {
    updateFormData({ selectedLocation: locationId });
  };

  const handleAuthMethodSelect = (methodId) => {
    updateFormData({ selectedAuthMethod: methodId, contactInfo: '' });
  };

  const handleContactInfoChange = (info) => {
    updateFormData({ contactInfo: info });
  };

  const handleVerificationCodeChange = (code) => {
    updateFormData({ verificationCode: code });
  };

  const handleResendCode = () => {
    // Simulate resending verification code
    console.log('Resending verification code to:', formData.contactInfo);
  };

  const handleVerificationComplete = () => {
    updateFormData({ isVerified: true });
    handleNext();
  };

  const handlePaymentComplete = (paymentResult) => {
    // Clear form data and navigate to dashboard
    localStorage.removeItem('registrationFormData');
    
    // Store user session
    const userData = {
      id: Date.now().toString(),
      service: formData.selectedService,
      location: formData.selectedLocation,
      contact: formData.contactInfo,
      paymentStatus: 'completed',
      registrationDate: new Date().toISOString(),
      ...paymentResult
    };
    
    localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
    localStorage.setItem('userData', JSON.stringify(userData));
    
    navigate('/user-dashboard');
  };

  const handleTrialStart = (trialResult) => {
    // Clear form data and navigate to dashboard with trial status
    localStorage.removeItem('registrationFormData');
    
    // Store user session with trial status
    const userData = {
      id: Date.now().toString(),
      service: formData.selectedService,
      location: formData.selectedLocation,
      contact: formData.contactInfo,
      paymentStatus: 'trial',
      registrationDate: new Date().toISOString(),
      ...trialResult
    };
    
    localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
    localStorage.setItem('userData', JSON.stringify(userData));
    
    navigate('/user-dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelectionStep
            selectedService={formData.selectedService}
            onServiceSelect={handleServiceSelect}
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
          <AuthMethodStep
            selectedLocation={formData.selectedLocation}
            selectedAuthMethod={formData.selectedAuthMethod}
            onAuthMethodSelect={handleAuthMethodSelect}
            contactInfo={formData.contactInfo}
            onContactInfoChange={handleContactInfoChange}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      
      case 4:
        return (
          <VerificationStep
            selectedAuthMethod={formData.selectedAuthMethod}
            contactInfo={formData.contactInfo}
            verificationCode={formData.verificationCode}
            onVerificationCodeChange={handleVerificationCodeChange}
            onContinue={handleVerificationComplete}
            onBack={handleBack}
            onResendCode={handleResendCode}
          />
        );
      
      case 5:
        return (
          <PaymentStep
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
      
      <div className="max-w-md mx-auto">
        {renderCurrentStep()}
      </div>
      
      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0" />
    </div>
  );
};

export default RegistrationStepper;