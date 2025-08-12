import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderSummary = ({ selectedService, pricing, location, promoCode, onPromoCodeChange, onApplyPromo, promoApplied, discount }) => {
  const formatCurrency = (amount) => {
    if (location === 'iran') {
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

  const calculateTotal = () => {
    let total = pricing.basePrice;
    if (pricing.tax) total += pricing.tax;
    if (pricing.processingFee) total += pricing.processingFee;
    if (discount) total -= discount;
    return Math.max(0, total);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="ShoppingCart" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Order Summary</h3>
          <p className="text-sm text-muted-foreground">Review your purchase details</p>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-4">
        <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon 
              name={selectedService.type === 'academy' ? 'GraduationCap' : 
                    selectedService.type === 'private' ? 'User' : 'Calculator'} 
              size={20} 
              className="text-primary-foreground" 
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-card-foreground">{selectedService.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">{selectedService.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                {selectedService.duration}
              </span>
              {selectedService.isTrial && (
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                  3-Day Free Trial
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-card-foreground">
              {formatCurrency(pricing.basePrice)}
            </p>
            {selectedService.originalPrice && selectedService.originalPrice > pricing.basePrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatCurrency(selectedService.originalPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-card-foreground">{formatCurrency(pricing.basePrice)}</span>
          </div>
          
          {pricing.tax && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-card-foreground">{formatCurrency(pricing.tax)}</span>
            </div>
          )}
          
          {pricing.processingFee && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="text-card-foreground">{formatCurrency(pricing.processingFee)}</span>
            </div>
          )}
          
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-success">Discount Applied</span>
              <span className="text-success">-{formatCurrency(discount)}</span>
            </div>
          )}
        </div>

        {/* Promo Code */}
        {!selectedService.isTrial && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => onPromoCodeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={onApplyPromo}
                disabled={!promoCode || promoApplied}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed animate-spring"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <div className="flex items-center space-x-2 text-success text-sm">
                <Icon name="Check" size={16} />
                <span>Promo code applied successfully!</span>
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-lg font-semibold text-card-foreground">Total</span>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">
              {selectedService.isTrial ? 'Free Trial' : formatCurrency(calculateTotal())}
            </p>
            {selectedService.isTrial && (
              <p className="text-xs text-muted-foreground">
                Then {formatCurrency(pricing.basePrice)}/month
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;