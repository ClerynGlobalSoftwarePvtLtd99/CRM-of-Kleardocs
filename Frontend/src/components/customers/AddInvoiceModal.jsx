import React, { useState, useRef, useEffect } from "react";
import { X, FileText, Calendar as CalendarIcon, ChevronDown } from "lucide-react";

const AddInvoiceModal = ({ customer, service, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-GB'),
    price: 2000,
    gst: 18,
    governmentFees: 0,
    isRecurring: false,
    interval: 1,
    intervalType: 'Month',
    endDate: new Date().toLocaleDateString('en-GB'),
    description: '',
  });
  
  const [showDescription, setShowDescription] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const formatDateToGB = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB');
  };

  const formatDateToISO = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length !== 3) return dateString;
    const [day, month, year] = parts;
    const isoDate = new Date(`${year}-${month}-${day}`);
    return isoDate.toISOString().split('T')[0];
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setFormData({...formData, endDate: value});
  };

  const handleEndDateCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date) => {
    setFormData(prev => ({...prev, endDate: formatDateToGB(date)}));
    setShowCalendar(false);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const current = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = getDaysInMonth(current);
    const firstDay = getFirstDayOfMonth(current);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-text-primary">
      <div className="w-full max-w-md bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="flex flex-col p-6 border-b border-bg-tertiary space-y-1 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">Add Invoice</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm font-bold text-text-secondary">{service?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Invoice Date</span>
            <div className="relative">
              <input 
                type="text" 
                value={formData.date}
                readOnly
                className="w-full px-4 py-2.5 bg-bg-primary border border-bg-tertiary rounded-lg text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer text-text-primary pr-10"
              />
              <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Professional Fees *</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">₹</span>
              <input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="pl-8"
              />
            </div>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">Government Fees *</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">₹</span>
              <input 
                type="number" 
                value={formData.governmentFees}
                onChange={(e) => setFormData({...formData, governmentFees: e.target.value})}
                className="pl-8"
              />
            </div>
          </div>

          <div className="fieldset-input">
            <span className="fieldset-label uppercase">GST *</span>
            <div className="relative">
              <input 
                type="number" 
                value={formData.gst}
                onChange={(e) => setFormData({...formData, gst: e.target.value})}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold">%</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 py-2 px-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={showDescription}
                  onChange={(e) => setShowDescription(e.target.checked)}
                />
                <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-orange"></div>
              </label>
              <span className="text-sm font-bold text-text-primary uppercase tracking-wider">Add Description?</span>
            </div>

            {showDescription && (
              <div className="fieldset-input animate-in fade-in slide-in-from-top-2 duration-200">
                <span className="fieldset-label uppercase">Description</span>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter invoice description..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-bg-primary border border-bg-tertiary rounded-lg text-sm focus:outline-none focus:border-accent transition-colors text-text-primary resize-none"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 py-2 px-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-orange"></div>
            </label>
            <span className="text-sm font-bold text-text-primary">Recurring Invoice?</span>
          </div>

          {formData.isRecurring && (
            <>
              <div className="fieldset-input">
                <span className="fieldset-label uppercase">Interval</span>
                <input 
                  type="number" 
                  min="1"
                  value={formData.interval}
                  onChange={(e) => setFormData({...formData, interval: e.target.value})}
                />
              </div>

              <div className="fieldset-input">
                <span className="fieldset-label uppercase">Interval Type</span>
                <div className="relative">
                  <select
                    value={formData.intervalType}
                    onChange={(e) => setFormData({...formData, intervalType: e.target.value})}
                    className="w-full appearance-none px-4 py-2.5 bg-bg-primary border border-bg-tertiary rounded-lg text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer text-text-primary pr-10"
                  >
                    <option value="Day">Day</option>
                    <option value="Month">Month</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                </div>
              </div>

              <div className="fieldset-input">
                <span className="fieldset-label uppercase">Invoice End Date</span>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.endDate}
                    onChange={handleEndDateChange}
                    className="w-full px-4 py-2.5 bg-bg-primary border border-bg-tertiary rounded-lg text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer text-text-primary pr-10"
                    placeholder="dd/mm/yyyy"
                  />
                  <button 
                    type="button"
                    onClick={handleEndDateCalendar}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <CalendarIcon size={18} />
                  </button>
                  
                  {showCalendar && (
                    <div 
                      ref={calendarRef}
                      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-bg-secondary border border-bg-tertiary rounded-lg shadow-lg p-4 z-50 w-64"
                    >
                      <div className="text-center font-semibold mb-3 text-text-primary">
                        {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-xs">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                          <div key={i} className="text-center font-semibold text-text-secondary py-1">
                            {day}
                          </div>
                        ))}
                        {generateCalendarDays().map((day, i) => (
                          <div key={i} className="text-center py-1">
                            {day && (
                              <button
                                type="button"
                                onClick={() => handleDateSelect(new Date(new Date().getFullYear(), new Date().getMonth(), day))}
                                className="w-8 h-8 rounded hover:bg-accent hover:text-white transition-colors text-sm"
                              >
                                {day}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full btn-raised btn-raised-orange text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 flex-shrink-0"
          >
            <FileText size={18} /> Add Invoice
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
