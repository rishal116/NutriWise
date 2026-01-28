"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export default function FilterBar({ filters, setFilters }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className="relative group">
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-80">
          <input
            className="bg-transparent outline-none text-sm w-full text-black"
            placeholder="Search coach..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold ml-2">
            Search
          </button>
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 hover:text-gray-600 text-black"
      >
        <span>Filters</span>
        <SlidersHorizontal size={18} />
      </button>

      {/* Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-gray-300 relative shadow-lg">
            <button onClick={() => setIsOpen(false)} className="absolute right-6 top-6 text-gray-600 hover:text-black">
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 text-black">Filter Options</h2>
            
            {/* Gender Section */}
            <div className="mb-6">
               <p className="text-gray-500 mb-2 text-sm">Gender</p>
               <div className="flex gap-2">
                 {['Male', 'Female'].map(g => (
                   <button 
                     key={g} 
                     className="px-4 py-2 bg-gray-100 rounded-xl border border-gray-300 hover:border-black text-sm text-black"
                   >
                     {g}
                   </button>
                 ))}
               </div>
            </div>

            {/* Language/Rating Placeholder */}
            <div className="space-y-4">
               <div>
                 <p className="text-gray-500 mb-2 text-sm">Minimum Rating</p>
                 <input type="range" min="1" max="5" className="w-full accent-black" />
               </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="w-full mt-8 bg-black text-white py-3 rounded-2xl font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
