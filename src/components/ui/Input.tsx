import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface BaseInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  size?: InputSize;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  wrapperClassName?: string;
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    BaseInputProps {
  multiline?: false;
}

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    BaseInputProps {
  multiline: true;
}

type CombinedInputProps = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, CombinedInputProps>(
  (props, ref) => {
    const {
      label,
      required,
      error,
      size = 'md',
      prefixIcon,
      suffixIcon,
      wrapperClassName,
      className,
      ...rest
    } = props;

    const sizes: Record<InputSize, string> = {
      sm: 'h-8 text-sm px-3',
      md: 'h-10 text-sm px-4',
      lg: 'h-12 text-base px-5',
    };

    const textareaSizes: Record<InputSize, string> = {
      sm: 'min-h-20 text-sm p-3',
      md: 'min-h-28 text-sm p-4',
      lg: 'min-h-36 text-base p-5',
    };

    const baseInputStyles =
      'w-full rounded-lg border border-background-200 bg-white text-background-900 placeholder:text-background-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-200 disabled:bg-background-50 disabled:cursor-not-allowed';

    const errorStyles = error
      ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
      : '';

    const prefixPadding = prefixIcon ? 'pl-10' : '';
    const suffixPadding = suffixIcon ? 'pr-10' : '';

    const isMultiline = 'multiline' in rest && rest.multiline === true;

    const renderInput = () => {
      if (isMultiline) {
        const { multiline, ...textareaRest } = rest as TextareaProps;
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={cn(
              baseInputStyles,
              errorStyles,
              textareaSizes[size],
              'resize-y',
              className
            )}
            {...textareaRest}
          />
        );
      }

      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={cn(
            baseInputStyles,
            errorStyles,
            sizes[size],
            prefixPadding,
            suffixPadding,
            className
          )}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      );
    };

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label className="block mb-1.5 text-sm font-medium text-background-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-background-400 pointer-events-none">
              {prefixIcon}
            </span>
          )}
          {renderInput()}
          {suffixIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-background-400 pointer-events-none">
              {suffixIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
