import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-300 shadow-sm',
      secondary:
        'bg-background-100 text-background-900 hover:bg-background-200 active:bg-background-300 focus:ring-background-300',
      outline:
        'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-200 bg-transparent',
      ghost:
        'text-primary-500 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-200 bg-transparent',
      danger:
        'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300 shadow-sm',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthStyles,
          className
        )}
        disabled={disabled || loading}
        whileTap={{ scale: 0.97 }}
        whileHover={!disabled && !loading ? { y: -1 } : undefined}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
