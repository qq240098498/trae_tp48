import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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
  const tabRefsMap = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const activeTab = value ?? internalValue;

  const setActiveTab = useCallback((newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [value, onValueChange]);

  const registerTab = useCallback((id: string, ref: HTMLButtonElement | null) => {
    tabRefsMap.current.set(id, ref);
  }, []);

  const contextValue = useMemo(() => ({
    activeTab,
    setActiveTab,
    registerTab,
  }), [activeTab, setActiveTab, registerTab]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  const { activeTab, setActiveTab, registerTab: parentRegisterTab } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);
  const localTabRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const registerTab = useCallback((id: string, ref: HTMLButtonElement | null) => {
    localTabRefs.current.set(id, ref);
    parentRegisterTab(id, ref);
  }, [parentRegisterTab]);

  const updateIndicator = useCallback(() => {
    const activeRef = localTabRefs.current.get(activeTab);
    const listEl = listRef.current;
    if (activeRef && listEl) {
      setIndicatorStyle({
        left: activeRef.offsetLeft,
        width: activeRef.offsetWidth,
      });
    }
  }, [activeTab]);

  const contextValue = useMemo(() => ({
    activeTab,
    setActiveTab,
    registerTab,
  }), [activeTab, setActiveTab, registerTab]);

  return (
    <TabsContext.Provider value={contextValue}>
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
  const registeredRef = useRef(false);

  const handleRef = useCallback((el: HTMLButtonElement | null) => {
    triggerRef.current = el;
    registerTab(value, el);
  }, [value, registerTab]);

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
