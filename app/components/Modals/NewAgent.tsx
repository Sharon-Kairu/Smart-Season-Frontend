import React from 'react'
import ModalWrapper from './ModalWrapper'

interface NewAgentProps {
  isOpen: boolean
  onClose: () => void
}

const NewAgent = ({ isOpen, onClose }: NewAgentProps) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Agent"
    >
      <form className="flex flex-col gap-4">

        <div>
          <label className="text-green-700 text-sm">Full Name</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="text" />
        </div>

        <div>
          <label className="text-green-700 text-sm">Phone Number</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="text" />
        </div>

        <div>
          <label className="text-green-700 text-sm">Email Address</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="text" />
        </div>
       <div>
          <label className="text-green-700 text-sm">Region</label>
          <input className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" type="text" />
        </div>

        <div>
          <label className="text-green-700 text-sm">Status</label>
          <select className="w-full p-2 border rounded-lg">
            <option>Active</option>
            <option>Pending</option>
          </select>
        </div>

      
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
            Save Agent
          </button>
        </div>

      </form>
    </ModalWrapper>
  )
}

export default NewAgent