"use client"
import { useAuth } from '@/contexts/auth';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-10 w-10">
    <defs>
      <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#7BA4E8"}}/>
        <stop offset="45%" style={{stopColor:"#4169E1"}}/>
        <stop offset="55%" style={{stopColor:"#4169E1"}}/>
        <stop offset="100%" style={{stopColor:"#2850AA"}}/>
      </linearGradient>
      
      <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor:"#2850AA"}}/>
        <stop offset="50%" style={{stopColor:"#4169E1"}}/>
        <stop offset="100%" style={{stopColor:"#2850AA"}}/>
      </linearGradient>

      <filter id="rimLight">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="1" dy="1" result="offsetblur"/>
        <feFlood floodColor="#1E40AF"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feComposite in="SourceGraphic"/>
      </filter>
    </defs>

    <circle cx="100" cy="100" r="98" fill="url(#edgeGradient)" stroke="#2850AA" strokeWidth="3"/>
    <circle cx="100" cy="100" r="90" fill="url(#coinGradient)"/>
    <circle cx="100" cy="100" r="85" fill="none" stroke="#2850AA" strokeWidth="1.5"/>
    <circle cx="100" cy="100" r="82" fill="none" stroke="#2850AA" strokeWidth="0.5"/>
    
    <text x="100" y="125" 
          fontFamily="Arial Black, Arial, sans-serif" 
          fontSize="80" 
          fontWeight="bold"
          textAnchor="middle" 
          fill="#FFFFFF"
          style={{filter: "drop-shadow(1px 1px 1px #2850AA)"}}>
      BH
    </text>

    <path d="M 30,100 A 70,70 0 0,1 170,100" 
          fill="none" 
          stroke="#7BA4E8" 
          strokeWidth="0.5"
          opacity="0.3"/>

    <circle cx="100" cy="100" r="90" 
            fill="url(#coinGradient)" 
            opacity="0.1" 
            filter="url(#rimLight)"/>
  </svg>
);

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