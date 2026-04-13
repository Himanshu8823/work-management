import { useLogout, useCurrentAdmin } from '@/hooks/useQueries';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { data: adminData } = useCurrentAdmin();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  const admin = adminData?.data?.admin;

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-gray-300 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-gray-300 transition-colors text-gray-700"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo/Brand */}
        <div className="flex-1 md:flex-none">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight ml-2 md:ml-0">
            Client Work
          </h1>
        </div>

        {/* Header Spacer */}
        <div className="flex-1 hidden md:block" />

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {admin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-200 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">{admin.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white rounded-2xl shadow-lg">
                <DropdownMenuItem disabled className="text-gray-600 text-sm">
                  <User className="h-4 w-4 mr-2" />
                  <span>{admin.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
