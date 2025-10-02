import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PersianNumberInput from 'components/ui/NumberInput';

const AuthMethodStep = ({
  selectedLocation,
  selectedAuthMethod,
  onAuthMethodSelect,
  contactInfo,
  onContactInfoChange,
  onContinue,
  onBack,
  loading,
}) => {
  const getAuthMethods = () => {
    if (selectedLocation === 'iran') {
      return [
        {
          id: 'email',
          name: 'ورود با ایمیل',
          description: 'ورود سریع با ارسال کد تایید به ایمیل شما',
          icon: 'Email',
          inputType: 'email',
          inputLabel: ' آدرس ایمیل',
          inputPlaceholder: 'email@gmail.com',
          recommended: true,
        },
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
        // {
        //   id: 'firebase_sms',
        //   name: 'احراز هویت پیامکی',
        //   description: 'احراز هویت با شماره موبایل (برای همه کشورها فعال نیست)',
        //   icon: 'MessageSquare',
        //   inputType: 'tel',
        //   inputLabel: 'شماره همراه',
        //   inputPlaceholder: '+1234567890',
        //   recommended: true,
        // },
        {
          id: 'email',
          name: 'احراز هویت ایمیلی',
          description: 'دریافت کد تایید از طریق ایمیل',
          icon: 'Mail',
          inputType: 'email',
          inputLabel: 'آدرس ایمیل',
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

    if (selectedAuthMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(contactInfo);
    }

    return false;
  };

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          انتخاب روش احراز هویت
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
                توصیه شده
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
                  <>
                    <div className="mt-4">
                      {method.inputType === 'tel' &&
                      selectedLocation === 'iran' ? (
                        <PersianNumberInput
                          value={contactInfo}
                          onChange={(val) => onContactInfoChange(val)}
                          className="flex h-10 w-full rounded-md border border-white bg-gray-100 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      ) : (
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
                              ? 'شماره موبایل خود را وارد کنید (09xxxxxxxxx)'
                              : method.inputType === 'tel'
                              ? 'شماره موبایل خود را به همراه کد کشور وارد کنید'
                              : 'ارسال کد به ایمیل'
                          }
                        />
                      )}
                    </div>
                  </>
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
            {/* <div>
              <p className="text-sm font-medium text-foreground">
                دریافت کد تایید از طریق پیامک
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                کد تایید تا لحظاتی دیگر به شماره موبایل شما ارسال میگردد.
              </p>
            </div> */}
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          برگشت
        </Button>
        <Button
          variant="default"
          onClick={() => {
            // Call parent handler to send OTP
            onContinue(contactInfo);
          }}
          disabled={loading || !selectedAuthMethod || !validateContactInfo()}
          //disabled={!selectedAuthMethod || !validateContactInfo()}
          className="flex-1">
          احراز هویت
        </Button>
      </div>
    </div>
  );
};

export default AuthMethodStep;
