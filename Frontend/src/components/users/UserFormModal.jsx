import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const UserFormModal = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    type: 'Agent',
    status: 'Active',
  })

  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setFormData({
          name: editingUser.name || '',
          phone: editingUser.phone ? editingUser.phone.replace('+91 ', '') : '',
          password: '', // Keep blank if not changed
          type: editingUser.type || 'Agent',
          status: editingUser.status || 'Active',
        })
      } else {
        setFormData({
          name: '',
          phone: '',
          password: '',
          type: 'Agent',
          status: 'Active',
        })
      }
    }
  }, [isOpen, editingUser])

  if (!isOpen) return null

  const isEditMode = !!editingUser

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formattedPhone = formData.phone ? `+91 ${formData.phone}` : ''
    onSubmit({
      ...formData,
      phone: formattedPhone,
      id: editingUser ? editingUser.id : Date.now(),
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-bg-tertiary)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            {isEditMode ? 'Edit User' : 'Add User'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* User Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              User Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3.5 border border-r-0 border-[var(--color-bg-tertiary)] rounded-l-lg bg-[var(--color-bg-tertiary)]/50 text-[var(--color-text-secondary)] font-medium text-sm">
                +91
              </span>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="flex-1 w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-r-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 flex items-baseline justify-between">
              <span>
                Password{' '}
                {!isEditMode && <span className="text-red-500">*</span>}
              </span>
              {isEditMode && (
                <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                  Keep blank if not changed
                </span>
              )}
            </label>
            <input
              type="password"
              name="password"
              required={!isEditMode}
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditMode ? 'Enter new password' : 'Enter password'}
              className="w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
            />
          </div>

          {/* Type Dropdown */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isEditMode && formData.type === 'Admin'} // Admin type not possible to modify
                className={`w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all ${
                  isEditMode && formData.type === 'Admin'
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                {(!isEditMode || formData.type === 'Admin') && (
                  <option value="Admin">Admin</option>
                )}
                <option value="Agent">Agent</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {isEditMode && formData.type === 'Admin' && (
            <p className="text-xs text-orange-500 font-medium -mt-2">
              Admin type cannot be modified.
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold text-sm tracking-wide cursor-pointer shadow-sm"
            >
              {isEditMode ? 'Update user' : 'ADD USER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserFormModal
