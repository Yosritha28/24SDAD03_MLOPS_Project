import React from 'react';
/**
 * ErrorState component – displays an error message with optional retry action.
 * Props:
 * - title: heading for the error (e.g., "Unable to load data")
 * - message: detailed error description
 * - onRetry: optional callback when retry button is clicked
 * - retryLabel: text for the retry button (default "Retry")
 * - className: additional CSS classes for the container
 */
export default function ErrorState({
  title = 'Error',
  message,
  onRetry,
  retryLabel = 'Retry',
  className = ''
}) {
  return (
    <div className={`error-state ${className}`.trim()}>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}
