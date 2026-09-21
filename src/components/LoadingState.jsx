/**
 * LoadingState component to display a loading indicator.
 * Props:
 * - message: optional text displayed under the spinner (default "Loading...")
 * - className: additional CSS classes for styling the container.
 */
export default function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div className={`riq-state loading-state ${className}`.trim()}>
      {/* Reuse any existing spinner style if present */}
      <div className="spinner" />
      <h3>{message}</h3>
    </div>
  );
}
