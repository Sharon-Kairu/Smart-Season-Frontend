import React from "react";
import DashHeader from "../components/DashHeader";
import AdminCards from "../components/AdminCards";
import { FaEdit } from "react-icons/fa";

const page = () => {
    
  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <DashHeader />

      <div className="p-4 md:p-6 flex flex-col gap-6">

        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            My Fields
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3">Field Name</th>
                  <th className="py-2 px-3">Location</th>
                  <th className="py-2 px-3">Crop Date</th>
                  <th className="py-2 px-3">Planting Date</th>
                  <th className="py-2 px-3">Size (Acres)</th>
                  <th className="py-2 px-3">Stage</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Actions</th>

                </tr>
              </thead>

              <tbody>
                <tr className="bg-gray-50 hover:bg-green-50 transition rounded-xl">
                  <td className="py-3 px-3 font-semibold text-green-700">
                    Field Alpha
                  </td>
                  <td className="py-3 px-3 text-gray-600">Kiambu</td>
                  <td className="py-3 px-3 text-gray-500">Maize</td>
                  <td className="py-3 px-3 text-gray-500">12 Mar 2026</td>
                  <td className="py-3 px-3 text-gray-700 font-medium">5</td>
                  <td className="py-3 px-3 text-gray-700 font-medium">Planted</td>
                  <td className="py-3 px-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </td>
                  <td>
                    <button className="bg-green-400 p-3 m-2 text-white rounded-lg">
                        <FaEdit size={16}/>
                    </button>  
                  </td>
                </tr>

                <tr className="bg-gray-50 hover:bg-green-50 transition rounded-xl">
                  <td className="py-3 px-3 font-semibold text-green-700">
                    Field Beta
                  </td>
                  <td className="py-3 px-3 text-gray-600">Nakuru</td>
                  <td className="py-3 px-3 text-gray-500">Wheat</td>
                  <td className="py-3 px-3 text-gray-500">02 Apr 2026</td>
                  <td className="py-3 px-3 text-gray-700 font-medium">8</td>          
                  <td className="py-3 px-3 text-gray-700 font-medium">Planted</td>        
                  <td className="py-3 px-3">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </td>
                  <td>
                    <button className="bg-green-400 p-3 m-2 text-white rounded-lg">
                        <FaEdit size={16}/>
                    </button>  
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;