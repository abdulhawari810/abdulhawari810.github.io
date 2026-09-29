import { Component } from "react";
import ErrorNetwork from "@/components/errorNetwork";
import { IS_DEVELOPMENT } from "@/lib/environment";
import { getErrorMessage, resolveHttpCode } from "@/lib/errorInfo";

/**
 * Error Boundary untuk menangkap error saat render.
 *
 * - Development : menampilkan pesan, kode, component stack, dan stack trace.
 * - Production  : menampilkan kode HTTP saja, tanpa detail internal.
 *
 * Harus berupa class component - React belum menyediakan error boundary
 * lewat hooks.
 *
 * Props:
 * - `error`        : error awal (dipakai untuk gagal boot sebelum render).
 * - `onError`      : callback(error, info) untuk logging/monitoring.
 * - `onReset`      : callback() yang dipanggil saat tombol "Coba Lagi" ditekan.
 * - `fallback`     : custom UI. Bisa `ReactNode` atau `({ error, reset }) => JSX`.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: props.error ?? null, info: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });

    if (IS_DEVELOPMENT) {
      console.groupCollapsed(
        `%c[ErrorBoundary] ${getErrorMessage(error)}`,
        "color:#dc2626;font-weight:700",
      );
      console.error(error);
      console.log("HTTP code:", resolveHttpCode(error));
      console.log("Component stack:", info?.componentStack);
      console.groupEnd();
    }

    this.props.onError?.(error, info);
  }

  reset() {
    this.setState({ error: null, info: null });
    this.props.onReset?.();
  }

  render() {
    const { error, info } = this.state;
    const { children, fallback, title } = this.props;

    if (!error) return children;

    if (typeof fallback === "function") {
      return fallback({ error, reset: this.reset });
    }
    if (fallback) return fallback;

    return (
      <ErrorNetwork
        error={error}
        title={title}
        componentStack={info?.componentStack}
        onRetry={this.reset}
      />
    );
  }
}
