import { createRoot } from 'react-dom/client'
import { Component, type ReactNode } from 'react'
import App from './App.tsx'
import './index.css'
import './i18n'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#fff', background: '#0D1B2A', minHeight: '100vh' }}>
          <h1 style={{ color: '#FF6B35' }}>Something went wrong</h1>
          <p style={{ marginBottom: '1rem', opacity: 0.8 }}>{err.message}</p>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem', opacity: 0.5, background: '#111', padding: '1rem', borderRadius: '8px' }}>
            {err.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#FF6B35', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
