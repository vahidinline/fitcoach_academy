import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStatusCard = ({ user, trialDaysRemaining }) => {
  console.log('user in Status Card', user);
  const getStatusConfig = () => {
    switch (user.status) {
      case 'active':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle',
          label: 'کاربر فعال',
        };
      case 'trial':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'Clock',
          label: 'دوره آزمایشی',
        };
      case 'pending':
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'AlertCircle',
          label: 'در انتظار فعال شدن',
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'User',
          label: 'عضو',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-elevation-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              {user.name}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full ${statusConfig.bgColor} flex items-center space-x-2`}>
          <Icon
            name={statusConfig.icon}
            size={16}
            className={statusConfig.color}
          />
          <span className={`text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-card-foreground">
            {user.membershipType}
          </p>
          {/* <p className="text-sm text-muted-foreground">عضویت</p> */}
        </div>
        {user.status === 'trial' && trialDaysRemaining !== null && (
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {trialDaysRemaining}
            </p>
            <p className="text-sm text-muted-foreground">روز باقیمانده</p>
          </div>
        )}
        {user.status === 'active' && (
          <div className="text-center">
            <p className="text-2xl font-bold text-success">∞</p>
            <p className="text-sm text-muted-foreground">دسترسی نامحدود </p>
          </div>
        )}
      </div>

      {user.status === 'trial' && trialDaysRemaining <= 3 && (
        <div className="mt-4 p-3 bg-warning/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <p className="text-sm text-warning font-medium">
              دسترسی محدود. برای دسترسی نامحدود لطفا اکانت خود را ارتقا دهید
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatusCard;
