'use client'
import React from 'react'

import { ReactNode } from 'react'
import { FiX } from 'react-icons/fi'

interface ModalWrapperProps{
    isOpen:boolean,
    onClose:()=>void,
    title:string,
    children:ReactNode
}


const ModalWrapper = ({ isOpen, onClose, title, children }: ModalWrapperProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <FiX size={22}  />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

export default ModalWrapper
