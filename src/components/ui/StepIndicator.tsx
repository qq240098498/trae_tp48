import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { type ReactNode } from 'react';

export interface StepItem {
  id: string | number;
  label?: string;
  description?: string;
  icon?: ReactNode;
}

export interface StepIndicatorProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  clickable?: boolean;
  showLabels?: boolean;
  className?: string;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  clickable = false,
  showLabels = true,
  className,
}: StepIndicatorProps) {
  const isCompleted = (index: number) => index < currentStep;
  const isCurrent = (index: number) => index === currentStep;

  const handleClick = (index: number) => {
    if (clickable && onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-center last:flex-none">
            <div
              className={cn(
                'flex flex-col items-center',
                clickable ? 'cursor-pointer' : ''
              )}
              onClick={() => handleClick(index)}
            >
              <div
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300',
                  isCompleted(index)
                    ? 'bg-success-500 text-white shadow-success'
                    : isCurrent(index)
                    ? 'bg-primary-500 text-white shadow-primary ring-4 ring-primary-100'
                    : 'bg-background-100 text-background-500'
                )}
              >
                {isCompleted(index) ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {step.icon || <Check className="w-5 h-5" />}
                  </motion.div>
                ) : (
                  <span>{step.icon || index + 1}</span>
                )}
              </div>
              {showLabels && (
                <div className="mt-3 text-center">
                  {step.label && (
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isCurrent(index)
                          ? 'text-primary-600'
                          : isCompleted(index)
                          ? 'text-success-600'
                          : 'text-background-500'
                      )}
                    >
                      {step.label}
                    </p>
                  )}
                  {step.description && (
                    <p className="mt-0.5 text-xs text-background-400">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div className="relative h-1 bg-background-200 rounded-full overflow-hidden">
                  {isCompleted(index + 1) || isCurrent(index + 1) ? (
                    <motion.div
                      className={cn(
                        'absolute top-0 left-0 h-full rounded-full',
                        isCompleted(index + 1) ? 'bg-success-500' : 'bg-primary-500'
                      )}
                      initial={{ width: '0%' }}
                      animate={{ width: isCurrent(index + 1) ? '100%' : '100%' }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
