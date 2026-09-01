import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from 'components/ui/Select';
import { useAuthStore } from 'store/useAuthStore';
import api from 'api/api';

const PaymentStep = ({ onComplete, onBack }) => {
  const {
    selectedLocation,
    selectedServicePrice,
    selectedServiceRialPrice,
    selectedServiceName,
    selectedServiceLaunchOffer,
  } = useAuthStore();

  const regularPrice =
    selectedLocation === 'iran'
      ? selectedServiceRialPrice.price
      : selectedServicePrice.price;
  const launchAvailable =
    selectedServiceLaunchOffer?.enabled &&
    Number(selectedServiceLaunchOffer?.reserved || 0) <
      Number(selectedServiceLaunchOffer?.maxReservations || 0);
  const basePrice = launchAvailable
    ? selectedLocation === 'iran'
      ? selectedServiceLaunchOffer.iranPrice
      : selectedServiceLaunchOffer.euroPrice
    : regularPrice;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // ---- Discount states ----
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');
  const [finalPrice, setFinalPrice] = useState(basePrice);

  useEffect(() => {
    setFinalPrice(basePrice);
  }, [basePrice]);

  // ----------------------
  // APPLY DISCOUNT
  // ----------------------
  const handleApplyDiscount = async () => {
    setDiscountError('');
    setDiscountSuccess('');

    if (!discountCode) {
      setDiscountError('کد تخفیف را وارد کنید');
      return;
    }

    try {
      const res = await api.post('/api/discount/validate', {
        code: discountCode,
        productType: selectedServiceName.code,
        baseAmount: basePrice,
      });

      const data = res.data;

      if (!data.valid) {
        setDiscountPercent(0);
        setFinalPrice(basePrice);
        setDiscountError('کد تخفیف معتبر نیست');
        return;
      }

      // Apply backend values
      setDiscountPercent(data.discount.value);
      setFinalPrice(data.finalPrice);
      setDiscountSuccess(`${data.discount.value}% تخفیف اعمال شد`);
    } catch (err) {
      setDiscountError('کد تخفیف معتبر نیست');
    }
  };

  // ----------------------
  // PAYMENT FINALIZE
  // ----------------------
  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentError('');

      const result = await onComplete({
        amountRial: selectedLocation === 'iran' ? finalPrice : null,
        amountUSD: selectedLocation !== 'iran' ? finalPrice : null,
        method: paymentMethod,
        discountCode,
        discountPercent,
      });

      console.log('Payment complete:', result);

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'شروع پرداخت انجام نشد. لطفاً دوباره تلاش کنید.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setPaymentMethod(selectedLocation === 'iran' ? 'zarinpal' : 'paypal');
  }, [selectedLocation]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-center">پرداخت</h2>

      {/* ---- PRICE BOX ---- */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm">قیمت:</p>
        <p className="text-2xl font-bold text-foreground">
          {selectedLocation === 'iran'
            ? `${finalPrice?.toLocaleString('fa-IR')} تومان`
            : `€${finalPrice}`}
        </p>
        {launchAvailable && (
          <p className="mt-2 text-xs font-bold text-[#a4523e]">
            قیمت ویژه برای{' '}
            {Number(selectedServiceLaunchOffer.maxReservations) -
              Number(selectedServiceLaunchOffer.reserved || 0)}{' '}
            نفر اول اعمال شده است.
          </p>
        )}

        {discountPercent > 0 && (
          <p className="text-green-600 text-sm mt-1">
            {discountPercent}% تخفیف اعمال شد
          </p>
        )}
      </div>

      {/* ---- DISCOUNT ---- */}
      <div className="space-y-2">
        <Input
          label="کد تخفیف"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <Button variant="outline" onClick={handleApplyDiscount}>
          اعمال کد تخفیف
        </Button>

        {discountError && (
          <p className="text-red-500 text-xs">{discountError}</p>
        )}
        {discountSuccess && (
          <p className="text-green-500 text-xs">{discountSuccess}</p>
        )}
      </div>

      {/* ---- PAYMENT METHOD ---- */}
      <Select
        label="روش پرداخت"
        options={
          selectedLocation === 'iran'
            ? [{ value: 'zarinpal', label: 'پرداخت ریالی با درگاه بانکی' }]
            : [{ value: 'paypal', label: 'پرداخت ارزی با PayPal Business' }]
        }
        value={paymentMethod}
        onChange={setPaymentMethod}
      />

      <Button
        variant="default"
        onClick={handlePayment}
        loading={isProcessing}
        disabled={!paymentMethod}>
        ادامه پرداخت
      </Button>
      {paymentError && (
        <p role="alert" className="text-sm text-red-600">
          {paymentError}
        </p>
      )}

      <Button variant="outline" onClick={onBack}>
        بازگشت
      </Button>
    </div>
  );
};

export default PaymentStep;
