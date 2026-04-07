import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import Loader from '../Loader'

const UsersTable = ({ 
  users, 
  onEditClick, 
  onDeleteClick, 
  loading, 
  pagination, 
  onPageChange 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && users.length === 0) {
    return <Loader />
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="bg-[var(--color-bg-tertiary)]/70 shadow-sm">
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider rounded-l-xl border-y border-l border-[var(--color-bg-tertiary)]">
              Created
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider border-y border-[var(--color-bg-tertiary)]">
              Name
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider border-y border-[var(--color-bg-tertiary)]">
              Email
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider border-y border-[var(--color-bg-tertiary)]">
              Role
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider border-y border-[var(--color-bg-tertiary)]">
              Status
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider rounded-r-xl border-y border-r border-[var(--color-bg-tertiary)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="p-6 text-center text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-bg-tertiary)]"
              >
                {loading ? 'Loading users...' : 'No users found.'}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user._id}
                className="bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)]/30 transition-all shadow-sm group"
              >
                <td className="p-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap rounded-l-xl border-y border-l border-[var(--color-bg-tertiary)]">
                  {formatDate(user.createdAt)}
                </td>
                <td className="p-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap font-medium border-y border-[var(--color-bg-tertiary)]">
                  {user.name}
                </td>
                <td className="p-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap border-y border-[var(--color-bg-tertiary)]">
                  {user.email}
                </td>
                <td className="p-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap border-y border-[var(--color-bg-tertiary)]">
                  <span className="capitalize">{user.role}</span>
                </td>
                <td className="p-4 text-sm whitespace-nowrap border-y border-[var(--color-bg-tertiary)]">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      user.active
                        ? 'bg-green-100/50 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-red-100/50 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                    }`}
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-sm whitespace-nowrap rounded-r-xl border-y border-r border-[var(--color-bg-tertiary)]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditClick(user)}
                      className="p-2 text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-lg shadow-sm hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all cursor-pointer hover:shadow-md"
                      title="Edit user"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(user._id)}
                      className="p-2 text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-lg shadow-sm hover:text-red-600 hover:border-red-600 hover:bg-red-600/10 transition-all cursor-pointer hover:shadow-md"
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 px-4">
          <div className="text-sm text-[var(--color-text-secondary)]">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-lg shadow-sm hover:bg-[var(--color-bg-tertiary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-lg">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-lg shadow-sm hover:bg-[var(--color-bg-tertiary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersTable
