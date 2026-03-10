import React from 'react'
import { Plus } from 'lucide-react'

const UsersTopSection = ({ usersCount, onNewUserClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
        Users ({usersCount})
      </h2>
      <button
        onClick={onNewUserClick}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium cursor-pointer"
      >
        <Plus size={18} />
        New User
      </button>
    </div>
  )
}

export default UsersTopSection
