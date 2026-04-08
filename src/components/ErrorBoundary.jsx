import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Intentionally silent in UI; details are shown in the collapsible section.
  }

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const message = this.state.error?.message || "Unknown error";

    return (
      <main className="min-h-[70vh] flex items-center justify-center p-6">
        <section className="w-full max-w-[520px] bg-surface border border-white/[0.10] rounded-[20px] p-7 text-center">
          <div className="font-syne font-extrabold text-[60px] leading-none text-[#FF2D78]">
            !
          </div>
          <h1 className="font-syne font-bold text-[20px] text-[#F0F0F8] mt-2">
            Something went wrong
          </h1>
          <p className="font-body text-[14px] text-muted mt-2">
            A runtime error interrupted this page. You can reload to recover.
          </p>

          <button
            onClick={this.reloadPage}
            className="mt-5 font-mono text-[11px] font-bold px-5 py-2 rounded-full"
            style={{ background: "#CAFF00", color: "#0A0A0F" }}
          >
            Reload page
          </button>

          <details className="mt-5 text-left bg-surface2 border border-white/[0.10] rounded-[10px] p-3">
            <summary className="font-mono text-[11px] text-muted cursor-pointer">
              Error details
            </summary>
            <pre className="font-mono text-[11px] text-[#F0F0F8] whitespace-pre-wrap mt-2">
              {message}
            </pre>
          </details>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
