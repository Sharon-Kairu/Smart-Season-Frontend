'use client'
import {useState} from "react";
import { FaSeedling, FaUsers } from "react-icons/fa";
import NewAgent from "./Modals/NewAgent";
import NewField from "./Modals/NewField";

const AdminCards = () => {
    const[showNewFieldModal,setShowNewFieldModal]=useState(false)
    const[showNewAgentModal,setShowNewAgentModal]=useState(false)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

      {/* FIELDS CARD */}
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Fields</h2>
          <FaSeedling className="text-green-600 text-xl" />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500">Number of fields</p>
            <h1 className="text-3xl font-bold text-gray-800">12</h1>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                   onClick={()=>setShowNewFieldModal(true)}
                   >
            + Add Field
          </button>
        </div>

      </div>

      {/* AGENTS CARD */}
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Agents</h2>
          <FaUsers className="text-green-600 text-xl" />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500">Number of agents</p>
            <h1 className="text-3xl font-bold text-gray-800">10</h1>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                  onClick={()=>setShowNewAgentModal(true)}
          >
            + Add Agent
          </button>
        </div>
         <NewAgent
           isOpen={showNewAgentModal}
           onClose={()=>setShowNewAgentModal(false)}
         />
         <NewField
           isOpen={showNewFieldModal}
           onClose={()=>setShowNewFieldModal(false)}
         />
      </div>

    </div>
   
  );
};

export default AdminCards;