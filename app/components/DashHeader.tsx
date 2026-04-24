'use client'
import React, { useState, useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import apiService from "../services/apiService";

const DashHeader = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userName, setUserName] = useState('User')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiService.getWithToken('/users/me/')
        setUserName(userData.full_name || userData.email || 'User')
      } catch (error) {
        console.error('Error fetching user:', error)
        setUserName('User')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await apiService.logout()
    } catch (error) {
      console.log(error)
      // Still redirect even if logout fails
      window.location.href = '/login'
    }
  }

  return (
    <>
      <div className="w-full bg-green-600 text-white px-6 py-4 flex items-center justify-between shadow-md rounded-xl">   
        <div>
          <h1 className="text-2xl font-semibold">Welcome,</h1>
          <p className="text-sm text-green-100">{loading ? 'Loading...' : userName}</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-white text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition disabled:opacity-50"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <FiLogOut size={18} />
          <span className="text-sm font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>

      {/* Logout Modal */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm">
            <div className="mb-4">
              <div className="inline-block">
                <svg className="animate-spin h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">👋 See you soon!</h2>
            <p className="text-gray-600">Logging you out securely...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default DashHeader;