import React from 'react';

/**
 * Reusable button component preserving existing UI classes.
 * Props:
 * - children: button label/content
 * - onClick: click handler
 * - type: button type (default "button")
 * - disabled: boolean flag
 * - className: additional CSS classes
 * - variant: optional style variant (e.g., "primary", "secondary") – maps to existing class names when provided
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = ''
}) {
  const classes = `${className} ${variant}`.trim();
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
