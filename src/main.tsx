import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Log all errors globally
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </ErrorBoundary>
  </StrictMode>,
)
