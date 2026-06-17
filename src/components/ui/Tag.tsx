import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

type TagColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray';
type TagSize = 'sm' | 'md';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: TagColor;
  size?: TagSize;
  selected?: boolean;
  closable?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      color = 'primary',
      size = 'md',
      selected = false,
      closable = false,
      onClose,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const colorStyles: Record<TagColor, { base: string; selected: string }> = {
      primary: {
        base: 'bg-primary-50 text-primary-600 border-primary-200',
        selected: 'bg-primary-500 text-white border-primary-500',
      },
      accent: {
        base: 'bg-accent-50 text-accent-600 border-accent-200',
        selected: 'bg-accent-500 text-white border-accent-500',
      },
      success: {
        base: 'bg-success-50 text-success-600 border-success-200',
        selected: 'bg-success-500 text-white border-success-500',
      },
      warning: {
        base: 'bg-amber-50 text-amber-600 border-amber-200',
        selected: 'bg-amber-500 text-white border-amber-500',
      },
      danger: {
        base: 'bg-red-50 text-red-600 border-red-200',
        selected: 'bg-red-500 text-white border-red-500',
      },
      gray: {
        base: 'bg-background-100 text-background-600 border-background-200',
        selected: 'bg-background-700 text-white border-background-700',
      },
    };

    const sizes: Record<TagSize, string> = {
      sm: 'text-xs px-2 py-0.5 gap-1',
      md: 'text-sm px-3 py-1 gap-1.5',
    };

    const isClickable = onClick !== undefined;

    const tagContent = (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border transition-all duration-200',
          selected ? colorStyles[color].selected : colorStyles[color].base,
          sizes[size],
          isClickable ? 'cursor-pointer hover:shadow-md' : '',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <span>{children}</span>
        {closable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className={cn(
              'rounded-full transition-colors duration-200',
              selected
                ? 'hover:bg-white/20'
                : 'hover:bg-black/10',
              size === 'sm' ? 'p-0.5' : 'p-0.5'
            )}
          >
            <X className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          </button>
        )}
      </span>
    );

    if (isClickable) {
      return (
        <motion.span
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {tagContent}
        </motion.span>
      );
    }

    return tagContent;
  }
);

Tag.displayName = 'Tag';

export default Tag;
