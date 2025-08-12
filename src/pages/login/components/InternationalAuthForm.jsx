import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InternationalAuthForm = ({ onSubmit, isLoading, error }) => {
  const [authMethod, setAuthMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (authMethod === 'email') {
      if (!email.trim()) {
        setValidationError('Email address is required');
        return;
      }
      if (!validateEmail(email)) {
        setValidationError('Please enter a valid email address');
        return;
      }
      onSubmit({ email, method: 'email' });
    } else {
      if (!phoneNumber.trim()) {
        setValidationError('Phone number is required');
        return;
      }
      if (!validatePhone(phoneNumber)) {
        setValidationError(
          'Please enter a valid phone number with country code'
        );
        return;
      }
      onSubmit({ phoneNumber, method: 'sms' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          خوش آمدید
        </h2>
        <p className="text-muted-foreground">ورود به پنل کاربری</p>
      </div>

      {/* Authentication Method Toggle */}
      <div className="flex bg-muted rounded-lg p-1">
        <button
          type="button"
          onClick={() => setAuthMethod('email')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium animate-spring text-right ${
            authMethod === 'email'
              ? 'bg-card text-card-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}>
          <Icon name="Mail" size={16} className="inline mr-2" />
          احراز هویت با ایمیل
        </button>
        {/* <button
          type="button"
          onClick={() => setAuthMethod('sms')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium animate-spring ${
            authMethod === 'sms'
              ? 'bg-card text-card-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}>
          <Icon name="Phone" size={16} className="inline mr-2" />
          احراز هویت با شماره موبایل
        </button> */}
      </div>

      {authMethod === 'email' ? (
        <Input
          className="text-left border"
          label="آدرس ایمیل"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={validationError}
          required
        />
      ) : (
        <Input
          label="شماره موبایل"
          type="tel"
          placeholder="+1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={validationError}
          required
          description="Include country code (e.g., +1 for US)"
        />
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName={authMethod === 'email' ? 'Mail' : 'Send'}
        iconPosition="right">
        {isLoading
          ? `در حال ارسال ${authMethod === 'email' ? 'ایمیل' : 'پیامک'}...`
          : `ارسال  ${
              authMethod === 'email' ? 'ایمیل حاوی کد' : 'پیامک حاوی کد'
            }`}
      </Button>

      <div className="text-center">
        <div className="flex items-center space-x-2 justify-center text-sm text-muted-foreground">
          <Icon name="Shield" size={16} className="text-success" />
          {/* <span>Secured by Firebase Auth</span> */}
        </div>
      </div>
    </form>
  );
};

export default InternationalAuthForm;
