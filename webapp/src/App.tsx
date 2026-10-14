import { useState } from 'react'
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
import Pins from './pages/Pins'
import { listenForSessionEnd } from './features/auth/session'
import { queryClient } from './lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'

listenForSessionEnd(queryClient);

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
          { path: '/settings', element: <Settings /> },
          { path: '/pins', element: <Pins /> },
        ]
      }
    ]
  },
  { path: '/', element: <Navigate to='/homepage' replace /> },
  { path: '*', element: <Navigate to='/login' replace /> }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
