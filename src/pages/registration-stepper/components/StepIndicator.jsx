import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, totalSteps, onBack, onExit }) => {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={currentStep === 1}
          className={`p-2 rounded-lg animate-spring ${
            currentStep === 1
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-foreground hover:bg-muted'
          }`}>
          <Icon name="ArrowLeft" size={20} />
        </button>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">
            مرحله {currentStep} از {totalSteps}
          </span>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onExit}
          className="p-2 rounded-lg hover:bg-muted animate-spring text-muted-foreground">
          <Icon name="X" size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
