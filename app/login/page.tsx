'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import apiService from '../services/apiService'
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const submitLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await apiService.postWithoutToken(
        '/users/auth/login/',
        { email, password }
      )

      const role = response.user.role
      if (role === 'admin' || role === 'superadmin') {
        router.push('/admin_dash')
      } else {
        router.push('/agent_dash')
      }
    } catch (error: any) {
      console.log('Login Failed: ', error)
      setError(error.message || 'Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 via-green-200 to-green-300">

      {/* Decorative blur circles */}
      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-green-400 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-green-600 opacity-30 rounded-full blur-3xl"></div>

      {/* Card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/70 border border-white/40 flex flex-col justify-center px-8 py-12 rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Welcome back
          </h1>
          <p className="text-green-800/70 text-sm">
            Sign in to your SmartSeason account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}


        <div className="mb-4">
          <label className="block text-xs font-medium tracking-widest uppercase text-green-700/60 mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-200 bg-white text-green-950 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all disabled:bg-gray-100"
            />
          </div>
        </div>

  
        <div className="mb-6">
          <label className="block text-xs font-medium tracking-widest uppercase text-green-700/60 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-green-200 bg-white text-green-950 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all disabled:bg-gray-100"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) submitLogin()
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-green-100 transition"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-green-600" />
              ) : (
                <Eye className="h-5 w-5 text-green-600" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={submitLogin}
          disabled={isLoading}
          className="w-full py-3 bg-green-900 text-white rounded-lg text-sm font-semibold hover:bg-green-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:bg-green-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>

      </div>
    </div>
  )
}

export default Login