import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from 'components/ui/Select';
import { useCheckoutStore } from 'store/useCheckoutStore';
import { useAuthStore } from 'store/useAuthStore';

const PaymentStep = ({ onComplete, onBack, onSkipTrial }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    selectedService,
    selectedLocation,
    selectedServicePrice,
    selectedServiceName,
    selectedServiceRialPrice,
    contactInfo,
  } = useAuthStore();

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: contactInfo || '',
    firstName: '',
    lastName: '',
    phone: contactInfo || '',
    priceRial: selectedServiceRialPrice.discountedPrice,
    price: selectedServicePrice.discountedPrice,
  });

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
        // {
        //   value: 'PayPal',
        //   label: 'PayPal',
        //   description: 'Secure online payments through PayPal',
        // },
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
    // if (field === 'firstName' || field === 'lastName') {
    //   serviceDetails[selectedService][field] = value;
    // }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // console.log('Processing payment with data:', service);

    // ✅ Attach the user’s name to service before completing
    // service.firstName = paymentData.firstName;
    // service.lastName = paymentData.lastName;

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      onComplete({
        transactionId: 'TXN_' + Date.now(),
        amount: paymentData.price,
        method: paymentMethod,
        status: 'completed',
        amountRial: paymentData.priceRial,
        firstName: paymentData.firstName,
        lastName: paymentData.lastName,
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

  console.log(
    'Payment data:',
    selectedService,
    selectedLocation,
    selectedServicePrice,
    selectedServiceName,
    selectedServiceRialPrice,
    contactInfo
  );

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CreditCard" size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">پرداخت</h2>
        <p className="text-muted-foreground">
          {selectedServiceName.displayName}
        </p>
      </div>

      {/* Service Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              {/* {selectedLocation === 'iran' ? (
                <span className="text-xl font-bold text-foreground">
                  {`${service.priceRial.toLocaleString('fa-IR')} تومان`}
                </span>
              ) : (
                <span className="text-xl font-bold text-foreground">
                  {service.price.price}
                </span>
              )} */}
            </div>
            <span className="text-xs text-muted-foreground"></span>
          </div>
        </div>
      </div>

      {/* Trial Option */}

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <Select
          label="درگاه پرداخت"
          options={paymentMethods}
          value={paymentMethod}
          onChange={setPaymentMethod}
          placeholder="انتخاب روش پرداخت"
          required
        />

        {/* Payment Form */}
        {paymentMethod && (
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            {selectedLocation === 'international' &&
              paymentMethod === 'stripe' && (
                <div className="flex justify-center">
                  <script
                    async
                    src="https://js.stripe.com/v3/buy-button.js"></script>

                  <stripe-buy-button
                    buy-button-id="buy_btn_1SM1OxLvdXYGADCcLewgqzDT"
                    publishable-key="pk_live_51O9uPPLvdXYGADCcTWSsikqwZStf2uKsh11X9PYtmmav0hRwbmHeOy24I9RUpHzNqLXPGk5rJnHXHmai0ypbuCiU00lXfhDJxb"></stripe-buy-button>
                </div>
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
                <div dir="rtl" className="p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={16} className="text-success" />
                    <p className="text-sm text-success font-medium p-2">
                      برای پرداخت به درگاه مورد تایید بانک مرکزی منتقل خواهید
                      شد.
                    </p>
                  </div>
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
                      : `پرداخت ${selectedServiceRialPrice.dispayDiscound}`}
                  </Button>
                </div>
                <div dir="rtl" className="alert alert-info mt-4">
                  <span className="text-white">
                    قبل از فشردن دکمه پرداخت، حتما فیلترشکن خود را خاموش کنید
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
