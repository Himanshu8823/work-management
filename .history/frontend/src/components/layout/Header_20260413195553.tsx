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
import { LogOut, User } from 'lucide-react';

export function Header() {
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

  const admin = adminData?.data;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="font-semibold text-lg tracking-tight">
          Client Work
        </div>

        <div className="flex items-center gap-4">
          {admin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{admin.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled>
                  <User className="h-4 w-4 mr-2" />
                  <span>{admin.email}</span>
                </DropdownMenuItem>
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
