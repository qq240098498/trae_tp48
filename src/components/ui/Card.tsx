import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
  hoverable?: boolean;
  children: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, clickable = false, hoverable = false, children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-2xl shadow-card overflow-hidden';
    const hoverStyles = hoverable || clickable ? 'hover:shadow-card-hover transition-shadow duration-300' : '';
    const clickableStyles = clickable ? 'cursor-pointer' : '';

    const content = (
      <div
        ref={ref}
        className={cn(baseStyles, hoverStyles, clickableStyles, className)}
        {...props}
      >
        {children}
      </div>
    );

    if (clickable) {
      return (
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {content}
        </motion.div>
      );
    }

    return content;
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-5 border-b border-background-100', className)}
      {...props}
    >
      {children || (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-background-900 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-background-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, padded = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(padded ? 'px-6 py-5' : '', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-t border-background-100 bg-background-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;
