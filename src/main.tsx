import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/ErrorBoundary'

console.log('🚀 Portfolio App Starting...')

// Log all errors globally
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason)
})

const rootElement = document.getElementById('root')
console.log('✅ Root element found:', rootElement)

if (!rootElement) {
  console.error('❌ Root element not found!')
}

createRoot(rootElement!).render(
  <StrictMode>
    <ErrorBoundary>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </ErrorBoundary>
  </StrictMode>,
)
