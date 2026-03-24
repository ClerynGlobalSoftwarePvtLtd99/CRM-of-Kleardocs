import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import UsersTopSection from '../components/users/UsersTopSection'
import UsersTable from '../components/users/UsersTable'
import UserFormModal from '../components/users/UserFormModal'
import { fetchUsers, createUser, updateUser, deleteUser } from '../redux/slices/usersSlice'

const Users = () => {
  const dispatch = useDispatch()
  const { users, loading, error, pagination } = useSelector((state) => state.users)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
  })
  const [searchTimeout, setSearchTimeout] = useState(null)

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    const timeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
    }, 500) // 500ms debounce
    
    setSearchTimeout(timeout)
  }, [searchTimeout])

  useEffect(() => {
    dispatch(fetchUsers(filters))
  }, [dispatch, filters])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

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

  const handleSubmit = async (formData) => {
    try {
      if (editingUser) {
        // Update existing user
        await dispatch(updateUser({ id: editingUser._id, userData: formData })).unwrap()
        toast.success('User updated successfully')
      } else {
        // Add new user
        await dispatch(createUser(formData)).unwrap()
        toast.success('User created successfully')
      }
      handleCloseModal()
      // Refresh users list
      dispatch(fetchUsers(filters))
    } catch (error) {
      toast.error(error || 'Failed to save user')
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap()
      toast.success('User deleted successfully')
      dispatch(fetchUsers(filters))
    } catch (error) {
      toast.error(error || 'Failed to delete user')
    }
  }

  const handleSearch = (searchTerm) => {
    debouncedSearch(searchTerm)
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      <UsersTopSection
        usersCount={pagination.total}
        onNewUserClick={handleNewUserClick}
        onSearch={handleSearch}
        loading={loading}
      />

      <UsersTable 
        users={users} 
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteUser}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingUser={editingUser}
        loading={loading}
      />
    </div>
  )
}

export default Users
