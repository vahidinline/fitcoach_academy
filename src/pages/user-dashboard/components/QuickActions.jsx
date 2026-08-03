import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { academyFeatures } from '../../../config/features';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'progress-report',
      title: 'Submit Progress',
      description: 'Upload photos and track your journey',
      icon: 'Camera',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      action: () => navigate('/progress-report-submission')
    },
    {
      id: 'calorie-upload',
      title: 'Calorie Tracking',
      description: 'Upload app screenshots',
      icon: 'Smartphone',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      action: () => navigate('/progress-report-submission', { state: { tab: 'calorie' } })
    },
    {
      id: 'payment-history',
      title: 'Payment History',
      description: 'View billing and transactions',
      icon: 'CreditCard',
      color: 'text-success',
      bgColor: 'bg-success/10',
      action: () => navigate('/payment-processing', { state: { tab: 'history' } }),
      enabled: academyFeatures.paymentHistory,
    },
    {
      id: 'settings',
      title: 'Account Settings',
      description: 'Manage your profile and preferences',
      icon: 'Settings',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      action: () => console.log('Settings clicked')
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-elevation-1">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.filter((action) => action.enabled !== false).map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="p-4 bg-muted/50 rounded-lg hover:bg-muted animate-spring text-left group"
          >
            <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 animate-spring`}>
              <Icon name={action.icon} size={20} className={action.color} />
            </div>
            <h4 className="font-medium text-card-foreground text-sm mb-1">
              {action.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
