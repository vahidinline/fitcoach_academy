import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = ({ location }) => {
  const iranianTrustSignals = [
    {
      icon: 'Shield',
      title: 'ZarinPal Certified',
      description: 'Verified Iranian payment gateway'
    },
    {
      icon: 'Lock',
      title: 'SSL Encrypted',
      description: '256-bit security encryption'
    },
    {
      icon: 'Award',
      title: 'Local Banking',
      description: 'Direct integration with Iranian banks'
    },
    {
      icon: 'Users',
      title: '10,000+ Users',
      description: 'Trusted by Iranian fitness enthusiasts'
    }
  ];

  const internationalTrustSignals = [
    {
      icon: 'Shield',
      title: 'Stripe Certified',
      description: 'PCI DSS Level 1 compliant'
    },
    {
      icon: 'Lock',
      title: 'Bank-Level Security',
      description: 'Same security as online banking'
    },
    {
      icon: 'Award',
      title: 'Global Standards',
      description: 'International security certifications'
    },
    {
      icon: 'Users',
      title: '50,000+ Users',
      description: 'Trusted worldwide'
    }
  ];

  const trustSignals = location === 'iran' ? iranianTrustSignals : internationalTrustSignals;

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fitness Enthusiast',
      content: `The payment process was smooth and secure. I felt confident throughout the entire transaction.`,
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Personal Trainer',
      content: `Quick and easy payment. The security features gave me peace of mind when purchasing.`,
      rating: 5
    },
    {
      name: 'Emma Wilson',
      role: 'Nutrition Coach',
      content: `Excellent service! The payment gateway is reliable and the process is straightforward.`,
      rating: 5
    }
  ];

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Security & Trust</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trustSignals.map((signal, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={signal.icon} size={16} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">{signal.title}</p>
                <p className="text-xs text-muted-foreground">{signal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="bg-gradient-to-r from-success/10 to-accent/10 rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
            <Icon name="RefreshCw" size={20} className="text-success-foreground" />
          </div>
          <div>
            <h4 className="font-semibold text-card-foreground">30-Day Money Back Guarantee</h4>
            <p className="text-sm text-muted-foreground">Not satisfied? Get a full refund within 30 days</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>• No questions asked refund policy</p>
          <p>• Cancel anytime during the first month</p>
          <p>• Full refund processed within 5-7 business days</p>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">What Our Customers Say</h3>
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border-l-2 border-primary/20 pl-4">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-2">"{testimonial.content}"</p>
              <div className="text-xs">
                <span className="font-medium text-card-foreground">{testimonial.name}</span>
                <span className="text-muted-foreground"> - {testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Gateway Logos */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h4 className="font-medium text-card-foreground mb-3">Accepted Payment Methods</h4>
        <div className="flex items-center justify-center space-x-4 opacity-60">
          {location === 'iran' ? (
            <>
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/30 rounded">
                ZarinPal
              </div>
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/30 rounded">
                Bank Mellat
              </div>
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/30 rounded">
                Parsian
              </div>
            </>
          ) : (
            <>
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/30 rounded">
                Visa
              </div>
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/30 rounded">
                Mastercard
              </div>
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/30 rounded">
                PayPal
              </div>
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/30 rounded">
                Apple Pay
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;