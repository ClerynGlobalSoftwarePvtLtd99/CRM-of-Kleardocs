import { Search, X } from "lucide-react";

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
    // Fetch agents for filter dropdown
    dispatch(fetchUsers({ role: 'agent' }));
    // Fetch services for filter dropdown
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

      console.log("Applying filters:", filters); // Debug log

      onFilterChange(filters);

      toast.success("Filters applied");

    }

  };



  const handleClear = () => {

    const clearedFilters = initialFilters;

    setFilters(clearedFilters);

    if (onFilterChange) {

      onFilterChange(clearedFilters);

    }

    toast.success("Filters cleared");

  };



  return (

    <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-8 mb-6 space-y-8 shadow-sm">

      {/* First Row */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

        <div className="fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Search</span>

          <div className="relative">

            <input

              name="search"

              placeholder="Name / Phone / Company"

              value={filters.search}

              onChange={handleChange}

              className="w-full !font-bold !text-sm"

            />

            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />

          </div>

        </div>



        <div className="fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Date Type</span>

          <select

            name="dateType"

            value={filters.dateType}

            onChange={handleChange}

            className="w-full !font-bold !text-sm"

          >

            <option>Created</option>

            <option>Last Followup</option>

            <option>Next Followup</option>

          </select>

        </div>



        <div className="fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Date Range</span>

          <DateRangePicker

            startDate={filters.startDate}

            endDate={filters.endDate}

            onRangeChange={(startDate, endDate) =>

              setFilters((prev) => ({

                ...prev,

                startDate,

                endDate,

              }))

            }

          />

        </div>



        <div className="fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Service</span>

          <select

            name="service"

            value={filters.service}

            onChange={handleChange}

            className="w-full !font-bold !text-sm"

          >

            <option value="">All Services</option>

            {services.filter(s => s.status).map((service) => (
              <option key={service._id} value={service.name}>{service.name}</option>
            ))}

          </select>

        </div>

      </div>



      {/* Second Row */}

      <div className="flex flex-wrap items-end gap-6">

        <div className="flex-1 min-w-[180px] fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Agent</span>

          <select

            name="agent"

            value={filters.agent}

            onChange={handleChange}

            className="w-full !font-bold !text-sm"

          >

            <option value="">All Agents</option>

            {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}

          </select>

        </div>



        <div className="flex-1 min-w-[180px] fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Source</span>

          <select

            name="source"

            value={filters.source}

            onChange={handleChange}

            className="w-full !font-bold !text-sm"

          >

            <option value="">All Sources</option>

            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}

          </select>

        </div>



        <div className="flex-1 min-w-[140px] fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Type</span>

          <select

            name="type"

            value={filters.type}

            onChange={handleChange}

            className="w-full !font-bold !text-sm"

          >

            <option value="">All Types</option>

            {CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}

          </select>

        </div>



        <div className="flex-1 min-w-[140px] fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Priority</span>

          <select

            name="priority"

            value={filters.priority}

            onChange={handleChange}

            className="w-full !font-bold !text-sm"

          >

            <option value="">All Priorities</option>

            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}

          </select>

        </div>



        <div className="flex-1 min-w-[180px] fieldset-input !mt-0">

          <span className="fieldset-label uppercase">Response</span>

          <select

            name="response"

            value={filters.response}

            onChange={handleChange}

            className="w-full !font-bold !text-sm"

          >

            <option value="">All Responses</option>

            {RESPONSES.map(r => <option key={r} value={r}>{r}</option>)}

          </select>

        </div>



        <div className="flex-1 min-w-[180px] fieldset-input !mt-0">

          <span className="fieldset-label uppercase">State & UT</span>

          <select

            name="state"

            value={filters.state}

            onChange={handleChange}

            className="w-full !font-bold !text-sm"

          >

            <option value="">All States & UTs</option>

            {STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}

          </select>

        </div>



        <div className="flex items-center gap-3 pb-0.5">

          <button

            type="button"

            onClick={handleApplyFilters}

            className="btn-raised btn-raised-orange text-white px-6 py-2 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg flex items-center gap-2"

          >

            <Search size={16} />

            Filter

          </button>



          <button

            type="button"

            onClick={handleClear}

            className="p-2.5 bg-bg-tertiary hover:bg-red-500/20 text-red-500 border border-bg-tertiary rounded-md transition-all shadow-sm group"

            title="Clear Filters"

          >

            <X size={18} className="group-hover:rotate-90 transition-transform" />

          </button>

        </div>

      </div>

    </div>

  );

};



export default LeadsFilter;