import React from "react";
import { FiLogOut } from "react-icons/fi";

const DashHeader = () => {
  return (
    <div className="w-full bg-green-600 text-white px-6 py-4 flex items-center justify-between shadow-md rounded-xl">   
      <div>
        <h1 className="text-2xl font-semibold">Welcome,</h1>
        <p className="text-sm text-green-100">Sharon Kairu</p>
      </div>
      <button className="flex items-center gap-2 bg-white text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition">
        <FiLogOut size={18} />
        <span className="text-sm font-medium">Logout</span>
      </button>

    </div>
  );
};

export default DashHeader;