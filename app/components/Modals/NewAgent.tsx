import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'
import  apiService  from '../../services/apiService' 

interface NewAgentProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface AgentForm {
  fullName: string
  phone: string
  email: string
  status: 'Active' | 'Pending'
  role:'agent'
  password: string
}

interface ApiError {
  detail?: string
  error?: string
  [key: string]: unknown
}

const NewAgent = ({ isOpen, onClose, onSuccess }: NewAgentProps) => {
  const [agent, setAgent] = useState<AgentForm>({
    fullName: '',
    phone: '',
    email: '',
    status: 'Active',
    role:'agent',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value
    
    // Handle phone number - remove leading 0 if present
    if (e.target.name === 'phone') {
      value = value.replace(/^0/, '')
    }
    
    setAgent(prev => ({ ...prev, [e.target.name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Combine +254 prefix with phone number
      const fullPhone = `+254${agent.phone}`
      
      await apiService.postWithToken('/users/register/', {
        full_name: agent.fullName,
        phone_number: fullPhone,
        email: agent.email,
        status: agent.status.toLowerCase(),
        role:agent.role,
        password: agent.password,
      })

      setSuccess(true)
      // reset form
      setAgent({ fullName: '', phone: '', email: '', status: 'Active', role:'agent' ,password: '' })
      setTimeout(() => {
        setSuccess(false)
        onClose()
        // Trigger page refresh
        if (onSuccess) {
          onSuccess()
        }
      }, 1200)

    } catch (err: unknown) {
      const apiErr = err as ApiError
      console.log(err)
      setError(apiErr.detail || apiErr.error || 'Failed to create agent. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add New Agent">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">
            Agent created successfully!
          </div>
        )}

        <div>
          <label className="text-green-700 text-sm">Full Name</label>
          <input
            name="fullName"
            value={agent.fullName}
            onChange={handleChange}
            className={inputClass}
            type="text"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-green-700 text-sm">Phone Number</label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
              +254
            </span>
            <input
              name="phone"
              value={agent.phone}
              onChange={handleChange}
              className={inputClass}
              type="text"
              placeholder="765123456"
              required
              disabled={loading}
              maxLength={9}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter phone without the leading 0 (e.g., 765123456)</p>
        </div>

        <div>
          <label className="text-green-700 text-sm">Email Address</label>
          <input
            name="email"
            value={agent.email}
            onChange={handleChange}
            className={inputClass}
            type="email"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-green-700 text-sm">Status</label>
          <select
            name="status"
            value={agent.status}
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          >
            <option>Active</option>
            <option>Pending</option>
          </select>
        </div>

        <div>
          <label className="text-green-700 text-sm">Password</label>
          <input
            name="password"
            value={agent.password}
            onChange={handleChange}
            className={inputClass}
            type="password"
            required
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {loading ? 'Saving...' : 'Save Agent'}
          </button>
        </div>

      </form>
    </ModalWrapper>
  )
}

export default NewAgent