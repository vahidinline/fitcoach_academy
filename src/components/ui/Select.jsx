import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, LoaderCircle, Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = React.forwardRef(function Select(
  {
    className,
    triggerClassName,
    menuClassName,
    options = [],
    value,
    defaultValue,
    placeholder = 'یک گزینه را انتخاب کنید',
    multiple = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    searchable = false,
    clearable = false,
    loading = false,
    id,
    name,
    onChange,
    onOpenChange,
    ...props
  },
  forwardedRef,
) {
  const generatedId = useId();
  const selectId = id || `select-${generatedId.replace(/:/g, '')}`;
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState(defaultValue ?? (multiple ? [] : ''));
  const selectedValue = value !== undefined ? value : internalValue;

  const filteredOptions = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase('fa');
    if (!searchable || !query) return options;
    return options.filter((option) => `${option.label} ${option.value}`.toLocaleLowerCase('fa').includes(query));
  }, [options, searchable, searchTerm]);

  const selectedOptions = multiple
    ? options.filter((option) => Array.isArray(selectedValue) && selectedValue.includes(option.value))
    : options.filter((option) => option.value === selectedValue);
  const hasValue = multiple ? selectedOptions.length > 0 : selectedOptions.length === 1;
  const displayValue = hasValue
    ? multiple && selectedOptions.length > 1 ? `${selectedOptions.length} گزینه انتخاب شده` : selectedOptions[0].label
    : placeholder;

  const setOpen = (nextOpen) => {
    if (disabled || loading) return;
    setIsOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) setSearchTerm('');
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    if (searchable) requestAnimationFrame(() => searchRef.current?.focus());
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, searchable]);

  const commitValue = (nextValue) => {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const selectOption = (option) => {
    if (option.disabled) return;
    if (multiple) {
      const current = Array.isArray(selectedValue) ? selectedValue : [];
      commitValue(current.includes(option.value) ? current.filter((item) => item !== option.value) : [...current, option.value]);
    } else {
      commitValue(option.value);
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} dir="rtl" className={cn('relative w-full', className)}>
      {label && <label id={`${selectId}-label`} className={cn('mb-2 block text-xs font-bold text-[#52605b]', error && 'text-red-600')}>{label}{required && <span className="mr-1 text-[#df6b52]">*</span>}</label>}
      <button
        ref={forwardedRef}
        id={selectId}
        type="button"
        disabled={disabled || loading}
        aria-labelledby={label ? `${selectId}-label` : undefined}
        aria-controls={`${selectId}-menu`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setOpen(!isOpen)}
        className={cn(
          'flex min-h-[52px] w-full items-center justify-between gap-3 rounded-2xl border bg-[#fbfaf6] px-4 text-right text-sm text-[#1c2c29] outline-none transition duration-200',
          'hover:border-[#b7bdb9] focus-visible:border-[#df6b52] focus-visible:ring-4 focus-visible:ring-[#df6b52]/10',
          isOpen && 'border-[#df6b52] bg-white ring-4 ring-[#df6b52]/10',
          !hasValue && 'text-[#87928e]',
          error && 'border-red-400 bg-red-50/40 focus-visible:border-red-500 focus-visible:ring-red-100',
          (disabled || loading) && 'cursor-not-allowed bg-[#efede7] opacity-60',
          triggerClassName,
        )}
        {...props}>
        <span className="min-w-0 flex-1 truncate">{displayValue}</span>
        <span className="flex shrink-0 items-center gap-2 text-[#66736e]">
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {clearable && hasValue && !loading && <span role="button" tabIndex={-1} aria-label="پاک کردن انتخاب" onClick={(event) => { event.stopPropagation(); commitValue(multiple ? [] : ''); }} className="rounded-full p-1 transition hover:bg-[#e6e2da]"><X className="h-3.5 w-3.5" /></span>}
          <span className={cn('flex h-7 w-7 items-center justify-center rounded-xl bg-[#e9e6de] transition', isOpen && 'rotate-180 bg-[#1c2c29] text-white')}><ChevronDown className="h-4 w-4" /></span>
        </span>
      </button>

      {name && <select className="sr-only" name={name} value={selectedValue ?? ''} onChange={() => {}} tabIndex={-1} multiple={multiple} required={required} aria-hidden="true">{!multiple && <option value="">{placeholder}</option>}{options.map((option) => <option key={String(option.value)} value={option.value}>{option.label}</option>)}</select>}

      {isOpen && <div id={`${selectId}-menu`} role="listbox" aria-multiselectable={multiple || undefined} className={cn('absolute inset-x-0 top-[calc(100%+8px)] z-[100] overflow-hidden rounded-[20px] border border-[#d8d4cb] bg-white p-2 shadow-[0_18px_50px_rgba(28,44,41,0.16)]', menuClassName)}>
        {searchable && <div className="relative mb-2"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#87928e]" /><input ref={searchRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="جست‌وجو…" className="h-10 w-full rounded-xl bg-[#f3efe7] pr-9 pl-3 text-sm outline-none focus:ring-2 focus:ring-[#df6b52]/20" /></div>}
        <div className="max-h-64 space-y-1 overflow-y-auto overscroll-contain">
          {filteredOptions.length ? filteredOptions.map((option) => {
            const selected = multiple ? Array.isArray(selectedValue) && selectedValue.includes(option.value) : selectedValue === option.value;
            return <button key={String(option.value)} type="button" role="option" aria-selected={selected} disabled={option.disabled} onClick={() => selectOption(option)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition hover:bg-[#f3efe7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df6b52]/30', selected && 'bg-[#1c2c29] text-white hover:bg-[#1c2c29]', option.disabled && 'cursor-not-allowed opacity-40')}>
              <span className="min-w-0 flex-1"><span className="block font-bold">{option.label}</span>{option.description && <span className={cn('mt-0.5 block text-[11px] text-[#87928e]', selected && 'text-white/60')}>{option.description}</span>}</span>
              <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#cfd4cf]', selected && 'border-[#df6b52] bg-[#df6b52] text-white')}>{selected && <Check className="h-3 w-3" />}</span>
            </button>;
          }) : <p className="px-3 py-6 text-center text-sm text-[#87928e]">گزینه‌ای پیدا نشد.</p>}
        </div>
      </div>}
      {description && !error && <p className="mt-2 text-xs leading-6 text-[#87928e]">{description}</p>}
      {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
