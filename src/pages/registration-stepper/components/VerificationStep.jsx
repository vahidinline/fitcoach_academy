import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VerificationStep = ({ 
  selectedAuthMethod, 
  contactInfo, 
  verificationCode, 
  onVerificationCodeChange, 
  onContinue, 
  onBack,
  onResendCode 
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

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerifying(false);
    onContinue();
  };

  const getVerificationMethod = () => {
    switch (selectedAuthMethod) {
      case 'sms':
        return {
          title: 'SMS Verification',
          description: 'Enter the 6-digit code sent to your phone',
          icon: 'MessageSquare',
          contactDisplay: contactInfo,
          codeLength: 6
        };
      case 'firebase_sms':
        return {
          title: 'SMS Verification',
          description: 'Enter the verification code sent via SMS',
          icon: 'MessageSquare',
          contactDisplay: contactInfo,
          codeLength: 6
        };
      case 'firebase_email':
        return {
          title: 'Email Verification',
          description: 'Enter the verification code from your email',
          icon: 'Mail',
          contactDisplay: contactInfo,
          codeLength: 6
        };
      default:
        return {
          title: 'Verification',
          description: 'Enter your verification code',
          icon: 'Shield',
          contactDisplay: contactInfo,
          codeLength: 6
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
        <p className="text-muted-foreground mb-2">
          {method.description}
        </p>
        <p className="text-sm text-foreground font-medium">
          {method.contactDisplay}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Verification Code"
          type="text"
          placeholder={`Enter ${method.codeLength}-digit code`}
          value={verificationCode}
          onChange={(e) => onVerificationCodeChange(e.target.value)}
          maxLength={method.codeLength}
          className="text-center text-2xl font-mono tracking-widest"
          required
        />

        <div className="text-center">
          {!canResend ? (
            <p className="text-sm text-muted-foreground">
              Resend code in {timeLeft} seconds
            </p>
          ) : (
            <Button
              variant="ghost"
              onClick={handleResend}
              className="text-sm"
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Resend Code
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Didn't receive the code?
            </p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• Check your spam/junk folder (for email)</li>
              <li>• Ensure you have good network coverage (for SMS)</li>
              <li>• Wait a few minutes and try resending</li>
              <li>• Contact support if issues persist</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isVerifying}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          variant="default"
          onClick={handleVerify}
          disabled={verificationCode.length !== method.codeLength || isVerifying}
          loading={isVerifying}
          className="flex-1"
        >
          {isVerifying ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default VerificationStep;