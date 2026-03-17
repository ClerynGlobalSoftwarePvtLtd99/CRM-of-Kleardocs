import React, { useState } from "react";

const getInitialForm = (data) => ({
  name: data?.name || "",
  template: data?.template || "",
  hsn: data?.hsn || "",
  professionalFees: data?.professionalFees || "",
  govtFees: data?.govtFees || "",
  status: data?.status || "Active",
});

const ServiceFormModal = ({ onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(getInitialForm(initialData));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center">
      
      <div className="bg-bg-secondary border border-bg-tertiary p-6 rounded-xl w-100 shadow-lg">
        
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {initialData ? "Edit Service" : "Add New Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Service Name"
            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <input
            name="template"
            value={form.template}
            onChange={handleChange}
            placeholder="Template"
            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"
          />

          <input
            name="professionalFees"
            type="number"
            value={form.professionalFees}
            onChange={handleChange}
            placeholder="Professional Fees"
            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"
          />

          <input
            name="govtFees"
            type="number"
            value={form.govtFees}
            onChange={handleChange}
            placeholder="Government Fees"
            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"
          />

          <input
            name="hsn"
            value={form.hsn}
            onChange={handleChange}
            placeholder="HSN Code"
            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border border-bg-tertiary text-text-secondary rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;