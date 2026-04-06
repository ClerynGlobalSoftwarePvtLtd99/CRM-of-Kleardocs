import { Search, X, Calendar as CalendarIcon, Filter, RefreshCcw } from "lucide-react";
import {
  SOURCES,
  CLIENT_TYPES,
  PRIORITIES,
  RESPONSES,
  STATES_AND_UTS
} from "../../utils/constants";
import DateRangePicker from "../DateRangePicker";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/usersSlice";
import { fetchServices } from "../../redux/slices/servicesSlice";
import toast from "react-hot-toast";

const LeadsFilter = ({ onFilterChange, filters: externalFilters = {} }) => {
  const dispatch = useDispatch();
  const { agents } = useSelector((state) => state.users);
  const { services } = useSelector((state) => state.services);

  const initialFilters = {
    search: "",
    dateType: "Created",
    startDate: null,
    endDate: null,
    service: "",
    agent: "",
    source: "",
    type: "",
    priority: "",
    response: "",
    state: "",
  };

  const [filters, setFilters] = useState({ ...initialFilters, ...externalFilters });

  useEffect(() => {
    dispatch(fetchUsers({ role: 'agent' }));
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    setFilters({ ...initialFilters, ...externalFilters });
  }, [JSON.stringify(externalFilters)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
      toast.success("Filters optimized");
    }
  };

  const handleClear = () => {
    const clearedFilters = initialFilters;
    setFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
    toast.success("Filters reset");
  };

  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-6 mb-8 space-y-6 shadow-xl relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-crm-orange/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-crm-orange/10 transition-all duration-700"></div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
        {/* a) Name/Phone/Company */}
        <div className="lg:col-span-3 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Search Keywords</label>
          <div className="relative">
            <input
              name="search"
              placeholder="Name / Phone / Company"
              value={filters.search}
              onChange={handleChange}
              className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all pr-10"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-50" />
          </div>
        </div>

        {/* b) Data Types */}
        <div className="lg:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Timeline Type</label>
          <select
            name="dateType"
            value={filters.dateType}
            onChange={handleChange}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all appearance-none cursor-pointer"
          >
            <option>Created</option>
            <option>Last Followup</option>
            <option>Next Followup</option>
          </select>
        </div>

        {/* c) Select Data Range */}
        <div className="lg:col-span-4 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1 flex items-center gap-1">
            <CalendarIcon size={10} /> Date Period
          </label>
          <DateRangePicker
            startDate={filters.startDate}
            endDate={filters.endDate}
            onRangeChange={(startDate, endDate) =>
              setFilters((prev) => ({ ...prev, startDate, endDate }))
            }
          />
        </div>

        {/* d) Service */}
        <div className="lg:col-span-3 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Service category</label>
          <select
            name="service"
            value={filters.service}
            onChange={handleChange}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all appearance-none cursor-pointer"
          >
            <option value="">All active services</option>
            {services.filter(s => s.status).map((service) => (
              <option key={service._id} value={service._id}>{service.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        {/* e) Agent */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Assigned Agent</label>
          <select
            name="agent"
            value={filters.agent}
            onChange={handleChange}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all appearance-none cursor-pointer"
          >
            <option value="">All active agents</option>
            {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>

        {/* f) Source */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Lead Origin</label>
          <select
            name="source"
            value={filters.source}
            onChange={handleChange}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all appearance-none cursor-pointer"
          >
            <option value="">All sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* g) Type of client */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Lead Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all appearance-none cursor-pointer"
          >
            <option value="">Any Type</option>
            {CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* h) Priority */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Priority</label>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleChange}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all appearance-none cursor-pointer"
          >
            <option value="">Any Priority</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* i) Response */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Current Response</label>
          <select
            name="response"
            value={filters.response}
            onChange={handleChange}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-8 py-2 text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-crm-orange/20 focus:border-crm-orange transition-all appearance-none cursor-pointer"
          >
            <option value="">All responses</option>
            {RESPONSES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end gap-3 pb-0.5 -mr-5">

          <button
            type="button"
            onClick={handleApplyFilters}
            className="lg:flex-none px-4 py-2 bg-accent hover:bg-yellow-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-end gap-1 font-bold text-[11px] uppercase tracking-tighter h-[38px]"
            title="Apply Filter"
          >
            <Filter size={16} />
            <span className="lg:inline">Filter</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="lg:flex-none px-4 py-2 bg-bg-tertiary hover:bg-red-500 hover:text-white text-text-secondary rounded-lg transition-colors cursor-pointer flex items-center justify-end gap-1 font-bold text-[11px] uppercase tracking-tighter h-[38px]"
            title="Clear Filters"
          >
            <X size={16} />
            <span className="lg:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsFilter;