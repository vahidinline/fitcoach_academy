import React from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import { UserRoundPen, Users } from 'lucide-react';

const UserStatusCard = ({ user, trialDaysRemaining }) => {
  const navigate = useNavigate();
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
          {user.status === 'active' && (
            <div className="text-center flex flex-row items-center">
              <button
                onClick={() =>
                  window.open('https://t.me/+6oHMFATMqqFkMGI0', '_blank')
                }
                className="btn bg-success px-1 text-white flex items-center  space-x-2">
                <Users />
                عضویت در گروه تلگرام
                {/* <svg
                  width="64px"
                  height="64px"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="url(#paint0_linear_87_7225)"></circle>{' '}
                    <path
                      d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z"
                      fill="white"></path>{' '}
                    <defs>
                      {' '}
                      <linearGradient
                        id="paint0_linear_87_7225"
                        x1="16"
                        y1="2"
                        x2="16"
                        y2="30"
                        gradientUnits="userSpaceOnUse">
                        {' '}
                        <stop stop-color="#37BBFE"></stop>{' '}
                        <stop offset="1" stop-color="#007DBB"></stop>{' '}
                      </linearGradient>{' '}
                    </defs>{' '}
                  </g>
                </svg> */}
                <p className="text-sm text-warning font-medium"></p>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-card-foreground">
            {user.membershipType}
          </p>
          {/* <p className="text-sm text-muted-foreground">عضویت</p> */}
        </div>
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

      <div className="mt-4 p-3  rounded-lg"></div>
    </div>
  );
};

export default UserStatusCard;
