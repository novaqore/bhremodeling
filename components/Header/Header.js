"use client"
import { useApp } from '@/contexts/AppContext';
import { LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase/init';
import { signOut } from 'firebase/auth';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { user } = useApp();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-full bg-white shadow-md">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">BH</span>
            </div>
            <span className="ml-2 text-xl font-semibold">BH Remodeling INC</span>
          </Link>

          {/* Login/Logout Button */}
          <div>
            {user ? (
              <button 
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) : (
              <Link 
                href="/login" 
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoginPage 
                    ? 'bg-gray-400 cursor-not-allowed' 
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
    </div>
  );
};

export default Header;