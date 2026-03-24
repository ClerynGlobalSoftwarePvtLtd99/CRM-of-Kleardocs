const LeadsHeader = ({ onAdd, count }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
        <h1 className="text-2xl font-black tracking-tight italic uppercase">
          Leads <span className="text-text-secondary not-italic font-normal">({count})</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onAdd}
          className="btn-raised btn-raised-orange text-white px-6 py-2 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg"
        >
          + New Lead
        </button>
      </div>
    </div>
  );
};

export default LeadsHeader;