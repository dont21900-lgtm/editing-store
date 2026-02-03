import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null, errorInfo: null }; }

    static getDerivedStateFromError(error) { return { hasError: true, error }; }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#111] flex items-center justify-center text-white p-8">
                    <div className="border border-red-500 p-8 max-w-lg text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2 font-mono">SYSTEM ERROR</h1>
                        <p className="text-neutral-400 mb-6 font-mono text-sm">Please refresh the interface.</p>
                        <details className="text-left text-xs bg-black p-4 rounded text-red-400 mb-4 overflow-auto max-h-40">
                            <summary>Error Details</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                        <button onClick={() => window.location.reload()} className="bg-white text-black px-8 py-3 font-bold hover:bg-neutral-200 transition-colors uppercase tracking-widest text-xs">Reload</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
