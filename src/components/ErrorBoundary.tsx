import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-900 px-4 text-center text-gray-100">
          <p className="text-lg">Algo salió mal. Recargá la página.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm transition hover:bg-gray-700"
          >
            Recargar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
