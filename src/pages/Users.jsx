import React, { useState } from 'react'
import UsersTopSection from '../components/users/UsersTopSection'
import UsersTable from '../components/users/UsersTable'
import UserFormModal from '../components/users/UserFormModal'

const initialUsers = [
  {
    id: 1,
    created: '5th January 2025 4:49 pm',
    name: 'Amit Samanta',
    phone: '+91 8100521654',
    type: 'Admin',
    status: 'Active',
    sessions: '',
  },
  {
    id: 2,
    created: '8th January 2025 12:06 am',
    name: 'Ritu Kaur',
    phone: '+91 5496665',
    type: 'Agent',
    status: 'Active',
    sessions: '',
  },
  {
    id: 3,
    created: '8th January 2025 12:10 am',
    name: 'Jagjyot Singh',
    phone: '+91 588548',
    type: 'Agent',
    status: 'Active',
    sessions: '',
  },
  {
    id: 4,
    created: '19th January 2025 2:03 pm',
    name: 'Samrat',
    phone: '+91 9674560601',
    type: 'Accountant',
    status: 'Active',
    sessions: '',
  },
  {
    id: 5,
    created: '20th January 2025 12:58 pm',
    name: 'TAPAS',
    phone: '+91 9583723661',
    type: 'Accountant',
    status: 'Active',
    sessions: '',
  },
  {
    id: 6,
    created: '12th February 2025 12:25 pm',
    name: 'Jagjyot Singh',
    phone: '+91 9674560602',
    type: 'Admin',
    status: 'Active',
    sessions: '',
  },
  {
    id: 7,
    created: '14th May 2025 4:25 pm',
    name: 'Jagjyot',
    phone: '+91 9804492472',
    type: 'Accountant',
    status: 'Active',
    sessions: '',
  },
]

const Users = () => {
  const [users, setUsers] = useState(initialUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const handleNewUserClick = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (user) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleSubmit = (formData) => {
    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) => (u.id === formData.id ? { ...u, ...formData } : u))
      )
    } else {
      // Add new user
      const now = new Date()
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })

      const day = now.getDate()
      const suffix = ['th', 'st', 'nd', 'rd'][
        day % 10 > 3 ? 0 : (((day % 100) - (day % 10) !== 10) * day) % 10
      ]

      const createdStr = `${day}${suffix} ${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()} ${timeFormatter.format(now).toLowerCase()}`

      setUsers((prev) => [
        ...prev,
        {
          id: formData.id,
          created: createdStr,
          name: formData.name,
          phone: formData.phone,
          type: formData.type,
          status: formData.status,
          sessions: '',
        },
      ])
    }
    handleCloseModal()
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      <UsersTopSection
        usersCount={users.length}
        onNewUserClick={handleNewUserClick}
      />

      <UsersTable users={users} onEditClick={handleEditClick} />

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingUser={editingUser}
      />
    </div>
  )
}

export default Users
