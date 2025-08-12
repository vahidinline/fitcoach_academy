import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentStep = ({ 
  selectedService, 
  selectedLocation, 
  onComplete, 
  onBack,
  onSkipTrial 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });

  const serviceDetails = {
    academy: { name: 'Academy Course', price: 49, originalPrice: 79 },
    private: { name: 'Private Course', price: 149, originalPrice: 199 },
    calorie: { name: 'Calorie Counting Service', price: 29, originalPrice: 39, hasTrial: true }
  };

  const service = serviceDetails[selectedService];

  const getPaymentMethods = () => {
    if (selectedLocation === 'iran') {
      return [
        { value: 'zarinpal', label: 'ZarinPal', description: 'Secure Iranian payment gateway' },
        { value: 'bank_transfer', label: 'Bank Transfer', description: 'Direct bank payment' }
      ];
    } else {
      return [
        { value: 'stripe', label: 'Credit/Debit Card', description: 'Visa, Mastercard, American Express' },
        { value: 'paypal', label: 'PayPal', description: 'Pay with your PayPal account' },
        { value: 'apple_pay', label: 'Apple Pay', description: 'Quick payment with Touch ID' }
      ];
    }
  };

  const paymentMethods = getPaymentMethods();

  const formatPrice = (price) => {
    if (selectedLocation === 'iran') {
      return `${(price * 42000).toLocaleString('fa-IR')} تومان`;
    }
    return `$${price}`;
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      onComplete({
        transactionId: 'TXN_' + Date.now(),
        amount: service.price,
        method: paymentMethod,
        status: 'completed'
      });
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrialStart = () => {
    onSkipTrial({
      trialId: 'TRIAL_' + Date.now(),
      service: selectedService,
      trialDays: 3,
      status: 'trial_active'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CreditCard" size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Complete Your Purchase
        </h2>
        <p className="text-muted-foreground">
          Secure payment processing for your fitness journey
        </p>
      </div>

      {/* Service Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">{service.name}</h3>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(service.originalPrice)}
              </span>
              <span className="text-xl font-bold text-foreground">
                {formatPrice(service.price)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">per month</span>
          </div>
        </div>
        
        {service.hasTrial && (
          <div className="flex items-center space-x-2 text-sm text-success">
            <Icon name="Gift" size={16} />
            <span>3-day free trial available</span>
          </div>
        )}
      </div>

      {/* Trial Option */}
      {service.hasTrial && (
        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-start space-x-3">
            <Icon name="Gift" size={20} className="text-success flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-success mb-1">
                Start Your Free Trial
              </h4>
              <p className="text-sm text-success/80 mb-3">
                Try our Calorie Counting Service for 3 days absolutely free. No payment required, cancel anytime.
              </p>
              <Button
                variant="outline"
                onClick={handleTrialStart}
                className="border-success text-success hover:bg-success hover:text-success-foreground"
              >
                Start 3-Day Free Trial
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <Select
          label="Payment Method"
          options={paymentMethods}
          value={paymentMethod}
          onChange={setPaymentMethod}
          placeholder="Select payment method"
          required
        />

        {/* Payment Form */}
        {paymentMethod && (
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            {selectedLocation === 'international' && paymentMethod === 'stripe' && (
              <>
                <Input
                  label="Card Number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    type="text"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    required
                  />
                  <Input
                    label="CVV"
                    type="text"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Cardholder Name"
                  type="text"
                  placeholder="John Doe"
                  value={paymentData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  required
                />
              </>
            )}

            {selectedLocation === 'iran' && (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={paymentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="09123456789"
                  value={paymentData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </>
            )}

            <div className="p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <p className="text-sm text-success font-medium">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          variant="default"
          onClick={handlePayment}
          disabled={!paymentMethod || isProcessing}
          loading={isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : `Pay ${formatPrice(service.price)}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;