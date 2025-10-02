import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentStep = ({
  selectedService,
  selectedLocation,
  onComplete,
  onBack,
  onSkipTrial,
  contactInfo,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: contactInfo || '',
    firstName: '',
    lastName: '',
    phone: contactInfo || '',
  });

  const [userDetails, setUserDetails] = useState({
    userName: '',
    userFamily: '',
  });

  const [serviceDetails, setServiceDetails] = useState({
    academy: {
      name: 'دوره آکادمی',
      price: 49,
      originalPrice: 79,
      rialPrice: 3500000,
      firstName: '',
      lastName: '',
    },
    private: {
      name: ' کوچینگ خصوصی',
      price: 149,
      originalPrice: 199,
      rialPrice: 10000000,
      firstName: '',
      lastName: '',
    },
    calorie: {
      name: 'Calorie Counting Service',
      price: 29,
      originalPrice: 39,
      hasTrial: true,
      firstName: '',
      lastName: '',
    },
  });

  const service = serviceDetails[selectedService];
  console.log('services in payment', service);

  const getPaymentMethods = () => {
    if (selectedLocation === 'iran') {
      return [
        {
          value: 'shaparak',
          label: 'درگاه شاپرک',
          description: 'پرداخت امن از طریق درگاه بانکی',
        },
      ];
    } else {
      return [
        {
          value: 'stripe',
          label: 'Credit/Debit Card',
          description: 'Visa, Mastercard, American Express',
        },
      ];
    }
  };

  const paymentMethods = getPaymentMethods();

  const formatPrice = (rialPrice) => {
    if (selectedLocation === 'iran') {
      return `${rialPrice.toLocaleString('fa-IR')} تومان`;
    }
    return `$${rialPrice}`;
  };

  const handleInputChange = (field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // ✅ اگر فیلد مربوط به نام باشد، داخل سرویس ذخیره کن
    if (field === 'firstName' || field === 'lastName') {
      serviceDetails[selectedService][field] = value;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // ✅ Attach the user’s name to service before completing
    service.firstName = paymentData.firstName;
    service.lastName = paymentData.lastName;

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      onComplete({
        transactionId: 'TXN_' + Date.now(),
        amount: service.price,
        method: paymentMethod,
        status: 'completed',
        amountRial: service.rialPrice,
        firstName: service.firstName,
        lastName: service.lastName,
        contactInfo: paymentData.phone || paymentData.email,
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
      status: 'trial_active',
    });
  };

  useEffect(() => {
    if (selectedLocation === 'iran') {
      setPaymentMethod('shaparak');
    } else {
      setPaymentMethod('stripe');
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CreditCard" size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          نهایی کردن خرید
        </h2>
        <p className="text-muted-foreground">پرداخت امن</p>
      </div>

      {/* Service Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">{service?.name}</h3>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              {selectedLocation === 'iran' ? (
                <span className="text-xl font-bold text-foreground">
                  {`${service.rialPrice.toLocaleString('fa-IR')} تومان`}
                </span>
              ) : (
                <span className="text-xl font-bold text-foreground">
                  {service.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground"></span>
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
            <Icon
              name="Gift"
              size={20}
              className="text-success flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-success mb-1">
                Start Your Free Trial
              </h4>
              <p className="text-sm text-success/80 mb-3">
                Try our Calorie Counting Service for 3 days absolutely free. No
                payment required, cancel anytime.
              </p>
              <Button
                variant="outline"
                onClick={handleTrialStart}
                className="border-success text-success hover:bg-success hover:text-success-foreground">
                Start 3-Day Free Trial
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="space-y-4">
        {/* <Select
          label="درگاه پرداخت"
          options={paymentMethods}
          value={paymentMethod}
          onChange={setPaymentMethod}
          placeholder="انتخاب روش پرداخت"
          required
        /> */}

        {/* Payment Form */}
        {paymentMethod && (
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            {selectedLocation === 'international' &&
              paymentMethod === 'stripe' && (
                <>
                  <Input
                    label="Card Number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) =>
                      handleInputChange('cardNumber', e.target.value)
                    }
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      type="text"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) =>
                        handleInputChange('expiryDate', e.target.value)
                      }
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
                    onChange={(e) =>
                      handleInputChange('cardholderName', e.target.value)
                    }
                    required
                  />
                </>
              )}

            {selectedLocation === 'iran' && (
              <div dir="rtl">
                <Input
                  label="نام"
                  type="text"
                  placeholder=""
                  value={paymentData.firstName}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  required
                />
                <Input
                  label="نام خانوادگی"
                  type="text"
                  placeholder=""
                  value={paymentData.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  required
                />
                <Input
                  label="شماره موبایل / ایمیل"
                  type="text"
                  disabled
                  placeholder="09123456789"
                  value={paymentData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  //  required
                />
              </div>
            )}

            <div dir="rtl" className="p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <p className="text-sm text-success font-medium p-2">
                  برای پرداخت به درگاه مورد تایید بانک مرکزی منتقل خواهید شد.
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
          className="flex-1">
          بازگشت
        </Button>
        <Button
          variant="default"
          onClick={handlePayment}
          disabled={
            !paymentMethod ||
            isProcessing ||
            paymentData.firstName == '' ||
            paymentData.lastName == ''
          }
          loading={isProcessing}
          className="flex-1">
          {isProcessing
            ? 'در حال انجام...'
            : `پرداخت ${formatPrice(service.rialPrice)}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
