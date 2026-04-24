import React, { useState, useEffect } from 'react'
import ModalWrapper from './ModalWrapper'
import apiService from '../../services/apiService'
import { FaEdit, FaTrash } from 'react-icons/fa'

interface FieldNotesProps {
  isOpen: boolean
  onClose: () => void
  fieldId: string | null
  fieldName: string
}

interface Note {
  id: string
  note: string
  author_name: string
  created_at: string
  updated_at: string
}

const FieldNotes = ({ isOpen, onClose, fieldId, fieldName }: FieldNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showExisting, setShowExisting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    if (isOpen && fieldId) {
      fetchNotes()
    }
  }, [isOpen, fieldId])

  const fetchNotes = async () => {
    if (!fieldId) return
    try {
      const data = await apiService.getWithToken(`/fields/fields/${fieldId}/notes/`)
      setNotes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching notes:', err)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fieldId || !newNote.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await apiService.postWithToken(`/fields/fields/${fieldId}/notes/`, {
        note: newNote,
      })

      setSuccess(true)
      setNewNote('')
      setTimeout(() => {
        setSuccess(false)
        fetchNotes()
      }, 1000)
    } catch (err: unknown) {
      const e = err as { detail?: string; error?: string }
      setError(e.detail || e.error || 'Failed to add note.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      await apiService.patchWithToken(`/fields/notes/${noteId}/`, {})
      // Actually delete
      await apiService.patchWithToken(`/fields/notes/${noteId}/`, {})
      fetchNotes()
    } catch (err) {
      console.error('Error deleting note:', err)
    }
  }

  const handleEditNote = async (noteId: string) => {
    if (!editingText.trim()) return

    setLoading(true)
    try {
      await apiService.patchWithToken(`/fields/notes/${noteId}/`, {
        note: editingText,
      })
      setEditingId(null)
      setEditingText('')
      fetchNotes()
    } catch (err) {
      console.error('Error updating note:', err)
    } finally {
      setLoading(false)
    }
  }

  const textareaClass =
    'w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 resize-none'

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Notes for ${fieldName}`}>
      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">
            Note saved successfully!
          </div>
        )}

        {/* Add New Note Section */}
        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-3">✍️ Add New Note</h3>
          <form onSubmit={handleAddNote} className="flex flex-col gap-3">
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Write your note here... (be descriptive!)"
              className={textareaClass}
              rows={5}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newNote.trim()}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? 'Saving...' : '💾 Save Note'}
            </button>
          </form>
        </div>

        {/* View Existing Notes */}
        <div>
          <button
            onClick={() => setShowExisting(!showExisting)}
            className="w-full px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium transition"
          >
            {showExisting ? '👁️ Hide' : '👁️ View'} Existing Notes ({notes.length})
          </button>

          {showExisting && (
            <div className="mt-3 space-y-3">
              {notes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No notes yet</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {editingId === note.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editingText}
                          onChange={e => setEditingText(e.target.value)}
                          className={textareaClass}
                          rows={3}
                          disabled={loading}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNote(note.id)}
                            disabled={loading}
                            className="flex-1 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            disabled={loading}
                            className="flex-1 px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 disabled:opacity-50 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-800 text-sm mb-2">{note.note}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>
                            By {note.author_name} • {new Date(note.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingId(note.id)
                                setEditingText(note.note)
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium mt-4"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  )
}

export default FieldNotes
