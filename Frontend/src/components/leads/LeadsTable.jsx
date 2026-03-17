const LeadsTable = ({ leads }) => {
  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl shadow flex flex-col h-[65vh]">

      <div className="overflow-auto flex-1 scrollbar-thin">

        <div className="min-w-275 space-y-3 p-3">

          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-bg-primary rounded-xl px-4 py-3 grid grid-cols-12 items-center gap-4 shadow"
            >

              {/* PROFILE + NAME */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-700 text-white font-semibold">
                  {lead.name?.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold leading-tight">
                    {lead.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {lead.phone}
                  </p>
                </div>
              </div>

              {/* ADDRESS + SERVICE */}
              <div className="col-span-3 text-sm">
                <p className="text-text-secondary truncate">
                  {lead.address || "—"}
                </p>
                <p className="font-medium text-text-primary">
                  {lead.service}
                </p>
              </div>

              {/* SOURCE + DATE */}
              <div className="col-span-2 text-sm">
                <p className="text-text-secondary">
                  {lead.source}
                </p>
                <p className="text-text-secondary">
                  {lead.createdAt}
                </p>
              </div>

              {/* AGENT */}
              <div className="col-span-1 text-sm font-medium">
                {lead.agent}
              </div>

              {/* TAGS */}
              <div className="col-span-2 flex gap-2">
                {lead.type && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {lead.type.toUpperCase()}
                  </span>
                )}

                {lead.priority && (
                  <span className="bg-red-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {lead.priority.toUpperCase()}
                  </span>
                )}
              </div>

              {/* BUTTON */}
              <div className="col-span-1 flex justify-end">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs font-semibold shadow">
                  DETAILS
                </button>
              </div>

            </div>
          ))}

          {leads.length === 0 && (
            <div className="text-center text-text-secondary py-10">
              No leads found
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default LeadsTable;