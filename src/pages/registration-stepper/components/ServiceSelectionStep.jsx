import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceSelectionStep = ({
  selectedService,
  onServiceSelect,
  onContinue,
  selectedLocation,
}) => {
  const services = [
    {
      id: 'academy',
      name: 'دوره آکادمی',
      price: 49,
      rialPrice: 3500000,
      originalPrice: 79,
      duration: 'سه ماه',
      features: [
        '۱۰ جلسه ویدیویی آموزش اصول تغذیه',
        '۱ جلسه آنلاین پرسش و پاسخ',
        '۳ برنامه تغذیه اختصاصی',
        'ارسال عکس قبل و بعد و سایز بدن',
        'امکان دریافت سرتیفیکیت',
        'دسترسی به گروه پشتیبانی',
      ],
      popular: true,
      icon: 'GraduationCap',
      color: 'bg-primary',
    },
    {
      id: 'private',
      name: ' کوچینگ خصوصی',
      price: 149,
      originalPrice: 199,
      rialPrice: 10000000,
      duration: 'ماهیانه',
      features: [
        'جلسات آنلاین هفتگی ۱-۱',
        'برنامه تغذیه اختصاصی',
        'پشتیبانی ۲۴/۷',
        'دسترسی به گروه تلگرام ',
        'Priority support',
      ],
      popular: false,
      icon: 'User',
      color: 'bg-accent',
    },
    // {
    //   id: 'calorie',
    //   name: 'Calorie Counting Service',
    //   price: 29,
    //   originalPrice: 39,
    //   duration: 'Monthly',
    //   features: [
    //     'Daily calorie tracking',
    //     'Meal planning assistance',
    //     'Food database access',
    //     'Progress analytics',
    //     '3-day free trial',
    //   ],
    //   popular: false,
    //   icon: 'Calculator',
    //   color: 'bg-warning',
    //   hasTrial: true,
    // },
  ];

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          لطفا یک محصول را انتخاب کنید
        </h2>
        <p className="text-muted-foreground"></p>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            className={`relative p-4 rounded-lg border-2 cursor-pointer animate-spring ${
              selectedService === service.id
                ? 'border-primary bg-green-300'
                : 'border-border bg-card hover:border-primary/50'
            }`}>
            {service.popular && (
              <div className="absolute  -top-3 left-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                محبوب
              </div>
            )}

            {service.hasTrial && (
              <div className="absolute -top-2 right-4 bg-success text-success-foreground text-xs font-medium px-2 py-1 rounded">
                Free Trial
              </div>
            )}

            <div className="">
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                  <h3 className="text-lg p-1 font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <div className="flex flex-col">
                    <div className="text-right ">
                      {selectedLocation !== 'iran' ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-foreground">
                            € {service.price}
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-foreground">
                              {service.rialPrice.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        </div>
                      )}
                      <span className="text-xs">
                        برای {service.duration.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-1">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon
                        name="Check"
                        size={14}
                        className="text-success flex-shrink-0"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/*
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedService === service.id
                    ? 'border-primary bg-primary'
                    : 'border-muted'
                }`}>
                {selectedService === service.id && (
                  <Icon
                    name="Check"
                    size={12}
                    className="text-primary-foreground"
                  />
                )}
              </div> */}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          variant="default"
          fullWidth
          onClick={onContinue}
          disabled={!selectedService}>
          ادامه
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
