import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/ui/AuthenticationGuard';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import OrderSummary from './components/OrderSummary';
import PaymentForm from './components/PaymentForm';
import TrustSignals from './components/TrustSignals';
import PaymentStatus from './components/PaymentStatus';
import ProgressIndicator from './components/ProgressIndicator';
import Icon from '../../components/AppIcon';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [userLocation, setUserLocation] = useState('iran');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [transactionId, setTransactionId] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [services, setServices] = useState([
    {
      type: 'certificate',
      name: 'Nutrition Coaching Program',
      label: ' صدور گواهی نوتریشن',
      description:
        'Complete fitness coaching program with personalized training plans',
      duration: '',
      originalPrice: 49,
      rialPrice: 5500000,
      currency: userLocation === 'iran' ? 'IRR' : 'EUR',
      isTrial: false,
    },
  ]);

  // Mock service data - in real app, this would come from route state or API
  const [selectedService] = useState([
    {
      type: 'certificate',
      name: 'Nutrition Coaching Program',
      label: ' صدور گواهی نوتریشن',
      description:
        'Complete fitness coaching program with personalized training plans',
      duration: '',
      originalPrice: 49,
      rialPrice: 5500000,
      currency: userLocation === 'iran' ? 'IRR' : 'EUR',
      isTrial: false,
    },
    {
      type: 'extra-report',
      name: 'Extra Progress Report',
      label: ' کوچینگ و دریافت برنامه ',

      description: ' ارسال گزارش پیشرفت و دریافت برنامه تمرینی و غذایی اختصاصی',
      duration: '',
      originalPrice: 49,
      rialPrice: 5500000,
      currency: userLocation === 'iran' ? 'IRR' : 'EUR',
      isTrial: false,
    },
  ]);

  const [pricing] = useState({
    basePrice: 49,
    tax: userLocation === 'international' ? 24.9 : 0,
    processingFee: userLocation === 'international' ? 5 : 10000, // IRR for Iran
  });

  // Detect user location on component mount
  useEffect(() => {
    const detectLocation = () => {
      // Simplified location detection - in real app, use proper geolocation
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('Tehran') || timezone.includes('Asia/Tehran')) {
        setUserLocation('iran');
      } else {
        setUserLocation('international');
      }
    };

    detectLocation();
  }, []);

  const handlePromoCodeChange = (code) => {
    setPromoCode(code);
    setPromoApplied(false);
    setDiscount(0);
  };

  const handleApplyPromo = () => {
    // Mock promo code validation
    const validPromoCodes = {
      SAVE20: 0.2,
      NEWUSER: 0.15,
      FITNESS10: 0.1,
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      const discountPercent = validPromoCodes[promoCode.toUpperCase()];
      const discountAmount = pricing.basePrice * discountPercent;
      setDiscount(discountAmount);
      setPromoApplied(true);
    } else {
      setPaymentError('Invalid promo code');
      setTimeout(() => setPaymentError(''), 3000);
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    setPaymentStatus('processing');
    setPaymentError('');

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock payment success/failure
      const isSuccess = Math.random() > 0.1; // 90% success rate

      if (isSuccess) {
        const mockTransactionId =
          'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        setTransactionId(mockTransactionId);
        setPaymentStatus('success');

        // Store payment success in localStorage for demo
        localStorage.setItem('paymentCompleted', 'true');
        localStorage.setItem('transactionId', mockTransactionId);
      } else {
        throw new Error(
          'Payment declined by your bank. Please try a different payment method.'
        );
      }
    } catch (error) {
      setPaymentError(error.message);
      setPaymentStatus('error');
    }
  };

  const handleRetryPayment = () => {
    setPaymentStatus('idle');
    setPaymentError('');
    setTransactionId('');
  };

  const handleCloseStatus = () => {
    setPaymentStatus('idle');
    if (paymentStatus === 'success') {
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader />

      <main className="pt-16 pb-20 lg:pb-8 lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Indicator */}
          <ProgressIndicator currentStep={2} totalSteps={3} />

          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-success" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">پرداخت</h1>
                <p className="text-muted-foreground">
                  Complete your purchase safely and securely
                </p>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={14} className="text-success" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={14} className="text-success" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Award" size={14} className="text-success" />
                <span>Verified Gateway</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              <PaymentForm
                location={userLocation}
                selectedService={selectedService}
                onPaymentSubmit={handlePaymentSubmit}
                isProcessing={paymentStatus === 'processing'}
              />

              {/* Error Display */}
              {paymentError && paymentStatus !== 'error' && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name="AlertCircle"
                      size={16}
                      className="text-destructive"
                    />
                    <p className="text-sm text-destructive">{paymentError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary & Trust Signals */}
            <div className="space-y-6">
              <OrderSummary
                selectedService={selectedService}
                pricing={pricing}
                location={userLocation}
                promoCode={promoCode}
                onPromoCodeChange={handlePromoCodeChange}
                onApplyPromo={handleApplyPromo}
                promoApplied={promoApplied}
                discount={discount}
              />

              {/* Desktop Trust Signals */}
              <div className="hidden lg:block">
                <TrustSignals location={userLocation} />
              </div>
            </div>
          </div>

          {/* Mobile Trust Signals */}
          <div className="lg:hidden mt-8">
            <TrustSignals location={userLocation} />
          </div>
        </div>
      </main>

      {/* Payment Status Modal */}
      <PaymentStatus
        status={paymentStatus}
        transactionId={transactionId}
        error={paymentError}
        onRetry={handleRetryPayment}
        onClose={handleCloseStatus}
      />

      <BottomTabNavigation />
    </div>
  );
};

export default PaymentProcessing;
