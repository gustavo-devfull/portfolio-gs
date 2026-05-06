import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fff',
          fontFamily: 'monospace'
        }}>
          <div style={{ maxWidth: '600px', padding: '2rem' }}>
            <h1>❌ Erro na Aplicação</h1>
            <pre style={{ background: '#1a1a1a', padding: '1rem', overflow: 'auto', borderRadius: '4px' }}>
              {this.state.error?.toString()}
            </pre>
            <p style={{ marginTop: '1rem', color: '#ccc' }}>
              Verifique o console do navegador para mais detalhes.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
