

const CompliancesTable = ({ data }) => {
  return (
    <div className="w-full">

      {/* Table Header */}
      <div className="grid grid-cols-[1.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] font-semibold text-text-primary mb-3 px-6">
        <div>Customer Name</div>
        <div>Customer Company</div>
        <div>Compliance Name</div>
        <div>Expiry</div>
        <div>Status</div>
        <div>Completed</div>
        <div>Accountant</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] bg-bg-primary rounded-xl px-6 py-4 shadow-sm items-center"
            >
              
              {/* Customer Name + Phone */}
              <div>
                <div className="font-semibold text-gray-900">
                  {row.customerName}
                </div>
                <div className="text-bg-tertiary text-sm">{row.phone}</div>
              </div>

              {/* Company */}
              <div className="text-bg-tertiary">{row.company}</div>

              {/* Compliance */}
              <div className="text-bg-tertiary truncate">
                {row.compliance}
              </div>

              {/* Expiry */}
              <div className="text-green-600 font-medium">
                {row.expiry}
              </div>

              {/* Status */}
              <div className="text-bg-tertiary">{row.status}</div>

              {/* Completed */}
              <div className="text-bg-tertiary">
                {row.completed ? row.completed : "-"}
              </div>

              {/* Accountant */}
              <div className="text-bg-tertiary">{row.accountant}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-bg-tertiary py-10 bg-bg-secondary rounded-xl shadow-sm">
            No data found
          </div>
        )}
      </div>

    </div>
  );
};

export default CompliancesTable;