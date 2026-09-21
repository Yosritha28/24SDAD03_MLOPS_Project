import React from 'react';
/**
 * EmptyState component – shows a friendly message when no data is available.
 * Props:
 * - title: main heading (e.g., "No applications found")
 * - description: optional supporting text
 * - actionLabel: optional button text for a primary action
 * - onAction: optional handler when the action button is clicked
 * - className: additional CSS classes for the container
 */
export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actionLabel && onAction && (
        <button className="empty-action-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
