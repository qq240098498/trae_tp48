import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  registerTab: (id: string, ref: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [tabRefs, setTabRefs] = useState<Map<string, HTMLButtonElement | null>>(
    new Map()
  );

  const activeTab = value ?? internalValue;

  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const registerTab = (id: string, ref: HTMLButtonElement | null) => {
    setTabRefs((prev) => {
      const next = new Map(prev);
      next.set(id, ref);
      return next;
    });
  };

  const activeTabRef = tabRefs.get(activeTab);
  const indicatorStyle = activeTabRef
    ? {
        left: activeTabRef.offsetLeft,
        width: activeTabRef.offsetWidth,
      }
    : undefined;

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, registerTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  const { activeTab } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const [tabRefs, setTabRefs] = useState<Map<string, HTMLButtonElement | null>>(
    new Map()
  );

  const registerTab = (id: string, ref: HTMLButtonElement | null) => {
    setTabRefs((prev) => {
      const next = new Map(prev);
      next.set(id, ref);
      return next;
    });
  };

  const updateIndicator = () => {
    const activeRef = tabRefs.get(activeTab);
    const listEl = listRef.current;
    if (activeRef && listEl) {
      setIndicatorStyle({
        left: activeRef.offsetLeft,
        width: activeRef.offsetWidth,
      });
    }
  };

  const context = useTabsContext();
  const originalRegisterTab = context.registerTab;

  const enhancedRegisterTab = (id: string, ref: HTMLButtonElement | null) => {
    originalRegisterTab(id, ref);
    registerTab(id, ref);
  };

  return (
    <TabsContext.Provider value={{ ...context, registerTab: enhancedRegisterTab }}>
      <div
        ref={listRef}
        className={cn(
          'relative flex items-center border-b border-background-200',
          className
        )}
        onMouseUp={updateIndicator}
      >
        {children}
        <AnimatePresence>
          {indicatorStyle && (
            <motion.div
              className="absolute bottom-0 h-0.5 bg-primary-500 rounded-full"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </AnimatePresence>
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, registerTab } = useTabsContext();
  const isActive = activeTab === value;
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleRef = (el: HTMLButtonElement | null) => {
    triggerRef.current = el;
    registerTab(value, el);
  };

  return (
    <button
      ref={handleRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(
        'relative px-4 py-3 text-sm font-medium transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2',
        isActive
          ? 'text-primary-600'
          : 'text-background-500 hover:text-background-700',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <motion.div
      role="tabpanel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn('pt-4', className)}
    >
      {children}
    </motion.div>
  );
}

export default Tabs;
