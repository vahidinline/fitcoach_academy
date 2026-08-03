import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(
  (
    {
      className,
      type = 'text',
      label,
      description,
      error,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base input classes
    const baseInputClasses =
      'flex h-12 w-full rounded-2xl border border-[#1c2c29]/12 bg-[#fbfaf7] px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9aa19d] focus-visible:border-[#638176] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#638176]/10 disabled:cursor-not-allowed disabled:opacity-50';

    // Checkbox-specific styles
    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    // Radio button-specific styles
    if (type === 'radio') {
      return (
        <input
          type="radio"
          className={cn(
            'h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    // For regular inputs with wrapper structure
    return (
      <div className="space-y-2.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              error ? 'text-destructive' : 'text-foreground'
            )}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <input
          type={type}
          className={cn(
            baseInputClasses,
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />

        {description && !error && (
          <p className="text-xs text-muted-foreground ">{description}</p>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
