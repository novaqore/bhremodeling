'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/init'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuth } from '@/contexts/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-16 h-16">
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

const FIREBASE_ERRORS = {
  'auth/invalid-email': 'Invalid email address format',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Please check your connection'
}

export default function Login() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    email: 'admin@test.com',
    password: '123456'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      router.push('/')
    } catch (error) {
      const errorMessage = FIREBASE_ERRORS[error.code] || error.message
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl" />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="relative">
              <Logo />
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl" />
            </div>
          </div>

          <div className="relative pt-4">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-600">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter your email"
                    className="mt-1 block w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl text-gray-900 
                              placeholder-gray-500 transition-colors duration-200
                              focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50
                              disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Enter your password"
                      className="block w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl text-gray-900 
                                placeholder-gray-500 transition-colors duration-200
                                focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 
                                hover:text-gray-500 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white
                          bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                          transition-all duration-200 transform hover:shadow-lg
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 text-sm text-red-600 bg-red-50/50 backdrop-blur-sm rounded-xl" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}