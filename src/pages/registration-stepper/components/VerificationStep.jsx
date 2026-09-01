import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { normalizeDigits } from 'utils/persianNumbers';

const VerificationStep = ({
  selectedAuthMethod,
  contactInfo,
  verificationCode,
  onVerificationCodeChange,
  onContinue,
  onBack,
  onResendCode,
  loading,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = () => {
    onResendCode();
    setTimeLeft(60);
    setCanResend(false);
  };

  // VerificationStep
  const handleVerify = async () => {
    if (verificationCode.length !== method.codeLength) return;

    setIsVerifying(true);
    try {
      await onContinue(); // ✅ بدون پارامتر
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerificationMethod = () => {
    switch (selectedAuthMethod) {
      case 'sms':
        return {
          title: 'احراز هویت با پیامک',
          description: 'رمز ۶ رقمی ارسال شده به شماره خود را وارد کنید',
          icon: 'MessageSquare',
          contactDisplay: contactInfo,
          codeLength: 6,
        };
      case 'firebase_sms':
        return {
          title: 'احراز هویت با پیامک',
          description: 'رمز ۶ رقمی ارسال شده به شماره خود را وارد کنید',
          icon: 'MessageSquare',
          contactDisplay: contactInfo,
          codeLength: 6,
        };
      case 'firebase_email':
        return {
          title: 'احراز هویت با ایمیل',
          description: 'رمز ارسال شده به ایمیل را وارد کنید',
          icon: 'Mail',
          contactDisplay: contactInfo,
          codeLength: 6,
        };
      default:
        return {
          title: 'احراز هویت',
          description: 'رمز دریافت شده را وارد کنید',
          icon: 'Shield',
          contactDisplay: contactInfo,
          codeLength: 6,
        };
    }
  };

  const method = getVerificationMethod();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name={method.icon} size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {method.title}
        </h2>
        <p className="text-muted-foreground mb-2">{method.description}</p>
        <p className="text-sm text-foreground font-medium">
          {method.contactDisplay}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="کد اعتبار سنجی"
          type="text"
          placeholder={`کد ${method.codeLength} رقمی`}
          value={verificationCode}
          onChange={(e) => onVerificationCodeChange(normalizeDigits(e.target.value).replace(/\D/g, ''))}
          maxLength={method.codeLength}
          className="text-center text-2xl font-mono tracking-widest"
          required
        />

        {/* <div className="text-center">
          {!canResend ? (
            <p className="text-sm text-muted-foreground">
              ارسال مجدد {timeLeft} ثانیه
            </p>
          ) : (
            <Button variant="ghost" onClick={handleResend} className="text-sm">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              ارسال مجدد
            </Button>
          )}
        </div> */}
      </div>

      <div dir="rtl" className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3 gap-2">
          <Icon
            name="Info"
            size={16}
            className="text-primary flex-shrink-0 mt-0.5"
          />
          <div dir="rtl">
            <p className="text-sm font-medium text-foreground">
              کد را دریافت نکردید؟
            </p>
            <ol className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>لطفا پوشه اسپم را چک کنید (برای ایمیل)</li>
              <li>مطمئن شوید خط همراه شما انتن داشته باشد</li>
              <li>کمی صبر کنید و سپس مجددا اقدام کنید</li>
              <li>با پشتیبانی تماس بگیرید</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isVerifying}
          className="flex-1">
          بازگشت
        </Button>
        <Button
          variant="default"
          onClick={handleVerify}
          disabled={
            loading ||
            verificationCode.length !== method.codeLength ||
            isVerifying
          }
          loading={isVerifying}
          className="flex-1">
          {isVerifying ? 'در حال بررسی کد...' : 'تایید و ادامه'}
        </Button>
      </div>
    </div>
  );
};

export default VerificationStep;
