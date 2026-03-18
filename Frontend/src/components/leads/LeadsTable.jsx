import { useNavigate } from "react-router";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return as is if already formatted

  const d = date.getDate();
  const suffix = d === 1 || d === 21 || d === 31 ? "st" : d === 2 || d === 22 ? "nd" : d === 3 || d === 23 ? "rd" : "th";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${d}${suffix} ${months[date.getMonth()]} ${date.getFullYear()} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

const LeadsTable = ({ leads }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
      <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-bg-tertiary">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead className="sticky top-0 z-10 bg-bg-tertiary/50 backdrop-blur-sm">
            <tr className="text-[11px] uppercase tracking-wider text-text-secondary border-b border-bg-tertiary">
              <th className="px-4 py-3 font-bold text-center">
                <input type="checkbox" className="rounded border-bg-tertiary accent-yellow-500" />
              </th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Phone</th>
              <th className="px-4 py-3 font-bold">Company Name</th>
              <th className="px-4 py-3 font-bold">Service</th>
              <th className="px-4 py-3 font-bold">Lead Source</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-center">Priority</th>
              <th className="px-4 py-3 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-tertiary">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-bg-tertiary/20 transition-colors">
                {/* 1. Tick box */}
                <td className="px-4 py-4 text-center">
                  <input type="checkbox" className="rounded border-bg-tertiary accent-yellow-500" />
                </td>

                {/* 2. Date */}
                <td className="px-4 py-4">
                  <span className="text-[10px] text-text-secondary whitespace-nowrap">{formatDate(lead.createdAt)}</span>
                </td>

                {/* 3. Name */}
                <td className="px-4 py-4">
                  <span className="font-bold text-xs text-text-primary whitespace-nowrap">{lead.name}</span>
                </td>

                {/* 4. Phone */}
                <td className="px-4 py-4">
                  <span className="text-xs text-text-secondary whitespace-nowrap">{lead.phone}</span>
                </td>

                {/* 5. Company Name */}
                <td className="px-4 py-4">
                  <span className="font-semibold text-xs text-text-primary capitalize truncate max-w-[150px] inline-block">
                    {lead.companyName || "—"}
                  </span>
                </td>

                {/* 6. Service */}
                <td className="px-4 py-4">
                  <span className="text-[11px] text-text-secondary italic truncate max-w-[150px] inline-block">
                    {lead.service}
                  </span>
                </td>

                {/* 7. Lead Source */}
                <td className="px-4 py-4">
                   <span className="text-xs font-medium text-text-primary capitalize whitespace-nowrap">{lead.source}</span>
                </td>

                {/* 8. Status */}
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${lead.isCustomer ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                    {lead.isCustomer ? 'CUSTOMER' : 'LEAD'}
                  </span>
                </td>

                {/* 9. Priority */}
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    lead.priority?.toLowerCase() === 'high' ? 'bg-orange-500 text-white' :
                    lead.priority?.toLowerCase() === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {lead.priority?.toUpperCase() || "NONE"}
                  </span>
                </td>

                {/* 10. Details */}
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => navigate(`/lead/${lead.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-[10px] font-bold shadow-md transition-all whitespace-nowrap"
                  >
                    DETAILS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
            <p className="text-sm font-medium">No leads found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;