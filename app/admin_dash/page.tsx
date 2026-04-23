import React from "react";
import DashHeader from "../components/DashHeader";
import AdminCards from "../components/AdminCards";
import { FaEdit } from "react-icons/fa";

const page = () => {
    
  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <DashHeader />

      <div className="p-4 md:p-6 flex flex-col gap-6">
        <AdminCards />

        {/* FIELDS TABLE */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            Current Fields
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
                  <th className="py-2 px-3">Assigned To</th>
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
                  <td className="py-3 px-3 text-gray-700 font-medium">John</td>
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
                  <td className="py-3 px-3 text-gray-700 font-medium">John</td>
                  
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

        {/* AGENTS TABLE */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            Agents
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Region</th>
                  <th className="py-2 px-3">Fields</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="bg-gray-50 hover:bg-green-50 transition rounded-xl">
                  <td className="py-3 px-3 font-semibold text-gray-800">
                    John Mwangi
                  </td>
                  <td className="py-3 px-3 text-gray-500">
                    +254 712 345 678
                  </td>
                  <td className="py-3 px-3 text-gray-500">
                    john@farmapp.com
                  </td>
                  <td className="py-3 px-3 text-gray-600">Kiambu</td>
                  <td className="py-3 px-3 text-gray-700 font-medium">
                    3 Fields
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </td>
                </tr>

                <tr className="bg-gray-50 hover:bg-green-50 transition rounded-xl">
                  <td className="py-3 px-3 font-semibold text-gray-800">
                    Mary Wanjiku
                  </td>
                  <td className="py-3 px-3 text-gray-500">
                    +254 798 123 456
                  </td>
                  <td className="py-3 px-3 text-gray-500">
                    mary@farmapp.com
                  </td>
                  <td className="py-3 px-3 text-gray-600">Nairobi</td>
                  <td className="py-3 px-3 text-gray-700 font-medium">
                    2 Fields
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      Inactive
                    </span>
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