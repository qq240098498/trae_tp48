import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { type ReactNode } from 'react';
import Button from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeStyles = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20',
  };

  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center text-center px-6',
        sizeStyles[size],
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl bg-background-100 text-background-400 mb-5',
          iconSizes[size]
        )}
      >
        {icon || <Package className={cn('w-1/2 h-1/2')} />}
      </div>
      <h3
        className={cn(
          'font-semibold text-background-900',
          titleSizes[size]
        )}
      >
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-background-500 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          <Button
            variant={action.variant || 'primary'}
            size={size === 'sm' ? 'sm' : 'md'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
