import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { ENVIRONMENT_LABEL, IS_DEVELOPMENT } from "@/lib/environment";
import {
  buildErrorReport,
  getErrorMessage,
  getErrorStack,
  getHttpStatusText,
  getRawErrorCode,
  isNetworkError,
  isOffline,
  resolveHttpCode,
} from "@/lib/errorInfo";

// Status koneksi diperlakukan sebagai external store agar React yang
// mengurus subscribe/unsubscribe-nya (tidak perlu setState manual di effect).
function subscribeToConnectivity(onStoreChange) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);
  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}

function getConnectivitySnapshot() {
  return !isOffline();
}

function getServerConnectivitySnapshot() {
  return true;
}

/**
 * Pantau status koneksi perangkat.
 * Mengembalikan true saat online, false saat offline.
 */
export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribeToConnectivity,
    getConnectivitySnapshot,
    getServerConnectivitySnapshot,
  );
}

function CodeBadge({ code, isNetwork }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "font-black leading-none tracking-tight",
          isNetwork ? "text-sand" : "text-danger",
        )}
      >
        {code}
      </span>
      <span className="h-8 w-px bg-border-custom" />
      <span className="text-sm font-semibold text-foreground">
        {isNetwork ? "Koneksi Bermasalah" : "Terjadi Kesalahan"}
      </span>
    </div>
  );
}

/**
 * Panel detail yang HANYA dirender saat development.
 * Berisi pesan error, kode asli, component stack, dan stack trace.
 */
function DevelopmentDetails({ error, componentStack }) {
  const [copied, setCopied] = useState(false);
  const stack = getErrorStack(error);
  const rawCode = getRawErrorCode(error);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        buildErrorReport({ error, componentStack }),
      );
      setCopied(true);
    } catch {
      // Clipboard tidak tersedia (konteks tidak aman / tidak ada izin)
      setCopied(false);
    }
  }

  return (
    <div className="mt-6 border-t border-border-custom pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary-text">
          Detail Error
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-sage px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-sage">
            {ENVIRONMENT_LABEL}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-border-custom px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-border-custom/20"
          >
            {copied ? "Tersalin" : "Copy detail"}
          </button>
        </div>
      </div>

      <dl className="mt-4 space-y-3 text-xs">
        <div>
          <dt className="text-secondary-text">Message</dt>
          <dd className="mt-1 break-words font-medium text-foreground">
            {getErrorMessage(error)}
          </dd>
        </div>

        {rawCode && (
          <div>
            <dt className="text-secondary-text">Error code</dt>
            <dd className="mt-1 break-words font-mono font-medium text-foreground">
              {rawCode}
            </dd>
          </div>
        )}

        {componentStack && (
          <div>
            <dt className="text-secondary-text">Component stack</dt>
            <dd className="mt-1 overflow-x-auto whitespace-pre-wrap break-words font-mono text-secondary-text">
              {componentStack.trim()}
            </dd>
          </div>
        )}

        {stack && (
          <div>
            <dt className="text-secondary-text">Stack trace</dt>
            <dd className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-panel p-3 font-mono text-on-panel">
              {stack}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/**
 * Tampilan error (application error maupun network error).
 *
 * - Development : tampilkan pesan, kode error, component stack, dan stack trace.
 * - Production  : tampilkan kode HTTP saja, tanpa detail internal.
 */
export default function ErrorNetwork({
  error = null,
  code,
  statusText,
  title,
  description,
  componentStack,
  onRetry,
  className,
}) {
  const isOnline = useOnlineStatus();

  const resolvedCode = code ?? resolveHttpCode(error);
  const offline = !isOnline;
  const networkIssue = offline || isNetworkError(error, resolvedCode);

  const resolvedStatusText = statusText ?? getHttpStatusText(resolvedCode);
  const resolvedTitle = title ?? "Unexpected Application Error";
  const resolvedDescription =
    description ??
    (networkIssue
      ? "Kami tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi."
      : "Ada yang tidak beres saat memuat halaman ini.");

  function handleRetry() {
    if (onRetry) {
      onRetry();
      return;
    }
    window.location.reload();
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex min-h-screen items-center justify-center bg-background px-6 py-16",
        className,
      )}
    >
      <div className="w-full max-w-xl rounded-lg border border-border-custom bg-background p-8">
        <CodeBadge code={resolvedCode} isNetwork={networkIssue} />

        <h1 className="mt-5 text-2xl font-black uppercase tracking-tight text-foreground">
          {resolvedTitle}
        </h1>
        <p className="mt-2 text-sm text-secondary-text">
          {resolvedDescription}
        </p>

        <p className="mt-1 text-sm text-secondary-text">
          HTTP {resolvedCode} &mdash; {resolvedStatusText}
        </p>

        {offline && (
          <p className="mt-4 rounded-lg border border-sand px-4 py-3 text-sm text-sand">
            Perangkat sedang offline. Koneksi akan dipulihkan otomatis saat
            jaringan kembali tersedia.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRetry}
            disabled={offline}
            className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {offline ? "Menunggu koneksi" : "Coba Lagi"}
          </button>

          {onRetry && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg border border-border-custom px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-border-custom/20"
            >
              Reload Halaman
            </button>
          )}
        </div>

        {/* Semua detail internal hanya ada di development. */}
        {IS_DEVELOPMENT && (
          <DevelopmentDetails error={error} componentStack={componentStack} />
        )}
      </div>
    </div>
  );
}
