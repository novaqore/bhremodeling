"use client"
import { useAuth } from '@/contexts/auth';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../Logo/Logo';


const Header = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (loading || !user) return null;

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm z-50">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex-shrink-0 flex items-center group hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <Logo />
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-full transition-colors" />
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-lg font-bold text-gray-900">BH Remodeling</span>
              <span className="text-xs font-medium text-gray-500 -mt-1">INC</span>
            </div>
          </Link>

          {/* Avatar/Login Button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                href="/profile"
                className="relative group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  <span className="font-medium text-sm">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors" />
              </Link>
            ) : (
              <Link
                href="/login"
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isLoginPage
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
                onClick={e => isLoginPage && e.preventDefault()}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;