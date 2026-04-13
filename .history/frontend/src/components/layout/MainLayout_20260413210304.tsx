import { ReactNode, useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-close sidebar on route/resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside (mobile overlay)
  const handleMainClick = () => {
    if (window.innerWidth < 768 && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className="flex-1 overflow-auto"
          onClick={handleMainClick}
        >
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
