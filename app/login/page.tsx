'use client'
import React, { useState } from 'react'

import Link from 'next/link'


const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-[480px] bg-green-200 flex flex-col justify-center px-10 py-14 lg:px-14">
        
        <div className="mb-8">
          
          <h1 className="text-3xl font-bold text-green-950 mb-2">Welcome back</h1>
          <p className="text-green-700/60 text-sm font-light">Sign in to your SmartSeason account</p>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium tracking-widest uppercase text-green-700/60 mb-2">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-green-100 bg-green-50/30 text-green-950 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
          />
        </div>

        <div className="mb-2">
          <label className="block text-xs font-medium tracking-widest uppercase text-green-700/60 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-green-100 bg-green-50/30 text-green-950 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
          />
        </div>

        <button className="w-full py-4 bg-green-950 text-white rounded-xl text-sm font-medium tracking-wide hover:bg-green-800 active:scale-[0.99] transition-all">
          Sign in
        </button>

        
      </div>
    </div>
  )
}

export default Login