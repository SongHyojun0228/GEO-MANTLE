import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import SharedLayout from './layouts/SharedLayout.jsx'
import GeoMantlePage from './pages/GeoMantlePage.jsx'
import NumMantlePage from './pages/NumMantlePage.jsx'
import AnimalMantlePage from './pages/AnimalMantlePage.jsx'

const router = createBrowserRouter([
  {
    element: <SharedLayout />,
    children: [
      { path: '/', element: <GeoMantlePage /> },
      { path: '/num', element: <NumMantlePage /> },
      { path: '/animal', element: <AnimalMantlePage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
