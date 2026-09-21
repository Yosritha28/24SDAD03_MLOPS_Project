/**
 * Generic modal component.
 * Props:
 * - isOpen: boolean – whether to show the modal.
 * - onClose: function – called when overlay is clicked or close action triggered.
 * - title: optional string – displayed at the top of the modal.
 * - children: modal content.
 * - className: additional CSS classes for the modal content.
 * - overlayClassName: additional classes for the overlay.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  overlayClassName = ''
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`riq-modal-overlay ${overlayClassName}`.trim()}
      onClick={onClose}
    >
      <div
        className={`riq-modal ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="riq-modal-title">{title}</h3>}
        <div className="riq-modal-body">{children}</div>
      </div>
    </div>
  );
}
