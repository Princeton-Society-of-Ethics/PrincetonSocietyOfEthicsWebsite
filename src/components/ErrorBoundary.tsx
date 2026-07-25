import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">Something went wrong</h1>
          <p className="max-w-md text-muted-foreground">
            An unexpected error occurred. Please refresh the page, or come back later.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 h-12 cursor-pointer rounded-sm bg-primary px-6 font-serif text-primary-foreground hover:bg-primary/90"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
