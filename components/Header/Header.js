"use client"
import { useApp } from '@/contexts/AppContext';
import { LogIn, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase/init';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header = () => {
  const { user } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Don't show back button on root or top-level routes
    const isTopLevelRoute = pathname === '/' || pathname === '/dashboard' || pathname === '/login';
    const isDeepRoute = pathname.split('/').filter(Boolean).length > 1;
    setCanGoBack(isDeepRoute && !isTopLevelRoute);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="fixed w-full bg-white border-b border-gray-200">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            {canGoBack && (
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            {/* Logo Section */}
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">BH</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">BH Remodeling INC</span>
            </Link>
          </div>

          {/* Login/Logout Button */}
          <div>
            {user ? (
              <button 
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) : (
              <Link 
                href="/login" 
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                  isLoginPage 
                    ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
                onClick={e => isLoginPage && e.preventDefault()}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;