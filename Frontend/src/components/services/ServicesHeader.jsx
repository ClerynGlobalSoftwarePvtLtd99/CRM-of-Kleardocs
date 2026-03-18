import React from "react";

const ServicesHeader = ({ onAddClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-text-primary">
        Services <span className="text-text-secondary">(18)</span>
      </h1>

      <button
        onClick={onAddClick}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium shadow-sm"
      >
        NEW SERVICE
      </button>
    </div>
  );
};

export default ServicesHeader;