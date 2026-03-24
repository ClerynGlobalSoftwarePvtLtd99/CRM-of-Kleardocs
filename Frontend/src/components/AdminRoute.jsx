import React from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../redux/hooks'
import toast from 'react-hot-toast'

const AdminRoute = ({ children }) => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  // Check if user exists and has admin role
  if (!user || user.role !== 'admin') {
    toast.error('Access denied. Admin privileges required.', {
      duration: 3000,
      icon: '🔒',
    })
    navigate('/')
    return null
  }

  return children
}

export default AdminRoute
