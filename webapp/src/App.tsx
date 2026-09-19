import { useState } from 'react'
import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'

const router = createBrowserRouter([
  // Public only routes- if not logged in, redirects to login/register pages
  {
    element: <ProtectedRoute requireAuth={false} />,
    children: [
      {
        path: '/login', 
        element: <Login /> 
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  },

  // Root route
  {
    path: '/',
    element: <Navigate to='/homepage' replace />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
