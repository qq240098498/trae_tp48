import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { forwardRef, type HTMLAttributes } from 'react';

type ProgressColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger';
type ProgressSize = 'sm' | 'md' | 'lg';

interface BaseProgressProps {
  value: number;
  max?: number;
  color?: ProgressColor;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export interface LinearProgressProps extends BaseProgressProps, Omit<HTMLAttributes<HTMLDivElement>, keyof BaseProgressProps> {
  variant?: 'linear';
  size?: ProgressSize;
  striped?: boolean;
  animated?: boolean;
}

export interface CircularProgressProps extends BaseProgressProps, Omit<HTMLAttributes<HTMLDivElement>, keyof BaseProgressProps> {
  variant: 'circular';
  size?: number;
  strokeWidth?: number;
}

export type ProgressBarProps = LinearProgressProps | CircularProgressProps;

const colorMap: Record<ProgressColor, string> = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  success: 'bg-success-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const textColorMap: Record<ProgressColor, string> = {
  primary: 'text-primary-500',
  accent: 'text-accent-500',
  success: 'text-success-500',
  warning: 'text-amber-500',
  danger: 'text-red-500',
};

const strokeColorMap: Record<ProgressColor, string> = {
  primary: '#1E3A5F',
  accent: '#FF6B35',
  success: '#2EC4B6',
  warning: '#F59E0B',
  danger: '#EF4444',
};

const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(
  (
    {
      value,
      max = 100,
      color = 'primary',
      size = 'md',
      showLabel = false,
      label,
      striped = false,
      animated = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const heightMap: Record<ProgressSize, string> = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const stripedStyles = striped
      ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent bg-size-200'
      : '';
    const animationStyles = animated ? 'animate-gradient-shift' : '';

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-2">
            {label && <span className="text-sm font-medium text-background-700">{label}</span>}
            {showLabel && (
              <span className={cn('text-sm font-semibold', textColorMap[color])}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            'w-full bg-background-200 rounded-full overflow-hidden',
            heightMap[size]
          )}
        >
          <motion.div
            className={cn(
              'h-full rounded-full',
              colorMap[color],
              stripedStyles,
              animationStyles
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }
);

LinearProgress.displayName = 'LinearProgress';

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      max = 100,
      color = 'primary',
      size = 64,
      strokeWidth = 6,
      showLabel = false,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            className="text-background-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <motion.circle
            stroke={strokeColorMap[color]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {(showLabel || label) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {showLabel && (
              <span className={cn('text-lg font-bold', textColorMap[color])}>
                {Math.round(percentage)}%
              </span>
            )}
            {label && (
              <span className="text-xs text-background-500 mt-0.5">{label}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (props, ref) => {
    if ('variant' in props && props.variant === 'circular') {
      return <CircularProgress ref={ref} {...props} />;
    }
    return <LinearProgress ref={ref} {...(props as LinearProgressProps)} />;
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
