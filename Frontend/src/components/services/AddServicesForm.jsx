import  { useState } from "react";
import CustomSelect from '../CustomSelect';

const getInitialForm = (data) => ({
  name: data?.name || "",
  template: data?.template || "",
  hsn: data?.hsn || "",
  professionalFees: data?.professionalFees || "",
  govtFees: data?.govtFees || "",
  gst: data?.gst || 0,
  status: data?.status !== undefined ? data?.status : true,
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
    <div className="absolute inset-0 bg-opacity-30 flex justify-center items-center z-50">
      
      <div className="bg-bg-secondary border border-bg-tertiary p-6 rounded-xl w-100 shadow-lg relative" style={{ zIndex: 60 }}>
        
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {initialData ? "Edit Service" : "Add New Service"}
        </h2>

        <div className="relative" style={{ zIndex: 65 }}>
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
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>


          <CustomSelect

            value={form.template}

            onChange={(e) => setForm(prev => ({ ...prev, template: e.target.value }))}

            options={[

              { value: "", label: "Select Template" },

              { value: "Compliance Update", label: "Compliance Update" },

              { value: "Annual Compliance Service - Jagjyot Singh", label: "Annual Compliance Service - Jagjyot Singh" },

              { value: "Annual Compliance Service - Ritu Kaur", label: "Annual Compliance Service - Ritu Kaur" },

              { value: "Annual Compliance Service plus GST plus ESI - Ritu Kaur", label: "Annual Compliance Service plus GST plus ESI - Ritu Kaur" },

              { value: "Annual Compliance - Onboarding", label: "Annual Compliance - Onboarding" },

              { value: "Startup India Registration", label: "Startup India Registration" },

              { value: "Startup India Promotion", label: "Startup India Promotion" },

              { value: "Website", label: "Website" },

              { value: "Professional Tax", label: "Professional Tax" },

              { value: "GST Filling", label: "GST Filling" },

              { value: "Service List", label: "Service List" },

              { value: "Next Quarter Payment", label: "Next Quarter Payment" },

              { value: "INC 20A Reminder", label: "INC 20A Reminder" },

              { value: "ROC plus GST plus ESI plus TDS", label: "ROC plus GST plus ESI plus TDS" },

              { value: "Package plus payment details", label: "Package plus payment details" },

              { value: "Annual Compliance plus Bookkeeping", label: "Annual Compliance plus Bookkeeping" },

              { value: "Director Resignation", label: "Director Resignation" }

            ]}

            placeholder="Select Template"

            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"

          />


          <input
            name="professionalFees"
            type="number"
            value={form.professionalFees}
            onChange={handleChange}
            placeholder="₹ Professional Fees"
            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"
          />

          <input
            name="govtFees"
            type="number"
            value={form.govtFees}
            onChange={handleChange}
            placeholder="₹ Government Fees"
            className="w-full border border-bg-tertiary bg-bg-primary text-text-primary p-2 rounded"
          />

          <input
            name="gst"
            type="number"
            value={form.gst}
            onChange={handleChange}
            placeholder="GST Percentage (%)"
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
  </div>
  );
};

export default ServiceFormModal;