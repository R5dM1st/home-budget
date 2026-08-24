type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
};

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-semibold">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="font-black underline underline-offset-4">
          Réessayer
        </button>
      ) : null}
    </div>
  );
}

export default ErrorBanner;
