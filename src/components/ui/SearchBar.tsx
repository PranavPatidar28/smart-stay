import React from "react";

const SearchBar = () => {
  return (
    <div className="p-2 bg-gray-100 rounded">
      <input type="text" placeholder="Search..." className="w-full p-2 rounded border border-gray-300" disabled />
      <p className="text-xs text-gray-400 mt-1">Search functionality coming soon.</p>
    </div>
  );
};

export default SearchBar; 