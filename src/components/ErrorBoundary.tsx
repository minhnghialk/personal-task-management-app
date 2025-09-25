import React, { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { logger } from '../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error('ErrorBoundary caught an error', { error, info });
    toast.error('Oops! Something went wrong.');
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 p-6">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6">{this.state.error?.message}</p>
          <button
            onClick={this.handleReload}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
