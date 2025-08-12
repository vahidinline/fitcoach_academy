import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationSelectionStep = ({
  selectedLocation,
  onLocationSelect,
  onContinue,
  onBack,
}) => {
  const locations = [
    {
      id: 'iran',
      name: 'ایران',
      description: 'کاربران ساکن ایران',
      features: ['امکان ثبت نام و ورود با شماره موبال', 'درگاه پرداخت بانکی'],
      icon: 'MapPin',
      flag: '🇮🇷',
      authMethods: ['SMS'],
      paymentMethods: ['ZarinPal', 'Bank Transfer'],
    },
    {
      id: 'international',
      name: 'بین المللی',
      description: 'کاربران ساکن خارج از ایران',
      features: ['ورود با ایمیل', 'درگاه پرداخت ارزی'],
      icon: 'Globe',
      flag: '🌍',
      authMethods: ['SMS', 'Email'],
      paymentMethods: ['Credit Card', 'PayPal', 'Apple Pay'],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Select Your Location
        </h2>
        <p className="text-muted-foreground">
          This helps us provide the best authentication and payment options
        </p>
      </div>

      <div className="space-y-4">
        {locations.map((location) => (
          <div
            key={location.id}
            onClick={() => onLocationSelect(location.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer animate-spring ${
              selectedLocation === location.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            }`}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{location.flag}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                      <span>{location.name}</span>
                      <Icon
                        name={location.icon}
                        size={16}
                        className="text-muted-foreground"
                      />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {location.description}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedLocation === location.id
                        ? 'border-primary bg-primary'
                        : 'border-muted'
                    }`}>
                    {selectedLocation === location.id && (
                      <Icon
                        name="Check"
                        size={12}
                        className="text-primary-foreground"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      امکانات
                    </h4>
                    <ul className="space-y-1">
                      {location.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Icon
                            name="Check"
                            size={12}
                            className="text-success flex-shrink-0"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        Authentication:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {location.authMethods.map((method) => (
                          <span
                            key={method}
                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        Payment:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {location.paymentMethods.map((method) => (
                          <span
                            key={method}
                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          بازگشت
        </Button>
        <Button
          variant="default"
          onClick={onContinue}
          disabled={!selectedLocation}
          className="flex-1">
          ادامه
        </Button>
      </div>
    </div>
  );
};

export default LocationSelectionStep;
