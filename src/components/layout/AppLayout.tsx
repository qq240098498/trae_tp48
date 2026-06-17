import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageSquare,
  PieChart,
  Settings,
  Sparkles,
  Target,
  User,
  X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path?: string;
  badge?: number;
  children?: NavItem[];
}

export interface AppLayoutProps {
  children: ReactNode;
  logo?: ReactNode;
  user?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  navItems?: NavItem[];
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  className?: string;
}

const defaultNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: '仪表盘',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    id: 'strategy',
    label: '策略中心',
    icon: <Lightbulb className="w-5 h-5" />,
    path: '/strategy',
  },
  {
    id: 'campaigns',
    label: '营销活动',
    icon: <Target className="w-5 h-5" />,
    path: '/campaigns',
    badge: 3,
  },
  {
    id: 'analytics',
    label: '数据分析',
    icon: <PieChart className="w-5 h-5" />,
    path: '/analytics',
  },
  {
    id: 'ai-assistant',
    label: 'AI 助手',
    icon: <Sparkles className="w-5 h-5" />,
    path: '/ai-assistant',
  },
  {
    id: 'messages',
    label: '消息中心',
    icon: <MessageSquare className="w-5 h-5" />,
    path: '/messages',
    badge: 5,
  },
];

export default function AppLayout({
  children,
  logo,
  user = { name: '张小明', role: '营销策划师' },
  navItems = defaultNavItems,
  sidebarCollapsed: externalCollapsed,
  onSidebarToggle,
  className,
}: AppLayoutProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const location = useLocation();

  const isCollapsed = externalCollapsed ?? internalCollapsed;

  const toggleSidebar = () => {
    if (onSidebarToggle) {
      onSidebarToggle();
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isActive = (item: NavItem) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some((child) => child.path === location.pathname);
    }
    return false;
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const active = isActive(item);

    const itemContent = (
      <div
        className={cn(
          'flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          active
            ? 'bg-primary-500 text-white shadow-primary'
            : 'text-background-600 hover:bg-background-100 hover:text-background-900',
          depth > 0 ? 'ml-4' : ''
        )}
      >
        <span
          className={cn(
            'flex-shrink-0',
            active ? 'text-white' : 'text-background-400 group-hover:text-primary-500'
          )}
        >
          {item.icon}
        </span>
        {!isCollapsed && (
          <>
            <span className="ml-3 flex-1 whitespace-nowrap">{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  'flex-shrink-0 inline-flex items-center justify-center min-w-5 h-5 text-xs font-medium rounded-full',
                  active ? 'bg-white/20 text-white' : 'bg-accent-500 text-white'
                )}
              >
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronDown
                className={cn(
                  'w-4 h-4 flex-shrink-0 transition-transform duration-200',
                  isExpanded ? 'rotate-180' : ''
                )}
              />
            )}
          </>
        )}
      </div>
    );

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            type="button"
            className="w-full text-left"
            onClick={() => toggleExpand(item.id)}
          >
            {itemContent}
          </button>
          {!isCollapsed && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-1 space-y-1"
                >
                  {item.children?.map((child) => renderNavItem(child, depth + 1))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    }

    if (item.path) {
      return (
        <Link key={item.id} to={item.path} className="block mb-1">
          {itemContent}
        </Link>
      );
    }

    return (
      <button key={item.id} type="button" className="w-full text-left mb-1">
        {itemContent}
      </button>
    );
  };

  const sidebarContent = (
    <>
      <div className="flex items-center h-16 px-4 border-b border-background-100">
        <Link to="/" className="flex items-center flex-shrink-0">
          {logo || (
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-lg font-bold text-background-900 font-serif-sc">
                  营销智策
                </span>
              )}
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      <div className="px-3 py-4 border-t border-background-100">
        <Link
          to="/settings"
          className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-background-600 hover:bg-background-100 hover:text-background-900 transition-colors duration-200"
        >
          <Settings className="w-5 h-5 text-background-400" />
          {!isCollapsed && <span className="ml-3">设置</span>}
        </Link>
      </div>
    </>
  );

  return (
    <div className={cn('flex h-screen bg-background-50', className)}>
      {/* Desktop Sidebar */}
      <motion.aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-background-100',
          isCollapsed ? 'w-20' : 'w-64'
        )}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 z-50 h-full w-64 flex-col bg-white border-r border-background-100 lg:hidden flex"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-background-400 hover:text-background-600 hover:bg-background-100"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-background-100">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileMenuOpen(true);
                } else {
                  toggleSidebar();
                }
              }}
              className="p-2 rounded-lg text-background-500 hover:text-background-700 hover:bg-background-100 transition-colors duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="relative p-2 rounded-lg text-background-500 hover:text-background-700 hover:bg-background-100 transition-colors duration-200"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
            </button>

            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-background-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-background-900">
                  {user.name}
                </p>
                <p className="text-xs text-background-500">{user.role}</p>
              </div>
              <button
                type="button"
                className="p-1 rounded-lg text-background-400 hover:text-background-600 hover:bg-background-100 transition-colors duration-200"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
