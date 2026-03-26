import React from "react";

const ServicesTable = ({ services, onEditClick, loading }) => {
  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl overflow-hidden shadow-sm">
      
      <div className="overflow-auto px-4">
        <table
          className="w-full text-left"
          style={{ borderSpacing: "0 10px", borderCollapse: "separate" }}
        >
          <thead>
            <tr className="text-text-secondary text-sm uppercase">
              <th className="sticky top-0 bg-bg-secondary px-4 py-4">Service</th>
              <th className="sticky top-0 bg-bg-secondary px-4 py-4">Email Template</th>

              <th className="sticky top-0 bg-bg-secondary px-4 py-4">HSN</th>
              <th className="sticky top-0 bg-bg-secondary px-4 py-4 text-right">Professional</th>
              <th className="sticky top-0 bg-bg-secondary px-4 py-4 text-right">Govt</th>
              <th className="sticky top-0 bg-bg-secondary px-4 py-4">Status</th>
              <th className="sticky top-0 bg-bg-secondary px-4 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr
                key={s._id}
                className="bg-bg-primary hover:bg-bg-tertiary transition rounded-md"
              >
                <td className="px-4 py-3 text-text-primary font-medium rounded-l-lg">
                  {s.name}
                </td>
                <td className="px-4 py-3 text-text-secondary">{s.template}</td>

                <td className="px-4 py-3 text-text-secondary">{s.hsn}</td>
                <td className="px-4 py-3 text-right text-text-primary">
                  ₹ {s.professionalFees}
                </td>
                <td className="px-4 py-3 text-right text-text-secondary">
                  ₹ {s.govtFees}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      s.status === true || s.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {s.status === true ? "Active" : s.status === "Active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center rounded-r-lg">
                  <button
                    onClick={() => onEditClick(s)}
                    className="text-accent hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-text-secondary"
                >
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesTable;