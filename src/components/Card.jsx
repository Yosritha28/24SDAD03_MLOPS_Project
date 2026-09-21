/**
 * Generic Card component.
 * Props:
 * - children: content inside the card
 * - className: additional CSS classes for custom styling (e.g., "score-card", "analysis-card")
 * - title: optional heading displayed at the top of the card
 */
export default function Card({ children, className = '', title }) {
  return (
    <div className={`riq-card card ${className}`.trim()}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
}
