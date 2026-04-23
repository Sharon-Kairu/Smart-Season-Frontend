import React from 'react'
import ModalWrapper from './ModalWrapper'

interface NewFieldProps {
  isOpen: boolean
  onClose: () => void
}

const NewField = ({ isOpen, onClose }: NewFieldProps) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Field"
    >
      <form className="h-[400px] flex flex-col gap-4 overflow-y-scroll">

        <div>
          <label className="text-green-700 text-sm">Name</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="text" />
        </div>

        <div>
          <label className="text-green-700 text-sm">Location</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="text" />
        </div>

        <div>
          <label className="text-green-700 text-sm">Crop type</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="text" />
        </div>

        <div>
          <label className="text-green-700 text-sm">Planting date</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="date" />
        </div>

        <div>
          <label className="text-green-700 text-sm">Size (Acres)</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="number" />
        </div>

        <div>
          <label className="text-green-700 text-sm">Assigned to</label>
          <select className="w-full p-2 border rounded-lg">
            <option>John Mwangi</option>
            <option>Mary Wanjiku</option>
          </select>
        </div>

        <div>
          <label className="text-green-700 text-sm">Status</label>
          <select className="w-full p-2 border rounded-lg">
            <option>Active</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Save Field
          </button>
        </div>

      </form>
    </ModalWrapper>
  )
}

export default NewField