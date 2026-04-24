import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'
import apiService from '../../services/apiService'

interface EditFieldProps {
  isOpen: boolean
  onClose: () => void
  field: {
    id: string
    name: string
    location: string
    crop_type: string
    planting_date: string
    size_in_acres: number
    stage: string
    status: string
    assigned_to: {
      id: string
      full_name: string
    } | null
  } | null
  agents: Array<{ id: string; full_name: string; email: string }>
  onSuccess: () => void
}

interface FieldForm {
  stage: string
  status: string
  assigned_to: string
}

const EditField = ({ isOpen, onClose, field, agents, onSuccess }: EditFieldProps) => {
  const [formData, setFormData] = useState<FieldForm>({
    stage: field?.stage || 'planted',
    status: field?.status || 'active',
    assigned_to: field?.assigned_to?.id || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  React.useEffect(() => {
    if (field) {
      setFormData({
        stage: field.stage,
        status: field.status,
        assigned_to: field.assigned_to?.id || '',
      })
    }
  }, [field, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!field) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await apiService.patchWithToken(`/fields/fields/${field.id}/`, {
        stage: formData.stage,
        status: formData.status,
        assigned_to: formData.assigned_to || null,
      })

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
        onSuccess()
      }, 1200)
    } catch (err: unknown) {
      const e = err as { detail?: string; error?: string }
      setError(e.detail || e.error || 'Failed to update field. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50'

  if (!field) return null

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Edit Field: ${field.name}`}>
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
            Field updated successfully!
          </div>
        )}

        {/* Display current values */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Information</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <p className="font-medium">Name:</p>
              <p>{field.name}</p>
            </div>
            <div>
              <p className="font-medium">Location:</p>
              <p>{field.location}</p>
            </div>
            <div>
              <p className="font-medium">Crop Type:</p>
              <p>{field.crop_type}</p>
            </div>
            <div>
              <p className="font-medium">Size:</p>
              <p>{field.size_in_acres} acres</p>
            </div>
            <div>
              <p className="font-medium">Planting Date:</p>
              <p>{new Date(field.planting_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Assigned To:</p>
              <p>{field.assigned_to?.full_name || 'Unassigned'}</p>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div>
          <label className="text-green-700 text-sm font-medium">Stage</label>
          <select
            name="stage"
            value={formData.stage}
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
          <label className="text-green-700 text-sm font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          >
            <option value="active">Active</option>
            <option value="at_risk">At Risk</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="text-green-700 text-sm font-medium">Assign to Agent</label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          >
            <option value="">— Unassigned —</option>
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
            {loading ? 'Updating...' : 'Update Field'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  )
}

export default EditField
