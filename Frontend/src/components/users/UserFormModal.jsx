import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const UserFormModal = ({ isOpen, onClose, onSubmit, editingUser, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
    active: true,
  })

  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setFormData({
          name: editingUser.name || '',
          email: editingUser.email || '',
          password: '', // Keep blank if not changed
          role: editingUser.role || 'agent',
          active: editingUser.active !== undefined ? editingUser.active : true,
        })
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'agent',
          active: true,
        })
      }
    }
  }, [isOpen, editingUser])

  if (!isOpen) return null

  const isEditMode = !!editingUser

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
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

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
            />
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

          {/* Role Dropdown */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="accountant">Accountant</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Status
              </label>
              <select
                name="active"
                value={formData.active ? 'true' : 'false'}
                onChange={handleChange}
                className="w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all cursor-pointer"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold text-sm tracking-wide cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update user' : 'ADD USER')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserFormModal
