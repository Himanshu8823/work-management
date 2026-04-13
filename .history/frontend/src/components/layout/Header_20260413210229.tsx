import { useLogout, useCurrentAdmin } from '@/hooks/useQueries';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
    <header className="sticky top-0 z-40 bg-blue-100 border-b border-blue-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-700"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo/Brand */}
        <div className="flex-1 md:flex-none">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
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
                <Button variant="ghost" className="gap-2 text-gray-700 hover:bg-blue-200">
                  <div className="h-8 w-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-bold">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{admin.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuItem disabled className="text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">{admin.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer hover:bg-red-50"
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
