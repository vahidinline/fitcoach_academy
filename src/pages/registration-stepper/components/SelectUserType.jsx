import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SelectUserType = ({ selectedUserType, onUserSelect, onContinue }) => {
  const usertype = [
    {
      id: 1,
      name: 'خانه دار',

      icon: 'GraduationCap',
      color: 'bg-primary',
    },
    {
      id: 2,
      name: 'شغل آزاد',

      icon: 'User',
      color: 'bg-accent',
    },
    {
      id: 3,
      name: 'مربی تغذیه یا ورزش ',

      icon: 'User',
      color: 'bg-accent',
    },
    {
      id: 4,
      name: 'دانشجو',

      icon: 'User',
      color: 'bg-accent',
    },
    {
      id: 5,
      name: 'کارمند',

      icon: 'User',
      color: 'bg-accent',
    },
    {
      id: 6,
      name: 'سایر ',

      icon: 'User',
      color: 'bg-accent',
    },
  ];

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          لطفا شغل خود را انتخاب کنید
        </h2>
        <p className="text-muted-foreground"></p>
      </div>

      <div className="space-y-4">
        {usertype.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`relative p-4 rounded-lg border-2 cursor-pointer animate-spring ${
              selectedUserType === usertype.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            }`}>
            <div className="flex items-start space-x-4">
              {/* <div
                className={`w-12 h-12 ${user.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon name={user.icon} size={24} className="text-white" />
              </div> */}

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg p-1 font-semibold text-foreground">
                    {user.name}
                  </h3>
                  <div className="flex flex-col">
                    <div className="text-right "></div>
                  </div>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedUserType === user.id
                    ? 'border-primary bg-primary'
                    : 'border-muted'
                }`}>
                {selectedUserType === user.id && (
                  <Icon
                    name="Check"
                    size={12}
                    className="text-primary-foreground"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          variant="default"
          fullWidth
          onClick={onContinue}
          disabled={!selectedUserType}>
          ادامه
        </Button>
      </div>
    </div>
  );
};

export default SelectUserType;
