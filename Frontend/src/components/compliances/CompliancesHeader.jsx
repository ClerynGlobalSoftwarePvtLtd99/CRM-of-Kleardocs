
const CompliancesHeader = ({financialYear , setFinancialYear , onView}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      
      <h1 className="text-2xl font-semibold">
        Compliances <span className="text-gray-500">(5199)</span>
      </h1>

      <div className="flex items-center gap-4">
        
        <fieldset className="border rounded px-3 pb-2 cursor-pointer">
            <legend className="text-sm px-1">
              Select Financial Year
            </legend>

            <select 
            value={financialYear}
            onChange={(e)=>setFinancialYear(e.target.value)}
            className="bg-transparent outline-none text-white float-end cursor-pointer">
              <option className="text-bg-tertiary">2025-2026</option>
              <option className="text-bg-tertiary">2024-2025</option>
              <option className="text-bg-tertiary">2023-2024</option>
            </select>
          </fieldset>

        <button 
        onClick={onView}
        className="bg-green-600 text-white px-5 py-2 rounded cursor-pointer">
          VIEW
        </button>

      </div>

    </div>
  );
};

export default CompliancesHeader;