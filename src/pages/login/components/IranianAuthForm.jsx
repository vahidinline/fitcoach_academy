import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const IranianAuthForm = ({ onSubmit, isLoading, error }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+98');
  const [validationError, setValidationError] = useState('');
  console.log('phoneNumber', phoneNumber);
  const countryCodeOptions = [{ value: '+98', label: '+98 (Iran)' }];

  const validatePhoneNumber = (phone) => {
    // Iranian mobile number validation (starts with 09 and 11 digits total)
    const iranianMobileRegex = /^09[0-9]{9}$/;
    return iranianMobileRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!phoneNumber.trim()) {
      setValidationError('Phone number is required');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setValidationError(
        'Please enter a valid Iranian mobile number (e.g., 09123456789)'
      );
      return;
    }

    onSubmit({
      phoneNumber: phoneNumber, // Replace 0 with country code
      method: 'sms',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div dir="rtl" className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          ورود به حساب کاربری
        </h2>
        <p className="text-muted-foreground">
          ورود به حساب کاربری از طریق شماره موبایل فقط برای ساکنان ایران فعال
          است
        </p>
      </div>

      <Select
        label="کد کشور"
        options={countryCodeOptions}
        value={countryCode}
        onChange={setCountryCode}
        className="mb-4"
        disabled
      />

      <Input
        label="شماره موبایل"
        type="tel"
        placeholder="09123456789"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        error={validationError}
        required
        className="text-right"
        dir="ltr"
      />

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
        iconName="Send"
        iconPosition="right">
        {isLoading ? 'در حال ارسال...' : 'ارسال کد تایید'}
      </Button>

      <div className="text-center">
        <div className="flex items-center space-x-2 justify-center text-sm text-muted-foreground">
          <Icon name="Shield" size={16} className="text-success" />
        </div>
      </div>
    </form>
  );
};

export default IranianAuthForm;
