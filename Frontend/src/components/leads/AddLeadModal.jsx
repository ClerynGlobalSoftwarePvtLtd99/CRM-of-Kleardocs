import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Plus,
  Instagram,
  Facebook,
  MessageCircleMore,
  Globe,
  ChevronDown,
  Youtube,
  Phone,
  Users,
  Monitor,
  Snowflake,
} from "lucide-react";
import { useSelector } from "react-redux";

import { 
  SOURCES, 
  STATES_AND_UTS, 
  AGENTS, 
  CLIENT_TYPES, 
  PRIORITIES,
  RESPONSES
} from "../../utils/constants";

const getSourceIcon = (sourceName) => {
  switch (sourceName.toLowerCase()) {
    case "instagram": return Instagram;
    case "facebook": return Facebook;
    case "youtube": return Youtube;
    case "whatsapp": return MessageCircleMore;
    case "referral": return Users;
    case "website": return Monitor;
    case "cold call": return Phone;
    case "other": return Globe;
    default: return Globe;
  }
};

const sourceOptions = SOURCES.map(source => ({
  value: source, // Keep original case
  label: source,
  icon: getSourceIcon(source)
}));

const SourceDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedSource =
    sourceOptions.find((item) => item.value === value) || sourceOptions[3];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SelectedIcon = selectedSource.icon;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none transition hover:bg-bg-tertiary"
      >
        <span className="flex items-center gap-2">
          <SelectedIcon size={16} />
          {selectedSource.label}
        </span>
        <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-text-primary bg-bg-secondary shadow-lg">
          {sourceOptions.map((source) => {
            const Icon = source.icon;
            const active = value === source.value;

            return (
              <button
                key={source.value}
                type="button"
                onClick={() => {
                  onChange(source.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-yellow-500 text-white"
                    : "bg-bg-secondary text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                <Icon size={16} />
                {source.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ServiceDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { services } = useSelector((state) => state.services);

  const activeServices = services.filter(s => s.status);
  const selectedService =
    activeServices.find((item) => item.name === value) || activeServices[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none transition hover:bg-bg-tertiary"
      >
        <span className="flex items-center gap-2">
          {selectedService?.name || 'Select Service'}
        </span>
        <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-text-primary bg-bg-secondary shadow-lg">
          {activeServices.map((service) => {
            const active = value === service.name;

            return (
              <button
                key={service._id}
                type="button"
                onClick={() => {
                  onChange(service.name);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-yellow-500 text-white"
                    : "bg-bg-secondary text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                {service.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AddLeadModal = ({ onClose, onSubmit }) => {
  const { services } = useSelector((state) => state.services);
  const activeServices = services.filter(s => s.status);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    companyName: "",
    service: activeServices[0]?.name || "", // Default to first active service
    source: SOURCES[1], // Facebook
    type: CLIENT_TYPES[0], // Hot
    priority: PRIORITIES[0], // High
    response: RESPONSES[0], // Interested
    address: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyDigits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-bg-tertiary bg-bg-secondary text-text-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-bg-tertiary px-5 py-4">
          <h2 className="text-lg font-semibold">Add New Lead</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter lead name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex overflow-hidden rounded-md border border-text-primary bg-bg-secondary">
                <span className="flex items-center border-r border-text-primary px-3 text-sm text-text-secondary">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Service
              </label>
              <ServiceDropdown
                value={formData.service}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, service: value }))
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Source
              </label>
              <SourceDropdown
                value={formData.source}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, source: value }))
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              >
                {CLIENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Response
              </label>
              <select
                name="response"
                value={formData.response}
                onChange={handleChange}
                className="w-full rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              >
                {RESPONSES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Address
              </label>
              <textarea
                name="address"
                rows="3"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                className="w-full resize-none rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                State & UT
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full rounded-md border border-text-primary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-yellow-500"
              >
                <option value="">Select State / UT</option>
                {STATES_AND_UTS.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-3 border-t border-bg-tertiary pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-text-primary bg-bg-secondary px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-600"
            >
              <Plus size={16} />
              Add New Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;