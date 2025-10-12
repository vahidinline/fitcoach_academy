import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceSelectionStep = ({
  selectedService,
  onServiceSelect,
  onContinue,
  selectedLocation,
  services,
}) => {
  return !services || services.length === 0 ? (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="loader mb-4"></div>
        <span className="loading loading-spinner text-primary"></span>

        <p dir="rtl" className="text-muted-foreground">
          در حال بارگذاری محصولات...
        </p>
      </div>
    </div>
  ) : (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          لطفا یک محصول را انتخاب کنید
        </h2>
        <p className="text-muted-foreground"></p>
      </div>

      <div className="space-y-4">
        {services.map((service) => {
          if (service.status === 'notActive') return null;
          {
            return (
              <div
                key={service._id}
                onClick={() => onServiceSelect(service._id)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer animate-spring ${
                  selectedService === service._id
                    ? 'border-primary bg-green-300 text-white'
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
                        {service.name.displayName}
                      </h3>
                      <div className="flex flex-col">
                        <div className="text-right ">
                          {selectedLocation !== 'iran' ? (
                            <div className="flex items-center space-x-2">
                              {service.status !== 'discontinued' ? (
                                <span className="text-xl font-bold text-foreground">
                                  € {service.price.displayPrice}
                                </span>
                              ) : (
                                <span className="flex flex-col text-right">
                                  <span className="text-xl font-bold text-foreground line-through">
                                    € {service.price.displayPrice}
                                  </span>
                                  <span className="text-xl font-bold text-foreground">
                                    € {service.price.discountedPrice}
                                  </span>
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              {service.status !== 'discontinued' ? (
                                <span className="text-xl font-bold text-foreground">
                                  {service.priceRial.price.toLocaleString(
                                    'fa-IR'
                                  )}{' '}
                                  تومان
                                </span>
                              ) : (
                                <span className="flex flex-col text-right">
                                  <span className="text-xl font-bold text-foreground line-through">
                                    {service.priceRial.price.toLocaleString(
                                      'fa-IR'
                                    )}{' '}
                                    تومان
                                  </span>
                                  <span className="text-xl font-bold text-foreground">
                                    {service.priceRial.dispayDiscound.toLocaleString(
                                      'fa-IR'
                                    )}{' '}
                                    تومان
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                          {/* <span className="text-xs">
                            برای {service.duration.toLowerCase()}
                          </span> */}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-1">
                      {service.features.map(
                        (feature, index) =>
                          feature.status && (
                            <li
                              key={index}
                              className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Icon
                                name="Check"
                                size={14}
                                className="text-success flex-shrink-0"
                              />
                              {feature.status && <span>{feature.value}</span>}
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          }
        })}
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
