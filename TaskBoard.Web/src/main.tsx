import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './app/router/Routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store, StoreContext } from './lib/stores/store'
import { ToastProvider } from './app/shared/components/toast'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ToastProvider>
    </StoreContext.Provider>
  </StrictMode>
)
