import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = ({ userLocation }) => {
  const iranianSignals = [
    {
      icon: 'Shield',
      title: 'Melli Payamak',
      description: 'Trusted SMS Gateway'
    },
    {
      icon: 'CreditCard',
      title: 'ZarinPal',
      description: 'Secure Payment'
    },
    {
      icon: 'Lock',
      title: 'SSL Encrypted',
      description: 'Data Protection'
    }
  ];

  const internationalSignals = [
    {
      icon: 'Shield',
      title: 'Firebase Auth',
      description: 'Google Security'
    },
    {
      icon: 'CreditCard',
      title: 'Stripe Certified',
      description: 'PCI Compliant'
    },
    {
      icon: 'Lock',
      title: 'SSL Encrypted',
      description: 'Bank-level Security'
    }
  ];

  const signals = userLocation === 'iran' ? iranianSignals : internationalSignals;

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <p className="text-center text-sm text-muted-foreground mb-4">
        Trusted by thousands of fitness enthusiasts
      </p>
      <div className="grid grid-cols-3 gap-4">
        {signals.map((signal, index) => (
          <div key={index} className="text-center">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name={signal.icon} size={16} className="text-success" />
            </div>
            <p className="text-xs font-medium text-foreground">{signal.title}</p>
            <p className="text-xs text-muted-foreground">{signal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;