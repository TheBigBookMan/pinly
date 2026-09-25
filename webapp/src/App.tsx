import { useState } from 'react'
import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import HomePage from './pages/HomePage'
import Map from './pages/Map'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'

const router = createBrowserRouter([
  {
    element: <ProtectedRoute requireAuth={false} />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> }
    ]
  },
  {
    element: <ProtectedRoute requireAuth={true} />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/homepage', element: <HomePage /> },
          { path: '/map', element: <Map /> },
          { path: '/profile', element: <Profile /> },
          { path: '/settings', element: <Settings /> }
        ]
      }
    ]
  },
  { path: '/', element: <Navigate to='/homepage' replace /> },
  { path: '*', element: <Navigate to='/login' replace /> }
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
