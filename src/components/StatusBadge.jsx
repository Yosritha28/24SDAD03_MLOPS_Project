/**
 * StatusBadge component to display status text with appropriate styling.
 * Props:
 * - status: string value to display (e.g., "Applied", "Under Review")
 * - variant: optional style variant, defaults to "default". When omitted the component
 *   will map common statuses to existing CSS classes used in the project:
 *   * "online" / "healthy"   → class "status-pill healthy"
 *   * "offline" / "degraded" → class "status-pill degraded"
 *   * any other value will use class "status-pill" plus the lower‑cased status.
 * - className: additional CSS classes.
 */
export default function StatusBadge({ status, variant = '', className = '' }) {
  // Determine base class based on known variants or status text
  const lower = status?.toLowerCase() || '';
  let baseClass = 'status-pill';
  if (variant) {
    baseClass = `${baseClass} ${variant}`.trim();
  } else if (['online', 'healthy', 'active'].includes(lower)) {
    baseClass = `${baseClass} healthy`;
  } else if (['offline', 'degraded', 'inactive', 'error'].includes(lower)) {
    baseClass = `${baseClass} degraded`;
  } else {
    baseClass = `${baseClass} ${lower.replace(/\s+/g, '-')}`;
  }

  const classes = `${baseClass} ${className}`.trim();
  return <span className={classes}>{status}</span>;
}
