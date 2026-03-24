import React, { useState } from 'react'
import { Plus, Search } from 'lucide-react'

const UsersTopSection = ({ usersCount, onNewUserClick, onSearch, loading }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
        Users ({usersCount})
        {loading && <span className="text-sm text-[var(--color-text-secondary)] ml-2">Loading...</span>}
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)]"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all w-full sm:w-64"
          />
        </div>
        
        <button
          onClick={onNewUserClick}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium cursor-pointer"
        >
          <Plus size={18} />
          New User
        </button>
      </div>
    </div>
  )
}

export default UsersTopSection
