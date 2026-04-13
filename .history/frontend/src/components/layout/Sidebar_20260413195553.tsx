import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/helpers';
import { BarChart3, Users, CheckSquare } from 'lucide-react';

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

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-white min-h-screen">
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-accent' : '')} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
