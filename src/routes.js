import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Admin = React.lazy(() => import('./views/admin/Admin'))
const Warga = React.lazy(() => import('./views/warga/Warga'))
const Pembayaran = React.lazy(() => import('./views/pembayaran/Pembayaran'))
const Pengaturan = React.lazy(() => import('./views/pengaturan/Pengaturan'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/admin', name: 'Admin', element: Admin, exact: true },
  { path: '/warga', name: 'Warga', element: Warga },
  { path: '/pembayaran', name: 'Pembayaran', element: Pembayaran },
  { path: '/setting', name: 'Pengaturan', element: Pengaturan },
]

export default routes
