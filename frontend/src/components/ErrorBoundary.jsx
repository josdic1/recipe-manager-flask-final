// src/components/ErrorBoundary.jsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.state = {
      hasError: true,
      error,
      errorInfo
    }
    console.error('🔴 Error caught by boundary:', error, errorInfo)
  }

  copyError = () => {
    const { error, errorInfo } = this.state
    const errorText = `
ERROR: ${error?.toString()}

COMPONENT STACK:
${errorInfo?.componentStack}

FULL STACK:
${error?.stack}
    `.trim()
    
    navigator.clipboard.writeText(errorText)
    alert('Error copied to clipboard!')
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state

      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>⚠️ Something Broke</h1>
            <button onClick={this.copyError} style={styles.copyButton}>
              📋 Copy Error
            </button>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Error Message:</h2>
            <pre style={styles.errorMessage}>{error?.toString()}</pre>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Error Type:</h2>
            <code style={styles.code}>{error?.name || 'Unknown'}</code>
          </div>

          {errorInfo?.componentStack && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Where it broke:</h2>
              <pre style={styles.stack}>
                {errorInfo.componentStack
                  .split('\n')
                  .slice(0, 5)
                  .join('\n')}
              </pre>
            </div>
          )}

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Quick fixes to try:</h2>
            <ul style={styles.list}>
              <li>Check if data is undefined or null</li>
              <li>Look for typos in prop names</li>
              <li>Verify API responses are formatted correctly</li>
              <li>Check console for more details</li>
            </ul>
          </div>

          <button 
            onClick={() => window.location.href = '/'} 
            style={styles.homeButton}
          >
            🏠 Go Home
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #ff4444',
    paddingBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '32px',
    color: '#ff4444'
  },
  copyButton: {
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  section: {
    marginBottom: '25px',
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #444'
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#ffa500',
    fontWeight: '600'
  },
  errorMessage: {
    backgroundColor: '#3a0000',
    color: '#ff6b6b',
    padding: '15px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    border: '1px solid #ff4444',
    overflowX: 'auto'
  },
  code: {
    backgroundColor: '#1a1a3a',
    color: '#88ccff',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace'
  },
  stack: {
    backgroundColor: '#000',
    color: '#0f0',
    padding: '15px',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'monospace',
    margin: 0,
    overflowX: 'auto',
    border: '1px solid #333'
  },
  list: {
    margin: '10px 0',
    paddingLeft: '20px',
    lineHeight: '1.8'
  },
  homeButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '20px'
  }
}

export default ErrorBoundary