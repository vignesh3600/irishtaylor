import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button.jsx';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
            <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-destructive" />
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">Refresh the page or sign in again to continue.</p>
            <Button className="mt-5" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
