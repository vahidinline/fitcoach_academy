import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AuthMethodStep = ({
  selectedLocation,
  selectedAuthMethod,
  onAuthMethodSelect,
  contactInfo,
  onContactInfoChange,
  onContinue,
  onBack,
}) => {
  const getAuthMethods = () => {
    if (selectedLocation === 'iran') {
      return [
        {
          id: 'sms',
          name: 'ورود با شماره موبایل',
          description: 'ورود سریع با ارسال کد تایید به شماره موبایل شما',
          icon: 'MessageSquare',
          inputType: 'tel',
          inputLabel: 'شماره موبایل',
          inputPlaceholder: '09123456789',
          recommended: true,
        },
      ];
    } else {
      return [
        {
          id: 'firebase_sms',
          name: 'SMS Verification',
          description: 'Quick verification via Firebase SMS',
          icon: 'MessageSquare',
          inputType: 'tel',
          inputLabel: 'Phone Number',
          inputPlaceholder: '+1234567890',
          recommended: true,
        },
        {
          id: 'firebase_email',
          name: 'Email Verification',
          description: 'Secure email token verification',
          icon: 'Mail',
          inputType: 'email',
          inputLabel: 'Email Address',
          inputPlaceholder: 'your@email.com',
          recommended: false,
        },
      ];
    }
  };

  const authMethods = getAuthMethods();

  const validateContactInfo = () => {
    if (!contactInfo) return false;

    if (selectedAuthMethod === 'sms' || selectedAuthMethod === 'firebase_sms') {
      const phoneRegex =
        selectedLocation === 'iran' ? /^09\d{9}$/ : /^\+\d{10,15}$/;
      return phoneRegex.test(contactInfo);
    }

    if (selectedAuthMethod === 'firebase_email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(contactInfo);
    }

    return false;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Choose Authentication Method
        </h2>
        <p className="text-muted-foreground">
          {selectedLocation === 'iran'
            ? 'Secure SMS verification for Iranian users'
            : 'Select your preferred verification method'}
        </p>
      </div>

      <div className="space-y-4">
        {authMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onAuthMethodSelect(method.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer animate-spring ${
              selectedAuthMethod === method.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            }`}>
            {method.recommended && (
              <div className="absolute -top-2 left-4 bg-success text-success-foreground text-xs font-medium px-2 py-1 rounded">
                Recommended
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={method.icon} size={24} className="text-primary" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {method.name}
                  </h3>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAuthMethod === method.id
                        ? 'border-primary bg-primary'
                        : 'border-muted'
                    }`}>
                    {selectedAuthMethod === method.id && (
                      <Icon
                        name="Check"
                        size={12}
                        className="text-primary-foreground"
                      />
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {method.description}
                </p>

                {selectedAuthMethod === method.id && (
                  <div className="mt-4">
                    <Input
                      label={method.inputLabel}
                      type={method.inputType}
                      placeholder={method.inputPlaceholder}
                      value={contactInfo}
                      onChange={(e) => onContactInfoChange(e.target.value)}
                      required
                      description={
                        method.inputType === 'tel' &&
                        selectedLocation === 'iran'
                          ? 'Enter your Iranian mobile number (09xxxxxxxxx)'
                          : method.inputType === 'tel'
                          ? 'Enter your phone number with country code'
                          : "We'll send a verification token to this email"
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedLocation === 'iran' && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon
              name="Shield"
              size={16}
              className="text-primary flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Secure Iranian Authentication
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your phone number will be verified using Melli Payamak's secure
                SMS service. This ensures compliance with Iranian regulations
                and provides the best user experience.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          variant="default"
          onClick={onContinue}
          disabled={!selectedAuthMethod || !validateContactInfo()}
          className="flex-1">
          Continue to Verification
        </Button>
      </div>
    </div>
  );
};

export default AuthMethodStep;
