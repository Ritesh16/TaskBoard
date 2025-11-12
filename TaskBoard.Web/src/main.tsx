import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './app/router/Routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store, StoreContext } from './lib/stores/store'
// import { ToastProvider } from './lib/context/ToastContext'
// import ToastContainer from './app/shared/components/toast/ToastContainer'
import { ToastProvider } from './app/shared/components/toast'
import { ToastContainer } from 'react-bootstrap'
import { AuthProvider } from './lib/context/AuthContext'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
        <ToastContainer />
      </ToastProvider>
    </StoreContext.Provider>
  </StrictMode>
)
