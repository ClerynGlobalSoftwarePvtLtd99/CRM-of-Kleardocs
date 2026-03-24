import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="max-w-md w-full bg-bg-secondary border border-bg-tertiary rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle size={24} />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            
            <p className="text-text-secondary mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-t-accent text-white px-4 py-2 rounded-md hover:bg-t-accent/90 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh Page
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-xs text-text-secondary">
                <summary className="cursor-pointer hover:text-text-primary">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-2 bg-bg-tertiary rounded overflow-auto max-h-32">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
