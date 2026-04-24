import React, { useState, useEffect } from 'react'
import ModalWrapper from './ModalWrapper'
import apiService from '../../services/apiService' 

interface NewFieldProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface Agent {
  id: string
  full_name: string
  email: string
}

interface FieldForm {
  name: string
  location: string
  crop_type: string
  planting_date: string
  size: string
  assigned_to: string
  stage: 'planted' | 'growing' | 'ready' | 'harvested'
}

const NewField = ({ isOpen, onClose, onSuccess }: NewFieldProps) => {
  const [field, setField] = useState<FieldForm>({
    name: '',
    location: '',
    crop_type: '',
    planting_date: '',
    size: '',
    assigned_to: '',
    stage: 'planted',
  })

  const [agents, setAgents] = useState<Agent[]>([])
  const [loadingAgents, setLoadingAgents] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const fetchAgents = async () => {
      setLoadingAgents(true)
      try {
        const data = await apiService.getWithToken('/users/agents/')
        setAgents(data)
      } catch {
       
      } finally {
        setLoadingAgents(false)
      }
    }
    fetchAgents()
  }, [isOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setField(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await apiService.postWithToken('/fields/fields/', {
        name: field.name,
        location: field.location,
        crop_type: field.crop_type,
        planting_date: field.planting_date,
        size_in_acres: field.size ? parseFloat(field.size) : null,
        assigned_to_id: field.assigned_to || null,
        stage: field.stage,
      })

      setSuccess(true)
      setField({
        name: '',
        location: '',
        crop_type: '',
        planting_date: '',
        size: '',
        assigned_to: '',
        stage: 'planted',
      })
      setTimeout(() => {
        setSuccess(false)
        onClose()
        // Trigger page refresh
        if (onSuccess) {
          onSuccess()
        }
      }, 1200)

    } catch (err: unknown) {
      const e = err as { detail?: string; error?: string }
      setError(e.detail || e.error || 'Failed to create field. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50'

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add New Field">
      <form
        onSubmit={handleSubmit}
        className="h-[400px] flex flex-col gap-4 overflow-y-auto pr-1"
      >
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">
            Field created successfully!
          </div>
        )}

        <div>
          <label className="text-green-700 text-sm">Name</label>
          <input
            name="name"
            value={field.name}
            onChange={handleChange}
            className={inputClass}
            type="text"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-green-700 text-sm">Location</label>
          <input
            name="location"
            value={field.location}
            onChange={handleChange}
            className={inputClass}
            type="text"
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-green-700 text-sm">Crop Type</label>
          <input
            name="crop_type"
            value={field.crop_type}
            onChange={handleChange}
            className={inputClass}
            type="text"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-green-700 text-sm">Planting Date</label>
          <input
            name="planting_date"
            value={field.planting_date}
            onChange={handleChange}
            className={inputClass}
            type="date"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-green-700 text-sm">Size (Acres)</label>
          <input
            name="size"
            value={field.size}
            onChange={handleChange}
            className={inputClass}
            type="number"
            min="0"
            step="0.1"
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-green-700 text-sm">Stage</label>
          <select
            name="stage"
            value={field.stage}
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          >
            <option value="planted">🌱 Planted</option>
            <option value="growing">🌿 Growing</option>
            <option value="ready">✅ Ready</option>
            <option value="harvested">🌾 Harvested</option>
          </select>
        </div>

        <div>
          <label className="text-green-700 text-sm">Assign to Agent</label>
          <select
            name="assigned_to"
            value={field.assigned_to}
            onChange={handleChange}
            className={inputClass}
            disabled={loading || loadingAgents}
          >
            <option value="">
              {loadingAgents ? 'Loading agents...' : '— Unassigned —'}
            </option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.full_name} ({agent.email})
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
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
            {loading ? 'Saving...' : 'Save Field'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  )
}

export default NewField