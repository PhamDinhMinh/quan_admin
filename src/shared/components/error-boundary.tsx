/* eslint-disable react/prop-types */
import React from 'react';

import ErrorPage from './error-page';

class ErrorBoundary extends React.Component {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (
      (
        this.state as {
          hasError: boolean;
        }
      ).hasError
    ) {
      // You can render any custom fallback UI
      return <ErrorPage />;
    }

    return (
      this.props as {
        children: React.ReactNode;
      }
    ).children;
  }
}

export default ErrorBoundary;
