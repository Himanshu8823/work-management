import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/helpers';
import { BarChart3, Users, CheckSquare, ChevronRight } from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    name: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
];

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed md:relative left-0 top-16 md:top-0 z-30 h-screen md:h-auto w-64 bg-gradient-to-b from-orange-100 to-orange-50 border-r border-orange-200 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      <nav className="flex flex-col gap-0 p-4 md:p-6">
        <div className="mb-8 hidden md:block">
          <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
            Navigation
          </div>
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group',
                active
                  ? 'bg-orange-400 text-white shadow-md'
                  : 'text-gray-700 hover:bg-orange-200 hover:text-gray-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              {active && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info - Desktop Only */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 border-t border-orange-200 bg-orange-100">
        <div className="text-xs text-orange-700 text-center">
          <p className="font-semibold">Client Work v1.0</p>
          <p className="text-orange-600 mt-1">Management System</p>
        </div>
      </div>
    </aside>
  );
}
