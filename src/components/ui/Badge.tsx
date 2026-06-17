import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

type BadgeColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children?: ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  count?: number;
  maxCount?: number;
  dot?: boolean;
  invisible?: boolean;
  showZero?: boolean;
  className?: string;
  offset?: [number, number];
}

const colorMap: Record<BadgeColor, string> = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  success: 'bg-success-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  gray: 'bg-background-500',
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      color = 'primary',
      size = 'md',
      count,
      maxCount = 99,
      dot = false,
      invisible = false,
      showZero = false,
      className,
      offset,
    },
    ref
  ) => {
    const showBadge = () => {
      if (invisible) return false;
      if (dot) return true;
      if (count === undefined) return false;
      if (count === 0) return showZero;
      return count > 0;
    };

    const displayCount = () => {
      if (count === undefined) return '';
      if (count > maxCount) return `${maxCount}+`;
      return count.toString();
    };

    const sizes = {
      dot: {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5',
      },
      count: {
        sm: 'min-w-4 h-4 text-[10px] px-1',
        md: 'min-w-5 h-5 text-xs px-1.5',
        lg: 'min-w-6 h-6 text-sm px-2',
      },
    };

    const offsetStyle = offset
      ? { top: offset[0], right: offset[1] }
      : undefined;

    const badgeSize = dot ? sizes.dot[size] : sizes.count[size];

    if (!children) {
      if (!showBadge()) return null;
      return (
        <span
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center rounded-full text-white font-medium',
            colorMap[color],
            badgeSize,
            className
          )}
        >
          {!dot && displayCount()}
        </span>
      );
    }

    return (
      <span ref={ref} className={cn('relative inline-flex', className)}>
        {children}
        {showBadge() && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={offsetStyle}
            className={cn(
              'absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white font-medium',
              colorMap[color],
              badgeSize,
              'shadow-sm'
            )}
          >
            {!dot && displayCount()}
          </motion.span>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
