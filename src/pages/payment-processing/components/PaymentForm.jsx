import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentForm = ({ location, selectedService, onPaymentSubmit, isProcessing }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: '',
    bankAccount: ''
  });

  const iranianPaymentMethods = [
    { value: 'zarinpal', label: 'ZarinPal', description: 'Secure Iranian payment gateway' },
    { value: 'mellat', label: 'Bank Mellat', description: 'Direct bank payment' },
    { value: 'parsian', label: 'Parsian Bank', description: 'Online banking' },
    { value: 'saderat', label: 'Bank Saderat', description: 'Internet banking' }
  ];

  const internationalPaymentMethods = [
    { value: 'stripe', label: 'Credit/Debit Card', description: 'Visa, Mastercard, American Express' },
    { value: 'paypal', label: 'PayPal', description: 'Pay with your PayPal account' },
    { value: 'apple_pay', label: 'Apple Pay', description: 'Quick payment with Touch ID' },
    { value: 'google_pay', label: 'Google Pay', description: 'Pay with Google account' }
  ];

  const paymentMethods = location === 'iran' ? iranianPaymentMethods : internationalPaymentMethods;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPaymentSubmit({
      method: paymentMethod,
      data: formData
    });
  };

  const isFormValid = () => {
    if (!paymentMethod) return false;
    
    if (location === 'iran') {
      return formData.email && formData.phone;
    } else {
      if (paymentMethod === 'stripe') {
        return formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName;
      }
      return true; // For PayPal, Apple Pay, Google Pay
    }
  };

  if (selectedService.isTrial) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Gift" size={24} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Free Trial Activated</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Enjoy 3 days of free access to our Calorie Counting Service. No payment required now.
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 text-left">
            <h4 className="font-medium text-card-foreground mb-2">Trial Terms:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Full access to calorie counting features</li>
              <li>• Personal nutrition recommendations</li>
              <li>• Progress tracking and analytics</li>
              <li>• Cancel anytime during trial period</li>
            </ul>
          </div>
          <Button
            variant="default"
            onClick={() => onPaymentSubmit({ method: 'trial', data: {} })}
            loading={isProcessing}
            fullWidth
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Secure Payment</h3>
          <p className="text-sm text-muted-foreground">Your information is encrypted and protected</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <Select
          label="Choose Payment Method"
          options={paymentMethods}
          value={paymentMethod}
          onChange={setPaymentMethod}
          placeholder="Select payment method"
          required
        />

        {paymentMethod && (
          <div className="p-4 bg-muted/30 rounded-lg">
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

        {/* Payment Details */}
        {paymentMethod && (
          <div className="space-y-4">
            {location === 'international' && paymentMethod === 'stripe' && (
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

            {location === 'iran' && (
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
                {(paymentMethod === 'mellat' || paymentMethod === 'parsian' || paymentMethod === 'saderat') && (
                  <Input
                    label="Bank Account Number"
                    type="text"
                    placeholder="Enter your account number"
                    value={formData.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    required
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-success/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-success" />
            <p className="text-sm text-success font-medium">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          disabled={!isFormValid() || isProcessing}
          loading={isProcessing}
          fullWidth
        >
          {isProcessing ? 'Processing Payment...' : 'Complete Payment'}
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;