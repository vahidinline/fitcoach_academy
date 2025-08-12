import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const MeasurementInputs = ({ measurements, onMeasurementsChange }) => {
  const [unitSystem, setUnitSystem] = useState('metric');

  const unitOptions = [
    { value: 'metric', label: 'Metric (kg, cm)' },
    { value: 'imperial', label: 'Imperial (lbs, inches)' },
  ];

  const measurementFields = [
    // {
    //   key: 'weight',
    //   label: 'Weight',
    //   icon: 'Scale',
    //   unit: unitSystem === 'metric' ? 'kg' : 'lbs',
    //   placeholder: unitSystem === 'metric' ? '70.5' : '155.3',
    // },
    // {
    //   key: 'bodyFat',
    //   label: 'Body Fat Percentage',
    //   icon: 'Percent',
    //   unit: '%',
    //   placeholder: '15.2',
    // },
    {
      key: 'chest',
      label: 'سینه',
      icon: 'Ruler',
      unit: unitSystem === 'metric' ? 'cm' : 'inches',
      placeholder: unitSystem === 'metric' ? '95' : '37.4',
    },
    {
      key: 'waist',
      label: 'کمر',
      icon: 'Ruler',
      unit: unitSystem === 'metric' ? 'cm' : 'inches',
      placeholder: unitSystem === 'metric' ? '80' : '31.5',
    },
    {
      key: 'hips',
      label: 'هیپ',
      icon: 'Ruler',
      unit: unitSystem === 'metric' ? 'cm' : 'inches',
      placeholder: unitSystem === 'metric' ? '90' : '35.4',
    },
    {
      key: 'bicep',
      label: 'بازو',
      icon: 'Ruler',
      unit: unitSystem === 'metric' ? 'cm' : 'inches',
      placeholder: unitSystem === 'metric' ? '35' : '13.8',
    },
  ];

  const handleMeasurementChange = (key, value) => {
    onMeasurementsChange({
      ...measurements,
      [key]: value,
      unitSystem: unitSystem,
    });
  };

  const addCustomMeasurement = () => {
    const customKey = `custom_${Date.now()}`;
    onMeasurementsChange({
      ...measurements,
      [customKey]: {
        label: '',
        value: '',
        unit: unitSystem === 'metric' ? 'cm' : 'inches',
      },
    });
  };

  const removeCustomMeasurement = (key) => {
    const updated = { ...measurements };
    delete updated[key];
    onMeasurementsChange(updated);
  };

  const updateCustomMeasurement = (key, field, value) => {
    onMeasurementsChange({
      ...measurements,
      [key]: {
        ...measurements[key],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            سایز ها و اندازه‌ها
          </h3>
          <p className="text-sm text-muted-foreground">
            پیشرفت فیزیکی خود را با اندازه‌گیری‌های دقیق پیگیری کنید
          </p>
        </div>
        <Select
          options={unitOptions}
          value={unitSystem}
          onChange={setUnitSystem}
          className="w-40"
        />
      </div>

      {/* Standard Measurements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {measurementFields.map((field) => (
          <div key={field.key} className="relative">
            <Input
              label={field.label}
              type="number"
              placeholder={field.placeholder}
              value={measurements[field.key] || ''}
              onChange={(e) =>
                handleMeasurementChange(field.key, e.target.value)
              }
              className="pr-16"
            />
            <div className="absolute right-3 top-9 flex items-center space-x-2 text-muted-foreground">
              <Icon name={field.icon} size={16} />
              <span className="text-sm font-medium">{field.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Measurements */}
      {Object.keys(measurements).filter((key) => key.startsWith('custom_'))
        .length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">
            اندازه‌گیری‌های سفارشی
          </h4>
          {Object.entries(measurements)
            .filter(([key]) => key.startsWith('custom_'))
            .map(([key, measurement]) => (
              <div
                key={key}
                className="flex items-end space-x-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <Input
                    label="Measurement Name"
                    type="text"
                    placeholder="e.g., Thigh, Forearm"
                    value={measurement.label || ''}
                    onChange={(e) =>
                      updateCustomMeasurement(key, 'label', e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Value"
                    type="number"
                    placeholder="0.0"
                    value={measurement.value || ''}
                    onChange={(e) =>
                      updateCustomMeasurement(key, 'value', e.target.value)
                    }
                  />
                </div>
                <div className="w-20">
                  <Input
                    label="Unit"
                    type="text"
                    value={
                      measurement.unit ||
                      (unitSystem === 'metric' ? 'cm' : 'inches')
                    }
                    onChange={(e) =>
                      updateCustomMeasurement(key, 'unit', e.target.value)
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomMeasurement(key)}
                  iconName="Trash2"
                  className="text-destructive hover:text-destructive"
                />
              </div>
            ))}
        </div>
      )}

      {/* Add Custom Measurement Button */}
      <Button
        variant="outline"
        onClick={addCustomMeasurement}
        iconName="Plus"
        iconPosition="left"
        className="w-full sm:w-auto">
        Add Custom Measurement
      </Button>

      {/* Measurement Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">
              Measurement Tips
            </h4>
            <ul className="text-xs text-primary/80 space-y-1">
              <li>
                • Take measurements at the same time of day for consistency
              </li>
              <li>• Measure on bare skin or tight-fitting clothing</li>
              <li>
                • Don't pull the tape too tight - it should be snug but not
                compressing
              </li>
              <li>• Record measurements weekly for best progress tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementInputs;
