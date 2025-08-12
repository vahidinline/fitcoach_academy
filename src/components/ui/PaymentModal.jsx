import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const PaymentModal = ({ isOpen, onClose, paymentType = 'subscription', amount, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userLocation, setUserLocation] = useState('international');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });

  // Detect user location (simplified)
  useEffect(() => {
    const detectLocation = () => {
      // Simplified location detection - in real app, use proper geolocation
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('Tehran') || timezone.includes('Asia')) {
        setUserLocation('iran');
      } else {
        setUserLocation('international');
      }
    };
    
    if (isOpen) {
      detectLocation();
    }
  }, [isOpen]);

  const paymentMethods = userLocation === 'iran' 
    ? [
        { value: 'zarinpal', label: 'ZarinPal', description: 'Secure Iranian payment gateway' },
        { value: 'mellat', label: 'Bank Mellat', description: 'Direct bank payment' },
        { value: 'parsian', label: 'Parsian Bank', description: 'Online banking' }
      ]
    : [
        { value: 'stripe', label: 'Credit/Debit Card', description: 'Visa, Mastercard, American Express' },
        { value: 'paypal', label: 'PayPal', description: 'Pay with your PayPal account' },
        { value: 'apple_pay', label: 'Apple Pay', description: 'Quick payment with Touch ID' },
        { value: 'google_pay', label: 'Google Pay', description: 'Pay with Google account' }
      ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      onSuccess?.({
        transactionId: 'TXN_' + Date.now(),
        amount: amount,
        method: paymentMethod,
        status: 'completed'
      });
      
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount) => {
    if (userLocation === 'iran') {
      return new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR'
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-400 p-4">
      <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-success" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Secure Payment</h2>
              <p className="text-sm text-muted-foreground">
                {paymentType === 'subscription' ? 'Monthly Subscription' : 'One-time Payment'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg animate-spring"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Method</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Step 1: Payment Method Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-2xl font-semibold text-card-foreground font-mono">
                  {formatAmount(amount)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {userLocation === 'iran' ? 'Iranian Rial' : 'US Dollar'}
                </p>
              </div>

              <Select
                label="Choose Payment Method"
                options={paymentMethods}
                value={paymentMethod}
                onChange={setPaymentMethod}
                placeholder="Select payment method"
                required
              />

              {paymentMethod && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Info" size={16} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {paymentMethods.find(m => m.value === paymentMethod)?.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {paymentMethods.find(m => m.value === paymentMethod)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {userLocation === 'international' && paymentMethod === 'stripe' && (
                <>
                  <Input
                    label="Card Number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      required
                    />
                    <Input
                      label="CVV"
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    label="Cardholder Name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    required
                  />
                </>
              )}

              {userLocation === 'iran' && (
                <>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="09123456789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </>
              )}

              <div className="p-4 bg-success/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} className="text-success" />
                  <p className="text-sm text-success font-medium">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CreditCard" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Confirm Payment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please review your payment details before proceeding
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-medium text-card-foreground font-mono">
                    {formatAmount(amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Method:</span>
                  <span className="text-sm font-medium text-card-foreground">
                    {paymentMethods.find(m => m.value === paymentMethod)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium text-card-foreground">
                    {paymentType === 'subscription' ? 'Monthly Subscription' : 'One-time Payment'}
                  </span>
                </div>
              </div>

              {isProcessing && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Processing payment...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handlePrevStep}
            disabled={isProcessing}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            variant="default"
            onClick={currentStep === 3 ? handlePayment : handleNextStep}
            disabled={
              isProcessing || 
              (currentStep === 1 && !paymentMethod) ||
              (currentStep === 2 && (!formData.email || !formData.phone) && userLocation === 'iran') ||
              (currentStep === 2 && (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) && userLocation === 'international' && paymentMethod === 'stripe')
            }
            loading={isProcessing}
          >
            {currentStep === 3 ? 'Pay Now' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;