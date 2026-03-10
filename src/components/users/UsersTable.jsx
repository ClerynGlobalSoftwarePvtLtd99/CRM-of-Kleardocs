import React from 'react'

const UsersTable = ({ users, onEditClick }) => {
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
              Phone
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider border-y border-[var(--color-bg-tertiary)]">
              Type
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider border-y border-[var(--color-bg-tertiary)]">
              Status
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider border-y border-[var(--color-bg-tertiary)]">
              Sessions
            </th>
            <th className="p-4 text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap uppercase tracking-wider rounded-r-xl border-y border-r border-[var(--color-bg-tertiary)]">
              Modify
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="p-6 text-center text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-bg-tertiary)]"
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)]/30 transition-all shadow-sm group"
              >
                <td className="p-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap rounded-l-xl border-y border-l border-[var(--color-bg-tertiary)]">
                  {user.created}
                </td>
                <td className="p-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap font-medium border-y border-[var(--color-bg-tertiary)]">
                  {user.name}
                </td>
                <td className="p-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap border-y border-[var(--color-bg-tertiary)]">
                  {user.phone}
                </td>
                <td className="p-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap border-y border-[var(--color-bg-tertiary)]">
                  {user.type}
                </td>
                <td className="p-4 text-sm whitespace-nowrap border-y border-[var(--color-bg-tertiary)]">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      user.status === 'Active'
                        ? 'bg-green-100/50 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-red-100/50 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap border-y border-[var(--color-bg-tertiary)]">
                  <button className="px-5 py-2 text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-lg shadow-sm hover:bg-[var(--color-bg-tertiary)] transition-all cursor-pointer hover:shadow-md">
                    Manage
                  </button>
                </td>
                <td className="p-4 text-sm whitespace-nowrap rounded-r-xl border-y border-r border-[var(--color-bg-tertiary)]">
                  <button
                    onClick={() => onEditClick(user)}
                    className="px-5 py-2 text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] rounded-lg shadow-sm hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all cursor-pointer hover:shadow-md"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
